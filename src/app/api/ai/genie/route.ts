import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { resolveCurriculumContext } from '@/lib/ai/pipeline/context';
import { executeGeneration, AIGenerationError } from '@/lib/ai/pipeline/generator';
import type { GenerationRequest } from '@/lib/ai/types';
import type { SaathiGenieResponse } from '@/lib/ai/schemas';

const GenieRequestBodySchema = z.object({
  prompt: z.string().min(2).max(1000),
  grade: z.string().optional(),
  subject: z.string().optional(),
  chapter: z.string().optional(),
  chapter_id: z.string().optional(),
  language: z.enum(['en', 'hi', 'bilingual']).default('en'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // 1. Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // In local dev/offline testing, fallback to mock teacher user if no active session
    const userId = user?.id || 'offline-teacher-id';

    const rawBody = await request.json();
    const parseResult = GenieRequestBodySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid Genie query', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;

    // 2. Resolve Curriculum Context
    const curriculum = await resolveCurriculumContext(
      {
        grade: body.grade || 'Class 10',
        subject: body.subject || 'Science',
        chapter: body.chapter,
        chapter_id: body.chapter_id,
      },
      supabase
    );

    // 3. Construct Request
    const genReq: GenerationRequest = {
      product_type: 'saathi-genie',
      curriculum,
      language: body.language,
      teacher_instructions: body.prompt,
    };

    const result = await executeGeneration<SaathiGenieResponse>(genReq, userId, null, supabase);

    return NextResponse.json({
      success: true,
      answer: result.data.pedagogical_answer,
      actionable_steps: result.data.actionable_steps,
      curriculum_reference: result.data.curriculum_reference,
      quick_followups: result.data.quick_followups,
      telemetry: result.telemetry,
    });
  } catch (err: unknown) {
    if (err instanceof AIGenerationError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.code === 'RATE_LIMITED' ? 429 : 400 }
      );
    }
    const message = err instanceof Error ? err.message : 'Internal Genie error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
