import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { ShieldCheck, Code2, Users, CheckCircle2 } from 'lucide-react';
import { useHoverGlow } from '@/hooks/useHoverGlow';

const PERSONAS = [
  {
    role: 'FOR CTOs',
    title: 'Enterprise Security & Compliance',
    icon: ShieldCheck,
    tagline: 'Zero compromise on data residency and candidate isolation.',
    bullets: [
      'Isolated micro-VM execution sandbox per candidate session',
      'End-to-end TLS 1.3 in transit and AES-256 at rest',
      'Granular Role-Based Access Control (RBAC)',
      'Immutable tamper-evident compliance audit trails',
    ],
  },
  {
    role: 'FOR HEADS OF ENGINEERING',
    title: 'Evaluation Rigor & Developer Experience',
    icon: Code2,
    tagline: 'Standardize first-round technical screens without false positives.',
    bullets: [
      'Calibrated algorithmic & practical coding challenges',
      'Deterministic automated scoring across 10+ languages',
      'Session behavioral telemetry & code integrity flags',
      'Save 60%+ senior-engineer technical interview hours',
    ],
  },
  {
    role: 'FOR TALENT ACQUISITION',
    title: 'High-Velocity Recruiting Funnel',
    icon: Users,
    tagline: 'Accelerate qualified candidates through the pipeline in hours, not weeks.',
    bullets: [
      'Automatic P1, P2, and P3 candidate tiering',
      'One-click bulk assessment invitations & real-time tracking',
      'Seamless Greenhouse, Lever, and Workday ATS sync',
      'Candidate-friendly interface with zero software download',
    ],
  },
];

function PersonaCard({ persona }) {
  const { onMouseMove, onMouseLeave } = useHoverGlow();
  const IconComponent = persona.icon;

  return (
    <div
      className="v-card flex flex-col justify-between p-8 sm:p-9 rounded-[28px] hover-glow transition-all duration-200"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[rgb(var(--c-indigo))]">
            {persona.role}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--c-chip))] text-[rgb(var(--c-indigo))] border border-[var(--line)]">
            <IconComponent className="h-4 w-4" />
          </div>
        </div>

        <h3 className="text-[20px] font-bold text-[rgb(var(--c-text))] font-serif leading-snug mb-2">
          {persona.title}
        </h3>

        <p className="text-[14px] leading-relaxed text-[rgb(var(--c-muted))] mb-6">
          {persona.tagline}
        </p>

        <ul className="space-y-3 border-t border-[var(--line)] pt-6 text-[13.5px] text-[rgb(var(--c-text))]">
          {persona.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 leading-snug">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--c-ok))]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PersonasSection() {
  return (
    <section className="py-20 md:py-24 bg-[rgb(var(--c-bg))] border-t border-[var(--line)]">
      <Container>
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <Eyebrow>STAKEHOLDER VALUE</Eyebrow>
          <h2 className="heading-h2 heading-h2--center mt-3 text-center w-full">
            Built for Every Hiring Stakeholder
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[rgb(var(--c-muted))]">
            Purpose-built capabilities that satisfy executive infosec demands, engineering technical rigor, and recruiting throughput.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <PersonaCard key={p.role} persona={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
