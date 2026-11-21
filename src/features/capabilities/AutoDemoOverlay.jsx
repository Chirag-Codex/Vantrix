import * as React from 'react';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * Scripted auto-demo for the hiring criteria builder (~7 seconds).
 * Derived from the product recording:
 * 0 - 1.5s: Scroll down to Nice to have.
 * 1.5 - 2.5s: SVG cursor enters and rests on Job titles with hover background.
 * 2.5 - 3.5s: Row lifts with soft shadow.
 * 3.5 - 5.0s: Cursor drags up, target zone in Must have tints and dashed line appears.
 * 5.0 - 5.8s: Row drops into Must have above Years of experience.
 * 5.8 - 7.0s: State settles and scrolls back to top.
 *
 * Interactive rules:
 * - Stops immediately on any user pointer or key event.
 * - Never loops.
 * - Under prefers-reduced-motion or global pause: disabled completely.
 */
export function AutoDemoOverlay({
  isPlaying,
  onStopDemo,
  onCompleteDrop,
  scrollContainerRef,
}) {
  const [motionState] = useMotionPreference();
  const [phase, setPhase] = React.useState('idle'); // 'scroll-down' | 'cursor-enter' | 'lift' | 'drag-up' | 'drop' | 'settle'
  const [cursorPos, setCursorPos] = React.useState({ x: 300, y: 400 });
  const [showCursor, setShowCursor] = React.useState(false);

  const isMotionAllowed =
    motionState !== 'reduce' &&
    motionState !== 'paused' &&
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    if (!isPlaying || !isMotionAllowed) {
      setPhase('idle');
      setShowCursor(false);
      return;
    }

    const container = scrollContainerRef?.current;
    const timers = [];

    // Stage 1: Scroll to Nice to have (0 - 1.5s)
    setPhase('scroll-down');
    setShowCursor(true);
    setCursorPos({ x: 340, y: 480 });
    if (container) {
      container.scrollTo({ top: 120, behavior: 'smooth' });
    }

    // Stage 2: Cursor enters & hovers on Job titles (1.5 - 2.5s)
    timers.push(
      setTimeout(() => {
        setPhase('cursor-enter');
        setCursorPos({ x: 140, y: 280 });
      }, 1500)
    );

    // Stage 3: Row lifts (2.5 - 3.5s)
    timers.push(
      setTimeout(() => {
        setPhase('lift');
        setCursorPos({ x: 160, y: 275 });
      }, 2500)
    );

    // Stage 4: Cursor drags up towards Must Have (3.5 - 5.0s)
    timers.push(
      setTimeout(() => {
        setPhase('drag-up');
        setCursorPos({ x: 180, y: 110 });
        if (container) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 3500)
    );

    // Stage 5: Drop occurs (5.0 - 5.8s)
    timers.push(
      setTimeout(() => {
        setPhase('drop');
        onCompleteDrop && onCompleteDrop();
      }, 5000)
    );

    // Stage 6: Settle and finish (5.8 - 7.0s)
    timers.push(
      setTimeout(() => {
        setPhase('settle');
        setShowCursor(false);
        onStopDemo && onStopDemo();
      }, 7000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isPlaying, isMotionAllowed, scrollContainerRef, onCompleteDrop, onStopDemo]);

  if (!isPlaying || !showCursor || !isMotionAllowed) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      {/* Animated SVG Cursor */}
      <div
        className="absolute pointer-events-none transition-all duration-700 ease-out"
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        <svg
          className="h-6 w-6 drop-shadow-md text-[rgb(var(--c-text))]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
        </svg>

        {/* Floating row preview while dragging */}
        {(phase === 'lift' || phase === 'drag-up') && (
          <div className="ml-4 mt-2 rounded-[14px] border border-[rgb(var(--c-indigo))] bg-[rgb(var(--c-tint))] px-3 py-1.5 shadow-xl text-[12px] font-bold text-[rgb(var(--c-text))]">
            Job titles (full-stack developer, team lead)
          </div>
        )}
      </div>

      {/* Drop Zone Highlight in Must Have when dragging up */}
      {phase === 'drag-up' && (
        <div className="absolute top-[165px] inset-x-6 z-20 flex items-center justify-center rounded-[14px] border-2 border-dashed border-[rgb(var(--c-indigo))] bg-[rgb(var(--c-tint)/0.6)] py-3 text-[12px] font-bold text-[rgb(var(--c-indigo))] animate-fade-in">
          Move to Must have
        </div>
      )}
    </div>
  );
}
