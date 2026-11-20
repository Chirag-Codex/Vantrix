import * as React from 'react';
import { formatDateKey, cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarPicker({ selectedDate, onSelectDate }) {
  const days = React.useMemo(() => {
    const list = [];
    const now = new Date();
    const startOffset = now.getHours() >= 18 ? 1 : 0;

    for (let i = startOffset; i < startOffset + 14; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        list.push(d);
      }
    }
    return list;
  }, []);

  const [startIndex, setStartIndex] = React.useState(0);
  const visibleCount = 5;
  const visibleDays = days.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--muted2)]">
        <span>1. Select Date</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={startIndex === 0}
            onClick={() => setStartIndex((prev) => Math.max(0, prev - 1))}
            className="rounded-lg p-1 text-[var(--muted)] transition-colors hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
            aria-label="Previous dates"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={startIndex + visibleCount >= days.length}
            onClick={() => setStartIndex((prev) => Math.min(days.length - visibleCount, prev + 1))}
            className="rounded-lg p-1 text-[var(--muted)] transition-colors hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
            aria-label="Next dates"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2" role="group" aria-label="Available calendar days">
        {visibleDays.map((date) => {
          const key = formatDateKey(date);
          const isSelected = selectedDate === key;
          const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = date.getDate();
          const month = date.toLocaleDateString('en-US', { month: 'short' });

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={cn(
                'flex flex-col items-center justify-center rounded-[18px] border p-2.5 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer',
                isSelected
                  ? 'border-transparent bg-[var(--gold-grad)] font-bold text-[var(--on-gold)] shadow-md'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--text)]'
              )}
              aria-pressed={isSelected}
            >
              <span className="text-[10px] font-semibold uppercase">{weekday}</span>
              <span className="my-0.5 text-lg font-bold">{dayNum}</span>
              <span className="text-[10px] opacity-75">{month}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
