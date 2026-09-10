import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultClient } from '../../supabase/client';
import { getAIProvider } from '../providers';
import {
  LessonPlanSchema,
  WorksheetSchema,
  QuizSchema,
  TestPaperSchema,
  PresentationSchema,
  MindMapSchema,
  TeachingActivitySchema,
  SaathiGenieResponseSchema,
} from '../schemas';
import {
  validateLessonPlan,
  validateWorksheet,
  validateQuiz,
  validateTestPaper,
  validatePresentation,
  validateMindMap,
  containsDevanagari,
  type ValidationIssue,
} from '../validators/educational';
import { buildPromptForProduct } from './prompts';
import { rateLimiter } from './rateLimiter';
import type { GenerationRequest, ProductType, TokenUsage } from '../types';

export interface GenerationEngineResult<T = unknown> {
  success: boolean;
  resource_id?: string;
  data: T;
  telemetry: {
    generation_id: string;
    provider: string;
    model: string;
    latency_ms: number;
    token_usage: TokenUsage;
    attempts: number;
  };
}

export class AIGenerationError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AIGenerationError';
    this.code = code;
    this.details = details;
  }
}

export function validateSchema(productType: ProductType, data: unknown): unknown {
  switch (productType) {
    case 'lesson-plan':
      return LessonPlanSchema.parse(data);
    case 'worksheet':
      return WorksheetSchema.parse(data);
    case 'quiz':
      return QuizSchema.parse(data);
    case 'test-paper':
      return TestPaperSchema.parse(data);
    case 'presentation':
      return PresentationSchema.parse(data);
    case 'mind-map':
      return MindMapSchema.parse(data);
    case 'teaching-activity':
      return TeachingActivitySchema.parse(data);
    case 'saathi-genie':
      return SaathiGenieResponseSchema.parse(data);
    default:
      throw new AIGenerationError('INVALID_REQUEST', `Unknown product type: ${productType}`);
  }
}

import type {
  LessonPlan,
  Worksheet,
  Quiz,
  TestPaper,
  Presentation,
  MindMap,
} from '../schemas';

export function validateEducational(productType: ProductType, data: unknown, language?: string): void {
  let report = { is_valid: true, issues: [] as ValidationIssue[] };

  switch (productType) {
    case 'lesson-plan':
      report = validateLessonPlan(data as LessonPlan);
      break;
    case 'worksheet':
      report = validateWorksheet(data as Worksheet);
      break;
    case 'quiz':
      report = validateQuiz(data as Quiz);
      break;
    case 'test-paper':
      report = validateTestPaper(data as TestPaper);
      break;
    case 'presentation':
      report = validatePresentation(data as Presentation);
      break;
    case 'mind-map':
      report = validateMindMap(data as MindMap);
      break;
  }

  if (!report.is_valid) {
    const criticalMsgs = report.issues.filter((i) => i.critical).map((i) => i.message);
    throw new AIGenerationError(
      'VALIDATION_FAILED',
      `Educational validation failed: ${criticalMsgs.join('; ')}`,
      report.issues
    );
  }

  // Devanagari validation for Hindi language
  if (language === 'hi') {
    const serialized = JSON.stringify(data);
    if (!containsDevanagari(serialized)) {
      throw new AIGenerationError(
        'VALIDATION_FAILED',
        'Hindi language mode requested but output contains no Devanagari script.'
      );
    }
  }
}

function mapProductToResourceType(
  productType: ProductType
): 'LESSON_PLAN' | 'WORKSHEET' | 'PRESENTATION' | 'MIND_MAP' | 'DOCUMENT' {
  switch (productType) {
    case 'lesson-plan':
      return 'LESSON_PLAN';
    case 'worksheet':
      return 'WORKSHEET';
    case 'presentation':
      return 'PRESENTATION';
    case 'mind-map':
      return 'MIND_MAP';
    default:
      return 'DOCUMENT';
  }
}

