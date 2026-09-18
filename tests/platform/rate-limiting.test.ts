import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter, RATE_LIMIT_POLICIES } from '@/lib/security/rateLimiter';

describe('Phase 10 — Centralized Rate Limiter', () => {
  beforeEach(() => {
    rateLimiter.reset();
  });

  it('allows requests within sliding window limits', () => {
    const key = 'test_ip_127_0_0_1';
    for (let i = 0; i < 5; i++) {
      const result = rateLimiter.check(key, 5, 60);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }
  });

  it('blocks requests exceeding maximum requests within sliding window', () => {
    const key = 'test_ip_abusive';
    for (let i = 0; i < 5; i++) {
      rateLimiter.check(key, 5, 60);
    }

    const blocked = rateLimiter.check(key, 5, 60);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it('enforces distinct canonical security policies correctly', () => {
    // AUTH policy: max 5 requests per 60s
    expect(RATE_LIMIT_POLICIES.AUTH.maxRequests).toBe(5);
    for (let i = 0; i < 5; i++) {
      expect(rateLimiter.checkPolicy('AUTH', 'user_1').allowed).toBe(true);
    }
    expect(rateLimiter.checkPolicy('AUTH', 'user_1').allowed).toBe(false);

    // ATTEMPT_SUBMIT policy: max 3 requests per 60s
    expect(RATE_LIMIT_POLICIES.ATTEMPT_SUBMIT.maxRequests).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect(rateLimiter.checkPolicy('ATTEMPT_SUBMIT', 'attempt_100').allowed).toBe(true);
    }
    expect(rateLimiter.checkPolicy('ATTEMPT_SUBMIT', 'attempt_100').allowed).toBe(false);

    // AI_GENERATE policy: max 10 requests per 60s
    expect(RATE_LIMIT_POLICIES.AI_GENERATE.maxRequests).toBe(10);
    for (let i = 0; i < 10; i++) {
      expect(rateLimiter.checkPolicy('AI_GENERATE', 'teacher_10').allowed).toBe(true);
    }
    expect(rateLimiter.checkPolicy('AI_GENERATE', 'teacher_10').allowed).toBe(false);
  });

  it('resets specific keys when cleared by operator', () => {
    const key = 'cleared_key';
    for (let i = 0; i < 5; i++) {
      rateLimiter.check(key, 5, 60);
    }
    expect(rateLimiter.check(key, 5, 60).allowed).toBe(false);

    rateLimiter.clearKey(key);
    expect(rateLimiter.check(key, 5, 60).allowed).toBe(true);
  });
});
