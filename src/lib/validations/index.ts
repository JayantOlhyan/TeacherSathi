import { z } from 'zod';

// Roles & Enums
export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT']);
export const SchoolBoardSchema = z.enum(['CBSE', 'KVS', 'JNV', 'STATE_BOARD', 'ICSE', 'OTHER']);
export const SubscriptionTierSchema = z.enum(['FREE', 'PRO_SCHOOL', 'ENTERPRISE']);
export const MembershipRoleSchema = z.enum(['SCHOOL_ADMIN', 'TEACHER', 'STUDENT']);
export const MemberStatusSchema = z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']);
export const PublicationStatusSchema = z.enum(['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']);
export const SectionTierSchema = z.enum(['SECTION_A', 'SECTION_B', 'SECTION_C']);
export const QuestionTypeSchema = z.enum([
  'MCQ',
  'VERY_SHORT',
  'SHORT_ANSWER',
  'LONG_ANSWER',
  'DIAGRAM',
  'CASE_BASED',
  'ASSERTION_REASON',
  'APPLICATION',
  'HOTS',
]);
export const DifficultyTierSchema = z.enum(['EASY', 'MEDIUM', 'HARD']);
export const BloomLevelSchema = z.enum(['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE']);
export const SessionStatusSchema = z.enum(['WAITING', 'PAIRING', 'ACTIVE', 'PAUSED', 'ENDED']);
export const RemoteActionTypeSchema = z.enum([
  'START_PRESENTATION',
  'NEXT_SLIDE',
  'PREVIOUS_SLIDE',
  'START_QUIZ',
  'END_QUIZ',
  'PUSH_RESOURCE',
  'START_TIMER',
  'LOCK_BOARD',
  'END_SESSION',
]);
export const ResourceTypeSchema = z.enum(['LESSON_PLAN', 'WORKSHEET', 'PRESENTATION', 'MIND_MAP', 'DOCUMENT']);
export const ResourceStatusSchema = z.enum(['DRAFT', 'VALIDATING', 'READY', 'USED', 'ARCHIVED']);
export const EnrollmentStatusSchema = z.enum(['ACTIVE', 'TRANSFERRED', 'DROPPED']);

// Profiles
export const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  preferred_language: z.enum(['en', 'hi']).optional(),
  avatar_url: z.string().url().nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  school_id: z.string().uuid().nullable().optional(),
});

// Schools
export const SchoolCreateSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(50).optional(),
  board: SchoolBoardSchema.default('CBSE'),
  state: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  address: z.string().max(500).optional(),
  postal_code: z.string().max(20).optional(),
  contact_email: z.string().email(),
  contact_phone: z.string().max(20).optional(),
  subscription_tier: SubscriptionTierSchema.default('FREE'),
});

// Classes
export const ClassCreateSchema = z.object({
  school_id: z.string().uuid(),
  teacher_id: z.string().uuid().optional(),
  grade_id: z.string().min(1),
  name: z.string().min(1).max(100),
  section: z.string().min(1).max(10).default('A'),
  academic_year: z.string().default('2026-27'),
});

export const ClassUpdateSchema = ClassCreateSchema.partial();

// Student Enrollment
export const StudentEnrollmentSchema = z.object({
  class_id: z.string().uuid(),
  student_id: z.string().uuid(),
  roll_number: z.string().max(50).optional(),
  enrollment_status: EnrollmentStatusSchema.default('ACTIVE'),
});

// Curriculum: Chapters & Concepts
export const ChapterCreateSchema = z.object({
  book_id: z.string().uuid(),
  chapter_number: z.number().int().positive(),
  slug: z.string().min(1),
  title_en: z.string().min(1).max(255),
  title_hi: z.string().min(1).max(255),
  description_en: z.string().optional(),
  description_hi: z.string().optional(),
  study_time: z.string().default('2 Hours'),
  video_id: z.string().nullable().optional(),
  publication_status: PublicationStatusSchema.default('PUBLISHED'),
  display_order: z.number().int().default(1),
  is_locked: z.boolean().default(false),
});

