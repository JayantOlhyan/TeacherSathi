import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';
import { getBillingProvider } from '@/lib/billing/providers';
import { CheckoutSessionRequestSchema } from '@/lib/validations/billing';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validated = CheckoutSessionRequestSchema.parse(json);

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
          { error: 'Forbidden: You are not authorized to manage billing for this school.' },
          { status: 403 }
        );
      }
    }

    const plan = await billingRepository.getPlanBySlug(validated.planSlug, supabase);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    if (plan.price === 0) {
      // Free plan requires no payment; activate immediately
      const sub = await billingRepository.createSubscription(
        {
          school_id: validated.schoolId,
          plan_id: plan.id,
          provider: 'MOCK',
          status: 'ACTIVE',
          billing_interval: 'MONTHLY',
        },
        supabase
      );

      return NextResponse.json({
        data: {
          freePlan: true,
          subscription: sub,
        },
      });
    }

    const provider = getBillingProvider();
    const receipt = `rcpt_${validated.schoolId.slice(0, 8)}_${Date.now()}`;

    const order = await provider.createOrder({
      amount: plan.price,
      currency: plan.currency || 'INR',
      receipt,
      notes: {
        school_id: validated.schoolId,
        plan_id: plan.id,
        plan_slug: plan.slug,
        user_id: user.id,
      },
    });

    // Record pending payment
    await billingRepository.createPaymentRecord(
      {
        school_id: validated.schoolId,
        provider: provider.name,
        provider_order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        status: 'PENDING',
        metadata: {
          receipt,
          plan_slug: plan.slug,
          billing_interval: validated.billingInterval,
        },
      },
      supabase
    );

    return NextResponse.json({
      data: {
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_public_key',
        plan: {
          id: plan.id,
          name: plan.name,
          slug: plan.slug,
          price: plan.price,
          currency: plan.currency,
        },
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
