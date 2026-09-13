import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assessmentsRepository } from '@/lib/repositories/assessments';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if batch save or single answer save
    if (Array.isArray(body.answers)) {
      await assessmentsRepository.batchSaveAnswers(params.id, body, user.id, supabase);
      return NextResponse.json({ success: true });
    }

    const saved = await assessmentsRepository.saveAnswer(params.id, body, user.id, supabase);
    return NextResponse.json({ data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
