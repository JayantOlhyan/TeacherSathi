-- =============================================================================
-- TEACHERSATHI — PHASE 5: ACADEMIC INTELLIGENCE, CONCEPT MASTERY & DIAGNOSTICS
-- Migration: 20260911000007_academic_intelligence.sql
-- =============================================================================

-- 1. Custom Types for Mastery, Gaps, and Observed Difficulty
DO $$ BEGIN
  CREATE TYPE mastery_status AS ENUM (
    'INSUFFICIENT_EVIDENCE',
    'CRITICAL',
    'DEVELOPING',
    'APPROACHING',
    'PROFICIENT',
    'STRONG'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE evidence_confidence AS ENUM (
    'INSUFFICIENT_EVIDENCE',
    'LOW',
    'MEDIUM',
    'HIGH'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gap_severity AS ENUM (
    'CRITICAL',
    'HIGH',
    'MODERATE',
    'ON_TRACK'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gap_status AS ENUM (
    'OPEN',
    'IN_REMEDIATION',
    'RESOLVED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE observed_difficulty_tier AS ENUM (
    'INSUFFICIENT_DATA',
    'EASY',
    'MODERATE',
    'DIFFICULT',
    'VERY_DIFFICULT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. Student Concept Mastery (Materialized Current State)
-- =============================================================================
CREATE TABLE IF NOT EXISTS student_concept_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  grade_id TEXT NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  mastery_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (mastery_score >= 0.00 AND mastery_score <= 100.00),
  confidence_level evidence_confidence NOT NULL DEFAULT 'INSUFFICIENT_EVIDENCE',
  evidence_count INT NOT NULL DEFAULT 0 CHECK (evidence_count >= 0),
  correct_count INT NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
  incorrect_count INT NOT NULL DEFAULT 0 CHECK (incorrect_count >= 0),
  unanswered_count INT NOT NULL DEFAULT 0 CHECK (unanswered_count >= 0),
  recent_accuracy NUMERIC(5, 2),
  historical_accuracy NUMERIC(5, 2),
  status mastery_status NOT NULL DEFAULT 'INSUFFICIENT_EVIDENCE',
  last_assessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_concept UNIQUE (student_id, concept_id)
);

-- =============================================================================
-- 3. Concept Mastery History (Append-Only Trend Ledger)
-- =============================================================================
CREATE TABLE IF NOT EXISTS concept_mastery_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  mastery_score NUMERIC(5, 2) NOT NULL CHECK (mastery_score >= 0.00 AND mastery_score <= 100.00),
  confidence_level evidence_confidence NOT NULL DEFAULT 'LOW',
  evidence_count INT NOT NULL DEFAULT 1 CHECK (evidence_count >= 1),
  source_assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  source_attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE SET NULL,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 4. Learning Gaps (Active Gaps & Action Tracking)
-- =============================================================================
CREATE TABLE IF NOT EXISTS learning_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  grade_id TEXT NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  severity gap_severity NOT NULL DEFAULT 'HIGH',
  mastery_score NUMERIC(5, 2) NOT NULL CHECK (mastery_score >= 0.00 AND mastery_score <= 100.00),
  confidence_level evidence_confidence NOT NULL DEFAULT 'MEDIUM',
  evidence_count INT NOT NULL DEFAULT 0 CHECK (evidence_count >= 0),
  status gap_status NOT NULL DEFAULT 'OPEN',
  recommended_action TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_gap_concept UNIQUE (student_id, concept_id)
);

-- =============================================================================
-- 5. Question Metrics (Observed Difficulty & Item Statistics)
-- =============================================================================
CREATE TABLE IF NOT EXISTS question_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
  attempt_count INT NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  correct_count INT NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
  incorrect_count INT NOT NULL DEFAULT 0 CHECK (incorrect_count >= 0),
  accuracy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (accuracy_rate >= 0.00 AND accuracy_rate <= 100.00),
  declared_difficulty difficulty_tier NOT NULL DEFAULT 'MEDIUM',
  observed_difficulty observed_difficulty_tier NOT NULL DEFAULT 'INSUFFICIENT_DATA',
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 6. Indexes for High-Performance Queries
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_scm_student ON student_concept_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_scm_concept ON student_concept_mastery(concept_id);
CREATE INDEX IF NOT EXISTS idx_scm_chapter ON student_concept_mastery(chapter_id);
CREATE INDEX IF NOT EXISTS idx_scm_school ON student_concept_mastery(school_id);
CREATE INDEX IF NOT EXISTS idx_scm_status ON student_concept_mastery(status);

CREATE INDEX IF NOT EXISTS idx_cmh_student_concept ON concept_mastery_history(student_id, concept_id, calculated_at);
CREATE INDEX IF NOT EXISTS idx_cmh_attempt ON concept_mastery_history(source_attempt_id);

CREATE INDEX IF NOT EXISTS idx_lg_student_status ON learning_gaps(student_id, status);
CREATE INDEX IF NOT EXISTS idx_lg_concept ON learning_gaps(concept_id);
CREATE INDEX IF NOT EXISTS idx_lg_school ON learning_gaps(school_id);
CREATE INDEX IF NOT EXISTS idx_lg_severity ON learning_gaps(severity);

CREATE INDEX IF NOT EXISTS idx_qm_observed ON question_metrics(observed_difficulty);

-- =============================================================================
-- 7. Updated-At Triggers
-- =============================================================================
CREATE TRIGGER trg_scm_updated_at
  BEFORE UPDATE ON student_concept_mastery
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_lg_updated_at
  BEFORE UPDATE ON learning_gaps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 8. Row Level Security (RLS) Enforcement
-- =============================================================================
ALTER TABLE student_concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_mastery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_metrics ENABLE ROW LEVEL SECURITY;

-- Helper: Check if user is teacher of a student via active class enrollment
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(p_teacher_id UUID, p_student_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.classes c
    JOIN public.class_students cs ON cs.class_id = c.id
    WHERE c.teacher_id = p_teacher_id
      AND cs.student_id = p_student_id
      AND cs.enrollment_status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS: student_concept_mastery
CREATE POLICY "scm_select_policy" ON student_concept_mastery
  FOR SELECT USING (
    is_super_admin()
    OR student_id = auth.uid()
    OR is_teacher_of_student(auth.uid(), student_id)
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

CREATE POLICY "scm_all_admin_policy" ON student_concept_mastery
  FOR ALL USING (
    is_super_admin()
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

-- RLS: concept_mastery_history
CREATE POLICY "cmh_select_policy" ON concept_mastery_history
  FOR SELECT USING (
    is_super_admin()
    OR student_id = auth.uid()
    OR is_teacher_of_student(auth.uid(), student_id)
  );

-- RLS: learning_gaps
CREATE POLICY "lg_select_policy" ON learning_gaps
  FOR SELECT USING (
    is_super_admin()
    OR student_id = auth.uid()
    OR is_teacher_of_student(auth.uid(), student_id)
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

CREATE POLICY "lg_update_teacher_policy" ON learning_gaps
  FOR UPDATE USING (
    is_super_admin()
    OR is_teacher_of_student(auth.uid(), student_id)
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

-- RLS: question_metrics
CREATE POLICY "qm_select_policy" ON question_metrics
  FOR SELECT USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "qm_admin_write_policy" ON question_metrics
  FOR ALL USING (
    is_super_admin()
  );
