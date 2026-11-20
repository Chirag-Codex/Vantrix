import { describe, it, expect } from 'vitest';
import { createBooking, generateICSContent } from './bookings';

describe('Bookings Service', () => {
  it('creates a demo booking successfully with realistic fields', async () => {
    const payload = {
      type: 'demo',
      start: '2026-11-25T10:00:00Z',
      end: '2026-11-25T10:45:00Z',
      tz: 'Asia/Kolkata',
      name: 'Priya Sharma',
      email: 'priya@techcorp.io',
      company: 'TechCorp',
      role: 'Director of Talent',
      teamSize: '51-200',
    };

    const booking = await createBooking(payload);
    expect(booking).toBeDefined();
    expect(booking.bookingId).toMatch(/^bk_/);
    expect(booking.status).toBe('confirmed');
    expect(booking.meetLink).toContain('https://meet.google.com/');
  });

  it('guarantees idempotency when the same idempotencyKey is re-submitted', async () => {
    const idempotencyKey = 'unique-test-key-12345';
    const payload = {
      type: 'demo',
      start: '2026-11-25T14:00:00Z',
      end: '2026-11-25T14:45:00Z',
      tz: 'UTC',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Example Org',
      role: 'CTO',
      teamSize: '11-50',
    };

    const first = await createBooking(payload, idempotencyKey);
    const second = await createBooking(payload, idempotencyKey);

    expect(first.bookingId).toBe(second.bookingId);
    expect(first.meetLink).toBe(second.meetLink);
  });

  it('generates valid RFC 5545 .ics calendar content', () => {
    const ics = generateICSContent({
      title: 'Vantrix Screen Demo',
      description: 'Platform walkthrough',
      start: '2026-11-25T10:00:00Z',
      end: '2026-11-25T10:45:00Z',
      location: 'Google Meet',
    });

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Vantrix Screen Demo');
    expect(ics).toContain('LOCATION:Google Meet');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });
});
