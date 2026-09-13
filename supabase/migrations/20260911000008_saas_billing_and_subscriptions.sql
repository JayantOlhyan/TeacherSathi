-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000008_saas_billing_and_subscriptions.sql
-- Description: Production SaaS Billing, Subscription Management, Plans & Entitlements
-- =============================================================================

-- 1. ENUMERATIONS
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM (
    'TRIALING',
    'ACTIVE',
    'PAST_DUE',
    'PAUSED',
    'CANCELLED',
    'EXPIRED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_interval AS ENUM (
    'MONTHLY',
    'YEARLY'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_event_type AS ENUM (
    'SUBSCRIPTION_CREATED',
    'SUBSCRIPTION_ACTIVATED',
    'PLAN_CHANGED',
    'PAYMENT_SUCCEEDED',
    'PAYMENT_FAILED',
    'SUBSCRIPTION_PAUSED',
    'SUBSCRIPTION_CANCELLED',
    'SUBSCRIPTION_EXPIRED',
    'SUBSCRIPTION_RENEWED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. PLANS TABLE (Database-driven pricing configuration)
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  billing_interval billing_interval NOT NULL DEFAULT 'MONTHLY',
  price INT NOT NULL DEFAULT 0, -- price in paise / minor units (e.g. 49900 = 499.00 INR)
  currency TEXT NOT NULL DEFAULT 'INR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  entitlements JSONB NOT NULL DEFAULT '{}',
  feature_flags JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SUBSCRIPTIONS TABLE (School Subscription State)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL DEFAULT 'MOCK', -- 'RAZORPAY' | 'MOCK'
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  status subscription_status NOT NULL DEFAULT 'ACTIVE',
  billing_interval billing_interval NOT NULL DEFAULT 'MONTHLY',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_school_subscription UNIQUE (school_id)
);

-- 4. SUBSCRIPTION EVENTS (Immutable Lifecycle Audit Ledger)
CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  event_type subscription_event_type NOT NULL,
  from_status subscription_status,
  to_status subscription_status,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PAYMENT RECORDS (Invoices and Transaction Receipts)
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'RAZORPAY',
  provider_payment_id TEXT,
  provider_order_id TEXT,
  amount INT NOT NULL DEFAULT 0, -- in paise
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'PENDING',
  receipt_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PROCESSED WEBHOOK EVENTS (Idempotency Registry)
CREATE TABLE IF NOT EXISTS processed_webhook_events (
  id TEXT PRIMARY KEY, -- provider event ID
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_plans_active_order ON plans(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_plans_slug ON plans(slug);
CREATE INDEX IF NOT EXISTS idx_subs_school_status ON subscriptions(school_id, status);
CREATE INDEX IF NOT EXISTS idx_subs_plan ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subs_provider_id ON subscriptions(provider_subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_events_sub ON subscription_events(subscription_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sub_events_school ON subscription_events(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_records_school ON payment_records(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_records_sub ON payment_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_provider_id ON payment_records(provider_payment_id);

-- 8. SECURITY HELPER FUNCTION: is_school_admin_of
CREATE OR REPLACE FUNCTION is_school_admin_of(p_user_id UUID, p_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = p_user_id
      AND school_id = p_school_id
      AND role = 'SCHOOL_ADMIN'
      AND is_active = true
  );
$$;

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;

-- Plans Policies (Public read for active plans)
CREATE POLICY "plans_read_active" ON plans
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "plans_superadmin_all" ON plans
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));

CREATE POLICY "plans_service_role_all" ON plans
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Subscriptions Policies
CREATE POLICY "sub_school_admin_select" ON subscriptions
  FOR SELECT TO authenticated
  USING (is_school_admin_of(auth.uid(), school_id));

CREATE POLICY "sub_school_admin_modify" ON subscriptions
  FOR UPDATE TO authenticated
  USING (is_school_admin_of(auth.uid(), school_id))
  WITH CHECK (is_school_admin_of(auth.uid(), school_id));

CREATE POLICY "sub_superadmin_all" ON subscriptions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));

CREATE POLICY "sub_service_role_all" ON subscriptions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Subscription Events Policies
CREATE POLICY "se_school_admin_select" ON subscription_events
  FOR SELECT TO authenticated
  USING (is_school_admin_of(auth.uid(), school_id));

CREATE POLICY "se_superadmin_all" ON subscription_events
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));

CREATE POLICY "se_service_role_all" ON subscription_events
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Payment Records Policies
CREATE POLICY "pr_school_admin_select" ON payment_records
  FOR SELECT TO authenticated
  USING (is_school_admin_of(auth.uid(), school_id));

CREATE POLICY "pr_superadmin_all" ON payment_records
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'));

CREATE POLICY "pr_service_role_all" ON payment_records
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Webhook Events Policies (Service role only)
CREATE POLICY "pwe_service_role_all" ON processed_webhook_events
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- 10. SEED CANONICAL PLANS
INSERT INTO plans (
  name,
  slug,
  description,
  billing_interval,
  price,
  currency,
  is_active,
  display_order,
  entitlements,
  feature_flags
) VALUES
(
  'Individual Educator / Starter School',
  'free',
  '100% Free forever for individual government teachers and starter school deployments.',
  'MONTHLY',
  0,
  'INR',
  true,
  1,
  '{
    "TEACHER_LIMIT": 3,
    "STUDENT_LIMIT": 60,
    "CLASS_LIMIT": 2,
    "AI_GENERATION_LIMIT": 100,
    "AI_QUIZ_LIMIT": 50,
    "AI_TEST_LIMIT": 10,
    "AI_WORKSHEET_LIMIT": 30,
    "AI_LESSON_PLAN_LIMIT": 20,
    "SMARTBOARD_LIMIT": 1,
    "CLASSROOM_SESSION_LIMIT": 20,
    "STORAGE_LIMIT_MB": 500
  }'::jsonb,
  '{
    "AI_GENERATION": true,
    "SMARTBOARD": true,
    "ASSESSMENTS": true,
    "ANALYTICS": false,
    "EXPORTS": false,
    "ADVANCED_REPORTS": false
  }'::jsonb
),
(
  'School Standard',
  'school',
  'Ideal for single-shift primary and middle schools scaling interactive smartboard teaching.',
  'YEARLY',
  499900, -- ₹4,999 / year
  'INR',
  true,
  2,
  '{
    "TEACHER_LIMIT": 15,
    "STUDENT_LIMIT": 350,
    "CLASS_LIMIT": 10,
    "AI_GENERATION_LIMIT": 500,
    "AI_QUIZ_LIMIT": 250,
    "AI_TEST_LIMIT": 100,
    "AI_WORKSHEET_LIMIT": 200,
    "AI_LESSON_PLAN_LIMIT": 150,
    "SMARTBOARD_LIMIT": 5,
    "CLASSROOM_SESSION_LIMIT": 100,
    "STORAGE_LIMIT_MB": 5000
  }'::jsonb,
  '{
    "AI_GENERATION": true,
    "SMARTBOARD": true,
    "ASSESSMENTS": true,
    "ANALYTICS": true,
    "EXPORTS": true,
    "ADVANCED_REPORTS": false
  }'::jsonb
),
(
  'School Pro',
  'school-pro',
  'Full institutional suite for CBSE secondary schools with complete concept analytics and PDF exports.',
  'YEARLY',
  999900, -- ₹9,999 / year
  'INR',
  true,
  3,
  '{
    "TEACHER_LIMIT": 50,
    "STUDENT_LIMIT": 1200,
    "CLASS_LIMIT": 35,
    "AI_GENERATION_LIMIT": 2000,
    "AI_QUIZ_LIMIT": 1000,
    "AI_TEST_LIMIT": 500,
    "AI_WORKSHEET_LIMIT": 1000,
    "AI_LESSON_PLAN_LIMIT": 800,
    "SMARTBOARD_LIMIT": 15,
    "CLASSROOM_SESSION_LIMIT": 500,
    "STORAGE_LIMIT_MB": 20000
  }'::jsonb,
  '{
    "AI_GENERATION": true,
    "SMARTBOARD": true,
    "ASSESSMENTS": true,
    "ANALYTICS": true,
    "EXPORTS": true,
    "ADVANCED_REPORTS": true
  }'::jsonb
),
(
  'Institutional Enterprise (KVS / District)',
  'enterprise',
  'Custom institutional licensing for school clusters, district education offices, and KVS chains.',
  'YEARLY',
  2999900, -- ₹29,999 / year
  'INR',
  true,
  4,
  '{
    "TEACHER_LIMIT": 250,
    "STUDENT_LIMIT": 10000,
    "CLASS_LIMIT": 200,
    "AI_GENERATION_LIMIT": 10000,
    "AI_QUIZ_LIMIT": 5000,
    "AI_TEST_LIMIT": 2500,
    "AI_WORKSHEET_LIMIT": 5000,
    "AI_LESSON_PLAN_LIMIT": 4000,
    "SMARTBOARD_LIMIT": 100,
    "CLASSROOM_SESSION_LIMIT": 5000,
    "STORAGE_LIMIT_MB": 100000
  }'::jsonb,
  '{
    "AI_GENERATION": true,
    "SMARTBOARD": true,
    "ASSESSMENTS": true,
    "ANALYTICS": true,
    "EXPORTS": true,
    "ADVANCED_REPORTS": true
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  billing_interval = EXCLUDED.billing_interval,
  entitlements = EXCLUDED.entitlements,
  feature_flags = EXCLUDED.feature_flags,
  updated_at = now();
