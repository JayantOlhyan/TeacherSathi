export interface LockoutStatus {
  locked: boolean;
  failedCount: number;
  lockoutRemainingSeconds: number;
}

class AbuseDetector {
  private failedAuthAttempts = new Map<string, { count: number; lockedUntil?: number }>();
  private recentSubmissions = new Map<string, { hash: string; timestamp: number }>();

  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private readonly REPLAY_WINDOW_MS = 5000; // 5 seconds

  /**
   * Records a failed authentication or OTP attempt and calculates lockout status.
   */
  recordAuthFailure(identifier: string): LockoutStatus {
    const now = Date.now();
    const entry = this.failedAuthAttempts.get(identifier) || { count: 0 };

    // If currently locked, check if lockout expired
    if (entry.lockedUntil && entry.lockedUntil > now) {
      const lockoutRemainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return {
        locked: true,
        failedCount: entry.count,
        lockoutRemainingSeconds,
      };
    }

    entry.count += 1;

    if (entry.count >= this.MAX_FAILED_ATTEMPTS) {
      entry.lockedUntil = now + this.LOCKOUT_DURATION_MS;
      this.failedAuthAttempts.set(identifier, entry);
      return {
        locked: true,
        failedCount: entry.count,
        lockoutRemainingSeconds: Math.ceil(this.LOCKOUT_DURATION_MS / 1000),
      };
    }

    this.failedAuthAttempts.set(identifier, entry);
    return {
      locked: false,
      failedCount: entry.count,
      lockoutRemainingSeconds: 0,
    };
  }

  /**
   * Resets failed attempt counter upon successful authentication.
   */
  recordAuthSuccess(identifier: string): void {
    this.failedAuthAttempts.delete(identifier);
  }

  /**
   * Checks if an identifier is currently locked out due to repeated failures.
   */
  isAuthLocked(identifier: string): LockoutStatus {
    const now = Date.now();
    const entry = this.failedAuthAttempts.get(identifier);
    if (!entry) {
      return { locked: false, failedCount: 0, lockoutRemainingSeconds: 0 };
    }

    if (entry.lockedUntil) {
      if (entry.lockedUntil > now) {
        return {
          locked: true,
          failedCount: entry.count,
          lockoutRemainingSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
        };
      }
      // Lockout expired: reset
      this.failedAuthAttempts.delete(identifier);
    }

    return { locked: false, failedCount: entry.count, lockoutRemainingSeconds: 0 };
  }

  /**
   * Detects rapid duplicate submissions of identical payloads within seconds.
   * Returns true if this is an abusive rapid replay, false if allowed.
   */
  isSubmissionReplay(attemptId: string, payloadHash: string): boolean {
    const now = Date.now();
    const existing = this.recentSubmissions.get(attemptId);

    if (existing) {
      if (existing.hash === payloadHash && now - existing.timestamp < this.REPLAY_WINDOW_MS) {
        return true; // Replay detected
      }
    }

    this.recentSubmissions.set(attemptId, { hash: payloadHash, timestamp: now });
    return false;
  }

  /**
   * Resets all internal state (for testing and operator resets).
   */
  reset(): void {
    this.failedAuthAttempts.clear();
    this.recentSubmissions.clear();
  }
}

export const abuseDetector = new AbuseDetector();
