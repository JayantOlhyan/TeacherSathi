-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000002_rls_policies.sql
-- Description: Row Level Security (RLS) policies and security definer helpers.
-- =============================================================================

-- =============================================================================
-- 1. SECURITY DEFINER HELPER FUNCTIONS (Bypass recursive RLS checks)
-- =============================================================================

-- Check if current authenticated user has SUPER_ADMIN role
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role = 'SUPER_ADMIN'
      AND is_active = true
  );
$$;

-- Check if current authenticated user is a SCHOOL_ADMIN for a given school
CREATE OR REPLACE FUNCTION public.is_school_admin(check_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM school_members
    WHERE profile_id = auth.uid()
      AND school_id = check_school_id
      AND membership_role = 'SCHOOL_ADMIN'
      AND status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- Check if current authenticated user is an active member of a given school
CREATE OR REPLACE FUNCTION public.is_school_member(check_school_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM school_members
    WHERE profile_id = auth.uid()
      AND school_id = check_school_id
      AND status = 'ACTIVE'
  ) OR public.is_super_admin();
$$;

-- Get user's primary school ID
CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid();
$$;

-- =============================================================================
-- 2. ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE remote_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 3. PROFILES POLICIES
-- =============================================================================

-- Users can read their own profile, school admins can read members, super admins read all
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (
    id = auth.uid()
    OR public.is_super_admin()
    OR (
      school_id IS NOT NULL 
      AND school_id = public.get_user_school_id()
    )
  );

-- Users can insert their own profile upon registration
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (
    id = auth.uid()
    OR public.is_super_admin()
  );

-- Users can update their own non-role profile details; super admin can update anything
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (
    id = auth.uid()
    OR public.is_super_admin()
  ) WITH CHECK (
    (id = auth.uid() AND role = (SELECT p.role FROM profiles p WHERE p.id = auth.uid()))
    OR public.is_super_admin()
  );

-- Only Super Admins can delete profiles
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (
    public.is_super_admin()
  );

-- =============================================================================
-- 4. SCHOOLS & SCHOOL MEMBERS POLICIES
-- =============================================================================

-- School read policy: Authenticated members of school or Super Admin
CREATE POLICY "schools_select_policy" ON schools
  FOR SELECT USING (
    id = public.get_user_school_id()
    OR public.is_school_member(id)
    OR public.is_super_admin()
  );

-- School write policy: Super admin or school admin of that school
CREATE POLICY "schools_modify_policy" ON schools
  FOR ALL USING (
    public.is_school_admin(id)
    OR public.is_super_admin()
  );

-- School Members select
CREATE POLICY "school_members_select_policy" ON school_members
  FOR SELECT USING (
    profile_id = auth.uid()
    OR public.is_school_member(school_id)
    OR public.is_super_admin()
  );

-- School Members modify
CREATE POLICY "school_members_modify_policy" ON school_members
  FOR ALL USING (
    public.is_school_admin(school_id)
    OR public.is_super_admin()
  );

-- =============================================================================
-- 5. CANONICAL CURRICULUM POLICIES (Public read, Super Admin manage)
-- =============================================================================

-- Grades
CREATE POLICY "grades_select_public" ON grades
  FOR SELECT USING (is_active = true OR public.is_super_admin());
CREATE POLICY "grades_super_admin_all" ON grades
  FOR ALL USING (public.is_super_admin());

-- Subjects
CREATE POLICY "subjects_select_public" ON subjects
  FOR SELECT USING (is_active = true OR public.is_super_admin());
CREATE POLICY "subjects_super_admin_all" ON subjects
  FOR ALL USING (public.is_super_admin());

-- Books
CREATE POLICY "books_select_public" ON books
  FOR SELECT USING (is_active = true OR public.is_super_admin());
CREATE POLICY "books_super_admin_all" ON books
  FOR ALL USING (public.is_super_admin());

-- Chapters
CREATE POLICY "chapters_select_public" ON chapters
  FOR SELECT USING (publication_status = 'PUBLISHED' OR public.is_super_admin());
CREATE POLICY "chapters_super_admin_all" ON chapters
  FOR ALL USING (public.is_super_admin());

-- Concepts
CREATE POLICY "concepts_select_public" ON concepts
  FOR SELECT USING (true);
CREATE POLICY "concepts_super_admin_all" ON concepts
  FOR ALL USING (public.is_super_admin());

-- =============================================================================
-- 6. QUESTION BANK POLICIES
-- =============================================================================

-- Questions
CREATE POLICY "questions_select_published" ON questions
  FOR SELECT USING (
    (status = 'PUBLISHED' AND is_archived = false)
    OR public.is_super_admin()
  );
CREATE POLICY "questions_super_admin_all" ON questions
  FOR ALL USING (public.is_super_admin());

-- Question Options
CREATE POLICY "question_options_select_published" ON question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM questions q
      WHERE q.id = question_id
        AND ((q.status = 'PUBLISHED' AND q.is_archived = false) OR public.is_super_admin())
    )
  );
CREATE POLICY "question_options_super_admin_all" ON question_options
  FOR ALL USING (public.is_super_admin());

-- Question Versions (Audit snapshots)
CREATE POLICY "question_versions_select_policy" ON question_versions
  FOR SELECT USING (public.is_super_admin());
CREATE POLICY "question_versions_insert_policy" ON question_versions
  FOR INSERT WITH CHECK (public.is_super_admin());

-- =============================================================================
-- 7. CLASSES & CLASS STUDENTS POLICIES (Tenant & Section Isolation)
-- =============================================================================

