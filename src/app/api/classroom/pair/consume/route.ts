import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classroomRepository } from '@/lib/repositories/classroom';
import { auditRepository } from '@/lib/repositories/audit';
import { hashPairingToken } from '@/lib/classroom/pairing';
import { ConsumePairingSchema } from '@/lib/classroom/schemas';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const validated = ConsumePairingSchema.parse(body);

    const tokenHash = hashPairingToken(validated.token);

    const { session, device } = await classroomRepository.consumePairingToken(
      validated.sessionId,
      tokenHash,
      {
        deviceType: validated.deviceType,
        deviceName: validated.deviceName,
        deviceFingerprint: validated.deviceFingerprint,
        role: validated.role,
        userId: user?.id || null,
      },
      supabase
    );

    await auditRepository.logAction(
      'DEVICE_PAIRED',
      'classroom_device',
      device.id,
      {
        sessionId: session.id,
        deviceType: device.device_type,
        deviceName: device.device_name,
      },
      user?.id,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      supabase
    );

    return NextResponse.json({
      success: true,
      data: {
        session,
        device,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Pairing failed';
    const status = message.includes('expired') || message.includes('Invalid') ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
