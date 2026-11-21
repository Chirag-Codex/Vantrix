import { useEffect, useState } from 'react';

const STORAGE_KEY = 'motion';

/**
 * Single writer of <html data-motion>.
 * Returns [motionState, setMotionState].
 * motionState: 'running' | 'paused' | 'reduce'
 */
export function useMotionPreference() {
  const getInitial = () => {
    // OS reduced motion wins
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'reduce';
    }
    try {
      return localStorage.getItem(STORAGE_KEY) || 'running';
    } catch {
      return 'running';
    }
  };

  const [state, setState] = useState(getInitial);

  useEffect(() => {
    document.documentElement.dataset.motion = state;
    if (state !== 'reduce') {
      try {
        localStorage.setItem(STORAGE_KEY, state);
      } catch {
        /* ignore */
      }
    }
  }, [state]);

  // Listen for OS preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => {
      if (e.matches) setState('reduce');
      else {
        try {
          setState(localStorage.getItem(STORAGE_KEY) || 'running');
        } catch {
          setState('running');
        }
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return [state, setState];
}
