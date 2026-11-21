import { Container } from '@/components/Container';
import { Shield, Zap, Terminal, Clock } from 'lucide-react';

const BENCHMARKS = [
  {
    icon: Zap,
    metric: 'Sub-200ms',
    label: 'Isolated Sandbox Execution',
    detail: 'Instant micro-VM cold starts for candidate challenges',
  },
  {
    icon: Terminal,
    metric: '10+',
    label: 'Programming Languages',
    detail: 'Polyglot test runners with automated grading',
  },
  {
    icon: Clock,
    metric: '<10 min',
    label: 'Workspace Setup',
    detail: 'Pre-configured assessment templates ready to deploy',
  },
  {
    icon: Shield,
    metric: 'TLS 1.3 & AES-256',
    label: 'Encrypted Infrastructure',
    detail: 'Enterprise data confidentiality and audit trails',
  },
];

// Verified design partner / customer logos (ready for drop-in when confirmed)
const VERIFIED_PARTNERS = [];

export function LogoStrip() {
  return (
    <div className="border-y border-[var(--line)] py-10 md:py-14 bg-[rgb(var(--c-bg))]">
      <Container>
        <p className="mb-8 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--c-indigo))]">
          Engineering Benchmarks &amp; Infrastructure Standards
        </p>

        {/* 4-column Benchmarks Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENCHMARKS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col rounded-[20px] border border-[var(--line)] bg-[rgb(var(--c-card))] p-6 shadow-sm transition-all duration-200 hover:border-[var(--line-strong)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-serif text-[28px] sm:text-[32px] font-bold tracking-tight text-[rgb(var(--c-text))]">
                    {item.metric}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--c-chip))] text-[rgb(var(--c-indigo))] border border-[var(--line)]">
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-[14px] font-bold uppercase tracking-wider text-[rgb(var(--c-text))]">
                  {item.label}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[rgb(var(--c-muted))]">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Structured Customer Logo Slot (conditionally rendered when partners are added) */}
        {VERIFIED_PARTNERS.length > 0 && (
          <div className="mt-10 border-t border-[var(--line)] pt-8 text-center">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--c-muted))]">
              Verified Design Partners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {VERIFIED_PARTNERS.map((partner) => (
                <span
                  key={partner.name}
                  className="font-bold uppercase tracking-[0.04em] text-[rgb(var(--c-logo))] text-[15px]"
                >
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
