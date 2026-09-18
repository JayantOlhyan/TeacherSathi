import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '@/lib/supabase/client';
import { logger } from '@/lib/observability/logger';

export type FeatureFlagScope = 'PLATFORM' | 'STATE' | 'DISTRICT' | 'ORGANIZATION' | 'SCHOOL';

export interface FeatureFlagRecord {
  id: string;
  flagKey: string;
  description?: string;
  isEnabled: boolean;
  scope: FeatureFlagScope;
  targetIds: string[];
  rolloutPercentage: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeatureFlagEvaluationContext {
  entityId?: string; // student_id, teacher_id, or school_id
  scope?: FeatureFlagScope;
  scopeId?: string; // state_code, district_id, school_id
}

// In-memory fallback and test store
const inMemoryFlags = new Map<string, FeatureFlagRecord>();

// Default seed flags
const DEFAULT_SEED_FLAGS: FeatureFlagRecord[] = [
  {
    id: 'ff_ai_genie_v2',
    flagKey: 'ai_genie_v2',
    description: 'Enables advanced multimodal NCERT AI Genie assistant',
    isEnabled: true,
    scope: 'PLATFORM',
    targetIds: [],
    rolloutPercentage: 100,
  },
  {
    id: 'ff_mobile_offline_packs',
    flagKey: 'mobile_offline_class_packs',
    description: 'Enables offline bundle downloads for low-connectivity classrooms',
    isEnabled: true,
    scope: 'PLATFORM',
    targetIds: [],
    rolloutPercentage: 100,
  },
  {
    id: 'ff_realtime_smartboard_recovery',
    flagKey: 'smartboard_auto_recovery',
    description: 'Automatic smartboard session recovery on reconnect',
    isEnabled: true,
    scope: 'PLATFORM',
    targetIds: [],
    rolloutPercentage: 100,
  },
];

// Initialize in-memory seed flags
DEFAULT_SEED_FLAGS.forEach((flag) => inMemoryFlags.set(flag.flagKey, flag));

const isTestOrPlaceholder =
  process.env.NODE_ENV === 'test' ||
  Boolean(process.env.VITEST) ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

class FeatureFlagService {
  private client: SupabaseClient;
  private cache = new Map<string, { flag: FeatureFlagRecord; cachedAt: number }>();
  private readonly CACHE_TTL_MS = 30000; // 30 seconds

  constructor(client: SupabaseClient = defaultClient) {
    this.client = client;
  }

  /**
   * Deterministic Murmur-like hash of a string to an integer 0..99 for percentage rollouts.
   */
  private hashToPercentage(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 100;
  }

  /**
   * Evaluates if a feature flag is enabled for the provided context.
   */
  async isEnabled(flagKey: string, context?: FeatureFlagEvaluationContext): Promise<boolean> {
    const flag = await this.getFlag(flagKey);
    if (!flag) return false;

    // 1. Global kill-switch check
    if (!flag.isEnabled) return false;

    // 2. 100% platform rollout shortcut
    if (flag.scope === 'PLATFORM' && flag.rolloutPercentage === 100 && flag.targetIds.length === 0) {
      return true;
    }

    // 3. Hierarchical Scope Verification
    if (context?.scope && flag.scope !== 'PLATFORM') {
      if (flag.scope !== context.scope) {
        // Scope mismatch: flag is designated for a different organizational tier
        return false;
      }
      if (context.scopeId && flag.targetIds.length > 0 && !flag.targetIds.includes(context.scopeId)) {
        return false;
      }
    }

    // 4. Explicit Target ID Whitelist Check
    if (flag.targetIds && flag.targetIds.length > 0) {
      const entityId = context?.entityId || context?.scopeId;
      if (entityId && flag.targetIds.includes(entityId)) {
        return true;
      }
      // If targets specified and not matched, deny
      if (!context?.entityId && !context?.scopeId) {
        return false;
      }
    }

    // 5. Gradual Percentage Rollout Hashing
    if (flag.rolloutPercentage > 0 && flag.rolloutPercentage < 100) {
      const hashKey = `${flagKey}:${context?.entityId || context?.scopeId || 'default'}`;
      const bucket = this.hashToPercentage(hashKey);
      return bucket < flag.rolloutPercentage;
    }

    return flag.rolloutPercentage === 100;
  }

