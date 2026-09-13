import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationsRepository } from '@/lib/repositories/notifications';
import { RegisterDeviceSchema } from '@/lib/validations/notifications';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = RegisterDeviceSchema.parse(body);

    await notificationsRepository.registerDevice(user.id, validated, supabase);

    return NextResponse.json({ success: true, message: 'Device registered successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to register device';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    await notificationsRepository.unregisterDevice(deviceId, user.id, supabase);

    return NextResponse.json({ success: true, message: 'Device unregistered successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to unregister device';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
