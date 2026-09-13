import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationsRepository } from '@/lib/repositories/notifications';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await notificationsRepository.markAsRead(params.id, user.id, supabase);

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark notification';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
