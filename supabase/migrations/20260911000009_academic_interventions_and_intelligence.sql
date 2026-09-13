-- =============================================================================
-- TEACHERSATHI — PHASE 6: ACADEMIC INTELLIGENCE, LEARNING GAPS & INTERVENTIONS
-- Migration: 20260911000009_academic_interventions_and_intelligence.sql
-- =============================================================================

-- 1. Extend gap_status enum to support IMPROVING and INSUFFICIENT_EVIDENCE
ALTER TYPE gap_status ADD VALUE IF NOT EXISTS 'IMPROVING';
ALTER TYPE gap_status ADD VALUE IF NOT EXISTS 'INSUFFICIENT_EVIDENCE';

-- 2. Custom Types for Interventions
DO $$ BEGIN
  CREATE TYPE intervention_type AS ENUM (
    'REMEDIATION_PLAN',
    'WORKSHEET',
    'PRACTICE_QUIZ',
    'LESSON_PLAN',
    'MIND_MAP'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE intervention_status AS ENUM (
    'DRAFT',
    'APPROVED',
    'ASSIGNED',
    'COMPLETED',
    'ARCHIVED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 3. Interventions Table (Teacher-Reviewable Actionable Interventions)
-- =============================================================================
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gap_id UUID REFERENCES learning_gaps(id) ON DELETE SET NULL,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type intervention_type NOT NULL DEFAULT 'REMEDIATION_PLAN',
  resource_id UUID REFERENCES ai_resources(id) ON DELETE SET NULL,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  status intervention_status NOT NULL DEFAULT 'DRAFT',
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  reassessment_assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 4. Performance Indexes
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_interventions_gap ON interventions(gap_id);
CREATE INDEX IF NOT EXISTS idx_interventions_teacher ON interventions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_interventions_class ON interventions(class_id);
CREATE INDEX IF NOT EXISTS idx_interventions_student ON interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_concept ON interventions(concept_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_interventions_school ON interventions(school_id);

-- =============================================================================
-- 5. Updated-At Trigger
-- =============================================================================
CREATE TRIGGER trg_interventions_updated_at
  BEFORE UPDATE ON interventions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 6. Row Level Security (RLS) Policies
-- =============================================================================
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- Helper check if user is in class as student
CREATE OR REPLACE FUNCTION public.is_student_in_class_active(p_student_id UUID, p_class_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.class_students
    WHERE class_id = p_class_id
      AND student_id = p_student_id
      AND enrollment_status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- SELECT Policy
CREATE POLICY "interventions_select_policy" ON interventions
  FOR SELECT USING (
    is_super_admin()
    OR teacher_id = auth.uid()
    OR (student_id IS NOT NULL AND student_id = auth.uid())
    OR (class_id IS NOT NULL AND is_student_in_class_active(auth.uid(), class_id))
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

-- INSERT Policy (Teachers, School Admins, Superadmins)
CREATE POLICY "interventions_insert_policy" ON interventions
  FOR INSERT WITH CHECK (
    is_super_admin()
    OR teacher_id = auth.uid()
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

-- UPDATE Policy (Author teacher, School Admins, Superadmins)
CREATE POLICY "interventions_update_policy" ON interventions
  FOR UPDATE USING (
    is_super_admin()
    OR teacher_id = auth.uid()
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

-- DELETE Policy (Author teacher, Superadmins)
CREATE POLICY "interventions_delete_policy" ON interventions
  FOR DELETE USING (
    is_super_admin()
    OR teacher_id = auth.uid()
  );
