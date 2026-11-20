import { describe, it, expect } from 'vitest';
import { createCheckoutOrder, verifyPayment } from './checkout';

describe('Checkout Service', () => {
  it('creates an order with valid currency and amount', async () => {
    const order = await createCheckoutOrder({
      planId: 'plan-starter',
      billingCycle: 'monthly',
      name: 'Alice Johnson',
      email: 'alice@startuplab.com',
      company: 'StartupLab',
      country: 'India',
      state: 'Karnataka',
    });

    expect(order).toBeDefined();
    expect(order.orderId).toMatch(/^order_/);
    expect(order.currency).toBe('USD');
    expect(order.amount).toBeGreaterThan(0);
    expect(order.keyId).toBeDefined();
  });

  it('verifies payment signature and issues short-lived opaque onboarding token', async () => {
    const result = await verifyPayment({
      orderId: 'order_12345',
      paymentId: 'pay_test_verified',
      signature: 'valid_mock_signature',
    });

    expect(result.success).toBe(true);
    expect(result.onboardingToken).toMatch(/^ob_/);
  });

  it('rejects signature verification when payment failure is triggered', async () => {
    await expect(
      verifyPayment({
        orderId: 'order_12345',
        paymentId: 'pay_trigger_fail',
        signature: 'invalid_sig',
      })
    ).rejects.toThrow('Payment verification signature check failed.');
  });
});