export const ConceptCreateSchema = z.object({
  chapter_id: z.string().uuid(),
  name_en: z.string().min(1).max(255),
  name_hi: z.string().min(1).max(255),
  bloom_level: BloomLevelSchema.default('UNDERSTAND'),
  learning_outcomes: z.array(z.string()).default([]),
  display_order: z.number().int().default(1),
});

// Questions & Question Options
export const QuestionOptionSchema = z.object({
  option_key: z.enum(['A', 'B', 'C', 'D']),
  text_en: z.string().min(1),
  text_hi: z.string().min(1),
  is_correct: z.boolean().default(false),
});

export const QuestionCreateSchema = z.object({
  chapter_id: z.string().uuid(),
  concept_id: z.string().uuid().nullable().optional(),
  section_tier: SectionTierSchema.default('SECTION_A'),
  question_type: QuestionTypeSchema.default('MCQ'),
  marks: z.number().int().min(1).max(10).default(1),
  difficulty: DifficultyTierSchema.default('MEDIUM'),
  bloom_level: BloomLevelSchema.default('UNDERSTAND'),
  text_en: z.string().min(1),
  text_hi: z.string().min(1),
  model_answer_en: z.string().min(1),
  model_answer_hi: z.string().min(1),
  explanation_en: z.string().optional(),
  explanation_hi: z.string().optional(),
  source: z.string().default('NCERT'),
  tags: z.array(z.string()).default([]),
  status: PublicationStatusSchema.default('PUBLISHED'),
  options: z.array(QuestionOptionSchema).optional(),
});

export const QuestionUpdateSchema = QuestionCreateSchema.partial();

// Resources (Parent & Child Schemas)
export const ResourceCreateSchema = z.object({
  school_id: z.string().uuid().nullable().optional(),
  owner_id: z.string().uuid(),
  chapter_id: z.string().uuid().nullable().optional(),
  resource_type: ResourceTypeSchema.default('LESSON_PLAN'),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: ResourceStatusSchema.default('DRAFT'),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const LessonPlanContentSchema = z.object({
  title: z.string().min(1),
  duration_mins: z.number().int().min(15).max(120).default(45),
  objectives: z.array(z.string()).min(1),
  warmup: z.string().optional(),
  core_instruction: z.string().min(1),
  guided_practice: z.string().optional(),
  assessment: z.string().optional(),
  homework: z.string().optional(),
});

export const WorksheetContentSchema = z.object({
  title: z.string().min(1),
  questions: z.array(z.object({
    number: z.number().int(),
    text: z.string().min(1),
    marks: z.number().int().min(1),
    type: QuestionTypeSchema.default('SHORT_ANSWER'),
  })),
  answer_key: z.record(z.string(), z.string()).default({}),
  pdf_url: z.string().url().nullable().optional(),
});

// Classroom Devices & Sessions
export const ClassroomDeviceSchema = z.object({
  id: z.string().min(1).max(50),
  school_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  device_code: z.string().optional(),
  location: z.string().min(1).max(200),
  device_fingerprint: z.string().optional(),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE']).default('OFFLINE'),
});

export const ClassroomSessionCreateSchema = z.object({
  id: z.string().min(1).max(100),
  device_id: z.string().min(1),
  teacher_id: z.string().uuid().optional(),
  class_id: z.string().uuid().optional(),
  chapter_id: z.string().uuid().optional(),
  session_token_hash: z.string().min(8),
  status: SessionStatusSchema.default('WAITING'),
  expires_at: z.string().datetime(),
});

export const RemoteActionCreateSchema = z.object({
  session_id: z.string().min(1),
  actor_id: z.string().uuid().optional(),
  action_type: RemoteActionTypeSchema,
  payload: z.record(z.string(), z.unknown()).default({}),
});
