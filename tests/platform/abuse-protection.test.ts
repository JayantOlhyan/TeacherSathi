import { describe, it, expect, beforeEach } from 'vitest';
import { abuseDetector } from '@/lib/security/abuseDetector';

describe('Phase 10 — Abuse Protection & Heuristics', () => {
  beforeEach(() => {
    abuseDetector.reset();
  });

  it('tracks failed authentication attempts and triggers temporary lockout on threshold', () => {
    const ip = '192.168.1.50';

    // First 4 failures do not lock out
    for (let i = 1; i <= 4; i++) {
      const status = abuseDetector.recordAuthFailure(ip);
      expect(status.locked).toBe(false);
      expect(status.failedCount).toBe(i);
      expect(status.lockoutRemainingSeconds).toBe(0);
    }

    // 5th failure triggers lockout
    const lockStatus = abuseDetector.recordAuthFailure(ip);
    expect(lockStatus.locked).toBe(true);
    expect(lockStatus.failedCount).toBe(5);
    expect(lockStatus.lockoutRemainingSeconds).toBeGreaterThan(0);

    // Subsequent status check confirms lockout
    expect(abuseDetector.isAuthLocked(ip).locked).toBe(true);
  });

  it('resets failed attempt counters upon successful authentication', () => {
    const account = 'teacher@school.gov.in';

    abuseDetector.recordAuthFailure(account);
    abuseDetector.recordAuthFailure(account);
    expect(abuseDetector.isAuthLocked(account).failedCount).toBe(2);

    abuseDetector.recordAuthSuccess(account);
    expect(abuseDetector.isAuthLocked(account).failedCount).toBe(0);
    expect(abuseDetector.isAuthLocked(account).locked).toBe(false);
  });

  it('detects rapid submission replay attacks with identical payloads within 5 seconds', () => {
    const attemptId = 'attempt_abc_123';
    const payloadHash = 'hash_e9b2c8a14d5f';

    // First submission is accepted
    const isFirstReplay = abuseDetector.isSubmissionReplay(attemptId, payloadHash);
    expect(isFirstReplay).toBe(false);

    // Immediate second submission with identical payload is flagged as replay
    const isSecondReplay = abuseDetector.isSubmissionReplay(attemptId, payloadHash);
    expect(isSecondReplay).toBe(true);

    // Submission with different payload hash is not flagged as replay
    const isDifferentPayloadReplay = abuseDetector.isSubmissionReplay(attemptId, 'hash_different_answers');
    expect(isDifferentPayloadReplay).toBe(false);
  });
});
