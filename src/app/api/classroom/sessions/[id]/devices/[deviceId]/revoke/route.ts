import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';
import { auditRepository } from '@/lib/repositories/audit';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; deviceId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { id: sessionId, deviceId } = params;

    const session = await classroomRepository.getSessionById(sessionId, supabase);
    if (!session) {
      return NextResponse.json({ error: 'Classroom session not found' }, { status: 404 });
    }

    if (session.teacher_id && user && session.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized: Only the session teacher can revoke devices' }, { status: 403 });
    }

    const device = await classroomRepository.revokeDevice(sessionId, deviceId, user?.id, supabase);

    await auditRepository.logAction(
      'DEVICE_REVOKED',
      'classroom_device',
      deviceId,
      { sessionId },
      user?.id,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      supabase
    );

    return NextResponse.json({ data: device, message: 'Device successfully revoked' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to revoke device';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
