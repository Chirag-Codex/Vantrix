// @ts-check
/**
 * Realistic mock adapter for Checkout & Payments.
 */

/**
 * @param {import('../types').CreateOrderPayload} payload
 * @returns {Promise<import('../types').OrderResponse>}
 */
export async function mockCreateOrder(payload) {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    orderId: `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    amount: payload.planId === 'plan-growth' ? 49900 : 19900, // in cents
    currency: 'USD',
    keyId: 'rzp_test_mock_vantrix_key',
  };
}

/**
 * @param {import('../types').VerifyPaymentPayload} payload
 * @returns {Promise<import('../types').VerifyPaymentResponse>}
 */
export async function mockVerifyPayment(payload) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!payload.paymentId || !payload.orderId) {
    throw new Error('Payment verification failed: Missing required verification parameters');
  }

  // Simulate verification failure on explicit test payment id
  if (payload.paymentId === 'pay_trigger_fail') {
    throw new Error('Payment verification signature check failed.');
  }

  // Return opaque short-lived onboarding token
  const onboardingToken = `ob_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  return {
    success: true,
    onboardingToken,
  };
}
