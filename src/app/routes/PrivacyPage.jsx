import { Container } from '@/components/Container';
import { SEO } from '@/components/SEO';

export function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy — Vantrix Screen"
        description="Privacy policy and data governance practices for Vantrix Screen technical assessment platform."
        canonical="https://screen.vantrix.ai/privacy"
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
              Privacy Notice
            </h1>
            <p className="font-mono text-xs text-[var(--muted2)]">Last Updated: November 2026</p>

            <div className="space-y-4 text-sm leading-relaxed text-[var(--text)]">
              <p className="text-[var(--muted)]">
                Vantrix Inc. (&ldquo;Vantrix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
                candidate and recruiter privacy. This policy outlines how technical assessment
                telemetry, code submissions, and enterprise administrative metadata are processed
                and protected.
              </p>

              <h2 className="pt-2 text-lg font-bold text-[var(--text)]">
                1. Data Collected During Assessments
              </h2>
              <p className="text-[var(--muted)]">
                When a candidate completes a technical challenge, we collect code text, automated
                test execution outputs, elapsed time per problem, and browser event metadata
                strictly for cheating prevention. We do not access external personal devices or
                capture unauthorized biometric feeds.
              </p>

              <h2 className="pt-2 text-lg font-bold text-[var(--text)]">
                2. Multi-tenant Isolation &amp; Storage
              </h2>
              <p className="text-[var(--muted)]">
                Each enterprise organization operates in an isolated tenant environment. Candidate
                scores, code repositories, and candidate PII are never pooled across customers or
                sold to third parties.
              </p>

              <h2 className="pt-2 text-lg font-bold text-[var(--text)]">3. Legal Disclosures &amp; Compliance</h2>
              <p className="v-panel p-4 text-xs leading-relaxed text-[var(--muted)] rounded-[16px]">
                Vantrix Screen complies with applicable global data privacy regulations including GDPR and CCPA. Organizations maintain full ownership and control over their candidate evaluation datasets, with automated 90-day retention purge options and GDPR data processor addendums available on request.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
