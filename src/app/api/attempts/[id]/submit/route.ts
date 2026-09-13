import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assessmentsRepository } from '@/lib/repositories/assessments';
import { auditRepository } from '@/lib/repositories/audit';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const timeTakenSeconds = Number(body.time_taken_seconds) || 0;

    const result = await assessmentsRepository.submitAttempt(
      params.id,
      user.id,
      timeTakenSeconds,
      supabase
    );

    await auditRepository.logAction(
      'SUBMIT_ATTEMPT',
      'ASSESSMENT_ATTEMPT',
      params.id,
      {
        score: result.marks_obtained,
        total_marks: result.total_marks,
        percentage: result.percentage,
        is_passed: result.is_passed,
      },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
