# TeacherSathi — Billing Provider Abstraction & Gateway Integration

> **Status**: Production Reference Architecture (Phase 5)  
> **Target Audience**: Backend Developers, DevOps Engineers, Security Auditors

---

## 1. Provider Abstraction Interface

To prevent vendor lock-in and enable deterministic offline unit testing, payment processing is abstracted behind the `BillingProvider` TypeScript interface in `src/lib/billing/providers/types.ts`:

```typescript
export interface BillingProvider {
  name: string;
  createCustomer(params: CreateCustomerParams): Promise<CustomerResult>;
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerificationResult>;
  cancelSubscription(providerSubId: string, atPeriodEnd: boolean): Promise<SubscriptionResult>;
  changeSubscription(providerSubId: string, newPlanId: string): Promise<SubscriptionResult>;
  fetchSubscription(providerSubId: string): Promise<SubscriptionResult>;
  handleWebhook(rawBody: string, signature: string): Promise<WebhookResult>;
}
```

---

## 2. Razorpay Production Provider (`RazorpayBillingProvider`)

Location: `src/lib/billing/providers/razorpay.ts`

### 2.1 Native HTTP Integration
Rather than depending on heavy, outdated third-party Node.js client packages, TeacherSathi communicates directly with Razorpay's REST API using standard `fetch` with HTTP Basic Authentication (`RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET` base64-encoded).

Key endpoints utilized:
- **Orders**: `POST https://api.razorpay.com/v1/orders`
- **Customers**: `POST https://api.razorpay.com/v1/customers`
- **Subscriptions**: `POST https://api.razorpay.com/v1/subscriptions`
- **Subscription Management**: `PATCH/POST /v1/subscriptions/{id}/cancel`

### 2.2 Cryptographic Payment Signature Verification
Razorpay returns three parameters upon checkout completion:
1. `razorpay_order_id` (or `razorpay_subscription_id`)
2. `razorpay_payment_id`
3. `razorpay_signature`

The signature is an HMAC-SHA256 digest:
$$\text{Signature} = \text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$

#### Timing-Safe Buffer Comparison
To prevent timing side-channel attacks, the signature verification utilizes `crypto.timingSafeEqual`. Because Node.js throws an unhandled exception if buffer byte lengths differ, an explicit length check guards the call:

```typescript
const sigBuf = Buffer.from(params.signature, 'utf8');
const expectedBuf = Buffer.from(expectedSignature, 'utf8');

if (sigBuf.length !== expectedBuf.length) {
  return { verified: false, error: 'Signature length mismatch.' };
}

const match = crypto.timingSafeEqual(sigBuf, expectedBuf);
```

### 2.3 Fail-Closed Production Security
When running in production (`NODE_ENV === 'production'`), `RazorpayBillingProvider` strictly fails closed:
```typescript
if (!this.keyId || !this.keySecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Razorpay credentials missing in production environment');
  }
}
```
This guarantees that missing environment variables never cause silent fallback to unauthenticated or mock transactions in live deployments.

---

## 3. Deterministic Mock Provider (`MockBillingProvider`)

Location: `src/lib/billing/providers/mock.ts`

To ensure complete test reliability, CI/CD speed, and offline developer workflows, `MockBillingProvider` implements the full provider interface deterministically:
- Generates structured IDs: `order_mock_*`, `sub_mock_*`, `cust_mock_*`.
- Deterministic verification: Passing signature `"invalid_signature"` produces an explicit verification failure; any other signature verifies successfully.
- Webhooks: Validates HMAC using `mock_webhook_secret_key_12345` or allows `"test_signature"`.

---

## 4. Provider Factory & Environment Configuration

Location: `src/lib/billing/providers/index.ts`

The provider factory dynamically resolves the active adapter:

```typescript
export function getBillingProvider(): BillingProvider {
  const providerType = process.env.BILLING_PROVIDER || 'MOCK';
  if (providerType.toUpperCase() === 'RAZORPAY') {
    return new RazorpayBillingProvider();
  }
  return new MockBillingProvider();
}
```

### Required Environment Variables

```env
# Provider Selection
BILLING_PROVIDER=RAZORPAY # or MOCK

# Razorpay API Credentials
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyyyyyyyy
RAZORPAY_WEBHOOK_SECRET=whsec_zzzzzzzzzzzzzzzzzz

# Client-Facing Key (Public)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
```
