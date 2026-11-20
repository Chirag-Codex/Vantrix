import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-pill border px-3.5 py-1 text-[13px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--gold-soft)] text-[var(--accent)] font-bold',
        secondary: 'border-[var(--line)] bg-[var(--fill)] text-[var(--muted)]',
        success: 'border-transparent bg-[var(--ok-bg)] text-[var(--ok)] font-bold',
        gold: 'border-transparent bg-[image:var(--gold-grad)] text-[var(--on-gold)] font-bold',
        outline: 'border-[var(--line)] text-[var(--text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
