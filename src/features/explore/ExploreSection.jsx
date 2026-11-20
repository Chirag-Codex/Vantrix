import { Container } from '@/components/Container';
import { ArrowRight } from 'lucide-react';

export function ExploreSection({ onOpenDemoModal }) {
  return (
    <section id="explore" className="py-20 md:py-28">
      <Container>
        {/* Section heading: H2 46px/1.1 (34px mobile), tracking -0.025em, 700, centred */}
        <h2 className="heading-h2 mb-12 md:mb-16">
          Explore what Vantrix can do for you
        </h2>

        {/* Two glass cards, 28px gap, padding 16px, radius 32px */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          {/* Vantrix Screen Card */}
          <div className="v-card p-4 flex flex-col rounded-[32px]">
            {/* Image container: height 300px (170px mobile), radius 22px, object-fit cover */}
            <div className="relative flex h-[170px] sm:h-[300px] w-full flex-col justify-end overflow-hidden rounded-[22px] bg-[var(--code-bg)] p-6 border border-[var(--line)]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--syn-grid) 1px, transparent 1px), linear-gradient(90deg, var(--syn-grid) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="relative z-10 space-y-1.5 font-mono text-xs sm:text-sm leading-6">
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
              </div>
            </div>

            {/* Content: Title 28px/700 centered (26px top margin), subtitle --muted, button */}
            <div className="flex flex-1 flex-col items-center p-6 text-center">
              <h3 className="mt-[26px] text-[28px] font-bold text-[var(--text)]">Vantrix Screen</h3>
              <p className="mt-2 mb-6 max-w-sm text-[16px] text-[var(--muted)]">
                Evaluate technical talent with greater confidence.
              </p>
              <button
                type="button"
                onClick={onOpenDemoModal}
                className="btn-gold gap-2"
              >
                <span>EXPLORE SCREEN</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Vantrix Talent Card */}
          <div className="v-card p-4 flex flex-col rounded-[32px]">
            {/* Image container: height 300px (170px mobile), radius 22px */}
            <div className="relative flex h-[170px] sm:h-[300px] w-full flex-col justify-end overflow-hidden rounded-[22px] bg-[var(--code-bg)] p-6 border border-[var(--line)]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--syn-grid) 1px, transparent 1px), linear-gradient(90deg, var(--syn-grid) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="relative z-10 space-y-1.5 font-mono text-xs sm:text-sm leading-6">
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
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col items-center p-6 text-center">
              <h3 className="mt-[26px] text-[28px] font-bold text-[var(--text)]">Vantrix Talent</h3>
              <p className="mt-2 mb-6 max-w-sm text-[16px] text-[var(--muted)]">
                Build exceptional teams with global talent.
              </p>
              <a
                href="#capabilities"
                className="btn-ghost gap-2"
              >
                <span>EXPLORE TALENT</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
