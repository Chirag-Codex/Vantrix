import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';

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

export function EnterpriseSection() {
  return (
    <section id="enterprise" className="py-20 md:py-28">
      <Container>
        {/* Eyebrow + Heading */}
        <div className="mb-12 text-center md:mb-16">
          <Eyebrow>ENTERPRISE STANDARDS</Eyebrow>
          <h2 className="heading-h2 mt-3">
            Engineered for Rigorous Evaluation
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-[var(--muted)]">
            Discover why top technology companies trust Vantrix Screen to run their primary hiring
            assessments.
          </p>
        </div>

        {/* One unified glass container with 56px padding, 2×2 grid with 44px/56px gaps */}
        <div className="v-card p-8 sm:p-12 md:p-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-x-14 md:gap-y-11">
            {FEATURES.map((f) => (
              <div key={f.num} className="flex flex-col">
                <div className="mb-3 flex items-center gap-3.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--gold-soft)] font-mono text-[13px] font-bold text-[var(--accent)]">
                    {f.num}
                  </span>
                  <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[var(--text)]">
                    {f.title}
                  </h3>
                </div>
                <p className="pl-10 text-[15px] leading-relaxed text-[var(--muted)]">
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
