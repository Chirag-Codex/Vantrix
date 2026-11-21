import * as React from 'react';
import { Container } from '@/components/Container';
import { newsConfig } from '@/config/news';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function NewsSection() {
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  return (
    <section id="news" className="py-20 md:py-28">
      <Container>
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <h2 className="heading-h2 heading-h2--center text-center w-full">
            Catch up on the latest news
          </h2>
        </div>

        {/* 3 glass cards (padding 32px, radius 32px), 18px/700 headline, "Read more →" in 14px muted */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {newsConfig.articles.map((item) => (
            <article
              key={item.id}
              className="v-card group flex flex-col justify-between p-8"
            >
              <div>
                <div className="mb-4 flex items-center gap-2.5 text-[12px] font-bold text-[var(--accent)]">
                  <span className="rounded-full bg-[var(--gold-soft)] px-3 py-0.5">
                    {item.tag}
                  </span>
                  <span className="text-[var(--muted2)]">• {item.date}</span>
                </div>
                <h3 className="mb-3 text-[18px] font-bold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                  {item.title}
                </h3>
                <p className="mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
                  {item.snippet}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(item)}
                className="inline-flex cursor-pointer items-center gap-2 pt-2 text-[14px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)] group-hover:text-[var(--accent)]"
                aria-label={`Read article: ${item.title}`}
              >
                <span>Read article</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        {/* Article Preview Modal */}
        {selectedArticle && (
          <Dialog open={Boolean(selectedArticle)} onOpenChange={() => setSelectedArticle(null)}>
            <DialogContent className="max-w-xl rounded-[32px] border border-[var(--line)] bg-[var(--panel)] p-6 backdrop-blur-xl md:p-8">
              <DialogHeader>
                <div className="mb-3 flex items-center gap-3 text-[12px] font-bold text-[var(--accent)]">
                  <span className="rounded-full bg-[var(--gold-soft)] px-3 py-0.5">
                    {selectedArticle.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--muted2)]">
                    <Calendar className="h-3.5 w-3.5" /> {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--muted2)]">
                    <Clock className="h-3.5 w-3.5" /> {selectedArticle.readTime}
                  </span>
                </div>
                <DialogTitle className="text-[22px] font-bold leading-snug text-[var(--text)]">
                  {selectedArticle.title}
                </DialogTitle>
                <DialogDescription className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                  {selectedArticle.snippet}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3.5 border-t border-[var(--line)] pt-4 text-[14px] leading-relaxed text-[var(--text)]">
                <p>
                  As enterprise software delivery cycles compress, modern engineering teams face unprecedented pressure to evaluate technical talent objectively. Traditional resume screens and unstructured interviews introduce variance that costs organizations months in failed onboarding.
                </p>
                <p>
                  Vantrix Screen introduces deterministic, sandbox-verified challenge environments with automated test suites and behavioral integrity monitoring. By shifting evaluation from subjective guesswork to reproducible execution signals, engineering leaders can extend offers with complete conviction.
                </p>
              </div>

              <div className="mt-6 flex justify-end border-t border-[var(--line)] pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="btn-ghost"
                >
                  Close
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Container>
    </section>
  );
}
