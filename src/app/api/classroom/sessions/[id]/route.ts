import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const sessionId = params.id;

    const session = await classroomRepository.getSessionById(sessionId, supabase);
    if (!session) {
      return NextResponse.json({ error: 'Classroom session not found' }, { status: 404 });
    }

    return NextResponse.json({ data: session });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
