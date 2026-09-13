import type { BillingProvider } from './types';
import { RazorpayBillingProvider } from './razorpay';
import { MockBillingProvider } from './mock';

export * from './types';
export * from './razorpay';
export * from './mock';

let providerInstance: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const isMock =
    process.env.BILLING_PROVIDER === 'mock' ||
    process.env.NODE_ENV === 'test' ||
    process.env.VITEST !== undefined;

  if (isMock) {
    providerInstance = new MockBillingProvider();
    return providerInstance;
  }

  providerInstance = new RazorpayBillingProvider();
  return providerInstance;
}

export function setBillingProvider(provider: BillingProvider): void {
  providerInstance = provider;
}
