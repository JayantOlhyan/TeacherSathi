import { z } from 'zod';

// =============================================================================
// 1. RESOURCE ENUMS & STATUS SCHEMAS
// =============================================================================

export const ResourceTypeSchema = z.enum([
  'PRESENTATION',
  'MIND_MAP',
  'TEACHING_ACTIVITY',
  'WORKSHEET',
  'QUIZ',
  'TEST',
  'ASSIGNMENT',
  'VIDEO',
  'DOCUMENT',
  'IMAGE',
  'AUDIO',
  'LINK',
  'LESSON_PLAN',
]);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;

export const ResourceStatusSchema = z.enum([
  'DRAFT',
  'VALIDATING',
  'READY',
  'PUBLISHED',
  'USED',
  'ARCHIVED',
]);
export type ResourceStatus = z.infer<typeof ResourceStatusSchema>;

export const ValidationStatusSchema = z.enum(['PENDING', 'PASSED', 'WARNING', 'FAILED']);
export type ValidationStatus = z.infer<typeof ValidationStatusSchema>;

// =============================================================================
// 2. PRESENTATION SCHEMAS
// =============================================================================

export const SlideTypeSchema = z.enum([
  'TITLE',
  'CONTENT',
  'IMAGE',
  'DIAGRAM',
  'QUESTION',
  'ACTIVITY',
  'SUMMARY',
]);
export type SlideType = z.infer<typeof SlideTypeSchema>;

export const PresentationThemeSchema = z.enum([
  'forest_green',
  'deep_ocean',
  'warm_amber',
  'dark_slate',
  'midnight_emerald',
  'LIGHT',
  'DARK',
]).or(z.string());
export type PresentationTheme = z.infer<typeof PresentationThemeSchema>;

export const PresentationSlideSchema = z.object({
  id: z.string().default(() => `slide_${Math.random().toString(36).substring(2, 9)}`),
  slide_number: z.number().int().positive().optional().default(1),
  type: SlideTypeSchema,
  title: z.string().min(1, 'Slide title is required'),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).max(10).optional().default([]),
  image_url: z.string().optional(),
  image_caption: z.string().optional(),
  diagram_type: z.enum(['MERMAID', 'FLOWCHART', 'CYCLE', 'TREE']).optional(),
  diagram_code: z.string().optional(),
  question_text: z.string().optional(),
  question_options: z.array(z.string()).min(2).max(6).optional(),
  correct_option_index: z.number().int().min(0).max(5).optional(),
  explanation: z.string().optional(),
  activity_type: z.string().optional(),
  activity_prompt: z.string().optional(),
  speaker_notes: z.string().optional().default(''),
});
export type PresentationSlide = z.infer<typeof PresentationSlideSchema>;

export const PresentationContentSchema = z.object({
  title: z.string().min(1),
  theme: PresentationThemeSchema.default('forest_green'),
  language: z.string().default('en'),
  aspect_ratio: z.enum(['16:9', '4:3']).default('16:9'),
  slides: z.array(PresentationSlideSchema).min(1),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});
export type PresentationContent = z.infer<typeof PresentationContentSchema>;

// =============================================================================
// 3. MIND MAP SCHEMAS
// =============================================================================

export const MindMapNodeTypeSchema = z.enum([
  'CENTRAL',
  'MAIN_BRANCH',
  'SUB_BRANCH',
  'LEAF',
  'CONCEPT',
  'SUB_CONCEPT',
  'EXAMPLE',
  'QUESTION',
]);
export type MindMapNodeType = z.infer<typeof MindMapNodeTypeSchema>;

export const MindMapNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: MindMapNodeTypeSchema.default('SUB_BRANCH'),
  x: z.number().default(0),
  y: z.number().default(0),
  color: z.string().optional(),
  notes: z.string().optional(),
  parent_id: z.string().optional(),
});
export type MindMapNode = z.infer<typeof MindMapNodeSchema>;

export const MindMapEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
  style: z.enum(['SOLID', 'DASHED', 'DOTTED']).default('SOLID'),
});
export type MindMapEdge = z.infer<typeof MindMapEdgeSchema>;

export const MindMapContentSchema = z.object({
  title: z.string().min(1),
  central_node_id: z.string().min(1),
  nodes: z.array(MindMapNodeSchema).min(1),
  edges: z.array(MindMapEdgeSchema).default([]),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});
export type MindMapContent = z.infer<typeof MindMapContentSchema>;

// =============================================================================
// 4. TEACHING ACTIVITY SCHEMAS
// =============================================================================

export const ActivityArchetypeSchema = z.enum([
  'THINK_PAIR_SHARE',
  'JIGSAW',
  'GALLERY_WALK',
  'FOUR_CORNERS',
  'ROLE_PLAY',
  'CONCEPT_ATTAINMENT',
  'FISHBOWL',
  'SOCRATIC_SEMINAR',
  'STATIONS',
  'PEER_INSTRUCTION',
  'DISCUSSION',
  'GROUP_ACTIVITY',
  'EXPERIMENT',
  'DEBATE',
  'OBSERVATION',
  'PROBLEM_SOLVING',
  'QUICK_POLL',
  'EXIT_TICKET',
]);
export type ActivityArchetype = z.infer<typeof ActivityArchetypeSchema>;

