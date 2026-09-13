import { z } from 'zod';

export const SubscriptionStatusSchema = z.enum([
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'PAUSED',
  'CANCELLED',
  'EXPIRED',
]);

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

export const BillingIntervalSchema = z.enum(['MONTHLY', 'YEARLY']);
export type BillingInterval = z.infer<typeof BillingIntervalSchema>;

export const PaymentStatusSchema = z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const SubscriptionEventTypeSchema = z.enum([
  'SUBSCRIPTION_CREATED',
  'SUBSCRIPTION_ACTIVATED',
  'PLAN_CHANGED',
  'PAYMENT_SUCCEEDED',
  'PAYMENT_FAILED',
  'SUBSCRIPTION_PAUSED',
  'SUBSCRIPTION_CANCELLED',
  'SUBSCRIPTION_EXPIRED',
  'SUBSCRIPTION_RENEWED',
]);
export type SubscriptionEventType = z.infer<typeof SubscriptionEventTypeSchema>;

export const CheckoutSessionRequestSchema = z.object({
  planSlug: z.string().min(1),
  billingInterval: BillingIntervalSchema.default('YEARLY'),
  schoolId: z.string().uuid(),
});
export type CheckoutSessionRequest = z.infer<typeof CheckoutSessionRequestSchema>;

export const PaymentVerificationRequestSchema = z.object({
  schoolId: z.string().uuid(),
  planSlug: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().min(1),
});
export type PaymentVerificationRequest = z.infer<typeof PaymentVerificationRequestSchema>;

export const PlanChangeRequestSchema = z.object({
  schoolId: z.string().uuid(),
  targetPlanSlug: z.string().min(1),
  immediate: z.boolean().default(false),
});
export type PlanChangeRequest = z.infer<typeof PlanChangeRequestSchema>;

export const CancelSubscriptionRequestSchema = z.object({
  schoolId: z.string().uuid(),
  reason: z.string().optional(),
});
export type CancelSubscriptionRequest = z.infer<typeof CancelSubscriptionRequestSchema>;
