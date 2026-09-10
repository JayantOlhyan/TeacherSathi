import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';
import { auditRepository } from '@/lib/repositories/audit';
import { ClassroomEventType } from '@/lib/classroom/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = params.id;

    const body = await request.json();
    const { eventType, payload, deviceId, idempotencyKey } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 });
    }

    const event = await classroomRepository.recordEvent(
      sessionId,
      deviceId || null,
      user?.id || null,
      eventType as ClassroomEventType,
      payload || {},
      idempotencyKey || undefined,
      supabase
    );

    // Audit privileged classroom operations
    await auditRepository.logAction(
      eventType,
      'classroom_event',
      event.id,
      { sessionId, sequenceNumber: event.sequence_number, deviceId },
      user?.id,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      supabase
    );

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to record classroom event';
    const status = message.includes('ENDED') || message.includes('revoked') ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const sessionId = params.id;
    const { searchParams } = new URL(request.url);
    const since = parseInt(searchParams.get('since') || '0', 10);

    const events = await classroomRepository.getEventsSince(sessionId, since, supabase);
    return NextResponse.json({ data: events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
