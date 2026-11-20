// @ts-check
import { mockCreateBooking } from './mocks/bookingsMock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vantrix.ai';

/**
 * Creates a demo or onboarding booking.
 * @param {import('./types').BookingPayload} payload
 * @param {string} [idempotencyKey]
 * @returns {Promise<import('./types').BookingResponse>}
 */
export async function createBooking(payload, idempotencyKey) {
  const key =
    idempotencyKey ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `idemp_${Date.now()}`);

  if (USE_MOCKS) {
    return mockCreateBooking(payload, key);
  }

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || `Booking failed with status ${response.status}`);
    // @ts-ignore
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Formats an ISO string to iCalendar basic format (YYYYMMDDTHHMMSSZ).
 * @param {string} isoString
 * @returns {string}
 */
function formatICSDate(isoString) {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates an RFC 5545 compliant .ics calendar file client-side.
 * @param {Object} event
 * @param {string} event.title
 * @param {string} event.description
 * @param {string} event.start - ISO string
 * @param {string} event.end - ISO string
 * @param {string} [event.location]
 * @returns {string} ICS content string
 */
export function generateICSContent(event) {
  const dtStamp = formatICSDate(new Date().toISOString());
  const dtStart = formatICSDate(event.start);
  const dtEnd = formatICSDate(event.end);
  const uid = `vantrix-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@screen.vantrix.ai`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vantrix Inc//Vantrix Screen Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title.replace(/\n/g, '\\n')}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    event.location ? `LOCATION:${event.location}` : 'LOCATION:Google Meet',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Initiates a browser download for the .ics file.
 * @param {string} icsContent
 * @param {string} [filename]
 */
export function downloadICSFile(icsContent, filename = 'vantrix-screen-demo.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