export const ActivityStepSchema = z.object({
  phase: z.string().optional(),
  step_number: z.number().int().positive().optional(),
  title: z.string().optional(),
  duration_minutes: z.number().optional(),
  duration_mins: z.number().optional(),
  teacher_instruction: z.string().optional(),
  teacher_prompt: z.string().optional(),
  student_action: z.string().optional(),
});

export const TeachingActivityContentSchema = z.object({
  title: z.string().optional(),
  archetype: ActivityArchetypeSchema.optional(),
  activity_type: ActivityArchetypeSchema.optional(),
  grade_level: z.string().optional(),
  subject: z.string().optional(),
  objective: z.string().optional(),
  learning_objectives: z.array(z.string()).optional(),
  duration_minutes: z.number().min(1).optional(),
  duration_mins: z.number().min(1).optional(),
  instructions: z.string().optional(),
  materials_needed: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  grouping: z.enum(['INDIVIDUAL', 'PAIRS', 'SMALL_GROUPS', 'WHOLE_CLASS']).optional(),
  procedure: z.array(ActivityStepSchema).optional(),
  teacher_steps: z.array(ActivityStepSchema).optional(),
  student_steps: z.array(z.string()).optional(),
  expected_outcome: z.string().optional(),
  assessment_strategy: z.string().optional(),
  assessment_method: z.string().optional(),
  differentiation: z.string().optional(),
});
export type TeachingActivityContent = z.infer<typeof TeachingActivityContentSchema>;

// =============================================================================
// 5. MEDIA ASSET & JOB SCHEMAS
// =============================================================================

export const MediaSourceSchema = z.enum(['UPLOAD', 'EXTERNAL', 'PLATFORM']);
export type MediaSource = z.infer<typeof MediaSourceSchema>;

export const MediaStatusSchema = z.enum(['UPLOADING', 'PROCESSING', 'READY', 'FAILED']);
export type MediaStatus = z.infer<typeof MediaStatusSchema>;

export const MediaJobTypeSchema = z.enum(['THUMBNAIL', 'TRANSCODE', 'METADATA_PROBE']);
export type MediaJobType = z.infer<typeof MediaJobTypeSchema>;

export const MediaJobStatusSchema = z.enum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']);
export type MediaJobStatus = z.infer<typeof MediaJobStatusSchema>;

export const MediaUploadInputSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  mime_type: z.string().min(3),
  size_bytes: z.number().int().positive().max(100 * 1024 * 1024), // 100MB ceiling
  source: MediaSourceSchema.default('UPLOAD'),
  source_url: z.string().url().optional(),
  language: z.string().default('en'),
  curriculum_mapping: z.object({
    grade_id: z.string().uuid().optional(),
    subject_id: z.string().uuid().optional(),
    chapter_id: z.string().uuid().optional(),
    concept_id: z.string().uuid().optional(),
  }).optional().default({}),
});
export type MediaUploadInput = z.infer<typeof MediaUploadInputSchema>;

// =============================================================================
// 6. RESOURCE CRUD INPUT & QUERY SCHEMAS
// =============================================================================

export const CreateResourceInputSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  resource_type: ResourceTypeSchema,
  grade_id: z.string().uuid().optional().nullable(),
  subject_id: z.string().uuid().optional().nullable(),
  book_id: z.string().uuid().optional().nullable(),
  chapter_id: z.string().uuid().optional().nullable(),
  concept_ids: z.array(z.string().uuid()).optional().default([]),
  language: z.enum(['en', 'hi', 'bilingual']).default('en'),
  content: z.record(z.string(), z.unknown()).default({}),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  status: ResourceStatusSchema.optional().default('DRAFT'),
});
export type CreateResourceInput = z.infer<typeof CreateResourceInputSchema>;

export const UpdateResourceInputSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  grade_id: z.string().uuid().optional().nullable(),
  subject_id: z.string().uuid().optional().nullable(),
  book_id: z.string().uuid().optional().nullable(),
  chapter_id: z.string().uuid().optional().nullable(),
  concept_ids: z.array(z.string().uuid()).optional(),
  language: z.enum(['en', 'hi', 'bilingual']).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  status: ResourceStatusSchema.optional(),
  change_summary: z.string().optional(),
});
export type UpdateResourceInput = z.infer<typeof UpdateResourceInputSchema>;

export const ResourceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  resource_type: ResourceTypeSchema.optional(),
  status: ResourceStatusSchema.optional(),
  grade_id: z.string().uuid().optional(),
  subject_id: z.string().uuid().optional(),
  chapter_id: z.string().uuid().optional(),
  language: z.string().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'title']).default('updated_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});
export type ResourceQuery = z.infer<typeof ResourceQuerySchema>;

// =============================================================================
// 7. VALIDATION ENGINE REPORT SCHEMA
// =============================================================================

export const ContentValidationErrorSchema = z.object({
  rule: z.string(),
  code: z.string().optional(),
  message: z.string(),
  severity: z.enum(['ERROR', 'WARNING']),
  field: z.string().optional(),
  slide_number: z.number().int().optional(),
});
export type ContentValidationError = z.infer<typeof ContentValidationErrorSchema>;

export const ValidationReportSchema = z.object({
  status: ValidationStatusSchema,
  score: z.number().min(0).max(100),
  errors: z.array(ContentValidationErrorSchema),
  warnings: z.array(ContentValidationErrorSchema),
  summary: z.string(),
  validated_at: z.string(),
});
export type ValidationReport = z.infer<typeof ValidationReportSchema>;
