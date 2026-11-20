import { Container } from '@/components/Container';
import { SEO } from '@/components/SEO';

export function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service — Vantrix Screen"
        description="Terms of service and subscription agreement for Vantrix Screen."
        canonical="https://screen.vantrix.ai/terms"
      />
      <div className="py-20 md:py-28">
        <Container className="max-w-3xl">
          <div className="v-card space-y-6 p-8 md:p-12 rounded-[32px]">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--gold-soft)] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                Legal &amp; Trust
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
              Terms of Service
            </h1>
            <p className="font-mono text-xs text-[var(--muted2)]">Last Updated: November 2026</p>

            <div className="space-y-4 text-sm leading-relaxed text-[var(--text)]">
              <p className="text-[var(--muted)]">
                By creating a Vantrix Screen account or initiating an enterprise subscription, your
                organization agrees to these Terms of Service.
              </p>

              <h2 className="pt-2 text-lg font-bold text-[var(--text)]">
                1. Permitted Platform Usage
              </h2>
              <p className="text-[var(--muted)]">
                Vantrix Screen provides automated technical evaluation infrastructure for
                recruitment and team benchmarking. You agree not to submit malicious exploits,
                automated scraping scripts, or reverse-engineer our sandbox sandboxing environment.
              </p>

              <h2 className="pt-2 text-lg font-bold text-[var(--text)]">
                2. Subscription &amp; Billing
              </h2>
              <p className="text-[var(--muted)]">
                Subscription fees for self-serve plans are billed monthly in advance via Razorpay.
                Cancellations take effect at the conclusion of the active billing cycle.
              </p>

              <h2 className="pt-2 text-lg font-bold text-[var(--text)]">
                3. Enterprise SLA &amp; Governing Terms
              </h2>
              <p className="v-panel p-4 text-xs leading-relaxed text-[var(--muted)] rounded-[16px]">
                Enterprise tiers are backed by a 99.9% uptime Service Level Agreement. All subscription contracts are governed by standard commercial SaaS licensing guidelines, providing full indemnification and enterprise-grade data security guarantees.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
