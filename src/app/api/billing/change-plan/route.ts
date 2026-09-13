import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';
import { PlanChangeRequestSchema } from '@/lib/validations/billing';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validated = PlanChangeRequestSchema.parse(json);

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
          { error: 'Forbidden: You are not authorized to change plan for this school.' },
          { status: 403 }
        );
      }
    }

    const targetPlan = await billingRepository.getPlanBySlug(validated.targetPlanSlug, supabase);
    if (!targetPlan) {
      return NextResponse.json({ error: 'Target plan not found' }, { status: 404 });
    }

    const currentSub = await billingRepository.getSubscriptionBySchoolId(validated.schoolId, supabase);

    // If downgrading to free, schedule at period end unless immediate is specified
    const isDowngrade = targetPlan.price < (currentSub.plan?.price || 0);

    if (isDowngrade && !validated.immediate) {
      const updated = await billingRepository.updateSubscription(
        validated.schoolId,
        {
          cancel_at_period_end: true,
        },
        'PLAN_CHANGED',
        supabase
      );

      return NextResponse.json({
        data: {
          subscription: updated,
          effectiveDate: currentSub.current_period_end,
          message: `Downgrade to ${targetPlan.name} scheduled for ${new Date(currentSub.current_period_end).toLocaleDateString()}.`,
        },
      });
    }

    // Immediate change / upgrade
    const updated = await billingRepository.updateSubscription(
      validated.schoolId,
      {
        plan_id: targetPlan.id,
        billing_interval: targetPlan.billing_interval,
        cancel_at_period_end: false,
      },
      'PLAN_CHANGED',
      supabase
    );

    return NextResponse.json({
      data: {
        subscription: updated,
        effectiveDate: new Date().toISOString(),
        message: `Plan changed to ${targetPlan.name} successfully.`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
