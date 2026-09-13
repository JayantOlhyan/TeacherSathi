export interface PlanEntitlements {
  TEACHER_LIMIT: number;
  STUDENT_LIMIT: number;
  CLASS_LIMIT: number;
  AI_GENERATION_LIMIT: number;
  AI_QUIZ_LIMIT: number;
  AI_TEST_LIMIT: number;
  AI_WORKSHEET_LIMIT: number;
  AI_LESSON_PLAN_LIMIT: number;
  SMARTBOARD_LIMIT: number;
  CLASSROOM_SESSION_LIMIT: number;
  STORAGE_LIMIT_MB: number;
  [key: string]: number;
}

export interface PlanFeatureFlags {
  AI_GENERATION: boolean;
  SMARTBOARD: boolean;
  ASSESSMENTS: boolean;
  ANALYTICS: boolean;
  EXPORTS: boolean;
  ADVANCED_REPORTS: boolean;
  [key: string]: boolean;
}

export interface PlanRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  billing_interval: 'MONTHLY' | 'YEARLY';
  price: number; // in paise (e.g. 49900 = 499.00 INR)
  currency: string;
  is_active: boolean;
  display_order: number;
  entitlements: PlanEntitlements;
  feature_flags: PlanFeatureFlags;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatusType =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'PAUSED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface SubscriptionRecord {
  id: string;
  school_id: string;
  plan_id: string;
  provider: string; // 'RAZORPAY' | 'MOCK'
  provider_subscription_id: string | null;
  provider_customer_id: string | null;
  status: SubscriptionStatusType;
  billing_interval: 'MONTHLY' | 'YEARLY';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
  plan?: PlanRecord;
}

export interface SubscriptionEventRecord {
  id: string;
  subscription_id: string;
  school_id: string;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  school_id: string;
  subscription_id: string | null;
  provider: string;
  provider_payment_id: string | null;
  provider_order_id: string | null;
  amount: number; // in paise
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  receipt_url: string | null;
  metadata: Record<string, unknown>;
  paid_at: string | null;
  created_at: string;
}

export interface SchoolUsageMetrics {
  teachers: number;
  students: number;
  classes: number;
  smartboards: number;
  aiGenerations: number;
  storageMb: number;
}

export interface SuperAdminBillingOverview {
  totalSchools: number;
  subscribedSchools: number;
  freeSchools: number;
  mrr: number; // in paise
  arr: number; // in paise
  planDistribution: Record<string, number>;
  pastDueSubscriptions: Array<{
    id: string;
    school_id: string;
    school_name: string;
    status: string;
    current_period_end: string;
    amount: number;
  }>;
}
