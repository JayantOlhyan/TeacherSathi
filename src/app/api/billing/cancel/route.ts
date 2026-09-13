import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';
import { CancelSubscriptionRequestSchema } from '@/lib/validations/billing';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validated = CancelSubscriptionRequestSchema.parse(json);

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, school_id')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'SUPER_ADMIN') {
      if (profile.role !== 'SCHOOL_ADMIN' || profile.school_id !== validated.schoolId) {
        return NextResponse.json(
          { error: 'Forbidden: You are not authorized to cancel subscription for this school.' },
          { status: 403 }
        );
      }
    }

    const now = new Date();
    const updated = await billingRepository.updateSubscription(
      validated.schoolId,
      {
        cancel_at_period_end: true,
        cancelled_at: now.toISOString(),
      },
      'SUBSCRIPTION_CANCELLED',
      supabase
    );

    return NextResponse.json({
      data: {
        subscription: updated,
        activeUntil: updated.current_period_end,
        message: `Subscription cancellation scheduled. Your features will remain active until ${new Date(updated.current_period_end).toLocaleDateString()}.`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
