import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../../supabase/client';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory rate limiting map: key -> timestamps
const rateLimitMap = new Map<string, RateLimitRecord>();

// In-memory idempotency cache: key -> cached response
const idempotencyCache = new Map<string, { result: unknown; expiresAt: number }>();

const WINDOW_MS = 30 * 1000; // 30 seconds
const MAX_REQUESTS_PER_WINDOW = 5;
const DEFAULT_MONTHLY_QUOTA = parseInt(process.env.AI_MONTHLY_QUOTA_FREE || '50', 10);

export const rateLimiter = {
  /**
   * Checks if user has exceeded the rapid request rate limit.
   */
  checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
    const now = Date.now();
    let record = rateLimitMap.get(key);

    if (!record) {
      record = { timestamps: [] };
      rateLimitMap.set(key, record);
    }

    // Filter out timestamps outside window
    record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

    if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      const oldest = record.timestamps[0];
      const retryAfterMs = WINDOW_MS - (now - oldest);
      return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
    }

    record.timestamps.push(now);
    return { allowed: true };
  },

  /**
   * Checks idempotency cache.
   */
  checkIdempotency(key?: string): unknown | null {
    if (!key) return null;
    const cached = idempotencyCache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      idempotencyCache.delete(key);
      return null;
    }
    return cached.result;
  },

  /**
   * Stores response in idempotency cache for 5 minutes.
   */
  saveIdempotency(key: string, result: unknown, ttlMs: number = 300000): void {
    if (!key) return;
    idempotencyCache.set(key, {
      result,
      expiresAt: Date.now() + ttlMs,
    });
  },

  /**
   * Checks monthly quota from Supabase `ai_usage_tracking` table or entitlement engine.
   * If DB is unavailable or offline, gracefully allows usage.
   */
  async checkMonthlyQuota(
    userId: string,
    client: SupabaseClient = defaultClient,
    schoolId?: string | null
  ): Promise<{ allowed: boolean; currentUsage: number; quota: number }> {
    const now = new Date();
    const periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let quota = DEFAULT_MONTHLY_QUOTA;

    if (schoolId) {
      try {
        const { entitlementEngine } = await import('@/lib/billing/entitlements');
        const profile = await entitlementEngine.getSchoolEntitlements(schoolId, client);
        quota = profile.entitlements.AI_GENERATION_LIMIT || quota;
      } catch {
        // Use default quota
      }
    }

    try {
      const { data, error } = await client
        .from('ai_usage_tracking')
        .select('generation_count, monthly_quota')
        .eq('user_id', userId)
        .eq('period_month', periodMonth)
        .maybeSingle();

      if (error) {
        // Table not found or connection error, allow with default
        return { allowed: true, currentUsage: 0, quota };
      }

      if (!data) {
        return { allowed: true, currentUsage: 0, quota };
      }

      const currentUsage = data.generation_count || 0;
      const userQuota = schoolId ? quota : (data.monthly_quota || quota);

      return {
        allowed: currentUsage < userQuota,
        currentUsage,
        quota: userQuota,
      };
    } catch {
      return { allowed: true, currentUsage: 0, quota };
    }
  },

  /**
   * Increments monthly usage count in `ai_usage_tracking`.
   */
  async recordUsage(
    userId: string,
    schoolId?: string | null,
    client: SupabaseClient = defaultClient
  ): Promise<void> {
    const now = new Date();
    const periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    try {
      const { data } = await client
        .from('ai_usage_tracking')
        .select('id, generation_count')
        .eq('user_id', userId)
        .eq('period_month', periodMonth)
        .maybeSingle();

      if (data) {
        await client
          .from('ai_usage_tracking')
          .update({
            generation_count: (data.generation_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);
      } else {
        await client.from('ai_usage_tracking').insert([
          {
            user_id: userId,
            school_id: schoolId || null,
            period_month: periodMonth,
            generation_count: 1,
            monthly_quota: DEFAULT_MONTHLY_QUOTA,
          },
        ]);
      }
    } catch {
      // Best-effort usage tracking, do not fail generation
    }
  },

  /**
   * Resets in-memory rate limits (useful for testing).
   */
  reset(): void {
    rateLimitMap.clear();
    idempotencyCache.clear();
  },
};