  /**
   * Retrieves a single feature flag by key with caching.
   */
  async getFlag(flagKey: string): Promise<FeatureFlagRecord | null> {
    const now = Date.now();
    const cached = this.cache.get(flagKey);
    if (cached && now - cached.cachedAt < this.CACHE_TTL_MS) {
      return cached.flag;
    }

    if (isTestOrPlaceholder) {
      const fallback = inMemoryFlags.get(flagKey) || null;
      if (fallback) {
        this.cache.set(flagKey, { flag: fallback, cachedAt: now });
      }
      return fallback;
    }

    try {
      const { data, error } = await this.client
        .from('feature_flags')
        .select('*')
        .eq('flag_key', flagKey)
        .single();

      if (!error && data) {
        const flag: FeatureFlagRecord = {
          id: data.id,
          flagKey: data.flag_key,
          description: data.description,
          isEnabled: data.is_enabled,
          scope: data.scope,
          targetIds: data.target_ids || [],
          rolloutPercentage: data.rollout_percentage,
          metadata: data.metadata,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        this.cache.set(flagKey, { flag, cachedAt: now });
        return flag;
      }
    } catch {
      // Ignore and fallback to in-memory store
    }

    const fallback = inMemoryFlags.get(flagKey) || null;
    if (fallback) {
      this.cache.set(flagKey, { flag: fallback, cachedAt: now });
    }
    return fallback;
  }

  /**
   * Lists all feature flags.
   */
  async listFlags(): Promise<FeatureFlagRecord[]> {
    if (isTestOrPlaceholder) {
      return Array.from(inMemoryFlags.values());
    }

    try {
      const { data, error } = await this.client
        .from('feature_flags')
        .select('*')
        .order('flag_key', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          flagKey: d.flag_key,
          description: d.description,
          isEnabled: d.is_enabled,
          scope: d.scope,
          targetIds: d.target_ids || [],
          rolloutPercentage: d.rollout_percentage,
          metadata: d.metadata,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Ignore
    }

    return Array.from(inMemoryFlags.values());
  }

  /**
   * Sets or creates a feature flag.
   */
  async setFlag(flag: Partial<FeatureFlagRecord> & { flagKey: string }): Promise<FeatureFlagRecord> {
    const existing = await this.getFlag(flag.flagKey);
    const updated: FeatureFlagRecord = {
      id: existing?.id || `ff_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      flagKey: flag.flagKey,
      description: flag.description ?? existing?.description,
      isEnabled: flag.isEnabled ?? existing?.isEnabled ?? false,
      scope: flag.scope ?? existing?.scope ?? 'PLATFORM',
      targetIds: flag.targetIds ?? existing?.targetIds ?? [],
      rolloutPercentage: flag.rolloutPercentage ?? existing?.rolloutPercentage ?? 0,
      metadata: flag.metadata ?? existing?.metadata ?? {},
      updatedAt: new Date().toISOString(),
    };

    inMemoryFlags.set(flag.flagKey, updated);
    this.cache.delete(flag.flagKey);

    if (!isTestOrPlaceholder) {
      try {
        await this.client
          .from('feature_flags')
          .upsert({
            flag_key: updated.flagKey,
            description: updated.description,
            is_enabled: updated.isEnabled,
            scope: updated.scope,
            target_ids: updated.targetIds,
            rollout_percentage: updated.rolloutPercentage,
            metadata: updated.metadata,
            updated_at: updated.updatedAt,
          }, { onConflict: 'flag_key' });
      } catch {
        // Fallback in-memory
      }
    }

    logger.info(`Feature flag updated: ${updated.flagKey} (enabled: ${updated.isEnabled}, rollout: ${updated.rolloutPercentage}%)`, {
      service: 'feature-flags',
      operation: 'update_flag',
    });

    return updated;
  }

  /**
   * Reset in-memory flags (for testing).
   */
  reset(): void {
    this.cache.clear();
    inMemoryFlags.clear();
    DEFAULT_SEED_FLAGS.forEach((flag) => inMemoryFlags.set(flag.flagKey, flag));
  }
}

export const featureFlags = new FeatureFlagService();
