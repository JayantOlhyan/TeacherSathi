import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';
import {
  generatePairingToken,
  hashPairingToken,
  createPairingUrl,
  PAIRING_TOKEN_LIFETIME_MS,
} from '@/lib/classroom/pairing';

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
      return NextResponse.json({ error: 'Unauthorized: Only the assigned teacher can generate pairing credentials' }, { status: 403 });
    }

    if (session.status === 'ENDED') {
      return NextResponse.json({ error: 'Cannot generate pairing tokens for an ENDED session' }, { status: 400 });
    }

    const rawToken = generatePairingToken();
    const tokenHash = hashPairingToken(rawToken);
    const expiresAt = new Date(Date.now() + PAIRING_TOKEN_LIFETIME_MS).toISOString();

    await classroomRepository.createPairingToken(sessionId, tokenHash, expiresAt, supabase);

    const origin = request.headers.get('origin') || request.nextUrl.origin || 'http://localhost:3000';
    const pairingUrl = createPairingUrl(origin, rawToken, sessionId);

    return NextResponse.json({
      data: {
        token: rawToken,
        pairingUrl,
        expiresAt,
        expiresInSeconds: PAIRING_TOKEN_LIFETIME_MS / 1000,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate pairing token';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
