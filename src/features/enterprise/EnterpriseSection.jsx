import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { Aurora } from '@/components/Aurora';
import { AURORA } from '@/config/aurora';
import { useHoverGlow } from '@/hooks/useHoverGlow';

const FEATURES = [
  {
    num: '01',
    title: 'AI-ASSISTED TECHNICAL SCREENING',
    description:
      'Automatically evaluate coding exercises and technical assessments while maintaining recruiter oversight.',
  },
  {
    num: '02',
    title: 'MULTI-ORGANIZATION PLATFORM',
    description:
      'Each organization operates in a completely isolated workspace with independent branding, users, templates, reports and scoring rules.',
  },
  {
    num: '03',
    title: 'CONFIGURABLE ASSESSMENT ENGINE',
    description:
      'Design role-specific technical assessments with reusable templates, coding questions, time limits and topic coverage.',
  },
  {
    num: '04',
    title: 'ENTERPRISE GOVERNANCE',
    description:
      'Comprehensive audit logs, organization controls, assessment history, recruiter activity and platform administration.',
  },
];

function AudienceCard({
  title,
  cta,
  isAurora,
  onCtaClick,
  href,
  isExternal,
  secondaryCta,
  secondaryHref,
}) {
  const { onMouseMove, onMouseLeave } = useHoverGlow();

  if (isAurora) {
    return (
      <Aurora
        config={AURORA.panel}
        className="aurora--soft rounded-[28px] flex flex-col justify-end p-8 sm:p-11 min-h-[340px] md:min-h-[380px] hover-glow"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="relative z-10">
          <h3 className="font-serif text-[clamp(34px,3.5vw,48px)] leading-[1.08] text-[rgb(var(--c-text))] mb-6">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCtaClick}
              className="btn-gold"
            >
              {cta}
            </button>
            {secondaryCta && (
              <a href={secondaryHref} className="btn-ghost">
                {secondaryCta}
              </a>
            )}
          </div>
        </div>
      </Aurora>
    );
  }

  // Grid pattern card
  return (
    <div
      className="relative rounded-[28px] flex flex-col justify-end p-8 sm:p-11 min-h-[340px] md:min-h-[380px] overflow-hidden border border-[var(--line)] bg-[rgb(var(--c-card))] hover-glow"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Faint grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--syn-grid) 1px, transparent 1px), linear-gradient(90deg, var(--syn-grid) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <h3 className="font-serif text-[clamp(34px,3.5vw,48px)] leading-[1.08] text-[rgb(var(--c-text))] mb-6">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="btn-gold inline-flex items-center gap-2"
          >
            <span>{cta}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function EnterpriseSection({ onOpenDemoModal }) {
  return (
    <section id="enterprise" className="py-20 md:py-28">
      <Container>
        {/* Eyebrow + Heading */}
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <Eyebrow>ENTERPRISE STANDARDS</Eyebrow>
          <h2 className="heading-h2 heading-h2--center mt-3 text-center w-full">
            Engineered for Rigorous Evaluation
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-[rgb(var(--c-muted))]">
            Discover why top technology companies trust Vantrix Screen to run their primary hiring
            assessments.
          </p>
        </div>

        {/* Audience split — balanced 2-column grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-16">
          <AudienceCard
            title="For hiring teams"
            cta="Book a demo →"
            secondaryCta="Buy now"
            secondaryHref="/#pricing"
            isAurora={true}
            onCtaClick={onOpenDemoModal}
          />
          <AudienceCard
            title="For global teams"
            cta="Explore Talent →"
            href="https://talent.vantrix.co/"
            isExternal={true}
            isAurora={false}
          />
        </div>

        {/* Enterprise feature grid */}
        <div className="v-card p-8 sm:p-12 md:p-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-x-14 md:gap-y-11">
            {FEATURES.map((f) => (
              <div key={f.num} className="flex flex-col">
                <div className="mb-3 flex items-center gap-3.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[rgb(var(--c-tint))] font-mono text-[13px] font-bold text-[rgb(var(--c-indigo))]">
                    {f.num}
                  </span>
                  <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[rgb(var(--c-text))]">
                    {f.title}
                  </h3>
                </div>
                <p className="pl-10 text-[15px] leading-relaxed text-[rgb(var(--c-muted))]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
