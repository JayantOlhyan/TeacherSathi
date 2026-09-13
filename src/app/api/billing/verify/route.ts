import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';
import { getBillingProvider } from '@/lib/billing/providers';
import { PaymentVerificationRequestSchema } from '@/lib/validations/billing';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const validated = PaymentVerificationRequestSchema.parse(json);

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
          { error: 'Forbidden: You are not authorized to verify billing for this school.' },
          { status: 403 }
        );
      }
    }

    const plan = await billingRepository.getPlanBySlug(validated.planSlug, supabase);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const provider = getBillingProvider();
    const verification = await provider.verifyPayment({
      paymentId: validated.razorpay_payment_id,
      orderId: validated.razorpay_order_id,
      signature: validated.razorpay_signature,
    });

    if (!verification.verified) {
      // Record failed payment attempt
      await billingRepository.createPaymentRecord(
        {
          school_id: validated.schoolId,
          provider: provider.name,
          provider_payment_id: validated.razorpay_payment_id,
          provider_order_id: validated.razorpay_order_id || null,
          amount: plan.price,
          currency: plan.currency || 'INR',
          status: 'FAILED',
          metadata: { error: verification.error || 'Signature verification failed' },
        },
        supabase
      ).catch(() => {});

      return NextResponse.json(
        { error: verification.error || 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Success: activate subscription
    const sub = await billingRepository.createSubscription(
      {
        school_id: validated.schoolId,
        plan_id: plan.id,
        provider: provider.name,
        provider_subscription_id: validated.razorpay_order_id || validated.razorpay_payment_id,
        status: 'ACTIVE',
        billing_interval: plan.billing_interval,
      },
      supabase
    );

    // Record verified payment record
    await billingRepository.createPaymentRecord(
      {
        school_id: validated.schoolId,
        subscription_id: sub.id,
        provider: provider.name,
        provider_payment_id: validated.razorpay_payment_id,
        provider_order_id: validated.razorpay_order_id || null,
        amount: plan.price,
        currency: plan.currency || 'INR',
        status: 'SUCCESS',
        metadata: { verified: true, plan_slug: plan.slug },
      },
      supabase
    );

    return NextResponse.json({
      data: {
        success: true,
        subscription: sub,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
