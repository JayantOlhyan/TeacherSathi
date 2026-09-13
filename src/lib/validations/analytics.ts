import { z } from 'zod';

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

export const MasteryStatusSchema = z.enum([
  'INSUFFICIENT_EVIDENCE',
  'CRITICAL',
  'DEVELOPING',
  'APPROACHING',
  'PROFICIENT',
  'STRONG',
]);
export type MasteryStatus = z.infer<typeof MasteryStatusSchema>;

export const EvidenceConfidenceSchema = z.enum([
  'INSUFFICIENT_EVIDENCE',
  'LOW',
  'MEDIUM',
  'HIGH',
]);
export type EvidenceConfidence = z.infer<typeof EvidenceConfidenceSchema>;

export const GapSeveritySchema = z.enum([
  'CRITICAL',
  'HIGH',
  'MODERATE',
  'ON_TRACK',
]);
export type GapSeverity = z.infer<typeof GapSeveritySchema>;

export const GapStatusSchema = z.enum([
  'OPEN',
  'IN_REMEDIATION',
  'IMPROVING',
  'RESOLVED',
  'INSUFFICIENT_EVIDENCE',
]);
export type GapStatus = z.infer<typeof GapStatusSchema>;

export const ObservedDifficultyTierSchema = z.enum([
  'INSUFFICIENT_DATA',
  'EASY',
  'MODERATE',
  'DIFFICULT',
  'VERY_DIFFICULT',
]);
export type ObservedDifficultyTier = z.infer<typeof ObservedDifficultyTierSchema>;

export const InterventionTypeSchema = z.enum([
  'REMEDIATION_PLAN',
  'REMEDIATION_ACTIVITY',
  'WORKSHEET',
  'PRACTICE_QUIZ',
  'LESSON_PLAN',
  'MIND_MAP',
]);
export type InterventionType = z.infer<typeof InterventionTypeSchema>;

export const InterventionStatusSchema = z.enum([
  'DRAFT',
  'APPROVED',
  'ASSIGNED',
  'COMPLETED',
  'ARCHIVED',
]);
export type InterventionStatus = z.infer<typeof InterventionStatusSchema>;

// =============================================================================
// DOMAIN MODELS & DTO SCHEMAS
// =============================================================================

export const AnalyticsFilterSchema = z.object({
  classId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  gradeId: z.string().min(1).optional(),
  subjectId: z.string().min(1).optional(),
  chapterId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
});
export type AnalyticsFilter = z.infer<typeof AnalyticsFilterSchema>;

export const RecomputeRequestSchema = z.object({
  studentId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
});
export type RecomputeRequest = z.infer<typeof RecomputeRequestSchema>;

export const GenerateInterventionSchema = z.object({
  conceptId: z.string().uuid(),
  chapterId: z.string().uuid().optional(),
  gradeId: z.string().min(1),
  subjectId: z.string().min(1),
  language: z.enum(['en', 'hi', 'bilingual']).default('en'),
  interventionType: InterventionTypeSchema.default('REMEDIATION_ACTIVITY'),
  observedWeakness: z.string().optional(),
});
export type GenerateIntervention = z.infer<typeof GenerateInterventionSchema>;

export const ConceptMasteryItemSchema = z.object({
  id: z.string().uuid().optional(),
  studentId: z.string().uuid(),
  conceptId: z.string().uuid(),
  conceptNameEn: z.string().optional(),
  conceptNameHi: z.string().optional(),
  chapterId: z.string().uuid(),
  chapterTitleEn: z.string().optional(),
  subjectId: z.string(),
  gradeId: z.string(),
  masteryScore: z.number().min(0).max(100),
  confidenceLevel: EvidenceConfidenceSchema,
  evidenceCount: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  incorrectCount: z.number().int().min(0),
  unansweredCount: z.number().int().min(0),
  recentAccuracy: z.number().min(0).max(100).nullable().optional(),
  historicalAccuracy: z.number().min(0).max(100).nullable().optional(),
  status: MasteryStatusSchema,
  lastAssessedAt: z.string().nullable().optional(),
  trend: z.array(z.object({
    masteryScore: z.number(),
    calculatedAt: z.string(),
  })).optional(),
});
export type ConceptMasteryItem = z.infer<typeof ConceptMasteryItemSchema>;

