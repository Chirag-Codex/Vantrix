import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CalendarPicker } from './CalendarPicker';
import { SlotGrid } from './SlotGrid';
import { DetailsForm } from './DetailsForm';
import { Confirmation } from './Confirmation';
import { TimezoneSelector } from './TimezoneSelector';
import { getAvailability } from '@/services/availability';
import { createBooking } from '@/services/bookings';
import { formatDateKey } from '@/lib/utils';

export function BookingModal({ open, onOpenChange, initialType = 'demo', token = null }) {
  const [step, setStep] = React.useState('slots'); // 'slots' | 'details' | 'confirmed'
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
      // Fallback
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
      type: initialType,
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
        setErrorMessage(err.message || 'Failed to load available slots.');
        setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, timezone, initialType]);

  const handleSlotContinue = () => {
    if (!selectedSlot) return;
    setStep('details');
  };

  const handleBookingSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setCachedFormData(formData);

    try {
      const result = await createBooking({
        type: initialType,
        start: selectedSlot.start,
        end: selectedSlot.end,
        tz: timezone,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        role: formData.role,
        teamSize: formData.teamSize,
        note: formData.note,
        token: token || undefined,
      });

      setConfirmedBooking(result);
      setStep('confirmed');
    } catch (err) {
      // @ts-ignore
      if (err.status === 409) {
        setErrorMessage(
          'This slot was just taken by another team. Please pick another available time slot below.'
        );
        setSelectedSlot(null);
        setStep('slots');
      } else {
        setErrorMessage(
          err.message || 'An error occurred while confirming your booking. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('slots');
    setSelectedSlot(null);
    setConfirmedBooking(null);
    setErrorMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[32px] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-bold text-[var(--text)]">
            {step === 'confirmed'
              ? 'Demo Walk-through Confirmed'
              : initialType === 'onboarding'
                ? 'Schedule Your Platform Onboarding'
                : 'Book a Live Vantrix Screen Demo'}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[var(--muted)]">
            {step === 'confirmed'
              ? 'Your meeting has been scheduled with our technical assessment architect.'
              : 'Choose a convenient 45-minute window for an interactive assessment demonstration.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && step === 'slots' && (
          <div
            role="alert"
            className="rounded-[14px] border border-[var(--line)] bg-[var(--danger-bg)] p-3 text-xs text-[var(--danger)]"
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

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={handleSlotContinue}
                className="btn-gold w-full sm:w-auto"
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
          <Confirmation booking={confirmedBooking} timezone={timezone} onClose={handleReset} />
        )}
      </DialogContent>
    </Dialog>
  );
}
