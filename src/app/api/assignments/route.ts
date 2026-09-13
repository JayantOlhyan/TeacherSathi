import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assessmentsRepository } from '@/lib/repositories/assessments';
import { auditRepository } from '@/lib/repositories/audit';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');

    if (classId) {
      const assignments = await assessmentsRepository.getAssignmentsByClass(classId, supabase);
      return NextResponse.json({ data: assignments });
    }

    // Default to student assignments for the authenticated student or requested studentId
    const targetStudentId = studentId || user.id;
    const assignments = await assessmentsRepository.getStudentAssignments(targetStudentId, supabase);
    return NextResponse.json({ data: assignments });
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
    const assignment = await assessmentsRepository.assignAssessment(
      body,
      user.id,
      null,
      supabase
    );

    await auditRepository.logAction(
      'ASSIGN_ASSESSMENT',
      'ASSIGNMENT',
      assignment.id,
      {
        assessment_id: assignment.assessment_id,
        class_id: assignment.class_id,
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
