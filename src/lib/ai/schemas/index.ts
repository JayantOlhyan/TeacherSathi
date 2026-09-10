import { z } from 'zod';

// =============================================================================
// 1. AI LESSON PLAN SCHEMA
// =============================================================================

export const LessonPlanStepSchema = z.object({
  step_number: z.number().int().positive(),
  title: z.string().min(2),
  duration_mins: z.number().int().positive(),
  teacher_actions: z.string().min(5),
  student_actions: z.string().min(5),
});

export const LessonPlanActivitySchema = z.object({
  title: z.string().min(2),
  duration_mins: z.number().int().positive(),
  description: z.string().min(5),
  grouping: z.enum(['individual', 'pairs', 'groups']),
});

export const LessonPlanSchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  duration_mins: z.number().int().min(15).max(120).default(45),
  learning_objectives: z.array(z.string().min(3)).min(2),
  materials: z.array(z.string()).min(1),
  prior_knowledge: z.string().min(3),
  introduction: z.object({
    duration_mins: z.number().int().positive(),
    hook: z.string().min(5),
    real_world_application: z.string().min(5),
  }),
  teaching_steps: z.array(LessonPlanStepSchema).min(2),
  activities: z.array(LessonPlanActivitySchema).min(1),
  assessment: z.object({
    formative_checks: z.array(z.string().min(3)).min(1),
    exit_ticket: z.string().min(3),
  }),
  differentiation: z.object({
    support_for_struggling: z.string().min(5),
    extension_for_advanced: z.string().min(5),
  }),
  homework: z.string().min(3),
  teacher_notes: z.string().optional().default(''),
});

export type LessonPlan = z.infer<typeof LessonPlanSchema>;

// =============================================================================
// 2. AI WORKSHEET SCHEMA
// =============================================================================

export const WorksheetQuestionOptionSchema = z.object({
  key: z.enum(['A', 'B', 'C', 'D']),
  text_en: z.string().min(1),
  text_hi: z.string().min(1),
});

export const WorksheetQuestionSchema = z.object({
  question_number: z.number().int().positive(),
  question_type: z.enum([
    'MCQ',
    'SHORT_ANSWER',
    'LONG_ANSWER',
    'APPLICATION',
    'HOTS',
    'CASE_BASED',
    'ASSERTION_REASON',
  ]),
  marks: z.number().int().min(1).max(10),
  text_en: z.string().min(2),
  text_hi: z.string().min(2),
  model_answer_en: z.string().min(2),
  model_answer_hi: z.string().min(2),
  options: z.array(WorksheetQuestionOptionSchema).optional(),
});

export const WorksheetSchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  total_marks: z.number().int().positive(),
  instructions: z.array(z.string()).min(1),
  questions: z.array(WorksheetQuestionSchema).min(3),
  answer_key: z.record(z.string(), z.string()),
});

export type Worksheet = z.infer<typeof WorksheetSchema>;

// =============================================================================
// 3. AI QUIZ SCHEMA
// =============================================================================

export const QuizOptionSchema = z.object({
  id: z.enum(['A', 'B', 'C', 'D']),
  text: z.string().min(1),
  is_correct: z.boolean(),
});

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(3),
  options: z.array(QuizOptionSchema).length(4),
  correct_option_id: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().min(3),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  concept: z.string().min(2),
});

export const QuizSchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  questions: z.array(QuizQuestionSchema).min(1),
});

export type Quiz = z.infer<typeof QuizSchema>;

// =============================================================================
// 4. AI TEST PAPER SCHEMA (CBSE Blueprint Alignment)
// =============================================================================

export const TestPaperQuestionSchema = z.object({
  question_number: z.number().int().positive(),
  text_en: z.string().min(3),
  text_hi: z.string().min(3),
  marks: z.number().int().min(1).max(20),
  question_type: z.string().min(2),
  bloom_level: z.string().min(2),
  model_answer: z.string().min(3),
  marking_scheme: z.array(z.string()).min(1),
});

export const TestPaperSectionSchema = z.object({
  section_name: z.enum(['Section A', 'Section B', 'Section C', 'Section D']),
  section_title: z.string().min(2),
  marks_per_question: z.number().int().positive(),
  questions: z.array(TestPaperQuestionSchema).min(1),
});

export const TestPaperSchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapters: z.array(z.string()).min(1),
  duration_mins: z.number().int().min(15).max(180),
  total_marks: z.number().int().positive(),
  general_instructions: z.array(z.string()).min(1),
  sections: z.array(TestPaperSectionSchema).min(1),
});

export type TestPaper = z.infer<typeof TestPaperSchema>;

// =============================================================================
// 5. AI PRESENTATION SCHEMA (Smartboard 75" Optimized)
// =============================================================================

export const PresentationSlideSchema = z.object({
  slide_number: z.number().int().positive(),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  bullet_points: z.array(z.string().min(2)).max(4),
  teacher_tip: z.string().min(3),
  visual_prompt: z.string().min(3),
  reflection_pause: z.string().optional(),
});

export const PresentationSchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  slide_count: z.number().int().min(4).max(20),
  slides: z.array(PresentationSlideSchema).min(4),
});

export type Presentation = z.infer<typeof PresentationSchema>;

// =============================================================================
// 6. AI MIND MAP SCHEMA
// =============================================================================

export const MindMapNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  category: z.enum(['Core', 'Subconcept', 'Application', 'Term']),
  description: z.string().min(3),
});

export const MindMapEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  relationship: z.string().min(1),
});

export const MindMapSchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  central_node: z.object({
    id: z.string().min(1),
    label: z.string().min(1),
  }),
  nodes: z.array(MindMapNodeSchema).min(3),
  edges: z.array(MindMapEdgeSchema).min(2),
});

export type MindMap = z.infer<typeof MindMapSchema>;

// =============================================================================
// 7. AI TEACHING ACTIVITY SCHEMA
// =============================================================================

export const TeachingActivityProcedureSchema = z.object({
  step_number: z.number().int().positive(),
  action: z.string().min(5),
  teacher_prompt: z.string().min(3),
});

export const TeachingActivitySchema = z.object({
  title: z.string().min(3),
  grade: z.string().min(1),
  subject: z.string().min(1),
  chapter: z.string().min(1),
  duration_mins: z.number().int().min(5).max(30),
  learning_outcome: z.string().min(5),
  materials_needed: z.array(z.string()).min(1),
  setup: z.string().min(5),
  step_by_step_procedure: z.array(TeachingActivityProcedureSchema).min(2),
  reflection_questions: z.array(z.string()).min(1),
  safety_guidelines: z.string().min(3),
});

export type TeachingActivity = z.infer<typeof TeachingActivitySchema>;

// =============================================================================
// 8. SAATHI GENIE SCHEMA
// =============================================================================

export const SaathiGenieResponseSchema = z.object({
  pedagogical_answer: z.string().min(5),
  actionable_steps: z.array(z.string().min(3)).min(1),
  curriculum_reference: z.object({
    grade: z.string().min(1),
    subject: z.string().min(1),
    chapter: z.string().min(1),
  }),
  quick_followups: z.array(z.string().min(3)).min(1),
});

export type SaathiGenieResponse = z.infer<typeof SaathiGenieResponseSchema>;
