import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

export function SlotGrid({ slots, selectedSlot, onSelectSlot, isLoading, timezone }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-vantrix-muted">
          2. Select Time Slot
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Filter out slots that have already passed in real-time
  const now = new Date();
  const availableSlots = (slots || []).filter((slot) => new Date(slot.start) > now);

  if (availableSlots.length === 0) {
    return (
      <div className="rounded-[18px] border border-[var(--line)] bg-[var(--panel)] p-6 text-center text-sm text-[var(--muted)]">
        <Clock className="mx-auto mb-2 h-6 w-6 text-[var(--muted2)]" />
        No upcoming available slots for this date. Please choose another date or adjust your timezone.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--muted2)]">
        <span>2. Select Time Slot</span>
        <span className="text-[11px] font-semibold text-[var(--accent)]">45 min walkthrough</span>
      </div>

      <div
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Available meeting time slots"
      >
        {availableSlots.map((slot) => {
          const isSelected = selectedSlot?.start === slot.start;
          const startDate = new Date(slot.start);
          const timeString = startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
          });

          return (
            <button
              key={slot.start}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectSlot(slot)}
              className={cn(
                'flex items-center justify-center rounded-[14px] border px-3 py-2.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer',
                isSelected
                  ? 'border-[var(--line-strong)] bg-[var(--gold-soft)] text-[var(--accent)] shadow-sm'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--text)] hover:border-[var(--line-strong)]'
              )}
            >
              {timeString}
            </button>
          );
        })}
      </div>
    </div>
  );
}
