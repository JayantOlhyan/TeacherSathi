export type RateLimitBoundary =
  | 'AUTH'
  | 'AI_GENERATE'
  | 'ATTEMPT_AUTOSAVE'
  | 'ATTEMPT_SUBMIT'
  | 'MEDIA_UPLOAD'
  | 'MOBILE_SYNC'
  | 'ADMIN_ACTIONS'
  | 'DEFAULT';

export interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

export const RATE_LIMIT_POLICIES: Record<RateLimitBoundary, RateLimitConfig> = {
  AUTH: { maxRequests: 5, windowSeconds: 60 },
  AI_GENERATE: { maxRequests: 10, windowSeconds: 60 },
  ATTEMPT_AUTOSAVE: { maxRequests: 60, windowSeconds: 60 },
  ATTEMPT_SUBMIT: { maxRequests: 3, windowSeconds: 60 },
  MEDIA_UPLOAD: { maxRequests: 10, windowSeconds: 60 },
  MOBILE_SYNC: { maxRequests: 30, windowSeconds: 60 },
  ADMIN_ACTIONS: { maxRequests: 20, windowSeconds: 60 },
  DEFAULT: { maxRequests: 60, windowSeconds: 60 },
};

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAfterSeconds: number;
  retryAfter: number;
}

class SlidingWindowRateLimiter {
  // Map of Key -> Array of unix millisecond timestamps
  private storage = new Map<string, number[]>();
  private lastPruneTime = Date.now();

  /**
   * Evaluates if a request identifier is within the sliding-window limits.
   */
  check(key: string, maxRequests: number, windowSeconds: number): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    // Routine pruning every 60 seconds
    if (now - this.lastPruneTime > 60000) {
      this.prune(now);
    }

    let timestamps = this.storage.get(key) || [];
    // Filter out timestamps outside the sliding window
    timestamps = timestamps.filter((ts) => ts > windowStart);

    if (timestamps.length >= maxRequests) {
      const oldestInWindow = timestamps[0];
      const resetAfterSeconds = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAfterSeconds,
        retryAfter: resetAfterSeconds,
      };
    }

    // Record this request
    timestamps.push(now);
    this.storage.set(key, timestamps);

    const remaining = Math.max(0, maxRequests - timestamps.length);
    const resetAfterSeconds = windowSeconds;

    return {
      allowed: true,
      limit: maxRequests,
      remaining,
      resetAfterSeconds,
      retryAfter: 0,
    };
  }

  /**
   * Helper to check against canonical policy names.
   */
  checkPolicy(boundary: RateLimitBoundary, identifier: string): RateLimitResult {
    const policy = RATE_LIMIT_POLICIES[boundary] || RATE_LIMIT_POLICIES.DEFAULT;
    const key = `${boundary}:${identifier}`;
    return this.check(key, policy.maxRequests, policy.windowSeconds);
  }

  /**
   * Prunes stale expired entries from memory.
   */
  private prune(now: number): void {
    this.lastPruneTime = now;
    const maxWindowMs = 86400 * 1000; // 24 hours max retention
    const keysToDelete: string[] = [];
    this.storage.forEach((timestamps: number[], key: string) => {
      const active = timestamps.filter((ts: number) => ts > now - maxWindowMs);
      if (active.length === 0) {
        keysToDelete.push(key);
      } else {
        this.storage.set(key, active);
      }
    });
    keysToDelete.forEach((k) => this.storage.delete(k));
  }

  /**
   * Clears all in-memory keys (useful for tests or operator overrides).
   */
  reset(): void {
    this.storage.clear();
    this.lastPruneTime = Date.now();
  }

  /**
   * Clears a specific key or prefix.
   */
  clearKey(key: string): void {
    this.storage.delete(key);
  }
}

export const rateLimiter = new SlidingWindowRateLimiter();
