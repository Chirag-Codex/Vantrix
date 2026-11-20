import { cn } from '@/lib/utils';

export function Eyebrow({ className, children, ...props }) {
  return (
    <span
      className={cn(
        'eyebrow-badge inline-block',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
