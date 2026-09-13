import { describe, it, expect, vi } from 'vitest';
import { entitlementEngine } from '../../src/lib/billing/entitlements';
import { billingRepository } from '../../src/lib/repositories/billing';

describe('Phase 5 SaaS Billing: Entitlements & Feature Gating', () => {
  it('correctly grants or denies feature access based on plan flags', async () => {
    const mockSchoolId = '123e4567-e89b-12d3-a456-426614174000';

    // Mock Free Plan subscription
    vi.spyOn(billingRepository, 'getSubscriptionBySchoolId').mockResolvedValue({
      id: 'sub-1',
      school_id: mockSchoolId,
      plan_id: 'plan-free',
      provider: 'MOCK',
      provider_subscription_id: null,
      provider_customer_id: null,
      status: 'ACTIVE',
      billing_interval: 'MONTHLY',
      current_period_start: '2026-09-01T00:00:00Z',
      current_period_end: '2026-10-01T00:00:00Z',
      cancel_at_period_end: false,
      cancelled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-09-01T00:00:00Z',
      plan: {
        id: 'plan-free',
        name: 'Free',
        slug: 'free',
        description: 'Free',
        billing_interval: 'MONTHLY',
        price: 0,
        currency: 'INR',
        is_active: true,
        display_order: 1,
        entitlements: {
          TEACHER_LIMIT: 3,
          STUDENT_LIMIT: 60,
          CLASS_LIMIT: 2,
          AI_GENERATION_LIMIT: 100,
          AI_QUIZ_LIMIT: 50,
          AI_TEST_LIMIT: 10,
          AI_WORKSHEET_LIMIT: 30,
          AI_LESSON_PLAN_LIMIT: 20,
          SMARTBOARD_LIMIT: 1,
          CLASSROOM_SESSION_LIMIT: 20,
          STORAGE_LIMIT_MB: 500,
        },
        feature_flags: {
          AI_GENERATION: true,
          SMARTBOARD: true,
          ASSESSMENTS: true,
          ANALYTICS: false,
          EXPORTS: false,
          ADVANCED_REPORTS: false,
        },
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
    });

    const canUseAI = await entitlementEngine.canUseFeature(mockSchoolId, 'AI_GENERATION');
    const canUseAnalytics = await entitlementEngine.canUseFeature(mockSchoolId, 'ANALYTICS');
    const canUseExports = await entitlementEngine.canUseFeature(mockSchoolId, 'EXPORTS');

    expect(canUseAI).toBe(true);
    expect(canUseAnalytics).toBe(false);
    expect(canUseExports).toBe(false);
  });

  it('correctly calculates remaining quota and enforces limits', async () => {
    const mockSchoolId = '123e4567-e89b-12d3-a456-426614174000';

    vi.spyOn(billingRepository, 'getSubscriptionBySchoolId').mockResolvedValueOnce({
      id: 'sub-2',
      school_id: mockSchoolId,
      plan_id: 'plan-school',
      provider: 'RAZORPAY',
      provider_subscription_id: 'sub_123',
      provider_customer_id: 'cust_123',
      status: 'ACTIVE',
      billing_interval: 'YEARLY',
      current_period_start: '2026-09-01T00:00:00Z',
      current_period_end: '2027-09-01T00:00:00Z',
      cancel_at_period_end: false,
      cancelled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-09-01T00:00:00Z',
      plan: {
        id: 'plan-school',
        name: 'School Standard',
        slug: 'school',
        description: 'Standard',
        billing_interval: 'YEARLY',
        price: 499900,
        currency: 'INR',
        is_active: true,
        display_order: 2,
        entitlements: {
          TEACHER_LIMIT: 15,
          STUDENT_LIMIT: 350,
          CLASS_LIMIT: 10,
          AI_GENERATION_LIMIT: 500,
          AI_QUIZ_LIMIT: 250,
          AI_TEST_LIMIT: 100,
          AI_WORKSHEET_LIMIT: 200,
          AI_LESSON_PLAN_LIMIT: 150,
          SMARTBOARD_LIMIT: 5,
          CLASSROOM_SESSION_LIMIT: 100,
          STORAGE_LIMIT_MB: 5000,
        },
        feature_flags: {
          AI_GENERATION: true,
          SMARTBOARD: true,
          ASSESSMENTS: true,
          ANALYTICS: true,
          EXPORTS: true,
          ADVANCED_REPORTS: false,
        },
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
    });

    vi.spyOn(billingRepository, 'getSchoolUsageMetrics').mockResolvedValueOnce({
      teachers: 10,
      students: 200,
      classes: 8,
      smartboards: 3,
      aiGenerations: 420,
      storageMb: 250,
    });

    const teacherQuota = await entitlementEngine.getRemainingQuota(mockSchoolId, 'TEACHER_LIMIT', {} as any);
    expect(teacherQuota.allowed).toBe(true);
    expect(teacherQuota.currentUsage).toBe(10);
    expect(teacherQuota.limit).toBe(15);
    expect(teacherQuota.remaining).toBe(5);
  });

  it('rejects resource creation when quota limit is reached', async () => {
    const mockSchoolId = '123e4567-e89b-12d3-a456-426614174000';

    vi.spyOn(billingRepository, 'getSubscriptionBySchoolId').mockResolvedValueOnce({
      id: 'sub-3',
      school_id: mockSchoolId,
      plan_id: 'plan-free',
      provider: 'MOCK',
      provider_subscription_id: null,
      provider_customer_id: null,
      status: 'ACTIVE',
      billing_interval: 'MONTHLY',
      current_period_start: '2026-09-01T00:00:00Z',
      current_period_end: '2026-10-01T00:00:00Z',
      cancel_at_period_end: false,
      cancelled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-09-01T00:00:00Z',
      plan: {
        id: 'plan-free',
        name: 'Free',
        slug: 'free',
        description: 'Free',
        billing_interval: 'MONTHLY',
        price: 0,
        currency: 'INR',
        is_active: true,
        display_order: 1,
        entitlements: {
          TEACHER_LIMIT: 3,
          STUDENT_LIMIT: 60,
          CLASS_LIMIT: 2,
          AI_GENERATION_LIMIT: 100,
          AI_QUIZ_LIMIT: 50,
          AI_TEST_LIMIT: 10,
          AI_WORKSHEET_LIMIT: 30,
          AI_LESSON_PLAN_LIMIT: 20,
          SMARTBOARD_LIMIT: 1,
          CLASSROOM_SESSION_LIMIT: 20,
          STORAGE_LIMIT_MB: 500,
        },
        feature_flags: {
          AI_GENERATION: true,
          SMARTBOARD: true,
          ASSESSMENTS: true,
          ANALYTICS: false,
          EXPORTS: false,
          ADVANCED_REPORTS: false,
        },
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
    });

    vi.spyOn(billingRepository, 'getSchoolUsageMetrics').mockResolvedValueOnce({
      teachers: 3, // at limit
      students: 60,
      classes: 2,
      smartboards: 1,
      aiGenerations: 100,
      storageMb: 50,
    });

    const check = await entitlementEngine.checkLimit(mockSchoolId, 'TEACHER_LIMIT', {} as any);
    expect(check.allowed).toBe(false);
    expect(check.currentUsage).toBe(3);
    expect(check.limit).toBe(3);
  });

  it('restricts AI generation during PAST_DUE grace period while allowing core features', async () => {
    const mockSchoolId = '123e4567-e89b-12d3-a456-426614174000';
    const now = new Date();
    // Period ended 2 days ago (within 7-day grace window)
    const periodEnd = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    vi.spyOn(billingRepository, 'getSubscriptionBySchoolId').mockResolvedValue({
      id: 'sub-grace',
      school_id: mockSchoolId,
      plan_id: 'plan-pro',
      provider: 'RAZORPAY',
      provider_subscription_id: 'sub_grace_1',
      provider_customer_id: 'cust_1',
      status: 'PAST_DUE',
      billing_interval: 'MONTHLY',
      current_period_start: '2026-08-01T00:00:00Z',
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      cancelled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-08-01T00:00:00Z',
      plan: {
        id: 'plan-pro',
        name: 'School Pro',
        slug: 'school-pro',
        description: 'Pro',
        billing_interval: 'MONTHLY',
        price: 99900,
        currency: 'INR',
        is_active: true,
        display_order: 3,
        entitlements: {
          TEACHER_LIMIT: 50,
          STUDENT_LIMIT: 1200,
          CLASS_LIMIT: 35,
          AI_GENERATION_LIMIT: 2000,
          AI_QUIZ_LIMIT: 1000,
          AI_TEST_LIMIT: 500,
          AI_WORKSHEET_LIMIT: 1000,
          AI_LESSON_PLAN_LIMIT: 800,
          SMARTBOARD_LIMIT: 15,
          CLASSROOM_SESSION_LIMIT: 500,
          STORAGE_LIMIT_MB: 20000,
        },
        feature_flags: {
          AI_GENERATION: true,
          SMARTBOARD: true,
          ASSESSMENTS: true,
          ANALYTICS: true,
          EXPORTS: true,
          ADVANCED_REPORTS: true,
        },
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
      },
    });

    const canAssess = await entitlementEngine.canUseFeature(mockSchoolId, 'ASSESSMENTS');
    const canSmartboard = await entitlementEngine.canUseFeature(mockSchoolId, 'SMARTBOARD');
    const canUseAI = await entitlementEngine.canUseFeature(mockSchoolId, 'AI_GENERATION');

    // Core reading/assessment remains active in grace period
    expect(canAssess).toBe(true);
    expect(canSmartboard).toBe(true);
    // Cost-bearing AI generations are paused during grace period
    expect(canUseAI).toBe(false);
  });
});
