# TeacherSathi — Phase 1 Database & Data Architecture Requirements

> **Status**: Specification Document for Phase 1 Execution  
> **Target Database Engine**: PostgreSQL 15+ (Hosted via Supabase)  
> **Security Requirement**: Row Level Security (RLS) Mandatory on All Tables

---

## 1. Schema Overview & Relationship Graph

```
                                    ┌──────────────────┐
                                    │     schools      │
                                    └─────────┬────────┘
                                              │ 1:N
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
             ┌───────────────┐                                 ┌───────────────┐
             │    classes    │                                 │   profiles    │
             └───────┬───────┘                                 └───────┬───────┘
                     │ 1:N                                             │ 1:1
                     ▼                                                 ▼
             ┌───────────────┐                                 ┌───────────────┐
             │class_students │ ◀────────────────────────────── │   teachers/   │
             └───────────────┘                                 │   students    │
                                                               └───────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ CANONICAL CURRICULUM SUBSYSTEM (Platform Owned)                              │
│ grades (1:N) ──> subjects (1:N) ──> books (1:N) ──> chapters (1:N) ──>       │
│ concepts (1:N) ──> questions (1:N) ──> question_options                     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ USER RESOURCES & SESSIONS SUBSYSTEM (Tenant Owned)                           │
│ lesson_plans, worksheets, presentations, mind_maps, quizzes, tests,          │
│ classroom_devices, classroom_sessions, remote_actions, attendance            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Table Specifications

### A. Identity, Tenants & Users

#### 1. `profiles`
- `id`: `uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
- `email`: `text NOT NULL UNIQUE`
- `display_name`: `text NOT NULL`
- `role`: `text NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'))`
- `school_id`: `uuid REFERENCES schools(id) ON DELETE SET NULL`
- `avatar_url`: `text`
- `phone`: `text`
- `created_at`: `timestamptz DEFAULT now()`
- `updated_at`: `timestamptz DEFAULT now()`
- **Indexes**: `CREATE INDEX idx_profiles_school ON profiles(school_id);`
- **RLS**: Users can read/write their own profile. `SUPER_ADMIN` can read all.

#### 2. `schools`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `name`: `text NOT NULL`
- `board`: `text NOT NULL CHECK (board IN ('CBSE', 'KVS', 'JNV', 'STATE_BOARD', 'ICSE', 'OTHER'))`
- `state`: `text NOT NULL`
- `city`: `text NOT NULL`
- `admin_email`: `text NOT NULL`
- `subscription_tier`: `text DEFAULT 'FREE'`
- `created_at`: `timestamptz DEFAULT now()`
- **RLS**: Only `SUPER_ADMIN` and members of `schools` with role `SCHOOL_ADMIN` can modify.

---

### B. Canonical NCERT Curriculum

#### 3. `grades`
- `id`: `text PRIMARY KEY` (e.g. `'class-6'`, `'class-8'`, `'class-10'`)
- `name`: `text NOT NULL` (e.g. `'Class 10'`)
- `display_order`: `int NOT NULL DEFAULT 1`
- `is_active`: `boolean DEFAULT true`

#### 4. `subjects`
- `id`: `text PRIMARY KEY` (e.g. `'mathematics'`, `'science'`)
- `name_en`: `text NOT NULL`
- `name_hi`: `text NOT NULL`
- `color`: `text DEFAULT '#0F5B38'`
- `icon`: `text`
- `display_order`: `int NOT NULL DEFAULT 1`

#### 5. `books`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `grade_id`: `text REFERENCES grades(id) ON DELETE CASCADE`
- `subject_id`: `text REFERENCES subjects(id) ON DELETE CASCADE`
- `title`: `text NOT NULL`
- `edition`: `text NOT NULL` (e.g. `'2026-27'`)
- `pdf_url`: `text`
- `created_at`: `timestamptz DEFAULT now()`
- **Indexes**: `CREATE INDEX idx_books_grade_subject ON books(grade_id, subject_id);`

#### 6. `chapters`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `book_id`: `uuid REFERENCES books(id) ON DELETE CASCADE`
- `chapter_number`: `int NOT NULL`
- `slug`: `text NOT NULL` (e.g. `'chapter-10'`)
- `title_en`: `text NOT NULL`
- `title_hi`: `text NOT NULL`
- `description_en`: `text`
- `description_hi`: `text`
- `study_time`: `text DEFAULT '2 Hours'`
- `video_id`: `text` (YouTube fallback ID)
- `publication_status`: `text DEFAULT 'PUBLISHED'`
- **Indexes**: `CREATE UNIQUE INDEX idx_chapters_book_num ON chapters(book_id, chapter_number);`

#### 7. `concepts`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `chapter_id`: `uuid REFERENCES chapters(id) ON DELETE CASCADE`
- `name_en`: `text NOT NULL`
- `name_hi`: `text NOT NULL`
- `bloom_level`: `text NOT NULL`
- `learning_outcomes`: `text[]`

