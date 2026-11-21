import { Pause, Play } from 'lucide-react';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * MotionToggle — 44px circular button at hero's bottom-right.
 * Toggles global aurora animation pause state.
 * Hidden Play action when OS requests reduced motion.
 */
export function MotionToggle() {
  const [motionState, setMotionState] = useMotionPreference();

  const isOsReduced = motionState === 'reduce';
  const isPaused = motionState === 'paused';

  // Under OS reduced motion: hide the toggle entirely (nothing to play)
  if (isOsReduced) return null;

  const toggle = () => {
    setMotionState((prev) => (prev === 'paused' ? 'running' : 'paused'));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isPaused}
      aria-label={isPaused ? 'Play background animation' : 'Pause background animation'}
      className="
        flex h-11 w-11 items-center justify-center rounded-full
        border border-[var(--line-strong)]
        bg-[rgb(var(--c-card)/0.8)] text-[rgb(var(--c-text))]
        transition-colors duration-150
        hover:border-[rgb(var(--c-indigo))]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[rgb(var(--c-indigo))] focus-visible:ring-offset-2
        cursor-pointer
      "
    >
      {isPaused
        ? <Play className="ml-0.5 h-4 w-4" />
        : <Pause className="h-4 w-4" />
      }
    </button>
  );
}
