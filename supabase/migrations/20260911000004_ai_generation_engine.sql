-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000004_ai_generation_engine.sql
-- Description: AI Generation telemetry, request logging, and monthly usage tracking.
-- =============================================================================

-- 1. AI GENERATION STATUS ENUM
CREATE TYPE ai_generation_status AS ENUM (
  'PENDING',
  'GENERATING',
  'VALIDATING',
  'COMPLETED',
  'FAILED'
);

-- 2. AI GENERATIONS TELEMETRY TABLE
CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  resource_type TEXT NOT NULL,
  curriculum_context JSONB NOT NULL DEFAULT '{}',
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  status ai_generation_status NOT NULL DEFAULT 'PENDING',
  prompt_summary TEXT,
  token_count_prompt INT NOT NULL DEFAULT 0,
  token_count_completion INT NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL DEFAULT 0,
  error_message TEXT,
  idempotency_key TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. AI USAGE TRACKING (Monthly quota enforcement)
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  period TEXT NOT NULL, -- e.g. '2026-09'
  generation_count INT NOT NULL DEFAULT 0,
  last_generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_ai_usage_period UNIQUE (user_id, period)
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_ai_generations_user ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_school ON ai_generations(school_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON ai_generations(status);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created ON ai_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_generations_idempotency ON ai_generations(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_period ON ai_usage_tracking(user_id, period);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- AI Generations Policies
CREATE POLICY "ai_generations_select_policy" ON ai_generations
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_super_admin()
    OR (
      school_id IS NOT NULL 
      AND public.is_school_admin(school_id)
    )
  );

CREATE POLICY "ai_generations_insert_policy" ON ai_generations
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR public.is_super_admin()
  );

CREATE POLICY "ai_generations_update_policy" ON ai_generations
  FOR UPDATE USING (
    user_id = auth.uid()
    OR public.is_super_admin()
  );

-- AI Usage Tracking Policies
CREATE POLICY "ai_usage_select_policy" ON ai_usage_tracking
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_super_admin()
    OR (
      school_id IS NOT NULL 
      AND public.is_school_admin(school_id)
    )
  );

CREATE POLICY "ai_usage_modify_policy" ON ai_usage_tracking
  FOR ALL USING (
    user_id = auth.uid()
    OR public.is_super_admin()
  );
