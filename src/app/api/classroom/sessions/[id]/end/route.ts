import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';
import { auditRepository } from '@/lib/repositories/audit';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = params.id;

    const session = await classroomRepository.getSessionById(sessionId, supabase);
    if (!session) {
      return NextResponse.json({ error: 'Classroom session not found' }, { status: 404 });
    }

    if (session.teacher_id && user && session.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized: You are not the assigned teacher for this session' }, { status: 403 });
    }

    if (session.status === 'ENDED') {
      return NextResponse.json({ data: session, message: 'Session is already ended' });
    }

    // Transition session to ENDED (disconnects devices, sets ended_at)
    const updated = await classroomRepository.updateSessionStatus(sessionId, 'ENDED', supabase);

    // Record SESSION_ENDED event
    await classroomRepository.recordEvent(
      sessionId,
      null,
      user?.id || null,
      'SESSION_ENDED',
      { endedAt: updated.ended_at },
      undefined,
      supabase
    );

    // Audit log
    await auditRepository.logAction(
      'SESSION_ENDED',
      'classroom_session',
      sessionId,
      { endedAt: updated.ended_at },
      user?.id,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      supabase
    );

    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to end session';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
