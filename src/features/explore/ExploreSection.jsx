import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { ArrowRight } from 'lucide-react';
import { useHoverGlow } from '@/hooks/useHoverGlow';

function ExploreCard({ title, description, ctaLabel, href, isPrimary = false, codeLines }) {
  const { onMouseMove, onMouseLeave } = useHoverGlow();

  return (
    <div
      className="v-card p-4 flex flex-col rounded-[28px] hover-glow"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Code preview */}
      <div className="relative flex h-[170px] sm:h-[260px] w-full flex-col justify-end overflow-hidden rounded-[20px] bg-[rgb(var(--c-code))] p-6 border border-[var(--line)]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--syn-grid) 1px, transparent 1px), linear-gradient(90deg, var(--syn-grid) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-1.5 font-mono text-xs sm:text-sm leading-6">
          {codeLines}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-start p-6">
        <h3 className="font-serif text-[36px] leading-tight text-[rgb(var(--c-text))]">{title}</h3>
        <p className="mt-2 mb-6 text-[15px] text-[rgb(var(--c-muted))] leading-relaxed">{description}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isPrimary ? 'btn-gold' : 'btn-ghost'} gap-2 mt-auto inline-flex items-center`}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export function ExploreSection() {
  return (
    <section id="platform" className="relative py-20 md:py-28">
      <div id="explore" className="absolute -top-20" aria-hidden="true" />
      <Container>
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <Eyebrow>PLATFORM</Eyebrow>
          <h2 className="heading-h2 heading-h2--center mt-3 text-center w-full">
            Explore what Vantrix can do for you
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <ExploreCard
            title="Vantrix Screen"
            description="Evaluate technical talent with greater confidence."
            ctaLabel="Explore Screen"
            href="https://screen.vantrix.co/"
            isPrimary={true}
            codeLines={
              <>
                <div>
                  <span className="font-semibold text-[var(--syn-keyword)]">class </span>
                  <span className="font-semibold text-[var(--syn-plain)]">TechnicalAssessment(Evaluator):</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--syn-keyword)]">def </span>
                  <span className="text-[var(--syn-plain)]">analyze_integrity(self, session):</span>
                </div>
                <div className="pl-8">
                  <span className="text-[var(--syn-keyword)]">return </span>
                  <span className="text-[var(--syn-string)]">anomaly_score &lt; 0.05</span>
                </div>
                <div className="pl-4 text-[var(--syn-comment)]"># AI-assisted evaluation engine</div>
              </>
            }
          />

          <ExploreCard
            title="Vantrix Talent"
            description="Build exceptional teams with global talent."
            ctaLabel="Explore Talent"
            href="https://talent.vantrix.co/"
            isPrimary={true}
            codeLines={
              <>
                <div>
                  <span className="font-semibold text-[var(--syn-keyword)]">const </span>
                  <span className="text-[var(--syn-plain)]">talentNetwork = </span>
                  <span className="text-[var(--syn-keyword)]">new </span>
                  <span className="text-[var(--syn-plain)]">PreVettedPool();</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--syn-keyword)]">const </span>
                  <span className="text-[var(--syn-plain)]">candidates = talentNetwork.getTier(</span>
                  <span className="text-[var(--syn-string)]">&apos;P1&apos;</span>
                  <span className="text-[var(--syn-plain)]">);</span>
                </div>
                <div className="pl-4">
                  <span className="text-[var(--syn-string)]">fastTrackInterview(candidates[0]);</span>
                </div>
                <div className="pl-4 text-[var(--syn-comment)]">{`// Global pre-assessed developers`}</div>
              </>
            }
          />
        </div>
      </Container>
    </section>
  );
}
