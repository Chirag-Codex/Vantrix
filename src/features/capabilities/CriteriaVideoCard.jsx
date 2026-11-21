import * as React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function CriteriaVideoCard({ replayTrigger = 0, onOpenDemoModal }) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const videoRef = React.useRef(null);

  // Check prefers-reduced-motion
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    }
  }, []);

  // Control video playback based on isPlaying state
  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Listen for replayTrigger from parent "Replay demo" button
  React.useEffect(() => {
    if (replayTrigger > 0) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  }, [replayTrigger]);

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    setIsPlaying((prev) => {
      const next = !prev;
      if (videoRef.current) {
        if (next) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
      return next;
    });
  };

  const handleReplay = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
  };

  return (
    <div className="relative flex h-[560px] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-[var(--line)] bg-[rgb(var(--c-card))] p-5 shadow-[var(--shadow-card)]">
      {/* Top Header Bar with Live Indicator, Clean Controls & Status Badge */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--c-ok))] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-ok))]" />
          </span>
          <span className="text-[12px] font-semibold tracking-wide uppercase text-[rgb(var(--c-muted))]">
            Vantrix Criteria Engine
          </span>
        </div>

        {/* Playback Controls & Status Badge placed cleanly in header */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[rgb(var(--c-chip))] px-2 py-0.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[rgb(var(--c-text))] hover:bg-[rgb(var(--c-card))] transition-colors"
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
            </button>
            <button
              type="button"
              onClick={handleReplay}
              aria-label="Replay preview"
              className="flex h-6 w-6 items-center justify-center rounded-full text-[rgb(var(--c-text))] hover:bg-[rgb(var(--c-card))] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
          <span className="rounded-full bg-[rgb(var(--c-chip))] px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-[rgb(var(--c-indigo))]">
            Live Preview
          </span>
        </div>
      </div>

      {/* Main Body Viewport — High-performance video with animated WebP and poster fallback */}
      <div
        className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-[rgb(var(--c-bg))] my-3 cursor-pointer"
        onClick={handleTogglePlay}
        role="region"
        aria-label="Vantrix Screen AI criteria builder preview"
      >
        <video
          ref={videoRef}
          src="/vantrix-criteria-engine.mp4"
          poster="/vantrix-criteria-poster.png"
          autoPlay
          muted
          loop
          playsInline
          className="h-full max-h-[440px] w-auto max-w-full rounded-[16px] object-contain shadow-sm select-none"
          aria-label="Vantrix Screen criteria engine extracting must-have and nice-to-have skills for a full-stack developer role"
        >
          <img
            src="/vantrix-criteria-engine.webp"
            alt="Vantrix Screen criteria engine extracting must-have and nice-to-have skills for a full-stack developer role"
            className="h-full max-h-[440px] w-auto max-w-full rounded-[16px] object-contain shadow-sm select-none"
          />
        </video>
      </div>

      {/* Footer Info / Action Row */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[12px] text-[rgb(var(--c-muted-2))]">
        <span>Vantrix Screen Sourcing Intelligence</span>
        <button
          type="button"
          onClick={onOpenDemoModal}
          className="font-medium text-[rgb(var(--c-indigo))] hover:underline"
        >
          Book a demo →
        </button>
      </div>
    </div>
  );
}
