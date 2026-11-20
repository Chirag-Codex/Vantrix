import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-[var(--fill)]', className)} {...props} />;
}

export { Skeleton };