export async function executeGeneration<T = unknown>(
  req: GenerationRequest,
  userId: string,
  schoolId?: string | null,
  client: SupabaseClient = defaultClient
): Promise<GenerationEngineResult<T>> {
  // 1. Rate Limiting Check
  const rateLimitKey = `rate-limit:${userId}`;
  const rateCheck = rateLimiter.checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    throw new AIGenerationError(
      'RATE_LIMITED',
      `Too many requests. Please wait ${Math.ceil((rateCheck.retryAfterMs || 1000) / 1000)} seconds before retrying.`
    );
  }

  // 2. Quota Check
  const quotaCheck = await rateLimiter.checkMonthlyQuota(userId, client);
  if (!quotaCheck.allowed) {
    throw new AIGenerationError(
      'QUOTA_EXCEEDED',
      `Monthly AI generation limit reached (${quotaCheck.currentUsage}/${quotaCheck.quota}).`
    );
  }

  // 3. Idempotency Check
  if (req.idempotency_key) {
    const cached = rateLimiter.checkIdempotency(req.idempotency_key);
    if (cached) {
      return cached as GenerationEngineResult<T>;
    }
  }

  const provider = getAIProvider();
  const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const startTime = Date.now();

  // 4. Record Pending Telemetry
  try {
    await client.from('ai_generations').insert([
      {
        id: generationId,
        user_id: userId,
        school_id: schoolId || null,
        product_type: req.product_type,
        provider: provider.name,
        model: provider.model,
        status: 'GENERATING',
        input_context: {
          grade: req.curriculum.grade_name,
          subject: req.curriculum.subject_name_en,
          chapter_id: req.curriculum.chapter_id,
          difficulty: req.difficulty,
          language: req.language,
        },
        started_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // Non-blocking telemetry
  }

  // 5. Prompt Construction
  const { systemPrompt, userPrompt } = buildPromptForProduct(req);

  let validatedData: T | null = null;
  let tokenUsage: TokenUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  let currentPrompt = userPrompt;
  const maxRetries = 2; // Up to 3 attempts total
  let attempt = 0;
  let lastError: Error | AIGenerationError | null = null;

  // 6. Generation & Validation Loop
  for (attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await provider.generateStructured<unknown>(currentPrompt, systemPrompt, 30000);
      tokenUsage = result.token_usage;

      // Schema Validation
      const parsed = validateSchema(req.product_type, result.data);

      // Educational Validation
      validateEducational(req.product_type, parsed, req.language);

      validatedData = parsed as T;
      break; // Validation succeeded!
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt <= maxRetries) {
        // Augment prompt with repair instruction for next attempt
        currentPrompt = `${userPrompt}\n\nATTENTION: The previous response had validation errors:\n${lastError.message}\nPlease correct the schema and return strictly valid JSON.`;
      }
    }
  }

  // If all attempts failed
  if (!validatedData) {
    const errorMsg = lastError?.message || 'AI generation failed schema or educational validation';

    try {
      await client
        .from('ai_generations')
        .update({
          status: 'FAILED',
          error_message: errorMsg,
          latency_ms: Date.now() - startTime,
          completed_at: new Date().toISOString(),
        })
        .eq('id', generationId);
    } catch {
      // ignore
    }

    const errorCode = lastError instanceof AIGenerationError ? lastError.code : 'VALIDATION_FAILED';
    const errorDetails = lastError instanceof AIGenerationError ? lastError.details : undefined;

    throw new AIGenerationError(
      errorCode,
      `Generation failed after ${attempt - 1} attempts: ${errorMsg}`,
      errorDetails
    );
  }

  const totalLatencyMs = Date.now() - startTime;

  // 7. Persist to Resource Table (except for ephemeral Saathi Genie chats)
  let resourceId: string | undefined = undefined;

  if (req.product_type !== 'saathi-genie') {
    try {
      const resourceType = mapProductToResourceType(req.product_type);
      const title = (validatedData as Record<string, unknown>).title as string || `${req.curriculum.chapter_title_en} ${req.product_type}`;

      const { data: resourceData, error: rErr } = await client
        .from('resources')
        .insert([
          {
            school_id: schoolId || null,
            owner_id: userId,
            chapter_id: req.curriculum.chapter_id.startsWith('ch-') ? null : req.curriculum.chapter_id,
            resource_type: resourceType,
            title,
            description: `Generated by TeacherSathi AI (${provider.name} ${provider.model}) for ${req.curriculum.grade_name} ${req.curriculum.subject_name_en}`,
            status: 'READY',
            metadata: {
              ...(validatedData as Record<string, unknown>),
              generation_id: generationId,
              difficulty: req.difficulty,
              language: req.language,
            },
            is_archived: false,
          },
        ])
        .select('id')
        .single();

      if (!rErr && resourceData) {
        resourceId = resourceData.id;
      }
    } catch (err) {
      console.warn('[AIGenerationEngine] Resource persistence fallback:', err);
    }
  }

  // 8. Update Telemetry Record
  try {
    await client
      .from('ai_generations')
      .update({
        status: 'COMPLETED',
        resource_id: resourceId || null,
        output_payload: validatedData as Record<string, unknown>,
        token_usage: tokenUsage,
        latency_ms: totalLatencyMs,
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId);
  } catch {
    // ignore
  }

  // 9. Record Usage Quota
  await rateLimiter.recordUsage(userId, schoolId, client);

  const finalResult: GenerationEngineResult<T> = {
    success: true,
    resource_id: resourceId,
    data: validatedData,
    telemetry: {
      generation_id: generationId,
      provider: provider.name,
      model: provider.model,
      latency_ms: totalLatencyMs,
      token_usage: tokenUsage,
      attempts: attempt,
    },
  };

  // 10. Cache Idempotency
  if (req.idempotency_key) {
    rateLimiter.saveIdempotency(req.idempotency_key, finalResult);
  }

  return finalResult;
}
