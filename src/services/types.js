/**
 * @file Data contracts and JSDoc typedefs for the Vantrix Screen services.
 */

/**
 * @typedef {Object} AvailabilitySlot
 * @property {string} start - ISO 8601 timestamp string of slot start
 * @property {string} end - ISO 8601 timestamp string of slot end
 */

/**
 * @typedef {'demo' | 'onboarding'} BookingType
 */

/**
 * @typedef {Object} AvailabilityQuery
 * @property {BookingType} type
 * @property {string} from - ISO date string (YYYY-MM-DD)
 * @property {string} to - ISO date string (YYYY-MM-DD)
 * @property {string} tz - IANA timezone identifier (e.g. 'Asia/Kolkata', 'America/New_York')
 */

/**
 * @typedef {Object} BookingPayload
 * @property {BookingType} type
 * @property {string} start - ISO 8601 timestamp
 * @property {string} end - ISO 8601 timestamp
 * @property {string} tz - IANA timezone
 * @property {string} name
 * @property {string} email
 * @property {string} company
 * @property {string} role
 * @property {string} teamSize
 * @property {string} [note]
 * @property {string} [token] - Optional onboarding verification token
 */

/**
 * @typedef {Object} BookingResponse
 * @property {string} bookingId
 * @property {string} start
 * @property {string} end
 * @property {string} [meetLink]
 * @property {string} status
 */

/**
 * @typedef {Object} CreateOrderPayload
 * @property {string} planId
 * @property {string} billingCycle
 * @property {string} name
 * @property {string} email
 * @property {string} company
 * @property {string} [gstin]
 * @property {string} country
 * @property {string} state
 */

/**
 * @typedef {Object} OrderResponse
 * @property {string} orderId
 * @property {number} amount - In lowest denomination (cents or paise)
 * @property {string} currency - E.g. 'USD' or 'INR'
 * @property {string} keyId - Public Razorpay Key ID
 */

/**
 * @typedef {Object} VerifyPaymentPayload
 * @property {string} orderId
 * @property {string} paymentId
 * @property {string} signature
 */

/**
 * @typedef {Object} VerifyPaymentResponse
 * @property {boolean} success
 * @property {string} onboardingToken - Short-lived opaque token
 */

export {};
