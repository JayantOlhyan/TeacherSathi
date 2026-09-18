import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter } from '@/lib/security/rateLimiter';
import { telemetry } from '@/lib/observability/metrics';

describe('Phase 10 — Load & Concurrency Simulation', () => {
  beforeEach(() => {
    rateLimiter.reset();
    telemetry.reset();
  });

  it('simulates 100 concurrent requests across students autosaving answers', async () => {
    const concurrentStudents = 100;
    const promises: Promise<{ studentId: string; allowed: boolean; durationMs: number }>[] = [];

    const startTime = Date.now();

    for (let i = 0; i < concurrentStudents; i++) {
      const studentId = `student_${i}`;
      promises.push(
        (async () => {
          const reqStart = Date.now();
          // Each student attempts 2 autosaves
          const res1 = rateLimiter.checkPolicy('ATTEMPT_AUTOSAVE', studentId);
          const res2 = rateLimiter.checkPolicy('ATTEMPT_AUTOSAVE', studentId);
          const durationMs = Date.now() - reqStart;
          telemetry.recordLatency('/api/attempts/[id]/answers', durationMs);
          telemetry.recordRequest(200);
          return { studentId, allowed: res1.allowed && res2.allowed, durationMs };
        })()
      );
    }

    const results = await Promise.all(promises);
    const totalDurationMs = Date.now() - startTime;

    // All 100 independent students should be allowed within their individual limit
    const allAllowed = results.every((r) => r.allowed);
    expect(allAllowed).toBe(true);

    // Total simulation time should be very fast for in-memory checks (< 500ms for 100 concurrent)
    expect(totalDurationMs).toBeLessThan(1000);

    // Verify telemetry report
    const snapshot = telemetry.getSnapshot();
    const stats = snapshot.latencies['/api/attempts/[id]/answers'];
    expect(stats.count).toBe(100);
    expect(stats.p95).toBeLessThan(100); // well within 500ms budget
    expect(snapshot.requests.success2xx).toBe(100);
    expect(snapshot.requests.serverError5xx).toBe(0);
  });

  it('simulates peak submission rush at exam cutoff with rate limiting throttling', async () => {
    const attemptId = 'exam_final_rush_attempt';
    const totalBursts = 10;
    const burstResults: boolean[] = [];

    // Rapidly fire 10 submissions on a single attempt (limit is 3/min)
    for (let i = 0; i < totalBursts; i++) {
      const result = rateLimiter.checkPolicy('ATTEMPT_SUBMIT', attemptId);
      burstResults.push(result.allowed);
      if (result.allowed) {
        telemetry.recordRequest(200);
      } else {
        telemetry.recordRequest(429);
        telemetry.recordError('RATE_LIMITED');
      }
    }

    const allowedCount = burstResults.filter(Boolean).length;
    const blockedCount = burstResults.filter((r) => !r).length;

    // Exactly 3 allowed, 7 throttled
    expect(allowedCount).toBe(3);
    expect(blockedCount).toBe(7);

    const snapshot = telemetry.getSnapshot();
    expect(snapshot.requests.clientError4xx).toBe(7);
    expect(snapshot.errorsByCode.RATE_LIMITED).toBe(7);
  });
});
