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

    const state = await classroomRepository.getAuthoritativeState(sessionId, supabase);
    return NextResponse.json({ data: state });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve authoritative state';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
