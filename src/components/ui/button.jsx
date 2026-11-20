import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.07em] transition-all rounded-pill select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[image:var(--gold-grad)] text-[var(--on-gold)] border-0 hover:brightness-105 active:brightness-95',
        secondary:
          'bg-transparent border border-[var(--line-strong)] text-[var(--text)] hover:bg-[var(--fill)] hover:border-[var(--accent)]',
        ghost:
          'bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--fill)]',
        outline:
          'border border-[var(--line-strong)] text-[var(--accent)] bg-transparent hover:bg-[var(--fill)]',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline normal-case tracking-normal font-medium',
      },
      size: {
        default: 'min-h-[48px] px-[26px]',
        sm: 'min-h-[40px] px-5 text-[12px]',
        lg: 'min-h-[48px] px-8 text-[13px]',
        icon: 'h-11 w-11 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
