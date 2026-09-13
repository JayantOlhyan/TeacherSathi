import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { MockBillingProvider } from '../../src/lib/billing/providers/mock';
import { RazorpayBillingProvider } from '../../src/lib/billing/providers/razorpay';

describe('Phase 5 SaaS Billing: Payment Provider Abstraction', () => {
  it('executes customer, order, and subscription operations with MockBillingProvider', async () => {
    const mock = new MockBillingProvider();

    const customer = await mock.createCustomer({
      name: 'Principal Sharma',
      email: 'principal@kvsdelhi.edu.in',
      schoolId: '123e4567-e89b-12d3-a456-426614174000',
    });
    expect(customer.customerId).toContain('cust_mock_');
    expect(customer.email).toBe('principal@kvsdelhi.edu.in');

    const order = await mock.createOrder({
      amount: 999900,
      currency: 'INR',
      receipt: 'rcpt_test_001',
    });
    expect(order.orderId).toContain('order_mock_');
    expect(order.amount).toBe(999900);
    expect(order.currency).toBe('INR');

    const sub = await mock.createSubscription({
      planId: 'plan-school-pro',
      customerId: customer.customerId,
    });
    expect(sub.subscriptionId).toContain('sub_mock_');
    expect(sub.status).toBe('active');
  });

  it('verifies signatures correctly in MockBillingProvider', async () => {
    const mock = new MockBillingProvider();

    const verified = await mock.verifyPayment({
      paymentId: 'pay_123',
      orderId: 'order_123',
      signature: 'valid_signature',
    });
    expect(verified.verified).toBe(true);

    const rejected = await mock.verifyPayment({
      paymentId: 'pay_123',
      orderId: 'order_123',
      signature: 'invalid_signature',
    });
    expect(rejected.verified).toBe(false);
  });

  it('verifies HMAC-SHA256 signatures with RazorpayBillingProvider using timingSafeEqual', async () => {
    const testKeyId = 'rzp_test_key_123';
    const testSecret = 'secret_key_abcdef_98765';
    const razorpay = new RazorpayBillingProvider(testKeyId, testSecret);

    const orderId = 'order_DA1234567890';
    const paymentId = 'pay_DB9876543210';

    // Generate valid HMAC-SHA256 signature
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac('sha256', testSecret)
      .update(payload)
      .digest('hex');

    const result = await razorpay.verifyPayment({
      paymentId,
      orderId,
      signature: validSignature,
    });
    expect(result.verified).toBe(true);
    expect(result.error).toBeUndefined();

    // Invalidate signature by 1 character
    const invalidSignature = validSignature.slice(0, -1) + (validSignature.slice(-1) === 'a' ? 'b' : 'a');
    const failResult = await razorpay.verifyPayment({
      paymentId,
      orderId,
      signature: invalidSignature,
    });
    expect(failResult.verified).toBe(false);
    expect(failResult.error).toBe('Invalid signature verification.');
  });

  it('fails closed in production environment when credentials are missing', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
      expect(() => new RazorpayBillingProvider('', '')).toThrow(
        'Razorpay credentials missing in production environment. Failing closed.'
      );
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
    }
  });
});
