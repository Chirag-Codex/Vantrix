import { Container } from '@/components/Container';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { faqConfig } from '@/config/faq';

export function FaqSection() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <Container className="max-w-3xl">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <h2 className="heading-h2 heading-h2--center text-center w-full">
            {faqConfig.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
            {faqConfig.subheading}
          </p>
        </div>

        {/* Glass accordion container with 32px radius, row padding 20px */}
        <div className="v-card px-6 sm:px-8 py-2 rounded-[32px]">
          <Accordion type="single" collapsible className="w-full">
            {faqConfig.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-[var(--line)] py-2 last:border-b-0"
              >
                <AccordionTrigger className="py-5 text-[16px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)] text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-[var(--muted)]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
