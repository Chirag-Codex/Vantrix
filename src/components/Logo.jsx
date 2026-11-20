import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function Logo({ className }) {
  return (
    <Link
      to="/"
      className={cn(
        'group inline-flex items-center gap-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg',
        className
      )}
      aria-label="Vantrix Screen homepage"
    >
      {/* 34px gold-gradient rounded-square with letter V, 10px radius */}
      <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[image:var(--gold-grad)] text-[15px] font-black text-[var(--on-gold)] shadow-sm">
        V
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[18px] font-extrabold uppercase leading-none tracking-[0.02em] text-[var(--text)]">
          VANTRIX
        </span>
        <span className="mt-0.5 text-[12px] font-medium leading-none text-[var(--muted)]">
          Screen
        </span>
      </div>
    </Link>
  );
}
