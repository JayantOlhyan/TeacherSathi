import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationsRepository } from '@/lib/repositories/notifications';
import { CreateNotificationSchema } from '@/lib/validations/notifications';

export async function GET(req: NextRequest) {
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
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const result = await notificationsRepository.getNotificationsByUser(
      user.id,
      page,
      limit,
      unreadOnly,
      supabase
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    const validated = CreateNotificationSchema.parse(body);

    const notification = await notificationsRepository.createNotification(validated, supabase);

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create notification';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await notificationsRepository.markAllAsRead(user.id, supabase);

    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark notifications';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
