import * as React from 'react';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { Aurora } from '@/components/Aurora';
import { AURORA } from '@/config/aurora';
import { useHoverGlow } from '@/hooks/useHoverGlow';
import { BookingModalContext } from '@/app/Layout';
import { Loader2 } from 'lucide-react';

// Lazy-load CriteriaVideoCard to keep @dnd-kit out of the initial bundle
const CriteriaVideoCardLazy = React.lazy(() =>
  import('./CriteriaVideoCard').then((m) => ({ default: m.CriteriaVideoCard }))
);

export function CapabilitiesSection() {
  const { openDemoModal } = React.useContext(BookingModalContext);
  const { onMouseMove, onMouseLeave } = useHoverGlow();
  const [shouldLoadBuilder, setShouldLoadBuilder] = React.useState(false);
  const [replayTrigger, setReplayTrigger] = React.useState(0);
  const sectionRef = React.useRef(null);

  // Lazy-load when within 300px of viewport
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setShouldLoadBuilder(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBuilder(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="pt-[120px] pb-20"
      aria-label="Hiring criteria and evaluation capabilities"
    >
      <Container>
        {/* Two-column layout: 1fr / 1.1fr, gap 56px */}
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          {/* Left Column: Heading, Copy, Actions */}
          <div className="flex flex-col items-start text-left">
            <Eyebrow>HIRING CRITERIA</Eyebrow>

            <h2 className="heading-h2 mt-3 font-serif">
              Describe the role. Stay in control.
            </h2>

            <p className="mt-4 max-w-lg text-[16px] leading-[1.65] text-[rgb(var(--c-muted))]">
              Write the brief in plain language or upload a job spec. Vantrix Screen proposes
              must-have and nice-to-have criteria. You decide which are mandatory and in what
              order they matter, and the ranking updates as you go.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => setReplayTrigger((prev) => prev + 1)}
                className="btn-ghost"
              >
                Replay demo
              </button>

              <button
                type="button"
                onClick={openDemoModal}
                className="btn-gold"
              >
                Book a demo →
              </button>
            </div>
          </div>

          {/* Right Column: 32px Aurora Panel holding the Builder Card */}
          <Aurora
            config={AURORA.panel}
            className="aurora--soft rounded-[32px] p-6 sm:p-11 hover-glow"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <div className="relative z-10 w-full">
              {/* Card Container with reserved height 560px for CLS 0 */}
              <div className="h-[560px] w-full">
                {shouldLoadBuilder ? (
                  <React.Suspense
                    fallback={
                      <div className="flex h-[560px] w-full flex-col items-center justify-center rounded-[28px] border border-[var(--line)] bg-[rgb(var(--c-card))] p-6 shadow-[var(--shadow-card)]">
                        <Loader2 className="h-7 w-7 animate-spin text-[rgb(var(--c-indigo))]" />
                        <span className="mt-3 text-[13px] font-medium text-[rgb(var(--c-muted))]">
                          Loading criteria preview...
                        </span>
                      </div>
                    }
                  >
                    <CriteriaVideoCardLazy
                      onOpenDemoModal={openDemoModal}
                      replayTrigger={replayTrigger}
                    />
                  </React.Suspense>
                ) : (
                  <div className="flex h-[560px] w-full items-center justify-center rounded-[28px] border border-[var(--line)] bg-[rgb(var(--c-card))] p-6 shadow-[var(--shadow-card)]">
                    <span className="text-[13px] font-medium text-[rgb(var(--c-muted-2))]">
                      Scroll to view criteria preview
                    </span>
                  </div>
                )}
              </div>

              {/* Disclaimer / Sample Label */}
              <p className="mt-3 text-center text-[12px] text-[rgb(var(--c-muted))]">
                Interactive preview — sample Senior Backend role
              </p>
            </div>
          </Aurora>
        </div>
      </Container>
    </section>
  );
}