---

### C. Question Bank & Assessments

#### 8. `questions`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `chapter_id`: `uuid REFERENCES chapters(id) ON DELETE CASCADE`
- `concept_id`: `uuid REFERENCES concepts(id) ON DELETE SET NULL`
- `section_tier`: `text NOT NULL CHECK (section_tier IN ('SECTION_A', 'SECTION_B', 'SECTION_C'))`
- `question_type`: `text NOT NULL CHECK (question_type IN ('MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'DIAGRAM', 'CASE_BASED'))`
- `marks`: `int NOT NULL`
- `difficulty`: `text NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))`
- `text_en`: `text NOT NULL`
- `text_hi`: `text NOT NULL`
- `model_answer_en`: `text NOT NULL`
- `model_answer_hi`: `text NOT NULL`
- `explanation_en`: `text`
- `explanation_hi`: `text`
- `source`: `text`
- `tags`: `text[]`
- `is_verified`: `boolean DEFAULT false`
- `created_at`: `timestamptz DEFAULT now()`
- **Indexes**: `CREATE INDEX idx_questions_chapter ON questions(chapter_id, section_tier);`

#### 9. `question_options`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `question_id`: `uuid REFERENCES questions(id) ON DELETE CASCADE`
- `option_key`: `text NOT NULL CHECK (option_key IN ('A', 'B', 'C', 'D'))`
- `text_en`: `text NOT NULL`
- `text_hi`: `text NOT NULL`
- `is_correct`: `boolean NOT NULL DEFAULT false`

---

### D. Classroom & Hardware Subsystem

#### 10. `classroom_devices`
- `id`: `text PRIMARY KEY` (e.g. `'Board-001'`)
- `school_id`: `uuid REFERENCES schools(id) ON DELETE CASCADE`
- `room_location`: `text NOT NULL` (e.g. `'Room 102 • Science Lab'`)
- `device_fingerprint`: `text`
- `is_online`: `boolean DEFAULT false`
- `last_heartbeat`: `timestamptz`

#### 11. `classroom_sessions`
- `id`: `text PRIMARY KEY` (e.g. `'sess_98241'`)
- `device_id`: `text REFERENCES classroom_devices(id)`
- `teacher_id`: `uuid REFERENCES profiles(id)`
- `class_id`: `uuid REFERENCES classes(id)`
- `chapter_id`: `uuid REFERENCES chapters(id)`
- `status`: `text NOT NULL CHECK (status IN ('WAITING', 'PAIRING', 'ACTIVE', 'PAUSED', 'ENDED'))`
- `token_hash`: `text NOT NULL`
- `expires_at`: `timestamptz NOT NULL`
- `created_at`: `timestamptz DEFAULT now()`
- **Indexes**: `CREATE INDEX idx_sessions_active ON classroom_sessions(status, expires_at);`

---

### E. User Resources & Teaching Kits

#### 12. `lesson_plans`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `teacher_id`: `uuid REFERENCES profiles(id) ON DELETE CASCADE`
- `chapter_id`: `uuid REFERENCES chapters(id)`
- `title`: `text NOT NULL`
- `duration_mins`: `int DEFAULT 45`
- `content_json`: `jsonb NOT NULL`
- `status`: `text DEFAULT 'DRAFT'`
- `created_at`: `timestamptz DEFAULT now()`
- **RLS**: Teachers can only select and modify their own lesson plans.

#### 13. `worksheets`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `teacher_id`: `uuid REFERENCES profiles(id) ON DELETE CASCADE`
- `chapter_id`: `uuid REFERENCES chapters(id)`
- `title`: `text NOT NULL`
- `questions_json`: `jsonb NOT NULL`
- `answer_key_json`: `jsonb NOT NULL`
- `pdf_url`: `text`
- `created_at`: `timestamptz DEFAULT now()`

#### 14. `audit_logs`
- `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `actor_id`: `uuid REFERENCES profiles(id)`
- `action`: `text NOT NULL`
- `entity_type`: `text NOT NULL`
- `entity_id`: `text NOT NULL`
- `metadata`: `jsonb`
- `created_at`: `timestamptz DEFAULT now()`
- **RLS**: Append-only. Selectable exclusively by `SUPER_ADMIN`.

---

## 3. Row Level Security (RLS) Policy Blueprint

```sql
-- Profiles: Users manage own profile, Admins view all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles read policy" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles update policy" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Canonical Curriculum: Public read, Super Admin write
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters public read" ON chapters FOR SELECT USING (true);
CREATE POLICY "Chapters super admin write" ON chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Lesson Plans: Isolated to creator teacher
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lesson plans owner read" ON lesson_plans FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Lesson plans owner write" ON lesson_plans FOR ALL USING (teacher_id = auth.uid());
```
