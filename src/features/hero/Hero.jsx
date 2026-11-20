import * as React from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';
import { Container } from '@/components/Container';
import { SlideIndicators } from './SlideIndicators';

const SLIDES = [
  {
    eyebrow: 'Technical assessment platform',
    line1: 'Hire Better Engineers.',
    line2: 'Faster.',
    description:
      'Secure technical assessments with AI-assisted evaluation, coding challenges and integrity monitoring, in one enterprise-grade platform.',
  },
  {
    eyebrow: 'Standardized evaluation',
    line1: 'Score every candidate',
    line2: 'the same way.',
    description:
      'Deterministic rubrics and AI evaluation eliminate interviewer variance across all engineering levels and roles.',
  },
  {
    eyebrow: 'Recruiter intelligence',
    line1: 'Give recruiters a shortlist,',
    line2: 'not a spreadsheet.',
    description:
      'Automatic P1, P2, and P3 tiering transforms raw code submissions into fast, confident hiring decisions.',
  },
  {
    eyebrow: 'Assessment integrity',
    line1: 'Prevent fraud before it',
    line2: 'reaches engineering.',
    description:
      'Automated session forensics, environment anomaly detection, and real-time plagiarism prevention ensure authentic candidate code.',
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

  const togglePlayback = () => setIsPlaying((prev) => !prev);
  const activeSlide = SLIDES[currentSlide];

  return (
    <section
      ref={heroTrackRef}
      id="hero"
      aria-label="Hero — Vantrix Screen"
      className="relative h-[280vh] w-full"
    >
      {/* Sticky Hero Viewport */}
      <div
        className="sticky top-0 flex h-screen min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] pt-16 text-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {/* Background scene gradient from spec */}
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background: 'var(--scene)',
          }}
          aria-hidden="true"
        />

        {/* Top ambient gold glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] -z-15"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 20%, var(--bg-glow-1) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Vertical overlay from spec */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(180deg, var(--hero-ov-top) 0%, var(--hero-ov-mid) 45%, var(--bg) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Main Centered Content Stack */}
        <Container className="relative z-10 flex flex-col items-center justify-center px-4 pt-8 pb-16 text-center sm:px-6">
          {/* Badge Pill: sparkle icon in --accent, "Technical assessment platform" */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--fill)] px-[18px] py-[10px] text-[14px] font-medium text-[var(--text)] backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[var(--accent)] shrink-0" />
            <span>{activeSlide.eyebrow}</span>
          </div>

          {/* H1 Headline: 88px/1.05, 800, tracking -0.04em, --gold-text-grad fill (Mobile 44px) */}
          <div
            key={currentSlide}
            className="flex min-h-[120px] items-center justify-center animate-fade-in transition-all duration-300 sm:min-h-[160px] lg:min-h-[190px]"
          >
            <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.04em] text-gold-gradient sm:text-[68px] lg:text-[88px]">
              <span>{activeSlide.line1}</span>
              <br />
              <span>{activeSlide.line2}</span>
            </h1>
          </div>

          {/* Paragraph: 19px/1.6 --muted, max-width 620px */}
          <p className="mt-[26px] max-w-[620px] text-[16px] leading-[1.65] text-[var(--muted)] sm:text-[19px]">
            {activeSlide.description}
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-[14px]">
            <button
              type="button"
              onClick={onOpenDemoModal}
              className="btn-gold"
              aria-label="Book a live product demo"
            >
              BOOK A DEMO
            </button>
            <a href="#pricing" className="btn-ghost">
              BUY NOW
            </a>
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

        {/* Bottom Right: 52px circular pause button (border --line-strong, bg --panel) */}
        <div className="absolute bottom-8 right-6 z-20 md:right-10">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={
              isPlaying
                ? 'Pause background video and slide transition'
                : 'Play background video and slide transition'
            }
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--text)] backdrop-blur-md transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}
