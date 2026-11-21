import { useCallback, useRef } from 'react';

/**
 * Moves a radial glow ::before layer via CSS custom properties.
 * Fine pointers only. One rAF per move event.
 * Usage:
 *   const { onMouseMove, onMouseLeave } = useHoverGlow();
 *   <div className="hover-glow" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
 */
export function useHoverGlow() {
  const rafRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    // Skip coarse pointers (touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    if (rafRef.current) return; // already scheduled

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = e.currentTarget;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--glow-x', `${x}%`);
      el.style.setProperty('--glow-y', `${y}%`);
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return { onMouseMove, onMouseLeave };
}
