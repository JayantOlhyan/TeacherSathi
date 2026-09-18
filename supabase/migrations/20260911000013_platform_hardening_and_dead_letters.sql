-- =============================================================================
-- TEACHERSATHI — PHASE 10: PLATFORM INTELLIGENCE, SCALE HARDENING & DEAD LETTERS
-- Migration: 20260911000013_platform_hardening_and_dead_letters.sql
-- =============================================================================

-- 1. High-Frequency Composite Indexes for 10M+ Scale Performance
-- -----------------------------------------------------------------------------

-- Attempt answers composite index for point lookups during autosave & grading
CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt_question 
  ON attempt_answers(attempt_id, question_id);

-- Assessment attempts composite index for student single-attempt checks
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_student_assessment_status 
  ON assessment_attempts(student_id, assessment_id, status);

-- Assessment results composite lookup by student and assessment
CREATE INDEX IF NOT EXISTS idx_assessment_results_student_assessment 
  ON assessment_results(student_id, assessment_id);

-- Student concept mastery composite indexes for multi-tier district/state aggregations
CREATE INDEX IF NOT EXISTS idx_scm_school_subject_grade 
  ON student_concept_mastery(school_id, subject_id, grade_id);

CREATE INDEX IF NOT EXISTS idx_scm_student_chapter 
  ON student_concept_mastery(student_id, chapter_id);

CREATE INDEX IF NOT EXISTS idx_scm_school_chapter 
  ON student_concept_mastery(school_id, chapter_id);

-- Learning gaps composite index for severity sorting per school
CREATE INDEX IF NOT EXISTS idx_lg_school_severity_status 
  ON learning_gaps(school_id, severity, status);

-- Classroom events sequence and recovery indexes
CREATE INDEX IF NOT EXISTS idx_classroom_events_session_created 
  ON classroom_events(session_id, created_at DESC);

-- Audit logs composite index for tenant compliance inspection
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created 
  ON audit_logs(actor_id, created_at DESC);

-- Media jobs queue polling composite index
CREATE INDEX IF NOT EXISTS idx_media_jobs_status_created 
  ON media_jobs(status, created_at ASC);

-- Notifications unread count composite index
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
  ON notifications(user_id, read_at) WHERE read_at IS NULL;


-- 2. Dead-Letter Queue Table (job_dead_letters)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_dead_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_job_id TEXT NOT NULL,
  job_type TEXT NOT NULL,
  queue_name TEXT NOT NULL DEFAULT 'default',
  payload JSONB NOT NULL DEFAULT '{}',
  failure_reason TEXT NOT NULL,
  retry_count INT NOT NULL DEFAULT 0,
  last_attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'DEAD' CHECK (status IN ('DEAD', 'REQUEUED', 'PURGED')),
  requeued_at TIMESTAMPTZ,
  purged_at TIMESTAMPTZ,
  operator_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_dead_letters_status_type 
  ON job_dead_letters(status, job_type);

CREATE INDEX IF NOT EXISTS idx_job_dead_letters_created_at 
  ON job_dead_letters(created_at DESC);

CREATE TRIGGER trg_job_dead_letters_updated_at
  BEFORE UPDATE ON job_dead_letters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE job_dead_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jdl_admin_policy" ON job_dead_letters
  FOR ALL USING (
    is_super_admin()
  );


-- 3. Hierarchical Feature Flags Table (feature_flags)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT NOT NULL UNIQUE,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  scope TEXT NOT NULL DEFAULT 'PLATFORM' CHECK (scope IN ('PLATFORM', 'STATE', 'DISTRICT', 'ORGANIZATION', 'SCHOOL')),
  target_ids TEXT[] DEFAULT '{}',
  rollout_percentage INT NOT NULL DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_scope ON feature_flags(scope, is_enabled);

CREATE TRIGGER trg_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feature_flags_select_all" ON feature_flags
  FOR SELECT USING (true);

CREATE POLICY "feature_flags_admin_modify" ON feature_flags
  FOR ALL USING (
    is_super_admin()
  );


-- 4. Immutable Operator Action Audit Table (operator_audit_logs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS operator_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  reason TEXT NOT NULL,
  request_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  result TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (result IN ('SUCCESS', 'FAILURE')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_operator_audit_operator_created 
  ON operator_audit_logs(operator_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_operator_audit_action 
  ON operator_audit_logs(action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_operator_audit_request 
  ON operator_audit_logs(request_id);

ALTER TABLE operator_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "operator_audit_admin_read" ON operator_audit_logs
  FOR SELECT USING (
    is_super_admin()
  );

CREATE POLICY "operator_audit_insert" ON operator_audit_logs
  FOR INSERT WITH CHECK (
    is_super_admin()
  );
