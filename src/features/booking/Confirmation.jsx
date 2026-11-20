import { generateICSContent, downloadICSFile } from '@/services/bookings';
import { CheckCircle2, Calendar, Video, Download } from 'lucide-react';

export function Confirmation({ booking, timezone, onClose }) {
  const startDate = new Date(booking.start);
  const endDate = new Date(booking.end);

  const formattedDate = startDate.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });

  const formattedTime = `${startDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  })} – ${endDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  })} (${timezone})`;

  const handleDownloadICS = () => {
    const icsString = generateICSContent({
      title: 'Vantrix Screen Platform Demo & Walk-through',
      description:
        'Live interactive evaluation walk-through with a Vantrix technical assessment architect.',
      start: booking.start,
      end: booking.end,
      location: booking.meetLink || 'Google Meet',
    });
    downloadICSFile(icsString, 'vantrix-screen-demo.ics');
  };

  return (
    <div className="space-y-6 py-4 text-center" role="status" aria-live="polite">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--gold-soft)] text-[var(--accent)]">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-[var(--text)]">
          Demo Walk-through Confirmed
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          A calendar invite and confirmation details have been prepared for your team.
        </p>
      </div>

      <div className="space-y-3.5 rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-5 text-left">
        <div className="flex items-start gap-3 text-sm">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <div>
            <div className="font-semibold text-[var(--text)]">{formattedDate}</div>
            <div className="text-xs text-[var(--muted)]">{formattedTime}</div>
          </div>
        </div>

        {booking.meetLink && (
          <div className="flex items-center gap-3 border-t border-[var(--line)] pt-3 text-sm">
            <Video className="h-4 w-4 shrink-0 text-[var(--ok)]" />
            <a
              href={booking.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-mono text-xs text-[var(--accent)] hover:underline"
            >
              {booking.meetLink}
            </a>
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="space-y-1.5 rounded-[18px] border border-[var(--line)] bg-[var(--panel)] p-4 text-left text-xs text-[var(--muted)]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text)]">
          Next Steps:
        </div>
        <p>1. Our technical assessment architect will review your role requirements beforehand.</p>
        <p>
          2. You will receive a direct email with sample assessment rubrics tailored to your stack.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={handleDownloadICS}
          className="btn-ghost flex-1 gap-2"
        >
          <Download className="h-4 w-4" /> ADD TO CALENDAR (.ICS)
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-gold flex-1"
          >
            DONE
          </button>
        )}
      </div>
    </div>
  );
}
