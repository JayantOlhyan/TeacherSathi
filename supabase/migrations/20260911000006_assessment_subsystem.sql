-- =============================================================================
-- TEACHERSATHI — PHASE 4: PRODUCTION ACADEMIC ASSESSMENT SUBSYSTEM
-- Migration: 20260911000006_assessment_subsystem.sql
-- =============================================================================

-- 1. Custom Types for Assessments & Attempts
DO $$ BEGIN
  CREATE TYPE assessment_type AS ENUM (
    'MCQ_QUIZ',
    'TEST_PAPER',
    'WORKSHEET',
    'ASSIGNMENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assessment_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED',
    'ARCHIVED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM (
    'SCHEDULED',
    'ACTIVE',
    'CLOSED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attempt_status AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'SUBMITTED',
    'GRADED',
    'ABANDONED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE answer_grading_status AS ENUM (
    'UNGRADED',
    'AUTO_GRADED',
    'MANUAL_REVIEW',
    'GRADED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. Assessments Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type assessment_type NOT NULL DEFAULT 'MCQ_QUIZ',
  grade_id TEXT NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'bilingual')),
  duration_minutes INT NOT NULL DEFAULT 30 CHECK (duration_minutes >= 5 AND duration_minutes <= 180),
  total_marks INT NOT NULL DEFAULT 0 CHECK (total_marks >= 0),
  passing_marks INT CHECK (passing_marks >= 0),
  status assessment_status NOT NULL DEFAULT 'DRAFT',
  instructions TEXT[] NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{
    "shuffle_questions": false,
    "shuffle_options": false,
    "show_result_after_submission": true,
    "allow_retake": false,
    "max_attempts": 1,
    "negative_marking": false,
    "negative_marks_per_question": 0
  }'::jsonb,
  available_from TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 3. Assessment Questions (Ordered Snapshot Ledger)
-- =============================================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  question_order INT NOT NULL,
  section TEXT NOT NULL DEFAULT 'SECTION_A',
  marks_override INT,
  question_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_assessment_question_order UNIQUE (assessment_id, question_order)
);

-- =============================================================================
-- 4. Assignments Table (Class Distribution)
-- =============================================================================
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  available_from TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  status assignment_status NOT NULL DEFAULT 'ACTIVE',
  settings_override JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 5. Student Assessment Attempts
-- =============================================================================
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  status attempt_status NOT NULL DEFAULT 'IN_PROGRESS',
  attempt_number INT NOT NULL DEFAULT 1 CHECK (attempt_number >= 1),
  score NUMERIC(6, 2),
  total_marks INT NOT NULL,
  percentage NUMERIC(5, 2),
  time_taken_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_assessment_attempt UNIQUE (assessment_id, student_id, attempt_number)
);

-- =============================================================================
-- 6. Attempt Answers (Per-Question Responses & Autosave)
-- =============================================================================
CREATE TABLE IF NOT EXISTS attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  assessment_question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  selected_option TEXT CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  text_answer TEXT,
  answer_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_answered BOOLEAN NOT NULL DEFAULT false,
  marks_awarded NUMERIC(5, 2),
  max_marks NUMERIC(5, 2) NOT NULL,
  is_correct BOOLEAN,
  grading_status answer_grading_status NOT NULL DEFAULT 'UNGRADED',
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_attempt_question UNIQUE (attempt_id, assessment_question_id)
);

