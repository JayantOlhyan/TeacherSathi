import { z } from 'zod';

// =============================================================================
// ASSESSMENT & ATTEMPT ENUMS
// =============================================================================

export const AssessmentTypeSchema = z.enum([
  'MCQ_QUIZ',
  'TEST_PAPER',
  'WORKSHEET',
  'ASSIGNMENT',
]);
export type AssessmentType = z.infer<typeof AssessmentTypeSchema>;

export const AssessmentStatusSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'CLOSED',
  'ARCHIVED',
]);
export type AssessmentStatus = z.infer<typeof AssessmentStatusSchema>;

export const AssignmentStatusSchema = z.enum([
  'SCHEDULED',
  'ACTIVE',
  'CLOSED',
]);
export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;

export const AttemptStatusSchema = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'SUBMITTED',
  'GRADED',
  'ABANDONED',
]);
export type AttemptStatus = z.infer<typeof AttemptStatusSchema>;

export const AnswerGradingStatusSchema = z.enum([
  'UNGRADED',
  'AUTO_GRADED',
  'MANUAL_REVIEW',
  'GRADED',
]);
export type AnswerGradingStatus = z.infer<typeof AnswerGradingStatusSchema>;

// =============================================================================
// ASSESSMENT SETTINGS
// =============================================================================

export const DEFAULT_ASSESSMENT_SETTINGS = {
  shuffle_questions: false,
  shuffle_options: false,
  show_result_after_submission: true,
  allow_retake: false,
  max_attempts: 1,
  negative_marking: false,
  negative_marks_per_question: 0,
};

export const AssessmentSettingsSchema = z.object({
  shuffle_questions: z.boolean().default(false),
  shuffle_options: z.boolean().default(false),
  show_result_after_submission: z.boolean().default(true),
  allow_retake: z.boolean().default(false),
  max_attempts: z.number().int().min(1).default(1),
  negative_marking: z.boolean().default(false),
  negative_marks_per_question: z.number().min(0).default(0),
});
export type AssessmentSettings = z.infer<typeof AssessmentSettingsSchema>;

// =============================================================================
// QUESTION SNAPSHOT (IMMUTABLE FOR REPRODUCIBILITY)
// =============================================================================

export const SnapshotOptionSchema = z.object({
  option_key: z.enum(['A', 'B', 'C', 'D']),
  text_en: z.string(),
  text_hi: z.string().optional(),
  is_correct: z.boolean(),
});
export type SnapshotOption = z.infer<typeof SnapshotOptionSchema>;

export const QuestionSnapshotSchema = z.object({
  text_en: z.string().min(1),
  text_hi: z.string().optional(),
  question_type: z.string().default('MCQ'),
  marks: z.number().min(1).default(1),
  difficulty: z.string().optional(),
  bloom_level: z.string().optional(),
  options: z.array(SnapshotOptionSchema).optional(),
  model_answer_en: z.string().optional(),
  model_answer_hi: z.string().optional(),
  explanation_en: z.string().optional(),
  explanation_hi: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type QuestionSnapshot = z.infer<typeof QuestionSnapshotSchema>;

// =============================================================================
// ASSESSMENT & QUESTION CREATION SCHEMAS
// =============================================================================

export const AssessmentQuestionCreateSchema = z.object({
  question_id: z.string().uuid().nullable().optional(),
  question_order: z.number().int().positive(),
  section: z.string().default('SECTION_A'),
  marks_override: z.number().int().positive().nullable().optional(),
  question_snapshot: QuestionSnapshotSchema,
});
export type AssessmentQuestionCreate = z.infer<typeof AssessmentQuestionCreateSchema>;

export const AssessmentCreateSchema = z.object({
  school_id: z.string().uuid().nullable().optional(),
  class_id: z.string().uuid().nullable().optional(),
  title: z.string().min(3).max(255),
  description: z.string().optional().default(''),
  assessment_type: AssessmentTypeSchema.default('MCQ_QUIZ'),
  grade_id: z.string().min(1),
  subject_id: z.string().min(1),
  book_id: z.string().uuid().nullable().optional(),
  chapter_id: z.string().uuid().nullable().optional(),
  concept_id: z.string().uuid().nullable().optional(),
  language: z.enum(['en', 'hi', 'bilingual']).default('en'),
  duration_minutes: z.number().int().min(5).max(180).default(30),
  total_marks: z.number().int().min(0),
  passing_marks: z.number().int().min(0).nullable().optional(),
  instructions: z.array(z.string()).default([]),
  settings: AssessmentSettingsSchema.default(DEFAULT_ASSESSMENT_SETTINGS),
  questions: z.array(AssessmentQuestionCreateSchema).min(1),
});
export type AssessmentCreate = z.infer<typeof AssessmentCreateSchema>;

export const AssessmentUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  duration_minutes: z.number().int().min(5).max(180).optional(),
  passing_marks: z.number().int().min(0).nullable().optional(),
  instructions: z.array(z.string()).optional(),
  settings: AssessmentSettingsSchema.optional(),
  status: AssessmentStatusSchema.optional(),
});
export type AssessmentUpdate = z.infer<typeof AssessmentUpdateSchema>;

// =============================================================================
// ASSIGNMENT SCHEMAS
// =============================================================================

export const AssignmentCreateSchema = z.object({
  assessment_id: z.string().uuid(),
  class_id: z.string().uuid(),
  available_from: z.string().datetime().nullable().optional(),
  due_at: z.string().datetime().nullable().optional(),
  settings_override: z.record(z.string(), z.unknown()).optional().default({}),
});
export type AssignmentCreate = z.infer<typeof AssignmentCreateSchema>;

// =============================================================================
// ATTEMPT & ANSWER SCHEMAS
// =============================================================================

export const AttemptStartSchema = z.object({
  assessment_id: z.string().uuid(),
  assignment_id: z.string().uuid().nullable().optional(),
});
export type AttemptStart = z.infer<typeof AttemptStartSchema>;

export const AnswerSaveSchema = z.object({
  assessment_question_id: z.string().uuid(),
  selected_option: z.enum(['A', 'B', 'C', 'D']).nullable().optional(),
  text_answer: z.string().nullable().optional(),
  answer_payload: z.record(z.string(), z.unknown()).optional().default({}),
});
export type AnswerSave = z.infer<typeof AnswerSaveSchema>;

export const BatchAnswersSaveSchema = z.object({
  answers: z.array(AnswerSaveSchema).min(1),
});
export type BatchAnswersSave = z.infer<typeof BatchAnswersSaveSchema>;

export const AttemptSubmitSchema = z.object({
  time_taken_seconds: z.number().int().min(0).default(0),
});
export type AttemptSubmit = z.infer<typeof AttemptSubmitSchema>;
