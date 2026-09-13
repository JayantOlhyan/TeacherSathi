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

    const body = await request.json();
    const assignmentPayload = {
      ...body,
      assessment_id: params.id,
    };

    const assignment = await assessmentsRepository.assignAssessment(
      assignmentPayload,
      user.id,
      null,
      supabase
    );

    await auditRepository.logAction(
      'ASSIGN_ASSESSMENT',
      'ASSIGNMENT',
      assignment.id,
      {
        assessment_id: params.id,
        class_id: assignment.class_id,
        due_at: assignment.due_at,
      },
      user.id,
      request.headers.get('x-forwarded-for') || null,
      request.headers.get('user-agent') || null,
      supabase
    );

    return NextResponse.json({ data: assignment }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
