import { cn } from '@/lib/utils';

export function Section({ id, className, children, ...props }) {
  return (
    <section id={id} className={cn('relative py-[72px] md:py-28 lg:py-32', className)} {...props}>
      {children}
    </section>
  );
}
