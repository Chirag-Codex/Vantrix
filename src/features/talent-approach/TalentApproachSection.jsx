import * as React from 'react';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { useHoverGlow } from '@/hooks/useHoverGlow';
import { cn } from '@/lib/utils';

export const TALENT_STEPS = [
  {
    step: '01',
    title: 'Understand',
    description: 'Role requirements, team context, and operational environment.',
  },
  {
    step: '02',
    title: 'Source',
    description: 'Targeted sourcing across active & passive talent networks.',
  },
  {
    step: '03',
    title: 'Evaluate',
    description: 'Assess technical depth, domain exposure, & cultural fit.',
  },
  {
    step: '04',
    title: 'Prepare',
    description: 'Guide candidates on interview expectations & key context.',
  },
  {
    step: '05',
    title: 'Coordinate',
    description: 'Manage scheduling, interview ops, & feedback loops.',
  },
  {
    step: '06',
    title: 'Close',
    description: 'Support offer negotiation, candidate alignment, & joining.',
  },
  {
    step: '07',
    title: 'Support',
    description: 'Provide ongoing EOR, employment admin, & team support.',
  },
];

export function TalentApproachSection() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { onMouseMove, onMouseLeave } = useHoverGlow();

  const handleSelect = (index) => {
    setActiveStep(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(index);
    }
  };

  return (
    <section
      id="talent-approach"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-label="The Vantrix Talent Approach"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
          <Eyebrow>EXECUTION FRAMEWORK</Eyebrow>
          <h2 className="heading-h2 heading-h2--center mt-3 font-serif text-center w-full">
            The Vantrix Talent Approach
          </h2>
          <p className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-[rgb(var(--c-muted))]">
            We don&apos;t just forward CVs. We execute a disciplined 7-step process from discovery
            through onboarding and ongoing workforce support.
          </p>
        </div>

        {/* 7-Step Expanding Flex-Accordion */}
        <div
          className="flex flex-col lg:flex-row gap-3 w-full"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          role="region"
          aria-label="7-step talent delivery process"
        >
          {TALENT_STEPS.map((item, index) => {
            const isActive = activeStep === index;

            return (
              <div
                key={item.step}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`Step ${item.step}: ${item.title}`}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => handleSelect(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'group relative flex flex-col justify-start rounded-[24px] p-6 transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--c-indigo))] overflow-hidden',
                  'motion-reduce:transition-none',
                  // Desktop flex transition: 0.5s cubic-bezier(0.22, 1, 0.36, 1)
                  'lg:h-[340px] lg:duration-500 lg:ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isActive
                    ? 'lg:flex-[3.5] border-2 border-[rgb(var(--c-indigo))] bg-[rgb(var(--c-card))] shadow-lg shadow-[rgb(var(--c-indigo)/0.08)]'
                    : 'lg:flex-1 border border-[var(--line)] bg-[rgb(var(--c-card))] hover:border-[var(--line-strong)] hover:bg-[rgb(var(--c-tint)/0.25)] shadow-sm'
                )}
                style={{
                  transitionProperty: 'flex, border-color, box-shadow, background-color',
                }}
              >
                {/* Step Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-mono text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-200',
                      isActive
                        ? 'text-[rgb(var(--c-indigo))]'
                        : 'text-[rgb(var(--c-blue))] opacity-80 group-hover:opacity-100'
                    )}
                  >
                    {item.step}
                  </span>
                  {/* Subtle active status dot */}
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full transition-all duration-300',
                      isActive
                        ? 'bg-[rgb(var(--c-indigo))] scale-100 opacity-100'
                        : 'scale-0 opacity-0'
                    )}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <div className="mt-3 lg:mt-4">
                  <h3
                    className={cn(
                      'text-lg lg:text-xl font-bold tracking-tight transition-colors duration-200',
                      isActive
                        ? 'text-[rgb(var(--c-text))]'
                        : 'text-[rgb(var(--c-text))] group-hover:text-[rgb(var(--c-indigo))]'
                    )}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Desktop: Animated Smooth Text Reveal with min-width wrapper to prevent reflow */}
                <div className="hidden lg:block mt-3 flex-1">
                  <div
                    className={cn(
                      'min-w-[210px] transition-all duration-300 ease-out',
                      isActive
                        ? 'opacity-100 translate-y-0 delay-[120ms]'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    )}
                  >
                    <p className="text-[14px] leading-relaxed text-[rgb(var(--c-muted))]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mobile / Tablet (< lg): Vertical CSS Grid Accordion Collapse/Expand */}
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out lg:hidden',
                    isActive ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-[14px] leading-relaxed text-[rgb(var(--c-muted))] pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
