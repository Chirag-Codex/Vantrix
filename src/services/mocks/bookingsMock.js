// @ts-check
/**
 * Realistic mock adapter for booking appointments.
 */

/** @type {Set<string>} */
const bookedSlots = new Set();
/** @type {Map<string, import('../types').BookingResponse>} */
const idempotencyStore = new Map();

/**
 * @param {import('../types').BookingPayload} payload
 * @param {string} idempotencyKey
 * @returns {Promise<import('../types').BookingResponse>}
 */
export async function mockCreateBooking(payload, idempotencyKey) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Check idempotency
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    return /** @type {import('../types').BookingResponse} */ (idempotencyStore.get(idempotencyKey));
  }

  // Simulate slot taken (409 conflict) if start contains :45 or explicitly configured
  if (payload.start.includes('T11:30:00Z') && !bookedSlots.has(payload.start)) {
    // For testing: slot 11:30 triggers simulated conflict on first try
    bookedSlots.add(payload.start);
    const error = new Error('Selected slot is no longer available. Please select another slot.');
    // @ts-ignore
    error.status = 409;
    throw error;
  }

  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const response = {
    bookingId,
    start: payload.start,
    end: payload.end,
    meetLink: `https://meet.google.com/vnt-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`,
    status: 'confirmed',
  };

  if (idempotencyKey) {
    idempotencyStore.set(idempotencyKey, response);
  }

  return response;
}
