-- =============================================================================
-- TEACHERSATHI DATABASE MIGRATION: 20260911000001_initial_schema.sql
-- Description: Core schema, enums, tables, and relationships.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'TEACHER',
  'STUDENT'
);

CREATE TYPE school_board AS ENUM (
  'CBSE',
  'KVS',
  'JNV',
  'STATE_BOARD',
  'ICSE',
  'OTHER'
);

CREATE TYPE subscription_tier AS ENUM (
  'FREE',
  'PRO_SCHOOL',
  'ENTERPRISE'
);

CREATE TYPE membership_role AS ENUM (
  'SCHOOL_ADMIN',
  'TEACHER',
  'STUDENT'
);

CREATE TYPE member_status AS ENUM (
  'ACTIVE',
  'PENDING',
  'SUSPENDED'
);

CREATE TYPE publication_status AS ENUM (
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'ARCHIVED'
);

CREATE TYPE section_tier AS ENUM (
  'SECTION_A',
  'SECTION_B',
  'SECTION_C'
);

CREATE TYPE question_type AS ENUM (
  'MCQ',
  'VERY_SHORT',
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'DIAGRAM',
  'CASE_BASED',
  'ASSERTION_REASON',
  'APPLICATION',
  'HOTS'
);

CREATE TYPE difficulty_tier AS ENUM (
  'EASY',
  'MEDIUM',
  'HARD'
);

CREATE TYPE bloom_level AS ENUM (
  'REMEMBER',
  'UNDERSTAND',
  'APPLY',
  'ANALYZE',
  'EVALUATE',
  'CREATE'
);

CREATE TYPE device_status AS ENUM (
  'ONLINE',
  'OFFLINE',
  'MAINTENANCE'
);

CREATE TYPE session_status AS ENUM (
  'WAITING',
  'PAIRING',
  'ACTIVE',
  'PAUSED',
  'ENDED'
);

CREATE TYPE remote_action_type AS ENUM (
  'START_PRESENTATION',
  'NEXT_SLIDE',
  'PREVIOUS_SLIDE',
  'START_QUIZ',
  'END_QUIZ',
  'PUSH_RESOURCE',
  'START_TIMER',
  'LOCK_BOARD',
  'END_SESSION'
);

CREATE TYPE resource_type AS ENUM (
  'LESSON_PLAN',
  'WORKSHEET',
  'PRESENTATION',
  'MIND_MAP',
  'DOCUMENT'
);

CREATE TYPE resource_status AS ENUM (
  'DRAFT',
  'VALIDATING',
  'READY',
  'USED',
  'ARCHIVED'
);

CREATE TYPE enrollment_status AS ENUM (
  'ACTIVE',
  'TRANSFERRED',
  'DROPPED'
);

-- =============================================================================
-- 1. TENANCY & IDENTITY
-- =============================================================================

-- Schools (Tenant Entity)
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  board school_board NOT NULL DEFAULT 'CBSE',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'FREE',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles (Linked 1:1 to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'TEACHER',
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- School Members (Multi-Tenant User Membership)
CREATE TABLE IF NOT EXISTS school_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  membership_role membership_role NOT NULL DEFAULT 'TEACHER',
  status member_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_school_member UNIQUE (school_id, profile_id)
);

-- =============================================================================
-- 2. CANONICAL CURRICULUM SUBSYSTEM (NCERT Standard)
-- =============================================================================

-- Grades (e.g., class-6, class-8, class-10)
CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  academic_year TEXT NOT NULL DEFAULT '2026-27',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subjects (e.g., mathematics, science)
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  color TEXT DEFAULT '#0F5B38',
  icon TEXT,
  display_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Books (NCERT Textbooks for Grade + Subject)
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id TEXT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  edition TEXT NOT NULL DEFAULT '2026 Edition',
  academic_year TEXT NOT NULL DEFAULT '2026-27',
  pdf_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_book_edition UNIQUE (grade_id, subject_id, academic_year)
);

