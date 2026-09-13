import { describe, it, expect } from 'vitest';
import {
  SubscriptionStatusSchema,
  BillingIntervalSchema,
  PaymentStatusSchema,
  SubscriptionEventTypeSchema,
  CheckoutSessionRequestSchema,
} from '../../src/lib/validations/billing';
import type { PlanRecord } from '../../src/lib/billing/types';

describe('Phase 5 SaaS Billing: Plan Models & Entitlements Structure', () => {
  const mockPlans: PlanRecord[] = [
    {
      id: 'plan-free-001',
      name: 'Individual Educator / Starter School',
      slug: 'free',
      description: '100% Free forever starter tier',
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
    {
      id: 'plan-school-pro-001',
      name: 'School Pro',
      slug: 'school-pro',
      description: 'Full institutional suite for CBSE schools',
      billing_interval: 'YEARLY',
      price: 999900, // ₹9,999 in paise
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
      created_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-09-01T00:00:00Z',
    },
  ];

  it('validates subscription statuses according to state machine specification', () => {
    expect(SubscriptionStatusSchema.parse('TRIALING')).toBe('TRIALING');
    expect(SubscriptionStatusSchema.parse('ACTIVE')).toBe('ACTIVE');
    expect(SubscriptionStatusSchema.parse('PAST_DUE')).toBe('PAST_DUE');
    expect(SubscriptionStatusSchema.parse('PAUSED')).toBe('PAUSED');
    expect(SubscriptionStatusSchema.parse('CANCELLED')).toBe('CANCELLED');
    expect(SubscriptionStatusSchema.parse('EXPIRED')).toBe('EXPIRED');

    expect(() => SubscriptionStatusSchema.parse('UNKNOWN_STATUS')).toThrow();
  });

  it('validates billing intervals (MONTHLY and YEARLY)', () => {
    expect(BillingIntervalSchema.parse('MONTHLY')).toBe('MONTHLY');
    expect(BillingIntervalSchema.parse('YEARLY')).toBe('YEARLY');
    expect(() => BillingIntervalSchema.parse('DAILY')).toThrow();
  });

  it('validates payment statuses and subscription event types', () => {
    expect(PaymentStatusSchema.parse('PENDING')).toBe('PENDING');
    expect(PaymentStatusSchema.parse('SUCCESS')).toBe('SUCCESS');
    expect(PaymentStatusSchema.parse('FAILED')).toBe('FAILED');
    expect(PaymentStatusSchema.parse('REFUNDED')).toBe('REFUNDED');

    expect(SubscriptionEventTypeSchema.parse('SUBSCRIPTION_ACTIVATED')).toBe('SUBSCRIPTION_ACTIVATED');
    expect(SubscriptionEventTypeSchema.parse('PAYMENT_SUCCEEDED')).toBe('PAYMENT_SUCCEEDED');
  });

  it('correctly parses prices in minor currency units (paise) into INR rupees', () => {
    const free = mockPlans[0];
    const pro = mockPlans[1];

    expect(free.price).toBe(0);
    expect(free.price / 100).toBe(0);

    expect(pro.price).toBe(999900);
    expect(pro.price / 100).toBe(9999);
  });

  it('validates checkout session request schema with valid and invalid payloads', () => {
    const valid = {
      planSlug: 'school-pro',
      billingInterval: 'YEARLY',
      schoolId: '123e4567-e89b-12d3-a456-426614174000',
    };
    expect(CheckoutSessionRequestSchema.parse(valid)).toEqual(valid);

    const invalidSchool = {
      planSlug: 'school-pro',
      billingInterval: 'YEARLY',
      schoolId: 'not-a-uuid',
    };
    expect(() => CheckoutSessionRequestSchema.parse(invalidSchool)).toThrow();
  });
});
