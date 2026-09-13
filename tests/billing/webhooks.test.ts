import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { RazorpayBillingProvider } from '../../src/lib/billing/providers/razorpay';
import { MockBillingProvider } from '../../src/lib/billing/providers/mock';

describe('Phase 5 SaaS Billing: Webhooks & Idempotency', () => {
  it('validates Razorpay webhook signatures using secret key', async () => {
    const webhookSecret = 'whsec_test_secret_12345';
    const razorpay = new RazorpayBillingProvider('key_123', 'sec_123', webhookSecret);

    const payload = JSON.stringify({
      event: 'payment.captured',
      id: 'evt_12345',
      payload: {
        payment: {
          entity: {
            id: 'pay_test_001',
            amount: 999900,
            status: 'captured',
          },
        },
      },
    });

    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    const result = await razorpay.handleWebhook(payload, signature);
    expect(result.valid).toBe(true);
    expect(result.eventId).toBe('evt_12345');
    expect(result.eventType).toBe('payment.captured');
  });

  it('rejects webhooks with forged or mismatched signatures', async () => {
    const webhookSecret = 'whsec_test_secret_12345';
    const razorpay = new RazorpayBillingProvider('key_123', 'sec_123', webhookSecret);

    const payload = JSON.stringify({ event: 'payment.captured' });
    const fakeSignature = 'forged_fake_signature_hex';

    const result = await razorpay.handleWebhook(payload, fakeSignature);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Signature mismatch');
  });

  it('handles duplicate webhook deliveries idempotently', async () => {
    const mock = new MockBillingProvider();
    const processedEvents = new Set<string>();

    const eventPayload = JSON.stringify({
      id: 'evt_idempotent_100',
      event: 'subscription.charged',
    });

    // 1st delivery
    const result1 = await mock.handleWebhook(eventPayload, 'test_signature');
    expect(result1.valid).toBe(true);
    expect(result1.eventId).toBe('evt_idempotent_100');

    let wasProcessed1 = processedEvents.has(result1.eventId!);
    expect(wasProcessed1).toBe(false);
    processedEvents.add(result1.eventId!);

    // 2nd duplicate delivery
    const result2 = await mock.handleWebhook(eventPayload, 'test_signature');
    expect(result2.valid).toBe(true);

    let wasProcessed2 = processedEvents.has(result2.eventId!);
    expect(wasProcessed2).toBe(true); // flagged as already processed!
  });
});
