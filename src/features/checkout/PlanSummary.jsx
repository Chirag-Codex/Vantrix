import { Check, Shield } from 'lucide-react';

export function PlanSummary({ plan }) {
  return (
    <div className="v-card p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--gold-grad)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--on-gold)]">
            Order Summary
          </span>
          <span className="text-xs font-medium text-[var(--muted2)]">Billed Monthly</span>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-[var(--text)]">{plan.name}</h3>
        <div className="mt-2 text-3xl font-extrabold text-[var(--text)]">
          {plan.price}
          <span className="ml-1 text-sm font-normal text-[var(--muted)]">{plan.billingPeriod}</span>
        </div>
      </div>

      <div className="space-y-4 border-t border-[var(--line)] pt-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted2)]">
          Plan Features Included:
        </div>
        <ul className="space-y-3 text-sm text-[var(--text)]">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--panel)] p-4 text-xs text-[var(--muted)]">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <span>
            Enterprise-grade TLS 1.3 encryption and isolated multi-tenant execution sandboxes.
          </span>
        </div>
      </div>
    </div>
  );
}
