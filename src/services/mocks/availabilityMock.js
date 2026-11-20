// @ts-check
/**
 * Realistic mock adapter for availability.
 * Generates timezone-anchored business hour slots (10:00 - 17:45)
 * matching the target timezone requested by the visitor.
 */

/**
 * Calculates a UTC ISO string that corresponds to a local wall-clock time in target tz.
 * @param {string} datePrefix - YYYY-MM-DD
 * @param {string} timeStr - HH:mm:ss
 * @param {string} timeZone - IANA timezone string (e.g. 'America/New_York')
 * @returns {string} ISO string in UTC
 */
function getUtcIsoString(datePrefix, timeStr, timeZone) {
  try {
    const approx = new Date(`${datePrefix}T${timeStr}Z`);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(approx);
    const getPart = (type) => parts.find((p) => p.type === type)?.value;
    const tzYear = getPart('year');
    const tzMonth = getPart('month');
    const tzDay = getPart('day');
    let tzHour = getPart('hour');
    if (tzHour === '24') tzHour = '00';
    const tzMin = getPart('minute');
    const tzSec = getPart('second');

    const tzAsUtc = Date.UTC(+tzYear, +tzMonth - 1, +tzDay, +tzHour, +tzMin, +tzSec);
    const diff = tzAsUtc - approx.getTime();
    const targetUtc = new Date(approx.getTime() - diff);
    return targetUtc.toISOString();
  } catch {
    return `${datePrefix}T${timeStr}Z`;
  }
}

/**
 * @param {import('../types').AvailabilityQuery} query
 * @returns {Promise<import('../types').AvailabilitySlot[]>}
 */
export async function mockGetAvailability(query) {
  // Simulate network latency (200ms - 400ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const slots = [];
  const fromDate = new Date(query.from);
  const toDate = new Date(query.to);
  const targetTz = query.tz || 'UTC';

  // Generate slots for each business day in the range
  const current = new Date(fromDate);
  while (current <= toDate) {
    const dayOfWeek = current.getDay();
    // Monday through Friday only
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const datePrefix = `${year}-${month}-${day}`;

      // Standard executive business hours in the requester's timezone
      const times = [
        ['10:00:00', '10:45:00'],
        ['11:30:00', '12:15:00'],
        ['14:00:00', '14:45:00'],
        ['15:30:00', '16:15:00'],
        ['17:00:00', '17:45:00'],
      ];

      times.forEach(([startT, endT]) => {
        slots.push({
          start: getUtcIsoString(datePrefix, startT, targetTz),
          end: getUtcIsoString(datePrefix, endT, targetTz),
        });
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return slots;
}
