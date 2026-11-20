import * as React from 'react';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { cn } from '@/lib/utils';
import { Settings, Zap } from 'lucide-react';

export function CapabilitiesSection() {
  const [selectedCandidate, setSelectedCandidate] = React.useState('A');

  return (
    <section id="capabilities" className="py-20 md:py-28">
      <Container>
        {/* Section header */}
        <div className="mb-12 text-center md:mb-16">
          <Eyebrow>CAPABILITIES</Eyebrow>
          <h2 className="heading-h2 mt-3">
            Everything for a rigorous first round
          </h2>
        </div>

        {/* Top 2 capability cards: 24px gap, padding 40px, min-height 300px */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Card 1: Flexible assessment builder */}
          <div className="v-card flex flex-col justify-between p-8 md:p-10 min-h-[300px]">
            <div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--gold-soft)] text-[var(--accent)]">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--text)]">
                FLEXIBLE ASSESSMENT BUILDER
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--muted)]">
                Create reusable assessment templates using MCQs and coding challenges, manage
                question banks, and import questions in bulk.
              </p>
            </div>
            {/* Feature tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['MCQ', 'Coding', 'Bulk import'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--line)] bg-[var(--fill)] px-3.5 py-1 text-[13px] font-semibold text-[var(--text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Recruiter intelligence */}
          <div className="v-card flex flex-col justify-between p-8 md:p-10 min-h-[300px]">
            <div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--gold-soft)] text-[var(--accent)]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--text)]">
                RECRUITER INTELLIGENCE
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--muted)]">
                Automatically score candidates, prioritise talent into P1, P2 and P3 tiers, and
                provide recruiters with actionable insights instead of manual evaluation.
              </p>
            </div>
            {/* Tier chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['P1', 'P2', 'P3'].map((tier) => (
                <span
                  key={tier}
                  className={cn(
                    'rounded-full border px-4 py-1 font-mono text-[13px] font-bold',
                    tier === 'P1'
                      ? 'border-[var(--line-strong)] bg-[var(--gold-soft)] text-[var(--accent)]'
                      : 'border-[var(--line)] bg-[var(--fill)] text-[var(--muted)]'
                  )}
                >
                  {tier}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Product Board */}
        <InteractiveProductBoard
          selectedCandidate={selectedCandidate}
          onSelectCandidate={setSelectedCandidate}
        />
      </Container>
    </section>
  );
}

function InteractiveProductBoard({ selectedCandidate, onSelectCandidate }) {
  const candidates = [
    {
      id: 'A',
      name: 'Candidate A',
      score: 87,
      tier: 'P1',
      role: 'SENIOR BACKEND ENGINEER',
      challenge: 'Rate limiter challenge',
      status: 'Tests passed',
      time: '45 min',
      integrity: 'Passed',
      flags: 0,
      code: `def rate_limit(user, window):\n    count = counter.incr(user)\n    return count <= LIMIT`,
    },
    {
      id: 'B',
      name: 'Candidate B',
      score: 74,
      tier: 'P2',
      role: 'SENIOR BACKEND ENGINEER',
      challenge: 'Rate limiter challenge',
      status: 'Tests passed',
      time: '52 min',
      integrity: 'Passed',
      flags: 0,
      code: `def rate_limit(user, window):\n    hits = cache.get(user, 0)\n    if hits >= LIMIT:\n        return False\n    cache.set(user, hits + 1)\n    return True`,
    },
    {
      id: 'C',
      name: 'Candidate C',
      score: 61,
      tier: 'P3',
      role: 'SENIOR BACKEND ENGINEER',
      challenge: 'Rate limiter challenge',
      status: 'Tests failed (2)',
      time: '60 min',
      integrity: '1 warning',
      flags: 1,
      code: `def rate_limit(user, window):\n    # Basic token bucket\n    return check_bucket(user)`,
    },
  ];

  const current = candidates.find((c) => c.id === selectedCandidate) || candidates[0];

  return (
    <div className="v-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left: Candidates List */}
        <div className="border-b border-[var(--line)] p-6 md:col-span-3 md:border-b-0 md:border-r">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted2)]">
            Candidates
          </div>
          <div className="space-y-2.5">
            {candidates.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCandidate(c.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between rounded-[14px] p-3.5 text-left transition-all',
                  c.id === selectedCandidate
                    ? 'border border-[var(--line-strong)] bg-[var(--gold-soft)] font-semibold text-[var(--text)]'
                    : 'border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--text)]'
                )}
              >
                <span className="text-[13px] font-semibold">{c.name}</span>
                <span className="font-mono text-[13px] font-bold">{c.score}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Code Challenge */}
        <div className="border-b border-[var(--line)] p-6 md:col-span-6 md:border-b-0 md:border-r">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted2)]">
            {current.role}
          </div>
          <div className="mb-4 text-[18px] font-bold text-[var(--text)]">{current.challenge}</div>

          {/* Code block */}
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--code-bg)] p-5 font-mono text-[13px] leading-6 text-[var(--syn-plain)]">
            <pre className="whitespace-pre-wrap font-mono">
              <code>{current.code}</code>
            </pre>
          </div>

          {/* Status badge */}
          <div className="mt-4 flex items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12px] font-bold',
                current.status.includes('passed')
                  ? 'border border-[var(--line)] bg-[var(--ok-bg)] text-[var(--ok)]'
                  : 'border border-[var(--line)] bg-[var(--danger-bg)] text-[var(--danger)]'
              )}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  current.status.includes('passed') ? 'bg-[var(--ok)]' : 'bg-[var(--danger)]'
                )}
              />
              {current.status}
            </span>
            <span className="font-mono text-[12px] text-[var(--muted2)]">{current.time}</span>
          </div>
        </div>

        {/* Right: Overall Score */}
        <div className="flex flex-col justify-between p-6 md:col-span-3">
          <div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted2)]">
              Overall score
            </div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-[64px] font-black leading-none tracking-tight text-[var(--text)] sm:text-[72px]">
                {current.score}
              </div>
              <div className="text-base font-semibold text-[var(--muted2)]">/100</div>
            </div>
          </div>

          {/* Integrity badge */}
          <div className="border-t border-[var(--line)] pt-4 mt-6">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--ok)]">
              <span className="h-2 w-2 rounded-full bg-[var(--ok)]" />
              <span>Integrity check {current.integrity.toLowerCase()}</span>
            </div>
            <div className="mt-1 text-[11px] text-[var(--muted2)]">{current.flags} flags raised</div>
          </div>
        </div>
      </div>

      {/* Mandatory sample label */}
      <div className="border-t border-[var(--line)] bg-[var(--panel)] px-6 py-3 text-center">
        <span className="text-[11px] font-medium text-[var(--muted2)]">
          Sample interface for illustration
        </span>
      </div>
    </div>
  );
}
