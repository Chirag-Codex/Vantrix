import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { ShieldCheck, Check, Terminal, Play } from 'lucide-react';

export function ProductPanel() {
  return (
    <section id="product-panel" className="py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col items-center text-center max-w-3xl mx-auto">
          <Eyebrow>ENTERPRISE INTERFACE</Eyebrow>
          <h2 className="heading-h2 heading-h2--center mt-3 text-center w-full">
            Designed for Engineering Leaders & Recruiters
          </h2>
          <p className="mt-3 max-w-xl text-[14px] text-[var(--muted)]">
            Streamlined technical assessment pipeline with real-time sandbox execution
          </p>
        </div>

        {/* Outer Glass Panel Container: radius 36px, padding 20px, shadow 0 40px 120px var(--glow) */}
        <div className="v-card relative overflow-hidden rounded-[36px] p-5 sm:p-7 shadow-[0_40px_120px_var(--glow)]">
          {/* Top Window Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-3 w-3 rounded-full bg-[#EF4444]" />
              <span className="inline-block h-3 w-3 rounded-full bg-[#F59E0B]" />
              <span className="inline-block h-3 w-3 rounded-full bg-[#10B981]" />
              <span className="ml-3 font-mono text-[12px] text-[var(--muted2)]">
                assessment_session_id: vnt-4921-senior-backend
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--ok-bg)] px-3 py-1 text-[12px] font-bold text-[var(--ok)]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Integrity</span>
              </span>
              <span className="hidden font-mono text-[12px] text-[var(--muted2)] sm:inline-block">
                Runtime: Python 3.12 (Isolated Sandbox)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left Column: Candidate Pipeline */}
            <div className="space-y-3 lg:col-span-4">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted2)]">
                Candidate Pipeline
              </div>

              <div className="space-y-3">
                {/* Active Selected Candidate */}
                <div className="rounded-[20px] border border-[var(--line-strong)] bg-[var(--gold-soft)] p-4 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[14px] font-bold text-[var(--text)]">Aarav Sharma</div>
                      <div className="text-[12px] text-[var(--muted)]">Senior Backend Engineer</div>
                    </div>
                    <span className="rounded-full border border-[var(--line-strong)] bg-[var(--fill)] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[var(--accent)]">
                      P1 Tier
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-2 text-[12px]">
                    <span className="text-[var(--muted)]">Score:</span>
                    <span className="font-mono font-bold text-[var(--ok)]">96 / 100</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[12px]">
                    <span className="text-[var(--muted)]">Integrity Flag:</span>
                    <span className="flex items-center gap-1 text-[var(--ok)]">
                      <Check className="h-3.5 w-3.5" /> 0 flags
                    </span>
                  </div>
                </div>

                {/* Candidate 2 */}
                <div className="v-panel rounded-[20px] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[14px] font-bold text-[var(--text)]">Priya Raman</div>
                      <div className="text-[12px] text-[var(--muted)]">Fullstack Specialist</div>
                    </div>
                    <span className="rounded-full border border-[var(--line)] bg-[var(--fill)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--muted)]">
                      P2 Tier
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-2 text-[12px]">
                    <span className="text-[var(--muted)]">Score:</span>
                    <span className="font-mono font-bold text-[var(--text)]">84 / 100</span>
                  </div>
                </div>

                {/* Candidate 3 */}
                <div className="v-panel rounded-[20px] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[14px] font-bold text-[var(--text)]">Karan Mehta</div>
                      <div className="text-[12px] text-[var(--muted)]">Distributed Systems</div>
                    </div>
                    <span className="rounded-full border border-[var(--line)] bg-[var(--fill)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--muted)]">
                      P2 Tier
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-2 text-[12px]">
                    <span className="text-[var(--muted)]">Score:</span>
                    <span className="font-mono font-bold text-[var(--text)]">81 / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Code Challenge & Sandbox Execution */}
            <div className="flex flex-col justify-between rounded-[24px] border border-[var(--line)] bg-[var(--code-bg)] p-5 font-mono text-[13px] text-[var(--syn-plain)] lg:col-span-8">
              {/* Challenge Header */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
                <div className="flex items-center gap-2 font-bold text-[var(--syn-keyword)]">
                  <Terminal className="h-4 w-4" />
                  <span>Challenge 02: LRU Cache Implementation with TTL</span>
                </div>
                <span className="rounded-full border border-[var(--line)] bg-[var(--ok-bg)] px-3 py-0.5 text-[12px] font-bold text-[var(--ok)]">
                  All 12 Tests Passed
                </span>
              </div>

              {/* Code Snippet */}
              <div className="space-y-1 overflow-x-auto py-2 leading-relaxed">
                <p>
                  <span className="text-[var(--syn-keyword)] font-bold">class</span>{' '}
                  <span className="font-bold text-[var(--syn-plain)]">LRUCache</span>:
                </p>
                <p className="pl-4">
                  <span className="text-[var(--syn-keyword)] font-bold">def</span>{' '}
                  <span className="font-bold text-[var(--syn-plain)]">__init__</span>(self, capacity:{' '}
                  <span className="text-[var(--syn-keyword)]">int</span>):
                </p>
                <p className="pl-8 text-[var(--syn-comment)]">self.capacity = capacity</p>
                <p className="pl-8 text-[var(--syn-comment)]">self.cache = OrderedDict()</p>
                <p className="pl-4">
                  <span className="text-[var(--syn-keyword)] font-bold">def</span>{' '}
                  <span className="font-bold text-[var(--syn-plain)]">get</span>(self, key:{' '}
                  <span className="text-[var(--syn-keyword)]">int</span>) -&gt;{' '}
                  <span className="text-[var(--syn-keyword)]">int</span>:
                </p>
                <p className="pl-8 text-[var(--syn-comment)]">if key not in self.cache: return -1</p>
                <p className="pl-8 text-[var(--syn-string)]">self.cache.move_to_end(key)</p>
                <p className="pl-8 text-[var(--syn-comment)]">return self.cache[key]</p>
              </div>

              {/* Terminal Execution Output Footer */}
              <div className="mt-4 border-t border-[var(--line)] pt-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  <span className="flex items-center gap-2 text-[var(--ok)] font-medium">
                    <Play className="h-3 w-3 fill-current" />
                    Execution time: 142ms • Memory: 18.4 MB
                  </span>
                  <span className="text-[var(--muted2)]">100% deterministic score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="mt-6 text-center text-[11px] font-medium text-[var(--muted2)]">
            Sample interface for illustration
          </div>
        </div>
      </Container>
    </section>
  );
}
