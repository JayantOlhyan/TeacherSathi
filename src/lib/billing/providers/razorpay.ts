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

export class RazorpayBillingProvider implements BillingProvider {
  name = 'RAZORPAY';
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;
  private baseUrl = 'https://api.razorpay.com/v1';

  constructor(keyId?: string, keySecret?: string, webhookSecret?: string) {
    this.keyId = keyId || process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || '';
    this.webhookSecret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (process.env.NODE_ENV === 'production' && (!this.keyId || !this.keySecret)) {
      throw new Error('Razorpay credentials missing in production environment. Failing closed.');
    }
  }

  private getAuthHeader(): string {
    const token = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    return `Basic ${token}`;
  }

  async createCustomer(params: CreateCustomerParams): Promise<CustomerResult> {
    const res = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        contact: params.phone,
        notes: { school_id: params.schoolId },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay createCustomer failed: ${err}`);
    }

    const data = await res.json();
    return {
      customerId: data.id,
      email: data.email,
    };
  }

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay createOrder failed: ${err}`);
    }

    const data = await res.json();
    return {
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
    };
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult> {
    const res = await fetch(`${this.baseUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: params.planId,
        customer_id: params.customerId,
        total_count: params.totalCount || 12,
        notes: params.notes,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay createSubscription failed: ${err}`);
    }

    const data = await res.json();
    return {
      subscriptionId: data.id,
      status: data.status,
      planId: data.plan_id,
      currentPeriodStart: data.current_start ? new Date(data.current_start * 1000).toISOString() : undefined,
      currentPeriodEnd: data.current_end ? new Date(data.current_end * 1000).toISOString() : undefined,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerificationResult> {
    const { paymentId, orderId, subscriptionId, signature } = params;

    let payload = '';
    if (orderId) {
      payload = `${orderId}|${paymentId}`;
    } else if (subscriptionId) {
      payload = `${paymentId}|${subscriptionId}`;
    } else {
      return {
        verified: false,
        paymentId,
        error: 'Either orderId or subscriptionId is required for signature verification.',
      };
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length) {
      return {
        verified: false,
        paymentId,
        orderId,
        subscriptionId,
        error: 'Invalid signature verification.',
      };
    }

    const verified = crypto.timingSafeEqual(sigBuf, expectedBuf);

    return {
      verified,
      paymentId,
      orderId,
      subscriptionId,
      error: verified ? undefined : 'Invalid signature verification.',
    };
  }

  async cancelSubscription(providerSubId: string, atPeriodEnd: boolean): Promise<SubscriptionResult> {
    const res = await fetch(`${this.baseUrl}/subscriptions/${providerSubId}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_at_cycle_end: atPeriodEnd ? 1 : 0,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay cancelSubscription failed: ${err}`);
    }

    const data = await res.json();
    return {
      subscriptionId: data.id,
      status: data.status,
    };
  }

  async changeSubscription(providerSubId: string, newPlanId: string): Promise<SubscriptionResult> {
    const res = await fetch(`${this.baseUrl}/subscriptions/${providerSubId}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: newPlanId,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay changeSubscription failed: ${err}`);
    }

    const data = await res.json();
    return {
      subscriptionId: data.id,
      status: data.status,
      planId: data.plan_id,
    };
  }

  async fetchSubscription(providerSubId: string): Promise<SubscriptionResult> {
    const res = await fetch(`${this.baseUrl}/subscriptions/${providerSubId}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay fetchSubscription failed: ${err}`);
    }

    const data = await res.json();
    return {
      subscriptionId: data.id,
      status: data.status,
      planId: data.plan_id,
      currentPeriodStart: data.current_start ? new Date(data.current_start * 1000).toISOString() : undefined,
      currentPeriodEnd: data.current_end ? new Date(data.current_end * 1000).toISOString() : undefined,
    };
  }

  async handleWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
    if (!this.webhookSecret) {
      return {
        valid: false,
        error: 'Webhook secret is not configured.',
      };
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');

      const sigBuf = Buffer.from(signature);
      const expectedBuf = Buffer.from(expectedSignature);

      if (sigBuf.length !== expectedBuf.length) {
        return { valid: false, error: 'Signature mismatch' };
      }

      const isValid = crypto.timingSafeEqual(sigBuf, expectedBuf);

      if (!isValid) {
        return { valid: false, error: 'Signature mismatch' };
      }

      const payload = JSON.parse(rawBody);
      return {
        valid: true,
        eventId: payload.event_id || payload.id,
        eventType: payload.event,
        payload,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { valid: false, error: msg };
    }
  }
}