-- =============================================================================
-- 7. Assessment Results (Authoritative Result Ledger)
-- =============================================================================
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL UNIQUE REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_marks INT NOT NULL,
  marks_obtained NUMERIC(6, 2) NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  correct_answers INT NOT NULL DEFAULT 0,
  incorrect_answers INT NOT NULL DEFAULT 0,
  unanswered INT NOT NULL DEFAULT 0,
  time_taken_seconds INT NOT NULL DEFAULT 0,
  is_passed BOOLEAN,
  submission_type TEXT NOT NULL DEFAULT 'ON_TIME' CHECK (submission_type IN ('ON_TIME', 'LATE')),
  question_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 8. Indexes for High-Performance Queries
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_assessments_teacher ON assessments(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_assessments_school ON assessments(school_id);
CREATE INDEX IF NOT EXISTS idx_assessments_curriculum ON assessments(grade_id, subject_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_order ON assessment_questions(assessment_id, question_order);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_assessment ON assignments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON assessment_attempts(student_id, status);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assignment ON assessment_attempts(assignment_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON assessment_results(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON assessment_results(assessment_id);

-- =============================================================================
-- 9. Triggers for `updated_at`
-- =============================================================================
CREATE TRIGGER trg_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_assessment_attempts_updated_at
  BEFORE UPDATE ON assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_attempt_answers_updated_at
  BEFORE UPDATE ON attempt_answers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 10. Row Level Security (RLS) Enforcement
-- =============================================================================
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Helper function: check if student is enrolled in class
CREATE OR REPLACE FUNCTION public.is_student_in_class(p_class_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.class_students
    WHERE class_id = p_class_id
      AND student_id = p_user_id
      AND enrollment_status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS: assessments
CREATE POLICY "assessments_select_policy" ON assessments
  FOR SELECT USING (
    is_super_admin()
    OR teacher_id = auth.uid()
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
    OR (
      status = 'PUBLISHED'
      AND EXISTS (
        SELECT 1 FROM assignments a
        JOIN class_students cs ON cs.class_id = a.class_id
        WHERE a.assessment_id = assessments.id
          AND cs.student_id = auth.uid()
          AND cs.enrollment_status = 'ACTIVE'
      )
    )
  );

CREATE POLICY "assessments_insert_policy" ON assessments
  FOR INSERT WITH CHECK (
    is_super_admin()
    OR (auth.uid() = teacher_id)
  );

CREATE POLICY "assessments_update_policy" ON assessments
  FOR UPDATE USING (
    is_super_admin()
    OR (
      teacher_id = auth.uid()
      -- Disallow modifying published assessment questions if student attempts exist
      AND (
        status = 'DRAFT'
        OR NOT EXISTS (SELECT 1 FROM assessment_attempts WHERE assessment_id = assessments.id)
      )
    )
  );

CREATE POLICY "assessments_delete_policy" ON assessments
  FOR DELETE USING (
    is_super_admin()
    OR (
      teacher_id = auth.uid()
      AND NOT EXISTS (SELECT 1 FROM assessment_attempts WHERE assessment_id = assessments.id)
    )
  );

-- RLS: assessment_questions
CREATE POLICY "assessment_questions_select_policy" ON assessment_questions
  FOR SELECT USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_questions.assessment_id
        AND (
          a.teacher_id = auth.uid()
          OR (a.school_id IS NOT NULL AND is_school_admin(a.school_id))
          OR (
            a.status = 'PUBLISHED'
            AND EXISTS (
              SELECT 1 FROM assignments asg
              JOIN class_students cs ON cs.class_id = asg.class_id
              WHERE asg.assessment_id = a.id
                AND cs.student_id = auth.uid()
                AND cs.enrollment_status = 'ACTIVE'
            )
          )
        )
    )
  );

CREATE POLICY "assessment_questions_all_teacher" ON assessment_questions
  FOR ALL USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_questions.assessment_id
        AND a.teacher_id = auth.uid()
        AND (
          a.status = 'DRAFT'
          OR NOT EXISTS (SELECT 1 FROM assessment_attempts WHERE assessment_id = a.id)
        )
    )
  );

-- RLS: assignments
CREATE POLICY "assignments_select_policy" ON assignments
  FOR SELECT USING (
    is_super_admin()
    OR teacher_id = auth.uid()
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
    OR is_student_in_class(class_id, auth.uid())
  );

CREATE POLICY "assignments_modify_policy" ON assignments
  FOR ALL USING (
    is_super_admin()
    OR teacher_id = auth.uid()
    OR (school_id IS NOT NULL AND is_school_admin(school_id))
  );

-- RLS: assessment_attempts
CREATE POLICY "attempts_select_policy" ON assessment_attempts
  FOR SELECT USING (
    is_super_admin()
    OR student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_attempts.assessment_id
        AND (a.teacher_id = auth.uid() OR (a.school_id IS NOT NULL AND is_school_admin(a.school_id)))
    )
  );

CREATE POLICY "attempts_insert_policy" ON assessment_attempts
  FOR INSERT WITH CHECK (
    is_super_admin()
    OR student_id = auth.uid()
  );

CREATE POLICY "attempts_update_policy" ON assessment_attempts
  FOR UPDATE USING (
    is_super_admin()
    OR (student_id = auth.uid() AND status = 'IN_PROGRESS')
    OR EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_attempts.assessment_id
        AND a.teacher_id = auth.uid()
    )
  );

-- RLS: attempt_answers
CREATE POLICY "attempt_answers_select_policy" ON attempt_answers
  FOR SELECT USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM assessment_attempts att
      WHERE att.id = attempt_answers.attempt_id
        AND (
          att.student_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM assessments a
            WHERE a.id = att.assessment_id
              AND (a.teacher_id = auth.uid() OR (a.school_id IS NOT NULL AND is_school_admin(a.school_id)))
          )
        )
    )
  );

CREATE POLICY "attempt_answers_upsert_policy" ON attempt_answers
  FOR ALL USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM assessment_attempts att
      WHERE att.id = attempt_answers.attempt_id
        AND att.student_id = auth.uid()
        AND att.status = 'IN_PROGRESS'
    )
    OR EXISTS (
      SELECT 1 FROM assessment_attempts att
      JOIN assessments a ON a.id = att.assessment_id
      WHERE att.id = attempt_answers.attempt_id
        AND a.teacher_id = auth.uid()
    )
  );

-- RLS: assessment_results
CREATE POLICY "results_select_policy" ON assessment_results
  FOR SELECT USING (
    is_super_admin()
    OR (
      student_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_results.assessment_id
          AND (
            (a.settings->>'show_result_after_submission')::boolean = true
            OR a.status = 'CLOSED'
          )
      )
    )
    OR EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_results.assessment_id
        AND (a.teacher_id = auth.uid() OR (a.school_id IS NOT NULL AND is_school_admin(a.school_id)))
    )
  );

CREATE POLICY "results_insert_update_policy" ON assessment_results
  FOR ALL USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM assessment_attempts att
      WHERE att.id = assessment_results.attempt_id
        AND (
          att.student_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM assessments a
            WHERE a.id = att.assessment_id
              AND a.teacher_id = auth.uid()
          )
        )
    )
  );
