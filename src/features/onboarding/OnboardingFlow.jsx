import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '@/components/Container';
import { CalendarPicker } from '@/features/booking/CalendarPicker';
import { SlotGrid } from '@/features/booking/SlotGrid';
import { TimezoneSelector } from '@/features/booking/TimezoneSelector';
import { Confirmation } from '@/features/booking/Confirmation';
import { getAvailability } from '@/services/availability';
import { createBooking } from '@/services/bookings';
import { formatDateKey } from '@/lib/utils';
import { Calendar, CheckCircle2 } from 'lucide-react';

export function OnboardingFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const token =
    location.state?.token ||
    (typeof window !== 'undefined' ? sessionStorage.getItem('vantrix_onboarding_token') : null);

  const customer = React.useMemo(() => {
    if (location.state?.customer) return location.state.customer;
    try {
      const stored = sessionStorage.getItem('vantrix_customer_data');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, [location.state]);

  const [timezone, setTimezone] = React.useState('Asia/Kolkata');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [slots, setSlots] = React.useState([]);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmedBooking, setConfirmedBooking] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (!token) {
      navigate('/#pricing', { replace: true });
    }
  }, [token, navigate]);

  React.useEffect(() => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTz) setTimezone(userTz);
    } catch {
      // Default
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(formatDateKey(tomorrow));
  }, []);

  React.useEffect(() => {
    if (!selectedDate) return;

    let isCancelled = false;
    async function fetchAvailability() {
      setIsLoadingSlots(true);
      try {
        const fromDate = new Date(`${selectedDate}T00:00:00Z`);
        const toDate = new Date(`${selectedDate}T23:59:59Z`);

        const availableSlots = await getAvailability({
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
          tz: timezone,
        });

        if (!isCancelled) {
          setSlots(availableSlots);
        }
      } catch {
        if (!isCancelled) {
          setSlots([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSlots(false);
        }
      }
    }

    fetchAvailability();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate, timezone]);

  const handleConfirmOnboarding = async () => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await createBooking({
        type: 'onboarding',
        start: selectedSlot.start,
        end: selectedSlot.end,
        tz: timezone,
        name: customer.name || 'Engineering Leader',
        email: customer.email || 'customer@company.com',
        company: customer.company || 'Enterprise Organization',
        role: 'Admin',
        teamSize: '11-50',
        token,
      });

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('vantrix_onboarding_token');
        sessionStorage.removeItem('vantrix_customer_data');
      }

      setConfirmedBooking(res);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to schedule onboarding session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="py-20 md:py-28">
      <Container className="max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--ok-bg)] px-4 py-1.5 text-xs font-bold text-[var(--ok)]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Payment Verified • Workspace Provisioned</span>
          </div>
          <h1 className="heading-h2">
            Schedule Your Onboarding Walkthrough
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
            {customer.name
              ? `Welcome ${customer.name}${customer.company ? ` from ${customer.company}` : ''}! Choose a dedicated time with our engineering solutions team.`
              : 'Choose a dedicated 45-minute window with our solutions engineering team to configure your isolated workspace and custom rubrics.'}
          </p>
        </div>

        <div className="v-card p-6 md:p-8">
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 rounded-[14px] border border-[var(--line)] bg-[var(--danger-bg)] p-4 text-xs font-semibold text-[var(--danger)]"
            >
              {errorMessage}
            </div>
          )}

          {!confirmedBooking ? (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                  <Calendar className="h-4 w-4 text-[var(--accent)]" />
                  <span>Onboarding Session Scheduling</span>
                </div>
                <TimezoneSelector value={timezone} onChange={setTimezone} />
              </div>

              <CalendarPicker
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
              />

              <SlotGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                isLoading={isLoadingSlots}
                timezone={timezone}
              />

              <div className="flex justify-end border-t border-[var(--line)] pt-5">
                <button
                  type="button"
                  disabled={!selectedSlot || isSubmitting}
                  onClick={handleConfirmOnboarding}
                  className="btn-gold w-full px-8 sm:w-auto"
                >
                  {isSubmitting ? 'CONFIRMING ONBOARDING...' : 'CONFIRM ONBOARDING SESSION'}
                </button>
              </div>
            </div>
          ) : (
            <Confirmation
              booking={confirmedBooking}
              timezone={timezone}
              onClose={() => navigate('/', { replace: true })}
            />
          )}
        </div>
      </Container>
    </div>
  );
}
