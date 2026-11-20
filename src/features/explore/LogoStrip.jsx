import { Container } from '@/components/Container';

export function LogoStrip() {
  const companies = [
    'IBM',
    'DELOITTE',
    'EY',
    'GOOGLE',
    'MICROSOFT',
    'UBER',
    'STRIPE',
    'AMAZON',
  ];

  return (
    <div className="border-y border-[var(--line)] py-9 md:py-12">
      <Container>
        <p className="mb-7 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          Talent evaluated from global technology leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between md:gap-8">
          {companies.map((name) => (
            <span
              key={name}
              className="font-bold uppercase tracking-[0.04em] text-[var(--muted2)] transition-colors duration-150 hover:text-[var(--text)] text-[14px] sm:text-[17px]"
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}
