export interface CreateCustomerParams {
  name: string;
  email: string;
  phone?: string;
  schoolId: string;
}

export interface CustomerResult {
  customerId: string;
  email: string;
}

export interface CreateOrderParams {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface OrderResult {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface CreateSubscriptionParams {
  planId: string;
  customerId?: string;
  totalCount?: number;
  notes?: Record<string, string>;
}

export interface SubscriptionResult {
  subscriptionId: string;
  status: string;
  planId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface VerifyPaymentParams {
  paymentId: string;
  orderId?: string;
  subscriptionId?: string;
  signature: string;
}

export interface VerificationResult {
  verified: boolean;
  paymentId: string;
  orderId?: string;
  subscriptionId?: string;
  error?: string;
}

export interface WebhookResult {
  valid: boolean;
  eventId?: string;
  eventType?: string;
  payload?: Record<string, unknown>;
  error?: string;
}

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