-- Classes
CREATE POLICY "classes_select_policy" ON classes
  FOR SELECT USING (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM class_students cs
      WHERE cs.class_id = id AND cs.student_id = auth.uid()
    )
  );

CREATE POLICY "classes_insert_policy" ON classes
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
  );

CREATE POLICY "classes_update_policy" ON classes
  FOR UPDATE USING (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
    OR teacher_id = auth.uid()
  );

CREATE POLICY "classes_delete_policy" ON classes
  FOR DELETE USING (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
  );

-- Class Students
CREATE POLICY "class_students_select_policy" ON class_students
  FOR SELECT USING (
    public.is_super_admin()
    OR student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_id
        AND (c.teacher_id = auth.uid() OR public.is_school_admin(c.school_id))
    )
  );

CREATE POLICY "class_students_modify_policy" ON class_students
  FOR ALL USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_id
        AND public.is_school_admin(c.school_id)
    )
  );

-- =============================================================================
-- 8. CLASSROOM DEVICES & SESSIONS POLICIES
-- =============================================================================

-- Classroom Devices
CREATE POLICY "devices_select_policy" ON classroom_devices
  FOR SELECT USING (
    public.is_super_admin()
    OR public.is_school_member(school_id)
  );

CREATE POLICY "devices_modify_policy" ON classroom_devices
  FOR ALL USING (
    public.is_super_admin()
    OR public.is_school_admin(school_id)
  );

-- Classroom Sessions
CREATE POLICY "sessions_select_policy" ON classroom_sessions
  FOR SELECT USING (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_devices d
      WHERE d.id = device_id
        AND public.is_school_member(d.school_id)
    )
  );

CREATE POLICY "sessions_insert_policy" ON classroom_sessions
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_devices d
      WHERE d.id = device_id
        AND public.is_school_member(d.school_id)
    )
  );

CREATE POLICY "sessions_update_policy" ON classroom_sessions
  FOR UPDATE USING (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_devices d
      WHERE d.id = device_id
        AND public.is_school_admin(d.school_id)
    )
  );

-- Remote Actions
CREATE POLICY "remote_actions_select_policy" ON remote_actions
  FOR SELECT USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id
        AND (s.teacher_id = auth.uid() OR EXISTS (
          SELECT 1 FROM classroom_devices d
          WHERE d.id = s.device_id AND public.is_school_member(d.school_id)
        ))
    )
  );

CREATE POLICY "remote_actions_insert_policy" ON remote_actions
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR actor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM classroom_sessions s
      WHERE s.id = session_id AND s.teacher_id = auth.uid()
    )
  );

-- =============================================================================
-- 9. RESOURCES SUBSYSTEM POLICIES (Lesson Plans, Worksheets, etc.)
-- =============================================================================

-- Generic Resources
CREATE POLICY "resources_select_policy" ON resources
  FOR SELECT USING (
    public.is_super_admin()
    OR owner_id = auth.uid()
    OR (
      school_id IS NOT NULL
      AND school_id = public.get_user_school_id()
      AND status IN ('READY', 'USED')
      AND is_archived = false
    )
  );

CREATE POLICY "resources_insert_policy" ON resources
  FOR INSERT WITH CHECK (
    public.is_super_admin()
    OR owner_id = auth.uid()
  );

CREATE POLICY "resources_update_policy" ON resources
  FOR UPDATE USING (
    public.is_super_admin()
    OR owner_id = auth.uid()
  );

CREATE POLICY "resources_delete_policy" ON resources
  FOR DELETE USING (
    public.is_super_admin()
    OR owner_id = auth.uid()
  );

-- Child Resource Tables (Lesson Plans, Worksheets, Presentations, Mind Maps)
CREATE POLICY "lesson_plans_owner_policy" ON lesson_plans
  FOR ALL USING (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_id
        AND (r.owner_id = auth.uid() OR (r.school_id = public.get_user_school_id() AND r.status IN ('READY', 'USED')))
    )
  );

CREATE POLICY "worksheets_owner_policy" ON worksheets
  FOR ALL USING (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_id
        AND (r.owner_id = auth.uid() OR (r.school_id = public.get_user_school_id() AND r.status IN ('READY', 'USED')))
    )
  );

CREATE POLICY "presentations_owner_policy" ON presentations
  FOR ALL USING (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_id
        AND (r.owner_id = auth.uid() OR (r.school_id = public.get_user_school_id() AND r.status IN ('READY', 'USED')))
    )
  );

CREATE POLICY "mind_maps_owner_policy" ON mind_maps
  FOR ALL USING (
    public.is_super_admin()
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM resources r
      WHERE r.id = resource_id
        AND (r.owner_id = auth.uid() OR (r.school_id = public.get_user_school_id() AND r.status IN ('READY', 'USED')))
    )
  );

-- =============================================================================
-- 10. AUDIT LOGS POLICIES (Append-only, Super Admin view)
-- =============================================================================

CREATE POLICY "audit_logs_select_policy" ON audit_logs
  FOR SELECT USING (
    public.is_super_admin()
  );

CREATE POLICY "audit_logs_insert_policy" ON audit_logs
  FOR INSERT WITH CHECK (
    actor_id = auth.uid()
    OR public.is_super_admin()
    OR actor_id IS NULL
  );

-- Prohibit all manual updates or deletions to audit logs
CREATE POLICY "audit_logs_prohibit_update" ON audit_logs
  FOR UPDATE USING (false);

CREATE POLICY "audit_logs_prohibit_delete" ON audit_logs
  FOR DELETE USING (false);
