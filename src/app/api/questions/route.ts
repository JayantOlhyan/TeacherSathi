import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { questionsRepository } from '@/lib/repositories/questions';
import { auditRepository } from '@/lib/repositories/audit';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    const questionId = searchParams.get('id');
    const sectionTier = searchParams.get('sectionTier') as 'SECTION_A' | 'SECTION_B' | 'SECTION_C' | null;

    if (questionId) {
      const question = await questionsRepository.getQuestionById(questionId, supabase);
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ data: question });
    }

    if (chapterId) {
      const questions = await questionsRepository.getQuestionsByChapter(chapterId, sectionTier || undefined, supabase);
      return NextResponse.json({ data: questions });
    }

    return NextResponse.json({ error: 'Missing chapterId or id parameter' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newQuestion = await questionsRepository.createQuestion(body, supabase);

    await auditRepository.logAction(
      'CREATE_QUESTION',
      'QUESTION',
      newQuestion.id,
      { chapter_id: newQuestion.chapter_id, marks: newQuestion.marks },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: newQuestion }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, change_summary, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    const updated = await questionsRepository.updateQuestion(
      id,
      updates,
      user.id,
      change_summary || 'Question edited via API',
      supabase
    );

    await auditRepository.logAction(
      'UPDATE_QUESTION',
      'QUESTION',
      id,
      { change_summary: change_summary || 'Question updated' },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
