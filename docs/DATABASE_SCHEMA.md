# TeacherSathi — Database Schema Specification

> **Status**: Production Reference Document (Phase 1)  
> **Source of Truth**: `supabase/migrations/`  
> **Target Engine**: PostgreSQL 15+ (Supabase)  

---

## 1. Schema Tables Directory

The TeacherSathi Phase 1 database contains 22 relational tables organized into 7 functional subsystems:

1. **Identity & Multi-Tenancy**: `schools`, `profiles`, `school_members`
2. **Canonical NCERT Curriculum**: `grades`, `subjects`, `books`, `chapters`, `concepts`
3. **Question Bank & Assessments**: `questions`, `question_options`, `question_versions`
4. **Institutional Classes**: `classes`, `class_students`
5. **Classroom Hardware**: `classroom_devices`, `classroom_sessions`, `remote_actions`
6. **Teacher Pedagogical Resources**: `resources`, `lesson_plans`, `worksheets`, `presentations`, `mind_maps`
7. **Security & Audit**: `audit_logs`

---

## 2. Comprehensive Table Specifications

### 1. `schools`
* **Purpose**: Multi-tenant institutional container representing schools and academies.
* **Owner**: `SUPER_ADMIN` and assigned `SCHOOL_ADMIN`.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**: None.
* **Important Fields**:
  - `name` (`text`): Official institution name.
  - `code` (`text UNIQUE`): School registration code.
  - `board` (`school_board`): `CBSE`, `KVS`, `JNV`, `STATE_BOARD`, `ICSE`, `OTHER`.
  - `state`, `city` (`text`): Geographical identifiers.
  - `contact_email` (`text`), `contact_phone` (`text`).
  - `subscription_tier` (`subscription_tier`): `FREE`, `PRO_SCHOOL`, `ENTERPRISE`.
  - `is_active` (`boolean`).
* **RLS Rules**:
  - `SELECT`: Active school members and `SUPER_ADMIN`.
  - `INSERT/UPDATE/DELETE`: `SUPER_ADMIN` or `SCHOOL_ADMIN` of this school.
* **Indexes**: Primary key index.
* **Delete Behavior**: Soft deletion via `is_active = false`. Hard delete cascades to members and classes.

---

### 2. `profiles`
* **Purpose**: User identity metadata linked 1:1 with Supabase Auth users.
* **Owner**: The user themselves (`auth.uid()`) and platform administrators.
* **Primary Key**: `id` (`uuid REFERENCES auth.users(id) ON DELETE CASCADE`).
* **Foreign Keys**: `school_id REFERENCES schools(id) ON DELETE SET NULL`.
* **Important Fields**:
  - `email` (`text UNIQUE`): Synced from `auth.users`.
  - `full_name` (`text`).
  - `role` (`user_role`): `SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`.
  - `preferred_language` (`text`, default: `'en'`).
  - `avatar_url`, `phone` (`text`).
* **RLS Rules**:
  - `SELECT`: User themselves, school colleagues, and `SUPER_ADMIN`.
  - `UPDATE`: User themselves (cannot elevate role); `SUPER_ADMIN` unrestricted.
  - `INSERT`: Auth webhook / registration trigger.
* **Indexes**: `idx_profiles_role`, `idx_profiles_school`.
* **Delete Behavior**: Cascades automatically when `auth.users` record is deleted.

---

### 3. `school_members`
* **Purpose**: Multi-tenant membership mapping allowing educators and students to belong to institutions.
* **Owner**: `SCHOOL_ADMIN` of the school and `SUPER_ADMIN`.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `school_id REFERENCES schools(id) ON DELETE CASCADE`.
  - `profile_id REFERENCES profiles(id) ON DELETE CASCADE`.
* **Important Fields**:
  - `membership_role` (`membership_role`): `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`.
  - `status` (`member_status`): `ACTIVE`, `PENDING`, `SUSPENDED`.
* **Constraints**: `UNIQUE (school_id, profile_id)`.
* **RLS Rules**:
  - `SELECT`: Member themselves, school colleagues, `SUPER_ADMIN`.
  - `INSERT/UPDATE/DELETE`: `SCHOOL_ADMIN` and `SUPER_ADMIN`.
* **Indexes**: `idx_school_members_school`, `idx_school_members_profile`.
* **Delete Behavior**: CASCADE upon school or profile removal.