export const LearningGapItemSchema = z.object({
  id: z.string().uuid().optional(),
  studentId: z.string().uuid(),
  studentName: z.string().optional(),
  conceptId: z.string().uuid(),
  conceptNameEn: z.string().optional(),
  chapterId: z.string().uuid(),
  subjectId: z.string(),
  gradeId: z.string(),
  severity: GapSeveritySchema,
  masteryScore: z.number().min(0).max(100),
  confidenceLevel: EvidenceConfidenceSchema,
  evidenceCount: z.number().int().min(0),
  status: GapStatusSchema,
  recommendedAction: z.string().optional().nullable(),
  detectedAt: z.string().optional(),
  resolvedAt: z.string().optional().nullable(),
});
export type LearningGapItem = z.infer<typeof LearningGapItemSchema>;

export const QuestionObservedDifficultySchema = z.object({
  questionId: z.string().uuid(),
  attemptCount: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  incorrectCount: z.number().int().min(0),
  accuracyRate: z.number().min(0).max(100),
  declaredDifficulty: z.string(),
  observedDifficulty: ObservedDifficultyTierSchema,
  lastCalculatedAt: z.string().optional(),
});
export type QuestionObservedDifficulty = z.infer<typeof QuestionObservedDifficultySchema>;

// =============================================================================
// INTERVENTION SCHEMAS
// =============================================================================

export const InterventionItemSchema = z.object({
  id: z.string().uuid(),
  gapId: z.string().uuid().nullable().optional(),
  teacherId: z.string().uuid(),
  schoolId: z.string().uuid().nullable().optional(),
  conceptId: z.string().uuid(),
  conceptNameEn: z.string().optional(),
  chapterId: z.string().uuid().nullable().optional(),
  chapterTitleEn: z.string().optional(),
  classId: z.string().uuid().nullable().optional(),
  className: z.string().optional(),
  studentId: z.string().uuid().nullable().optional(),
  studentName: z.string().optional(),
  title: z.string().min(1),
  type: InterventionTypeSchema,
  resourceId: z.string().uuid().nullable().optional(),
  content: z.record(z.string(), z.unknown()),
  status: InterventionStatusSchema,
  assignmentId: z.string().uuid().nullable().optional(),
  reassessmentAssessmentId: z.string().uuid().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type InterventionItem = z.infer<typeof InterventionItemSchema>;

export const CreateInterventionInputSchema = z.object({
  gapId: z.string().uuid().optional(),
  conceptId: z.string().uuid(),
  chapterId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  title: z.string().min(3),
  type: InterventionTypeSchema.optional().default('REMEDIATION_PLAN'),
  resourceId: z.string().uuid().optional(),
  content: z.record(z.string(), z.unknown()),
  status: InterventionStatusSchema.optional().default('DRAFT'),
});
export type CreateInterventionInput = z.input<typeof CreateInterventionInputSchema>;

export const UpdateInterventionInputSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  status: InterventionStatusSchema.optional(),
});
export type UpdateInterventionInput = z.infer<typeof UpdateInterventionInputSchema>;

export const AssignInterventionInputSchema = z.object({
  classId: z.string().uuid(),
  studentId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  timeLimitMinutes: z.number().int().min(5).max(180).default(15),
});
export type AssignInterventionInput = z.infer<typeof AssignInterventionInputSchema>;

// =============================================================================
// DATA QUALITY SCHEMAS
// =============================================================================

export const DataQualityReportSchema = z.object({
  totalQuestions: z.number().int().min(0),
  unmappedQuestionsCount: z.number().int().min(0),
  questionsWithMissingChapter: z.number().int().min(0),
  orphanedAnswersCount: z.number().int().min(0),
  orphanedResultsCount: z.number().int().min(0),
  healthyQuestionsPercentage: z.number().min(0).max(100),
  scannedAt: z.string(),
});
export type DataQualityReport = z.infer<typeof DataQualityReportSchema>;

