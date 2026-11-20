// @ts-check
import { createCheckoutOrder, verifyPayment, loadRazorpayScript } from '@/services/checkout';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

/**
 * Orchestrates the secure checkout flow: order creation -> Razorpay checkout -> server verification.
 * @param {Object} options
 * @param {import('@/services/types').CreateOrderPayload} options.payload
 * @param {(status: string) => void} options.onStatusChange
 * @param {(token: string) => void} options.onSuccess
 * @param {(error: string) => void} options.onError
 */
export async function executeCheckoutFlow({ payload, onStatusChange, onSuccess, onError }) {
  try {
    onStatusChange('Creating order...');
    const order = await createCheckoutOrder(payload);

    // If mock mode is enabled or Razorpay cannot run, use mock checkout completion
    if (USE_MOCKS) {
      onStatusChange('Simulating payment...');
      await new Promise((res) => setTimeout(res, 800));

      onStatusChange('Verifying payment signature with backend...');
      const verifyRes = await verifyPayment({
        orderId: order.orderId,
        paymentId: `pay_mock_${Date.now()}`,
        signature: `sig_mock_${Math.random().toString(36).substring(2, 10)}`,
      });

      if (verifyRes.success && verifyRes.onboardingToken) {
        onSuccess(verifyRes.onboardingToken);
      } else {
        onError('Payment verification failed on server.');
      }
      return;
    }

    // Real Razorpay integration
    onStatusChange('Loading payment gateway...');
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      onError(
        'Unable to load secure payment gateway. Please check your internet connection or ad-blocker.'
      );
      return;
    }

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Vantrix Inc.',
      description: `Vantrix Screen - ${payload.planId}`,
      order_id: order.orderId,
      prefill: {
        name: payload.name,
        email: payload.email,
      },
      theme: {
        color: '#E3B94A',
      },
      modal: {
        ondismiss: () => {
          onError('Payment checkout was canceled by user.');
        },
      },
      handler: async function (response) {
        try {
          onStatusChange('Verifying payment signature with server...');
          // Security requirement: NEVER trust client callback without backend signature verification
          const verifyResult = await verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyResult.success && verifyResult.onboardingToken) {
            onSuccess(verifyResult.onboardingToken);
          } else {
            onError(
              'Payment could not be verified by server. If amount was deducted, our team will resolve it within 1 hour.'
            );
          }
        } catch (verifyErr) {
          onError(
            verifyErr.message ||
              'Payment verification timeout. Please click retry to confirm payment status.'
          );
        }
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      onError(response.error.description || 'Payment execution failed at gateway.');
    });

    rzp.open();
  } catch (err) {
    onError(err.message || 'Failed to initiate payment.');
  }
}
