import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/Container';
import { SlideIndicators } from './SlideIndicators';
import { Aurora } from '@/components/Aurora';
import { AURORA } from '@/config/aurora';
import { PastelMeshAura } from '@/components/PastelMeshAura';

const SLIDES = [
  {
    eyebrow: 'Technical assessment platform',
    line1: 'Hire Better Engineers.',
    line2: null,
    accent: 'Faster.',
    description:
      'Secure technical assessments with AI-assisted evaluation, coding challenges and integrity monitoring, in one enterprise-grade platform.',
    lead: 'Provisional, tamper-aware scoring with clear candidate guidance.',
  },
  {
    eyebrow: 'Standardized evaluation',
    line1: 'Score every candidate',
    line2: 'the same',
    accent: 'way.',
    description:
      'Deterministic rubrics and AI evaluation eliminate interviewer variance across all engineering levels and roles.',
    lead: 'Eliminate bias with deterministic rubrics and AI evaluation.',
  },
  {
    eyebrow: 'Recruiter intelligence',
    line1: 'Give recruiters a shortlist,',
    line2: 'not a',
    accent: 'spreadsheet.',
    description:
      'Automatic P1, P2, and P3 tiering transforms raw code submissions into fast, confident hiring decisions.',
    lead: 'Automatic P1/P2/P3 tiering, right in the recruiter dashboard.',
  },
  {
    eyebrow: 'Assessment integrity',
    line1: 'Prevent fraud before it',
    line2: 'reaches',
    accent: 'engineering.',
    description:
      'Automated session forensics, environment anomaly detection, and real-time plagiarism prevention ensure authentic candidate code.',
    lead: 'Session forensics, anomaly detection and plagiarism prevention.',
  },
];

export function Hero({ onOpenDemoModal }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [prefersReduced, setPrefersReduced] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const heroTrackRef = React.useRef(null);
  const isProgrammaticScrollRef = React.useRef(false);

  // Motion and data-saver preference detection
  React.useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);

    if (motionQuery.matches || saveData) {
      setPrefersReduced(true);
      setIsPlaying(false);
    }

    const handler = (e) => {
      setPrefersReduced(e.matches);
      if (e.matches) setIsPlaying(false);
    };
    motionQuery.addEventListener('change', handler);
    return () => motionQuery.removeEventListener('change', handler);
  }, []);

  // Scroll position to active slide synchronization
  React.useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      if (!heroTrackRef.current) return;

      const rect = heroTrackRef.current.getBoundingClientRect();
      const trackHeight = heroTrackRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = trackHeight - windowHeight;
      if (maxScroll <= 0) return;

      const scrolled = -rect.top;
      if (scrolled <= 0) {
        setCurrentSlide(0);
        return;
      }

      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
      const slideIndex = Math.min(
        SLIDES.length - 1,
        Math.floor(progress * SLIDES.length)
      );
      setCurrentSlide(slideIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance slideshow timer if not scrolling or hovered
  React.useEffect(() => {
    if (!isPlaying || isHovered || prefersReduced) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, prefersReduced]);

  // Jump to specific slide (smoothly scrolls the track into position)
  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (!heroTrackRef.current) return;

    const rect = heroTrackRef.current.getBoundingClientRect();
    const trackHeight = heroTrackRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = trackHeight - windowHeight;
    if (maxScroll <= 0) return;

    const heroTop = window.scrollY + rect.top;
    const targetScroll = heroTop + (index / (SLIDES.length - 1)) * maxScroll;

    isProgrammaticScrollRef.current = true;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 600);
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <section
      ref={heroTrackRef}
      id="hero"
      aria-label="Hero — Vantrix Screen"
      className="relative h-[280vh] w-full"
    >
      {/* Sticky Hero Viewport */}
      <Aurora
        config={AURORA.hero}
        className="sticky top-0 h-screen min-h-[720px] w-full flex-col overflow-hidden pt-[76px]"
        style={{ display: 'flex', alignItems: 'stretch' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {/* Ambient Pastel Mesh Aura with Mouse-Reactive Drift */}
        <PastelMeshAura />

        {/* Two-column hero content */}
        <Container className="relative z-10 flex flex-1 items-center pt-[84px] pb-[64px] gap-16">
          {/* Left column — headline + CTAs */}
          <div className="flex-[1.15] min-w-0">
            {/* Eyebrow badge */}
            <div
              key={`eyebrow-${currentSlide}`}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgb(var(--c-card)/0.7)] px-4 py-2 text-[13px] font-medium text-[rgb(var(--c-text))] animate-fade-in"
            >
              <Sparkles className="h-3.5 w-3.5 text-[rgb(var(--c-indigo))] shrink-0" />
              <span>{activeSlide.eyebrow}</span>
            </div>

            {/* H1 */}
            <div
              key={`h1-${currentSlide}`}
              className="animate-fade-in"
            >
              <h1 className="heading-h1 font-serif">
                <span className="block">{activeSlide.line1}</span>
                {activeSlide.line2 !== null && (
                  <span className="block">
                    {activeSlide.line2}{' '}
                    <em className="accent-word" style={{ fontStyle: 'italic' }}>
                      {activeSlide.accent}
                    </em>
                  </span>
                )}
                {activeSlide.line2 === null && (
                  <span className="block">
                    <em className="accent-word" style={{ fontStyle: 'italic' }}>
                      {activeSlide.accent}
                    </em>
                  </span>
                )}
              </h1>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenDemoModal}
                className="btn-gold"
                aria-label="Book a live product demo"
              >
                Book a demo →
              </button>
              <a href="/#pricing" className="btn-ghost">
                Buy now
              </a>
            </div>
          </div>

          {/* Right column — lead + supporting text */}
          <div
            key={`right-${currentSlide}`}
            className="flex-1 min-w-0 hidden md:flex flex-col justify-center animate-fade-in"
            style={{ marginTop: '14px' }}
          >
            <p className="text-[21px] leading-[1.5] text-[rgb(var(--c-text))] font-medium mb-4">
              {activeSlide.lead || activeSlide.description.split(',')[0] + '.'}
            </p>
            <p className="text-[18px] leading-[1.6] text-[rgb(var(--c-muted))]">
              {activeSlide.description}
            </p>
          </div>
        </Container>

        {/* Right Edge: Vertical 4-dot slide indicator */}
        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 sm:flex md:right-10">
          <SlideIndicators
            totalSlides={SLIDES.length}
            currentSlide={currentSlide}
            onChangeSlide={goToSlide}
          />
        </div>
      </Aurora>
    </section>
  );
}
