import { Container } from '@/components/Container';
import { SEO } from '@/components/SEO';
import { ShieldCheck, Lock, Server, Key, FileText, Mail } from 'lucide-react';

const SECURITY_PILLARS = [
  {
    icon: Lock,
    title: 'Encryption in Transit & at Rest',
    description:
      'All incoming and outgoing traffic is encrypted with modern TLS 1.3 using forward secrecy. Data at rest—including candidate challenge submissions, scoring records, and administrative metadata—is encrypted using AES-256 with automatically rotated KMS keys.',
  },
  {
    icon: Server,
    title: 'Isolated Micro-VM Sandboxes',
    description:
      'Candidate code execution occurs in ephemeral, strictly firewalled micro-virtual machines with constrained memory, CPU, and execution timeouts. Sandboxes lack outbound network access and are destroyed immediately upon test completion.',
  },
  {
    icon: Key,
    title: 'Role-Based Access Control (RBAC)',
    description:
      'Granular permissions separate candidate evaluators, hiring managers, and organization administrators. Multi-tenant isolation ensures no candidate data or assessment configurations are shared across organizations.',
  },
  {
    icon: FileText,
    title: 'Immutable Audit Logging',
    description:
      'Every assessment invitation, score calculation, rubric modification, and recruiter access event is permanently logged with tamper-evident timestamps, client IP telemetry, and user agent signatures for enterprise compliance.',
  },
];

export function SecurityPage() {
  return (
    <>
      <SEO
        title="Security & Compliance — Vantrix Screen"
        description="Technical security architecture, encryption standards, sandbox isolation, and compliance governance for Vantrix Screen."
        canonical="https://screen.vantrix.ai/security"
      />
      <div className="py-20 md:py-28">
        <Container className="max-w-4xl">
          <div className="v-card space-y-8 p-8 md:p-14 rounded-[32px]">
            {/* Header pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[rgb(var(--c-ok-bg))] px-4 py-1.5 text-[rgb(var(--c-ok))]">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                Enterprise Trust &amp; Architecture
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(var(--c-text))] font-serif">
                Security &amp; Infrastructure Posture
              </h1>
              <p className="text-[15px] leading-relaxed text-[rgb(var(--c-muted))]">
                Vantrix Screen provides mission-critical technical assessment infrastructure engineered to protect candidate confidentiality, ensure evaluation integrity, and satisfy stringent enterprise infosec standards.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
              {SECURITY_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col rounded-[20px] border border-[var(--line)] bg-[rgb(var(--c-bg))] p-6"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--c-card))] text-[rgb(var(--c-indigo))] border border-[var(--line)]">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h2 className="text-[16px] font-bold text-[rgb(var(--c-text))] mb-2">
                      {pillar.title}
                    </h2>
                    <p className="text-[13px] leading-relaxed text-[rgb(var(--c-muted))]">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Retention & Privacy Policy */}
            <div className="space-y-4 border-t border-[var(--line)] pt-8 text-[14px] leading-relaxed text-[rgb(var(--c-text))]">
              <h2 className="text-xl font-bold text-[rgb(var(--c-text))]">
                Data Retention &amp; Governance
              </h2>
              <p className="text-[rgb(var(--c-muted))]">
                Assessments and candidate recordings are maintained according to customer-configured retention windows (30, 60, or 90 days default), after which records are cryptographically wiped. Organizations retain full ownership of all evaluation datasets.
              </p>

              <div className="rounded-[20px] border border-[var(--line)] bg-[rgb(var(--c-chip))] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[rgb(var(--c-text))]">
                    Security Questions &amp; Vendor Assessments
                  </h3>
                  <p className="text-xs text-[rgb(var(--c-muted))] mt-1">
                    To request SOC 2 type reports, vendor risk assessment questionnaires, or report a security concern:
                  </p>
                </div>
                <a
                  href="mailto:hello@vantrix.ai"
                  className="inline-flex items-center gap-2 btn-gold whitespace-nowrap text-[13px] py-2 px-4"
                >
                  <Mail className="h-4 w-4" />
                  <span>hello@vantrix.ai</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