---

### 4. `grades`
* **Purpose**: Canonical grade levels (`Class 6` through `Class 10`).
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`text`, e.g. `'class-6'`).
* **Important Fields**: `name`, `display_order`, `academic_year`, `is_active`.
* **RLS Rules**: Public read for active grades; `SUPER_ADMIN` write.
* **Indexes**: `idx_grades_active`.
* **Delete Behavior**: RESTRICT (cannot delete grade with dependent classes or books).

---

### 5. `subjects`
* **Purpose**: Canonical subject areas (`Mathematics`, `Science`, `Social Science`, `English`, `Hindi`).
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`text`, e.g. `'mathematics'`).
* **Important Fields**: `name_en`, `name_hi`, `color`, `icon`, `display_order`, `is_active`.
* **RLS Rules**: Public read for active subjects; `SUPER_ADMIN` write.
* **Indexes**: `idx_subjects_active`.
* **Delete Behavior**: RESTRICT (cannot delete subject with dependent books).

---

### 6. `books`
* **Purpose**: Specific textbook editions for a Grade + Subject combination.
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `grade_id REFERENCES grades(id) ON DELETE CASCADE`.
  - `subject_id REFERENCES subjects(id) ON DELETE CASCADE`.
* **Important Fields**: `title`, `edition`, `academic_year`, `pdf_url`, `is_active`.
* **Constraints**: `UNIQUE (grade_id, subject_id, academic_year)`.
* **RLS Rules**: Public read for active books; `SUPER_ADMIN` write.
* **Indexes**: `idx_books_grade_subject`.
* **Delete Behavior**: CASCADE to chapters.

---

