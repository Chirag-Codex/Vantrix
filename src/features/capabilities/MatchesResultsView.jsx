import { ArrowLeft, Check, AlertTriangle, XCircle, Award } from 'lucide-react';
import { SAMPLE_CANDIDATES } from '@/config/criteriaSample';
import { rankCandidates } from '@/lib/ranking';

/**
 * MatchesResultsView component.
 * Displays live deterministic candidate ranking based on current criteria.
 * Replaces card body inline without layout shift (CLS 0).
 */
export function MatchesResultsView({ criteriaConfig, onBackToEdit }) {
  const { ranked, totalFiltered, totalCandidates } = rankCandidates(
    criteriaConfig,
    SAMPLE_CANDIDATES
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-[rgb(var(--c-card))] px-3.5 py-1 text-[13px] font-semibold text-[rgb(var(--c-text))] transition-colors hover:bg-[rgb(var(--c-chip))]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Edit criteria</span>
        </button>
        <span className="text-[12px] font-medium text-[rgb(var(--c-muted-2))]">
          Deterministic ranking ({totalCandidates} candidates evaluated)
        </span>
      </div>

      {/* Must-have Filter Summary Banner */}
      <div className="mt-3 rounded-[14px] border border-amber-200 bg-amber-50/70 p-3 text-[13px] text-amber-900">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            {totalFiltered > 0
              ? `${totalFiltered} of ${totalCandidates} filtered out by your must-have criteria`
              : 'All candidates passed your mandatory must-have criteria'}
          </span>
        </div>
      </div>

      {/* Candidates Ranking List */}
      <div className="mt-3 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {ranked.map((c, idx) => (
          <div
            key={c.id}
            className={`rounded-[16px] border p-3.5 transition-all ${
              c.filteredOut
                ? 'border-[var(--line)] bg-[rgb(var(--c-chip)/0.5)] opacity-70'
                : 'border-[var(--line)] bg-[rgb(var(--c-card))] shadow-sm hover:border-[var(--line-strong)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--c-chip))] font-mono text-[11px] font-bold text-[rgb(var(--c-muted-2))]">
                  #{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[rgb(var(--c-text))]">
                      {c.name}
                    </span>
                    <span className="rounded-full bg-[rgb(var(--c-tint))] px-2 py-0.5 font-mono text-[10px] font-bold text-[rgb(var(--c-indigo))]">
                      {c.tier}
                    </span>
                    {idx === 0 && !c.filteredOut && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <Award className="h-3 w-3" /> Top match
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[rgb(var(--c-muted))]">
                    {c.headline} • {c.yearsExperience} yrs exp
                  </div>
                </div>
              </div>

              {/* Score / Status */}
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="font-mono text-[20px] font-black text-[rgb(var(--c-text))]">
                    {c.score}
                  </span>
                  <span className="text-[11px] font-medium text-[rgb(var(--c-muted-2))]">
                    /100
                  </span>
                </div>
              </div>
            </div>

            {/* Exclusion message if filtered out */}
            {c.filteredOut && (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50/80 px-2.5 py-1 text-[11px] font-medium text-red-700">
                <XCircle className="h-3 w-3 shrink-0" />
                <span>{c.exclusionReason}</span>
              </div>
            )}

            {/* Per-criterion match chips */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-2">
              {criteriaConfig.mustHave.map((crit) => {
                const status = c.evaluations[crit.id] || 'missed';
                return (
                  <span
                    key={crit.id}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      status === 'met'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {status === 'met' ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span>{crit.label}: {status}</span>
                  </span>
                );
              })}

              {criteriaConfig.niceToHave.slice(0, 2).map((crit) => {
                const status = c.evaluations[crit.id] || 'missed';
                return (
                  <span
                    key={crit.id}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      status === 'met'
                        ? 'bg-emerald-50 text-emerald-700'
                        : status === 'partial'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span>{crit.label}: {status}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
