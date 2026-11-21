import { useEffect } from 'react';

/**
 * Pauses aurora blobs when the section is off-screen.
 * Sets data-motion="paused" / "running" on the element itself.
 */
export function useAuroraVisibility(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.motion = entry.isIntersecting ? 'running' : 'paused';
      },
      { rootMargin: '100px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
