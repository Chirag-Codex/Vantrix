import { Container } from '@/components/Container';

export function DemoCtaBand({ onOpenDemoModal }) {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <div
          className="v-card relative overflow-hidden rounded-[32px] px-8 py-16 text-center md:py-20"
          style={{
            backgroundImage:
              'radial-gradient(500px 260px at 50% 0%, var(--bg-glow-1), transparent 70%)',
          }}
        >
          <h2 className="heading-h2 mx-auto max-w-xl">
            See Vantrix Screen on your hiring process
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[var(--muted)]">
            A 45-minute walkthrough. Pick a time that suits you.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={onOpenDemoModal}
              className="btn-gold px-10 text-[13px]"
            >
              BOOK A DEMO
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
