import { describe, it, expect } from 'vitest';

class ConcurrentSeatManager {
  private currentCount: number;
  private limit: number;

  constructor(initialCount: number, limit: number) {
    this.currentCount = initialCount;
    this.limit = limit;
  }

  // Atomic reservation simulating database transaction with lock
  async reserveSeat(): Promise<{ success: boolean; seatNumber?: number }> {
    if (this.currentCount >= this.limit) {
      return { success: false };
    }
    this.currentCount += 1;
    return { success: true, seatNumber: this.currentCount };
  }

  getCurrentCount(): number {
    return this.currentCount;
  }
}

describe('Phase 5 SaaS Billing: Concurrency & Atomic Quota Enforcement', () => {
  it('prevents exceeding plan limit when multiple requests compete for the final seat', async () => {
    // School Pro plan has 50 teacher seats; currently 49 are filled (1 seat left)
    const seatManager = new ConcurrentSeatManager(49, 50);

    // Simulate 3 concurrent teacher creation requests
    const results = await Promise.all([
      seatManager.reserveSeat(),
      seatManager.reserveSeat(),
      seatManager.reserveSeat(),
    ]);

    const successes = results.filter((r) => r.success);
    const failures = results.filter((r) => !r.success);

    // Exactly 1 request must succeed, and 2 must fail!
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(2);
    expect(seatManager.getCurrentCount()).toBe(50);
  });

  it('rejects all reservation requests when plan quota is already at maximum capacity', async () => {
    // School Standard plan has 15 teacher seats; all 15 are occupied
    const fullSeatManager = new ConcurrentSeatManager(15, 15);

    const results = await Promise.all([
      fullSeatManager.reserveSeat(),
      fullSeatManager.reserveSeat(),
    ]);

    expect(results.every((r) => !r.success)).toBe(true);
    expect(fullSeatManager.getCurrentCount()).toBe(15);
  });
});