### 7. `chapters`
* **Purpose**: Canonical curriculum units containing syllabus chapters.
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**: `book_id REFERENCES books(id) ON DELETE CASCADE`.
* **Important Fields**:
  - `chapter_number` (`int`).
  - `slug` (`text`, e.g. `'chapter-1'`).
  - `title_en`, `title_hi`, `description_en`, `description_hi`.
  - `study_time` (`text`, default: `'2 Hours'`).
  - `video_id` (`text` YouTube fallback).
  - `publication_status` (`publication_status`): `DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `ARCHIVED`.
* **Constraints**: `UNIQUE (book_id, chapter_number)`.
* **RLS Rules**: Public read for `PUBLISHED`; `SUPER_ADMIN` write.
* **Indexes**: `idx_chapters_book`, `idx_chapters_status`.
* **Delete Behavior**: CASCADE to concepts and questions.

---

### 8. `concepts`
* **Purpose**: Atomic learning units within a chapter mapped to Bloom's Taxonomy.
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**: `chapter_id REFERENCES chapters(id) ON DELETE CASCADE`.
* **Important Fields**:
  - `name_en`, `name_hi`.
  - `bloom_level`: `REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`, `EVALUATE`, `CREATE`.
  - `learning_outcomes` (`text[]`).
* **RLS Rules**: Public read; `SUPER_ADMIN` write.
* **Indexes**: `idx_concepts_chapter`.
* **Delete Behavior**: SET NULL in questions; CASCADE on chapter deletion.

---

### 9. `questions`
* **Purpose**: Verified assessment items for tests, worksheets, and quizzes.
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `chapter_id REFERENCES chapters(id) ON DELETE CASCADE`.
  - `concept_id REFERENCES concepts(id) ON DELETE SET NULL`.
* **Important Fields**:
  - `section_tier`: `SECTION_A` (2M), `SECTION_B` (3M), `SECTION_C` (4M).
  - `question_type`: `MCQ`, `VERY_SHORT`, `SHORT_ANSWER`, `LONG_ANSWER`, `DIAGRAM`, `CASE_BASED`, `ASSERTION_REASON`, `APPLICATION`, `HOTS`.
  - `marks` (`int`, 1–10).
  - `difficulty`: `EASY`, `MEDIUM`, `HARD`.
  - `text_en`, `text_hi`, `model_answer_en`, `model_answer_hi`, `explanation_en`, `explanation_hi`.
  - `tags` (`text[]`), `is_verified` (`boolean`).
  - `status`: `PUBLISHED`, `DRAFT`, `ARCHIVED`.
* **RLS Rules**: Public read for `PUBLISHED` & not archived; `SUPER_ADMIN` write.
* **Indexes**: `idx_questions_chapter`, `idx_questions_concept`, `idx_questions_type_difficulty`, `idx_questions_status`.
* **Delete Behavior**: Soft delete via `is_archived = true`.

---

### 10. `question_options`
* **Purpose**: Multiple choice option choices (A, B, C, D) for MCQ questions.
* **Owner**: Platform canonical (`SUPER_ADMIN`).
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**: `question_id REFERENCES questions(id) ON DELETE CASCADE`.
* **Important Fields**: `option_key` (`A`, `B`, `C`, `D`), `text_en`, `text_hi`, `is_correct`.
* **Constraints**: `UNIQUE (question_id, option_key)`.
* **RLS Rules**: Inherited from question visibility.
* **Indexes**: `idx_question_options_question`.
* **Delete Behavior**: CASCADE on question delete.

---

### 11. `question_versions`
* **Purpose**: Immutable historical version ledger for questions.
* **Owner**: System audit.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `question_id REFERENCES questions(id) ON DELETE CASCADE`.
  - `changed_by REFERENCES profiles(id) ON DELETE SET NULL`.
* **Important Fields**: `version_number`, `changed_at`, `change_summary`, `data_snapshot` (`jsonb`).
* **Constraints**: `UNIQUE (question_id, version_number)`.
* **RLS Rules**: `SUPER_ADMIN` view only; append-only.
* **Indexes**: `idx_question_versions_question`.
* **Delete Behavior**: CASCADE on question delete.

---

### 12. `classes`
* **Purpose**: Academic sections in a school (e.g. Class 10-A).
* **Owner**: School Admin and assigned Teacher.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `school_id REFERENCES schools(id) ON DELETE CASCADE`.
  - `teacher_id REFERENCES profiles(id) ON DELETE SET NULL`.
  - `grade_id REFERENCES grades(id) ON DELETE RESTRICT`.
* **Important Fields**: `name`, `section`, `academic_year`, `status` (`ACTIVE`, `ARCHIVED`).
* **Constraints**: `UNIQUE (school_id, grade_id, section, academic_year)`.
* **RLS Rules**: Visible to school admin, assigned teacher, enrolled students.
* **Indexes**: `idx_classes_school`, `idx_classes_teacher`, `idx_classes_grade`.
* **Delete Behavior**: CASCADE to enrollment rosters (`class_students`).

---

### 13. `class_students`
* **Purpose**: Student roster enrollment within classes.
* **Owner**: School Admin.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `class_id REFERENCES classes(id) ON DELETE CASCADE`.
  - `student_id REFERENCES profiles(id) ON DELETE CASCADE`.
* **Important Fields**: `roll_number`, `enrollment_status` (`ACTIVE`, `TRANSFERRED`, `DROPPED`).
* **Constraints**: `UNIQUE (class_id, student_id)`.
* **RLS Rules**: Student can view own enrollment; class teacher and school admin manage.
* **Indexes**: `idx_class_students_class`, `idx_class_students_student`.
* **Delete Behavior**: CASCADE.

---

### 14. `classroom_devices`
* **Purpose**: Registered 75" Interactive Flat Panels (IFPs) / Smartboards in schools.
* **Owner**: School Admin.
* **Primary Key**: `id` (`text`, e.g. `'Board-001'`).
* **Foreign Keys**: `school_id REFERENCES schools(id) ON DELETE CASCADE`.
* **Important Fields**: `name`, `device_code UNIQUE`, `location`, `device_fingerprint`, `status` (`ONLINE`, `OFFLINE`, `MAINTENANCE`), `last_seen_at`.
* **RLS Rules**: Visible to school members; modified by `SCHOOL_ADMIN` & `SUPER_ADMIN`.
* **Indexes**: `idx_devices_school`, `idx_devices_code`.
* **Delete Behavior**: CASCADE to classroom sessions.

---

### 15. `classroom_sessions`
* **Purpose**: Active teaching period session between display kiosk and teacher phone.
* **Owner**: Assigned Teacher and Device.
* **Primary Key**: `id` (`text`, e.g. `'sess_98241'`).
* **Foreign Keys**:
  - `device_id REFERENCES classroom_devices(id) ON DELETE CASCADE`.
  - `teacher_id REFERENCES profiles(id) ON DELETE SET NULL`.
  - `class_id REFERENCES classes(id) ON DELETE SET NULL`.
  - `chapter_id REFERENCES chapters(id) ON DELETE SET NULL`.
* **Important Fields**:
  - `session_token_hash` (`text`).
  - `status`: `WAITING`, `PAIRING`, `ACTIVE`, `PAUSED`, `ENDED`.
  - `expires_at`, `started_at`, `ended_at`.
* **RLS Rules**: Scoped to teacher, device school members, `SUPER_ADMIN`.
* **Indexes**: `idx_sessions_device`, `idx_sessions_teacher`, `idx_sessions_active`.
* **Delete Behavior**: CASCADE to remote actions.

---

### 16. `remote_actions`
* **Purpose**: Event ledger for remote commands dispatched from mobile to kiosk.
* **Owner**: Session Teacher.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `session_id REFERENCES classroom_sessions(id) ON DELETE CASCADE`.
  - `actor_id REFERENCES profiles(id) ON DELETE SET NULL`.
* **Important Fields**: `action_type`, `payload` (`jsonb`), `created_at`.
* **RLS Rules**: Scoped to session participants.
* **Indexes**: `idx_remote_actions_session`.
* **Delete Behavior**: CASCADE with session.

---

### 17. `resources`
* **Purpose**: Parent entity for teacher-created and school-shared teaching assets.
* **Owner**: Creator Teacher (`owner_id`).
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `school_id REFERENCES schools(id) ON DELETE CASCADE`.
  - `owner_id REFERENCES profiles(id) ON DELETE CASCADE`.
  - `chapter_id REFERENCES chapters(id) ON DELETE SET NULL`.
* **Important Fields**:
  - `resource_type`: `LESSON_PLAN`, `WORKSHEET`, `PRESENTATION`, `MIND_MAP`, `DOCUMENT`.
  - `title`, `description`.
  - `status`: `DRAFT`, `VALIDATING`, `READY`, `USED`, `ARCHIVED`.
  - `metadata` (`jsonb`), `is_archived`.
* **RLS Rules**:
  - Owner can read and write.
  - School colleagues can view `READY` / `USED` assets.
* **Indexes**: `idx_resources_owner`, `idx_resources_school`, `idx_resources_chapter`, `idx_resources_status`.
* **Delete Behavior**: Soft delete via `is_archived = true`. Hard delete cascades to child tables.

---

### 18–21. Child Resource Tables (`lesson_plans`, `worksheets`, `presentations`, `mind_maps`)
* **Purpose**: Structured pedagogical payloads linked 1:1 with parent `resources(id)`.
* **Owner**: Authoring Teacher.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**:
  - `resource_id REFERENCES resources(id) ON DELETE CASCADE`.
  - `teacher_id REFERENCES profiles(id) ON DELETE CASCADE`.
  - `chapter_id REFERENCES chapters(id) ON DELETE SET NULL`.
* **Important Fields**:
  - `lesson_plans`: `duration_mins`, `content_json` (`jsonb`).
  - `worksheets`: `questions_json` (`jsonb`), `answer_key_json` (`jsonb`), `pdf_url`.
  - `presentations`: `slide_count`, `slides_json` (`jsonb`).
  - `mind_maps`: `nodes_json` (`jsonb`).
* **RLS Rules**: Inherited from resource ownership.
* **Indexes**: Indexed by `teacher_id`.
* **Delete Behavior**: CASCADE upon parent resource deletion.

---

### 22. `audit_logs`
* **Purpose**: Immutable compliance and security ledger.
* **Owner**: System.
* **Primary Key**: `id` (`uuid`, default: `gen_random_uuid()`).
* **Foreign Keys**: `actor_id REFERENCES profiles(id) ON DELETE SET NULL`.
* **Important Fields**: `action`, `entity_type`, `entity_id`, `metadata` (`jsonb`), `ip_address`, `user_agent`, `created_at`.
* **RLS Rules**:
  - `SELECT`: `SUPER_ADMIN` only.
  - `INSERT`: System triggers and authenticated users for own actions.
  - `UPDATE/DELETE`: Denied unconditionally (`USING (false)`).
* **Indexes**: `idx_audit_logs_actor`, `idx_audit_logs_entity`, `idx_audit_logs_created_at`.
* **Delete Behavior**: Immutable. Records are permanently retained.
