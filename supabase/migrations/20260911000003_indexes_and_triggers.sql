-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000003_indexes_and_triggers.sql
-- Description: Query performance indexes, updated_at triggers, and auth hooks.
-- =============================================================================

-- =============================================================================
-- 1. PERFORMANCE INDEXES
-- =============================================================================

-- Profiles & Membership
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_school ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_school_members_school ON school_members(school_id);
CREATE INDEX IF NOT EXISTS idx_school_members_profile ON school_members(profile_id);

-- Curriculum Subsystem
CREATE INDEX IF NOT EXISTS idx_grades_active ON grades(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_subjects_active ON subjects(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_books_grade_subject ON books(grade_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(publication_status);
CREATE INDEX IF NOT EXISTS idx_concepts_chapter ON concepts(chapter_id, display_order);

-- Question Bank Subsystem
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter_id, section_tier);
CREATE INDEX IF NOT EXISTS idx_questions_concept ON questions(concept_id);
CREATE INDEX IF NOT EXISTS idx_questions_type_difficulty ON questions(question_type, difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status, is_archived);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_question_versions_question ON question_versions(question_id);

-- Institutional Classes & Rosters
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade_id);
CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);

-- Hardware & Classroom Kiosk
CREATE INDEX IF NOT EXISTS idx_devices_school ON classroom_devices(school_id);
CREATE INDEX IF NOT EXISTS idx_devices_code ON classroom_devices(device_code);
CREATE INDEX IF NOT EXISTS idx_sessions_device ON classroom_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON classroom_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON classroom_sessions(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_remote_actions_session ON remote_actions(session_id, created_at);

-- Resources Subsystem
CREATE INDEX IF NOT EXISTS idx_resources_owner ON resources(owner_id);
CREATE INDEX IF NOT EXISTS idx_resources_school ON resources(school_id);
CREATE INDEX IF NOT EXISTS idx_resources_chapter ON resources(chapter_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status, is_archived);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_teacher ON lesson_plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_worksheets_teacher ON worksheets(teacher_id);
CREATE INDEX IF NOT EXISTS idx_presentations_teacher ON presentations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_mind_maps_teacher ON mind_maps(teacher_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================================================
-- 2. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach updated_at triggers to all tables tracking updates
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_school_members_updated_at BEFORE UPDATE ON school_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_concepts_updated_at BEFORE UPDATE ON concepts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_class_students_updated_at BEFORE UPDATE ON class_students FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_classroom_devices_updated_at BEFORE UPDATE ON classroom_devices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_classroom_sessions_updated_at BEFORE UPDATE ON classroom_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_lesson_plans_updated_at BEFORE UPDATE ON lesson_plans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_worksheets_updated_at BEFORE UPDATE ON worksheets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_presentations_updated_at BEFORE UPDATE ON presentations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_mind_maps_updated_at BEFORE UPDATE ON mind_maps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 3. AUTH TRIGGER: AUTO-CREATE PROFILE ON AUTH.USERS SIGNUP
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    preferred_language
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'TEACHER'::user_role),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Safely bind trigger to auth.users if auth schema is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;
