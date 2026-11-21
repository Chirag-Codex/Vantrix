import { Container } from '@/components/Container';
import { Aurora } from '@/components/Aurora';
import { AURORA } from '@/config/aurora';

export function DemoCtaBand({ onOpenDemoModal }) {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <Aurora
          config={AURORA.cta}
          className="aurora--soft rounded-[36px] px-10 py-[88px] text-center"
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="font-serif text-[clamp(40px,4.4vw,64px)] leading-[1.04] tracking-[-0.015em] text-[rgb(var(--c-text))] mx-auto max-w-[820px] text-center w-full">
              Run a fairer first round, starting today
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-[rgb(var(--c-muted))]">
              A 45-minute walkthrough. Pick a time that suits you.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={onOpenDemoModal}
                className="btn-gold min-h-[52px] px-10"
              >
                Book a demo →
              </button>
            </div>
          </div>
        </Aurora>
      </Container>
    </section>
  );
}
