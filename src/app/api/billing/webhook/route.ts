import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { billingRepository } from '@/lib/repositories/billing';
import { getBillingProvider } from '@/lib/billing/providers';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    const provider = getBillingProvider();
    const webhook = await provider.handleWebhook(rawBody, signature);

    if (!webhook.valid) {
      return NextResponse.json({ error: webhook.error || 'Invalid signature' }, { status: 400 });
    }

    const eventId = webhook.eventId || `evt_${Date.now()}`;
    const eventType = webhook.eventType || 'unknown';
    const payload = webhook.payload || {};

    const supabase = createClient();

    // Idempotency Check: Don't re-process duplicate webhook events
    const alreadyProcessed = await billingRepository.isWebhookProcessed(eventId, supabase);
    if (alreadyProcessed) {
      return NextResponse.json({ status: 'already_processed', eventId });
    }

    // Process payment & subscription lifecycle events
    const eventEntity = (payload.payload as Record<string, unknown>) || payload;
    const paymentEntity = (eventEntity.payment as Record<string, unknown>)?.entity as Record<string, unknown> | undefined;
    const subscriptionEntity = (eventEntity.subscription as Record<string, unknown>)?.entity as Record<string, unknown> | undefined;

    const schoolId =
      (paymentEntity?.notes as Record<string, string>)?.school_id ||
      (subscriptionEntity?.notes as Record<string, string>)?.school_id;

    if (schoolId) {
      switch (eventType) {
        case 'payment.captured': {
          const paymentId = paymentEntity?.id as string | undefined;
          const orderId = paymentEntity?.order_id as string | undefined;
          const amount = (paymentEntity?.amount as number) || 0;

          await billingRepository.createPaymentRecord(
            {
              school_id: schoolId,
              provider: provider.name,
              provider_payment_id: paymentId || null,
              provider_order_id: orderId || null,
              amount,
              status: 'SUCCESS',
              metadata: { eventId, webhook: true },
            },
            supabase
          ).catch(() => {});

          await billingRepository.updateSubscription(
            schoolId,
            { status: 'ACTIVE' },
            'PAYMENT_SUCCEEDED',
            supabase
          ).catch(() => {});
          break;
        }

        case 'payment.failed': {
          const paymentId = paymentEntity?.id as string | undefined;
          const orderId = paymentEntity?.order_id as string | undefined;
          const amount = (paymentEntity?.amount as number) || 0;

          await billingRepository.createPaymentRecord(
            {
              school_id: schoolId,
              provider: provider.name,
              provider_payment_id: paymentId || null,
              provider_order_id: orderId || null,
              amount,
              status: 'FAILED',
              metadata: { eventId, error: paymentEntity?.error_description },
            },
            supabase
          ).catch(() => {});

          await billingRepository.updateSubscription(
            schoolId,
            { status: 'PAST_DUE' },
            'PAYMENT_FAILED',
            supabase
          ).catch(() => {});
          break;
        }

        case 'subscription.activated':
        case 'subscription.charged': {
          await billingRepository.updateSubscription(
            schoolId,
            { status: 'ACTIVE' },
            eventType === 'subscription.charged' ? 'SUBSCRIPTION_RENEWED' : 'SUBSCRIPTION_ACTIVATED',
            supabase
          ).catch(() => {});
          break;
        }

        case 'subscription.halted':
        case 'subscription.paused': {
          await billingRepository.updateSubscription(
            schoolId,
            { status: 'PAUSED' },
            'SUBSCRIPTION_PAUSED',
            supabase
          ).catch(() => {});
          break;
        }

        case 'subscription.cancelled': {
          await billingRepository.updateSubscription(
            schoolId,
            { status: 'CANCELLED' },
            'SUBSCRIPTION_CANCELLED',
            supabase
          ).catch(() => {});
          break;
        }
      }
    }

    // Mark webhook processed for idempotency
    await billingRepository.markWebhookProcessed(eventId, provider.name, eventType, supabase).catch(() => {});

    return NextResponse.json({ success: true, eventId, eventType });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
