import crypto from 'crypto';
import type {
  BillingProvider,
  CreateCustomerParams,
  CustomerResult,
  CreateOrderParams,
  OrderResult,
  CreateSubscriptionParams,
  SubscriptionResult,
  VerifyPaymentParams,
  VerificationResult,
  WebhookResult,
} from './types';

export class MockBillingProvider implements BillingProvider {
  name = 'MOCK';
  private mockSecret = 'mock_webhook_secret_key_12345';

  async createCustomer(params: CreateCustomerParams): Promise<CustomerResult> {
    return {
      customerId: `cust_mock_${Buffer.from(params.email).toString('hex').slice(0, 10)}`,
      email: params.email,
    };
  }

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    return {
      orderId: `order_mock_${Date.now()}`,
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt,
    };
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      subscriptionId: `sub_mock_${Date.now()}`,
      status: 'active',
      planId: params.planId,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerificationResult> {
    // In mock mode, if signature is "invalid_signature", fail verification for testing
    if (params.signature === 'invalid_signature') {
      return {
        verified: false,
        paymentId: params.paymentId,
        orderId: params.orderId,
        subscriptionId: params.subscriptionId,
        error: 'Invalid signature.',
      };
    }

    return {
      verified: true,
      paymentId: params.paymentId,
      orderId: params.orderId,
      subscriptionId: params.subscriptionId,
    };
  }

  async cancelSubscription(providerSubId: string, atPeriodEnd: boolean): Promise<SubscriptionResult> {
    void atPeriodEnd;
    return {
      subscriptionId: providerSubId,
      status: 'cancelled',
    };
  }

  async changeSubscription(providerSubId: string, newPlanId: string): Promise<SubscriptionResult> {
    return {
      subscriptionId: providerSubId,
      status: 'active',
      planId: newPlanId,
    };
  }

  async fetchSubscription(providerSubId: string): Promise<SubscriptionResult> {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      subscriptionId: providerSubId,
      status: 'active',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
    };
  }

  async handleWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
    // If signature is invalid, reject
    if (signature === 'invalid_signature') {
      return { valid: false, error: 'Signature mismatch' };
    }

    // If signature is HMAC checked using mockSecret
    if (signature !== 'test_signature') {
      try {
        const expected = crypto
          .createHmac('sha256', this.mockSecret)
          .update(rawBody)
          .digest('hex');

        if (signature !== expected) {
          return { valid: false, error: 'Signature mismatch' };
        }
      } catch {
        return { valid: false, error: 'HMAC verification failed' };
      }
    }

    try {
      const payload = JSON.parse(rawBody);
      return {
        valid: true,
        eventId: payload.event_id || payload.id || `evt_${Date.now()}`,
        eventType: payload.event || 'payment.captured',
        payload,
      };
    } catch {
      return { valid: false, error: 'Malformed JSON payload' };
    }
  }
}
