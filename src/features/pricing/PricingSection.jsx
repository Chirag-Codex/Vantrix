import * as React from 'react';
import { pricingConfig } from '@/config/pricing';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useHoverGlow } from '@/hooks/useHoverGlow';

export function PricingSection({ onOpenDemoModal }) {
  // 1. selectedPlan state ('starter' | 'growth' | 'enterprise') initialized to 'growth'
  const [selectedPlan, setSelectedPlan] = React.useState('growth');

  return (
    <section id="pricing" className="py-20 md:py-28">
      <Container>
        {/* Eyebrow + Heading */}
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <Eyebrow>PRICING</Eyebrow>
          <h2 className="heading-h2 heading-h2--center mt-3 text-center w-full">
            Start today, or talk to us first
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-[rgb(var(--c-muted))]">
            Check out in minutes. Your onboarding call is booked straight after payment.
          </p>
        </div>

        {/* 3 cards, 28px radius, padding 36, gap 22 */}
        <div className="grid grid-cols-1 items-stretch gap-[22px] sm:grid-cols-3">
          {pricingConfig.plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onOpenDemoModal={onOpenDemoModal}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function PricingCard({ plan, selectedPlan, onSelectPlan, onOpenDemoModal }) {
  const isPopular = plan.popular;
  const isEnterprise = plan.action === 'book_demo';
  const { onMouseMove, onMouseLeave } = useHoverGlow();

  // Normalized key: 'starter', 'growth', 'enterprise'
  const planKey = plan.id.replace('plan-', '');
  // Selected if selectedPlan matches the normalized key or full plan.id
  const isSelected = selectedPlan === plan.id || selectedPlan === planKey;

  const handleCardClick = () => {
    onSelectPlan(planKey);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target !== e.currentTarget) return;
      e.preventDefault();
      onSelectPlan(planKey);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex flex-col justify-between rounded-[28px] p-9 hover-glow transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--c-indigo))]',
        isSelected
          ? 'border-2 border-slate-900 border-[rgb(var(--c-text))] bg-[rgb(var(--c-card))] shadow-lg scale-[1.01]'
          : 'border border-slate-200 border-[var(--line)] hover:border-slate-300 hover:border-[var(--line-strong)] bg-[rgb(var(--c-card))] shadow-sm'
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[16px] font-bold uppercase tracking-wider text-[rgb(var(--c-muted-2))]">
            {plan.name}
          </span>
          {isPopular && (
            <span className="rounded-full bg-[rgb(var(--c-indigo))] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--c-btn-text))]">
              Popular
            </span>
          )}
        </div>

        {/* Price in Instrument Serif 60px */}
        <div className="mb-3 flex items-baseline gap-1.5">
          <span className="font-serif text-[60px] leading-none tracking-tight text-[rgb(var(--c-text))]">
            {plan.price}
          </span>
          {plan.billingPeriod && (
            <span className="text-[14px] font-normal text-[rgb(var(--c-muted))]">
              {plan.billingPeriod}
            </span>
          )}
        </div>

        <p className="mb-8 min-h-[44px] text-[15px] leading-relaxed text-[rgb(var(--c-muted))]">
          {plan.description}
        </p>

        {/* Feature checklist */}
        <div className="mb-8 space-y-3 border-t border-[var(--line)] pt-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgb(var(--c-muted-2))]">
            Included Capabilities
          </div>
          <ul className="space-y-2.5 text-[14px] text-[rgb(var(--c-text))]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 leading-snug">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--c-ok))]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)] pt-6">
        {isEnterprise ? (
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlan(planKey);
              onOpenDemoModal();
            }}
          >
            Book a demo
          </button>
        ) : isSelected ? (
          <Link
            to={`/checkout?plan=${plan.id}`}
            className="btn-gold w-full text-center"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlan(planKey);
            }}
          >
            Buy now
          </Link>
        ) : (
          <Link
            to={`/checkout?plan=${plan.id}`}
            className="btn-ghost w-full text-center"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlan(planKey);
            }}
          >
            Buy now
          </Link>
        )}

        {plan.id === 'plan-starter' && (
          <p className="mt-3 text-center text-[12px] leading-snug text-[rgb(var(--c-muted))]">
            Exceeding 50? Flexible $4/assessment overage or instant 1-click upgrade with no lock-in.
          </p>
        )}
        {plan.id === 'plan-growth' && (
          <p className="mt-3 text-center text-[12px] leading-snug text-[rgb(var(--c-muted))]">
            Exceeding 250? Flexible $3/assessment overage or instant enterprise scaling with no lock-in.
          </p>
        )}
        {isEnterprise && (
          <p className="mt-3 text-center text-[12px] leading-snug text-[rgb(var(--c-muted))]">
            Custom volume limits, tailored annual invoicing, and dedicated enterprise SLA terms.
          </p>
        )}
      </div>
    </div>
  );
}
