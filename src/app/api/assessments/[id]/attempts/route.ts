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
    const assignmentId = body.assignment_id || null;

    const { attempt, isNew } = await assessmentsRepository.startAttempt(
      params.id,
      assignmentId,
      user.id,
      supabase
    );

    if (isNew) {
      await auditRepository.logAction(
        'START_ATTEMPT',
        'ASSESSMENT_ATTEMPT',
        attempt.id,
        {
          assessment_id: params.id,
          assignment_id: assignmentId,
          attempt_number: attempt.attempt_number,
        },
        user.id,
        request.headers.get('x-forwarded-for') || null,
        request.headers.get('user-agent') || null,
        supabase
      );
    }

    return NextResponse.json({ data: attempt, isNew }, { status: isNew ? 201 : 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
