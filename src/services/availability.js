// @ts-check
import { mockGetAvailability } from './mocks/availabilityMock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.vantrix.ai';

/**
 * Fetches available booking slots for a given date range and timezone.
 * @param {import('./types').AvailabilityQuery} query
 * @returns {Promise<import('./types').AvailabilitySlot[]>}
 */
export async function getAvailability(query) {
  if (USE_MOCKS) {
    return mockGetAvailability(query);
  }

  const params = new URLSearchParams({
    type: query.type,
    from: query.from,
    to: query.to,
    tz: query.tz,
  });

  const response = await fetch(`${API_BASE_URL}/availability?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch availability: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
