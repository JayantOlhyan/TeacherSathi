import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { profilesRepository } from '@/lib/repositories/profiles';
import { auditRepository } from '@/lib/repositories/audit';
import { resolveCurriculumContext } from '@/lib/ai/pipeline/context';
import { executeGeneration, AIGenerationError } from '@/lib/ai/pipeline/generator';
import type { GenerationRequest, ProductType } from '@/lib/ai/types';

const GenerateRequestBodySchema = z.object({
  product_type: z.enum([
    'lesson-plan',
    'worksheet',
    'quiz',
    'test-paper',
    'presentation',
    'mind-map',
    'teaching-activity',
    'saathi-genie',
  ]),
  grade: z.string().optional(),
  grade_id: z.string().optional(),
  subject: z.string().optional(),
  subject_id: z.string().optional(),
  book_id: z.string().optional(),
  chapter: z.string().optional(),
  chapter_id: z.string().optional(),
  chapter_number: z.number().optional(),
  concept_id: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  language: z.enum(['en', 'hi', 'bilingual']).default('en'),
  teacher_instructions: z.string().max(1000).optional(),
  quantity: z.number().int().min(1).max(30).optional(),
  duration_mins: z.number().int().min(5).max(180).optional(),
  total_marks: z.number().int().min(5).max(100).optional(),
  slide_count: z.number().int().min(3).max(20).optional(),
  idempotency_key: z.string().max(128).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // 1. Authentication Check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to generate AI resources' },
        { status: 401 }
      );
    }

    // 2. Authorization / Role Check
    let profile = null;
    try {
      profile = await profilesRepository.getProfileById(user.id, supabase);
    } catch {
      // Allow if profiles query is not populated in mock/fallback
    }

    if (profile && profile.role === 'STUDENT') {
      return NextResponse.json(
        { error: 'Forbidden: Students are not authorized to generate teaching materials' },
        { status: 403 }
      );
    }

    // 3. Request Validation
    const rawBody = await request.json();
    const parseResult = GenerateRequestBodySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid generation request parameters',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const body = parseResult.data;

    // 4. Resolve Canonical Curriculum Context
    const curriculum = await resolveCurriculumContext(
      {
        grade: body.grade,
        grade_id: body.grade_id,
        subject: body.subject,
        subject_id: body.subject_id,
        book_id: body.book_id,
        chapter: body.chapter,
        chapter_id: body.chapter_id,
        chapter_number: body.chapter_number,
        concept_id: body.concept_id,
      },
      supabase
    );

    // 5. Construct Generation Request
    const genReq: GenerationRequest = {
      product_type: body.product_type as ProductType,
      curriculum,
      difficulty: body.difficulty,
      language: body.language,
      teacher_instructions: body.teacher_instructions,
      quantity: body.quantity,
      duration_mins: body.duration_mins,
      total_marks: body.total_marks,
      slide_count: body.slide_count,
      idempotency_key: body.idempotency_key,
    };

    // 6. Execute Generation Pipeline
    const schoolId = profile?.school_id || null;
    const result = await executeGeneration(genReq, user.id, schoolId, supabase);

    // 7. Audit Logging
    try {
      await auditRepository.logAction(
        'AI_GENERATE_RESOURCE',
        'RESOURCE',
        result.resource_id || result.telemetry.generation_id,
        {
          product_type: body.product_type,
          provider: result.telemetry.provider,
          latency_ms: result.telemetry.latency_ms,
        },
        user.id,
        request.headers.get('x-forwarded-for') || null,
        request.headers.get('user-agent') || null,
        supabase
      );
    } catch {
      // Non-blocking audit
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AIGenerationError) {
      const statusMap: Record<string, number> = {
        RATE_LIMITED: 429,
        QUOTA_EXCEEDED: 429,
        INVALID_REQUEST: 400,
        VALIDATION_FAILED: 422,
        CURRICULUM_NOT_FOUND: 404,
      };
      const status = statusMap[err.code] || 500;
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
          details: err.details,
        },
        { status }
      );
    }

    const message = err instanceof Error ? err.message : 'Internal generation engine error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