-- Chapters
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  description_en TEXT,
  description_hi TEXT,
  study_time TEXT DEFAULT '2 Hours',
  video_id TEXT,
  publication_status publication_status NOT NULL DEFAULT 'PUBLISHED',
  display_order INT NOT NULL DEFAULT 1,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_chapter_number UNIQUE (book_id, chapter_number)
);

-- Concepts (Fine-grained pedagogical units within chapter)
CREATE TABLE IF NOT EXISTS concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  bloom_level bloom_level NOT NULL DEFAULT 'UNDERSTAND',
  learning_outcomes TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 3. QUESTION BANK & ASSESSMENT SUBSYSTEM
-- =============================================================================

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE SET NULL,
  section_tier section_tier NOT NULL DEFAULT 'SECTION_A',
  question_type question_type NOT NULL DEFAULT 'MCQ',
  marks INT NOT NULL DEFAULT 1 CHECK (marks >= 1 AND marks <= 10),
  difficulty difficulty_tier NOT NULL DEFAULT 'MEDIUM',
  bloom_level bloom_level NOT NULL DEFAULT 'UNDERSTAND',
  text_en TEXT NOT NULL,
  text_hi TEXT NOT NULL,
  model_answer_en TEXT NOT NULL,
  model_answer_hi TEXT NOT NULL,
  explanation_en TEXT,
  explanation_hi TEXT,
  source TEXT DEFAULT 'NCERT',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  status publication_status NOT NULL DEFAULT 'PUBLISHED',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Question Options (For MCQs)
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL CHECK (option_key IN ('A', 'B', 'C', 'D')),
  text_en TEXT NOT NULL,
  text_hi TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_question_option UNIQUE (question_id, option_key)
);

-- Question Versions (Audit History Ledger)
CREATE TABLE IF NOT EXISTS question_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  change_summary TEXT NOT NULL,
  data_snapshot JSONB NOT NULL,
  CONSTRAINT uq_question_version UNIQUE (question_id, version_number)
);

-- =============================================================================
-- 4. INSTITUTIONAL ROSTERS & CLASSES
-- =============================================================================

-- Classes (Sections in School)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  grade_id TEXT NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  academic_year TEXT NOT NULL DEFAULT '2026-27',
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_school_class_section UNIQUE (school_id, grade_id, section, academic_year)
);

-- Class Students (Enrollment)
CREATE TABLE IF NOT EXISTS class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  roll_number TEXT,
  enrollment_status enrollment_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

-- =============================================================================
-- 5. HARDWARE & CLASSROOM KIOSK SUBSYSTEM
-- =============================================================================

-- Classroom Devices (75" IFP Displays / Smartboards)
CREATE TABLE IF NOT EXISTS classroom_devices (
  id TEXT PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_code TEXT UNIQUE,
  location TEXT NOT NULL,
  device_fingerprint TEXT,
  status device_status NOT NULL DEFAULT 'OFFLINE',
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Classroom Sessions (Pairing Handshake & Period State)
CREATE TABLE IF NOT EXISTS classroom_sessions (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES classroom_devices(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  session_token_hash TEXT NOT NULL,
  status session_status NOT NULL DEFAULT 'WAITING',
  expires_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Remote Actions (Classroom Control Log)
CREATE TABLE IF NOT EXISTS remote_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES classroom_sessions(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action_type remote_action_type NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 6. TEACHER RESOURCES SUBSYSTEM
-- =============================================================================

-- Generic Resources Parent Ledger
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  resource_type resource_type NOT NULL DEFAULT 'LESSON_PLAN',
  title TEXT NOT NULL,
  description TEXT,
  status resource_status NOT NULL DEFAULT 'DRAFT',
  metadata JSONB NOT NULL DEFAULT '{}',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lesson Plans
CREATE TABLE IF NOT EXISTS lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  duration_mins INT NOT NULL DEFAULT 45,
  content_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Worksheets
CREATE TABLE IF NOT EXISTS worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  questions_json JSONB NOT NULL,
  answer_key_json JSONB NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Presentations
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slide_count INT NOT NULL DEFAULT 1,
  slides_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mind Maps
CREATE TABLE IF NOT EXISTS mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  nodes_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 7. AUDIT LOGS SUBSYSTEM
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
