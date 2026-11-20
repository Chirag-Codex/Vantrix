import { pricingConfig } from '@/config/pricing';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function PricingSection({ onOpenDemoModal }) {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <Container>
        {/* Eyebrow + Heading */}
        <div className="mb-12 text-center md:mb-16">
          <Eyebrow>PRICING</Eyebrow>
          <h2 className="heading-h2 mt-3">
            Start today, or talk to us first
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-relaxed text-[var(--muted)]">
            Check out in minutes. Your onboarding call is booked straight after payment.
          </p>
        </div>

        {/* 3 glass cards, 24px gap, padding 36px, radius 32px */}
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
          {pricingConfig.plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} onOpenDemoModal={onOpenDemoModal} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function PricingCard({ plan, onOpenDemoModal }) {
  const isPopular = plan.popular;
  const isEnterprise = plan.action === 'book_demo';

  return (
    <div
      className={cn(
        'v-card relative flex flex-col justify-between p-8 md:p-9 transition-all duration-200',
        isPopular
          ? 'border-[var(--accent)] shadow-[0_0_80px_var(--glow)] ring-1 ring-[var(--accent)]'
          : ''
      )}
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[16px] font-bold uppercase tracking-wider text-[var(--muted2)]">
            {plan.name}
          </span>
          {isPopular && (
            <span className="rounded-full bg-[var(--gold-grad)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--on-gold)]">
              POPULAR
            </span>
          )}
        </div>

        <div className="mb-3 flex items-baseline gap-1.5 text-[44px] font-extrabold tracking-[-0.03em] text-[var(--text)]">
          <span>{plan.price}</span>
          {plan.billingPeriod && (
            <span className="text-[14px] font-normal text-[var(--muted)]">{plan.billingPeriod}</span>
          )}
        </div>

        <p className="mb-8 min-h-[44px] text-[15px] leading-relaxed text-[var(--muted)]">
          {plan.description}
        </p>

        {/* Feature checklist */}
        <div className="mb-8 space-y-3 border-t border-[var(--line)] pt-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted2)]">
            Included Capabilities
          </div>
          <ul className="space-y-2.5 text-[14px] text-[var(--text)]">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 leading-snug">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
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
            onClick={onOpenDemoModal}
          >
            BOOK A DEMO
          </button>
        ) : isPopular ? (
          <Link
            to={`/checkout?plan=${plan.id}`}
            className="btn-gold w-full text-center"
          >
            BUY NOW
          </Link>
        ) : (
          <Link
            to={`/checkout?plan=${plan.id}`}
            className="btn-ghost w-full text-center"
          >
            BUY NOW
          </Link>
        )}
      </div>
    </div>
  );
}
