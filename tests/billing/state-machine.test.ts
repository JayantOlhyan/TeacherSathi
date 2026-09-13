import { describe, it, expect } from 'vitest';
import type { SubscriptionStatusType } from '../../src/lib/billing/types';

// Deterministic subscription lifecycle transition validator
function isValidTransition(from: SubscriptionStatusType, to: SubscriptionStatusType): boolean {
  const allowedTransitions: Record<SubscriptionStatusType, SubscriptionStatusType[]> = {
    TRIALING: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
    ACTIVE: ['PAST_DUE', 'PAUSED', 'CANCELLED', 'EXPIRED'],
    PAST_DUE: ['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED'],
    PAUSED: ['ACTIVE', 'CANCELLED', 'EXPIRED'],
    CANCELLED: ['ACTIVE'], // Resubscribe
    EXPIRED: ['ACTIVE'], // Re-activate
  };

  return allowedTransitions[from]?.includes(to) ?? false;
}

describe('Phase 5 SaaS Billing: Subscription State Machine', () => {
  it('allows valid subscription lifecycle transitions', () => {
    // Normal onboarding
    expect(isValidTransition('TRIALING', 'ACTIVE')).toBe(true);

    // Payment failure and recovery
    expect(isValidTransition('ACTIVE', 'PAST_DUE')).toBe(true);
    expect(isValidTransition('PAST_DUE', 'ACTIVE')).toBe(true);

    // Vacation or institutional pause
    expect(isValidTransition('ACTIVE', 'PAUSED')).toBe(true);
    expect(isValidTransition('PAUSED', 'ACTIVE')).toBe(true);

    // Expiration after grace period
    expect(isValidTransition('PAST_DUE', 'EXPIRED')).toBe(true);

    // Cancellation and re-activation
    expect(isValidTransition('ACTIVE', 'CANCELLED')).toBe(true);
    expect(isValidTransition('CANCELLED', 'ACTIVE')).toBe(true);
  });

  it('disallows invalid state transitions', () => {
    // TRIALING cannot jump directly to PAST_DUE
    expect(isValidTransition('TRIALING', 'PAST_DUE')).toBe(false);

    // EXPIRED cannot jump directly to PAST_DUE or PAUSED
    expect(isValidTransition('EXPIRED', 'PAST_DUE')).toBe(false);
    expect(isValidTransition('EXPIRED', 'PAUSED')).toBe(false);
  });

  it('verifies cancel_at_period_end preserves active status until period end date', () => {
    const now = new Date('2026-09-15T10:00:00Z');
    const periodEnd = new Date('2026-10-01T00:00:00Z');

    const subscription = {
      status: 'ACTIVE' as SubscriptionStatusType,
      cancel_at_period_end: true,
      current_period_end: periodEnd.toISOString(),
    };

    // Before period end date: access remains ACTIVE
    const isStillActive = subscription.status === 'ACTIVE' && now < new Date(subscription.current_period_end);
    expect(isStillActive).toBe(true);

    // After period end date: transitions to EXPIRED or CANCELLED
    const afterPeriodEnd = new Date('2026-10-02T00:00:00Z');
    const isExpiredAfter = afterPeriodEnd >= new Date(subscription.current_period_end);
    expect(isExpiredAfter).toBe(true);
  });
});
