import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const deviceId = searchParams.get('deviceId');

    if (sessionId) {
      const session = await classroomRepository.getSessionById(sessionId, supabase);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ data: session });
    }

    if (deviceId) {
      const device = await classroomRepository.getDeviceById(deviceId, supabase);
      if (!device) {
        return NextResponse.json({ error: 'Device not found' }, { status: 404 });
      }
      return NextResponse.json({ data: device });
    }

    return NextResponse.json({ error: 'Missing sessionId or deviceId parameter' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await request.json();
    const { action } = body;

    // Action 1: Create new session
    if (action === 'CREATE_SESSION') {
      const { session } = body;
      const newSession = await classroomRepository.createSession({
        ...session,
        teacher_id: user ? user.id : undefined,
      }, supabase);
      return NextResponse.json({ data: newSession }, { status: 201 });
    }

    // Action 2: Approve / Update pairing status
    if (action === 'UPDATE_STATUS') {
      const { sessionId, status } = body;
      if (!sessionId || !status) {
        return NextResponse.json({ error: 'sessionId and status required' }, { status: 400 });
      }

      const updated = await classroomRepository.updateSessionStatus(sessionId, status, supabase);
      return NextResponse.json({ data: updated });
    }

    // Action 3: Record remote control action
    if (action === 'REMOTE_ACTION') {
      const { remoteAction } = body;
      const recorded = await classroomRepository.recordRemoteAction({
        ...remoteAction,
        actor_id: user ? user.id : undefined,
      }, supabase);
      return NextResponse.json({ data: recorded }, { status: 201 });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
