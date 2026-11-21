import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function Logo({ className }) {
  return (
    <Link
      to="/"
      className={cn(
        'group inline-flex items-center gap-2.5 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--c-indigo))] rounded-lg',
        className
      )}
      aria-label="Vantrix Screen homepage"
    >
      {/* Square mark — indigo background */}
      <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-[rgb(var(--c-indigo))] text-[14px] font-black text-[rgb(var(--c-btn-text))] shadow-sm">
        V
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[21px] font-extrabold uppercase leading-none tracking-[0.02em] text-[rgb(var(--c-text))]">
          VANTRIX
        </span>
        <span className="mt-0.5 text-[13px] font-semibold leading-none text-[rgb(var(--c-muted))]">
          Screen
        </span>
      </div>
    </Link>
  );
}
