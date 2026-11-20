import * as React from 'react';
import { Container } from '@/components/Container';
import { CalendarPicker } from '@/features/booking/CalendarPicker';
import { SlotGrid } from '@/features/booking/SlotGrid';
import { DetailsForm } from '@/features/booking/DetailsForm';
import { Confirmation } from '@/features/booking/Confirmation';
import { TimezoneSelector } from '@/features/booking/TimezoneSelector';
import { getAvailability } from '@/services/availability';
import { createBooking } from '@/services/bookings';
import { formatDateKey } from '@/lib/utils';
import { SEO } from '@/components/SEO';

export function BookDemoPage() {
  const [step, setStep] = React.useState('slots');
  const [timezone, setTimezone] = React.useState('Asia/Kolkata');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [slots, setSlots] = React.useState([]);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [confirmedBooking, setConfirmedBooking] = React.useState(null);
  const [cachedFormData, setCachedFormData] = React.useState(null);

  React.useEffect(() => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTz) setTimezone(userTz);
    } catch {
      // default
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(formatDateKey(tomorrow));
  }, []);

  React.useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setErrorMessage('');

    getAvailability({
      type: 'demo',
      from: selectedDate,
      to: selectedDate,
      tz: timezone,
    })
      .then((data) => {
        if (!isMounted) return;
        setSlots(data);
        setIsLoadingSlots(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Failed to load availability slots');
        setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, timezone]);

  const handleBookingSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setCachedFormData(formData);

    try {
      const result = await createBooking({
        type: 'demo',
        start: selectedSlot.start,
        end: selectedSlot.end,
        tz: timezone,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        role: formData.role,
        teamSize: formData.teamSize,
        note: formData.note,
      });

      setConfirmedBooking(result);
      setStep('confirmed');
    } catch (err) {
      // @ts-ignore
      if (err.status === 409) {
        setErrorMessage('This slot was just claimed. Please select another slot below.');
        setSelectedSlot(null);
        setStep('slots');
      } else {
        setErrorMessage(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Book a Demo — Vantrix Screen"
        description="Schedule a 1-on-1 walkthrough with a technical assessment specialist. See how Vantrix Screen eliminates cheating and reduces interview load."
        canonical="https://screen.vantrix.ai/book-demo"
      />
      <div className="py-20 md:py-28">
        <Container className="max-w-2xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--gold-soft)] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                Interactive Walkthrough
              </span>
            </div>
            <h1 className="heading-h2">
              Book a Live Assessment Demo
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--muted)]">
              Choose a time with our technical architecture team for an interactive product
              walkthrough.
            </p>
          </div>

          <div className="v-card p-6 md:p-8">
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-[14px] border border-[var(--line)] bg-[var(--danger-bg)] p-3.5 text-xs text-[var(--danger)]"
              >
                {errorMessage}
              </div>
            )}

            {step === 'slots' && (
              <div className="space-y-6">
                <TimezoneSelector value={timezone} onChange={setTimezone} />

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

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    disabled={!selectedSlot}
                    onClick={() => setStep('details')}
                    className="btn-gold w-full px-8 sm:w-auto"
                  >
                    CONTINUE TO DETAILS
                  </button>
                </div>
              </div>
            )}

            {step === 'details' && (
              <DetailsForm
                initialValues={cachedFormData}
                onSubmit={handleBookingSubmit}
                isSubmitting={isSubmitting}
                error={errorMessage}
                onBack={() => setStep('slots')}
              />
            )}

            {step === 'confirmed' && confirmedBooking && (
              <Confirmation booking={confirmedBooking} timezone={timezone} />
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
