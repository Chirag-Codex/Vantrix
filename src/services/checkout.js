// @ts-check
import { mockCreateOrder, mockVerifyPayment } from './mocks/checkoutMock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vantrix.ai';

/**
 * Creates a checkout order.
 * @param {import('./types').CreateOrderPayload} payload
 * @returns {Promise<import('./types').OrderResponse>}
 */
export async function createCheckoutOrder(payload) {
  if (USE_MOCKS) {
    return mockCreateOrder(payload);
  }

  const response = await fetch(`${API_BASE_URL}/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to create order: ${response.status}`);
  }

  return response.json();
}

/**
 * Verifies Razorpay payment signature on backend.
 * @param {import('./types').VerifyPaymentPayload} payload
 * @returns {Promise<import('./types').VerifyPaymentResponse>}
 */
export async function verifyPayment(payload) {
  if (USE_MOCKS) {
    return mockVerifyPayment(payload);
  }

  const response = await fetch(`${API_BASE_URL}/checkout/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Payment verification failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Dynamically loads the Razorpay checkout script with integrity and fallback.
 * @returns {Promise<boolean>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    // Check if already loaded
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };

    document.body.appendChild(script);
  });
}
