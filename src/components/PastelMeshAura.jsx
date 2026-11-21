import * as React from 'react';

/**
 * ============================================================================
 * VANTRIX PASTEL MESH AURA
 * Slow-moving ambient pastel mesh / aura background animation with smooth
 * mouse-reactive parallax drift, modeled after high-end editorial tech sites.
 *
 * Technical Features:
 * - Multi-stop radial diffusion to eliminate banding
 * - Organic multi-frequency sinusoidal ambient drift (12s–20s cycles)
 * - Mouse-interactive inertia with fluid lag/easing (lerp)
 * - Contrast protection: left side stays clean/white for dark display typography
 * - Automatic pause when off-screen (IntersectionObserver)
 * - Respects prefers-reduced-motion and html[data-motion="paused"]
 * - Hardware-accelerated Canvas with subtle SVG noise dither
 * ============================================================================
 */

// User-tunable configuration parameters
export const AURA_CONFIG = {
  // Base canvas background (matches --c-bg)
  backgroundColor: '#F6F7FC',

  // Soft low-saturation pastel palette
  palette: {
    mint: 'rgba(196, 242, 221, 0.72)',     // Soft mint / sage green
    aqua: 'rgba(201, 238, 247, 0.68)',     // Pale aqua / cyan
    lavender: 'rgba(226, 218, 250, 0.62)', // Faint lavender / periwinkle
    cream: 'rgba(252, 248, 228, 0.58)',    // Warm pale yellow / cream
    sky: 'rgba(214, 238, 255, 0.62)',      // Soft sky blue
  },

  // Motion Profile & Speeds
  speed: 0.00045,           // Base ambient drift speed (lower = slower, more calm)
  mouseInfluence: 0.075,    // How much mouse movement displaces the aura (0 = none)
  mouseEasing: 0.045,       // Mouse inertia smoothness (lower = silkier, higher = snappier)

  // Fluid Color Zones (organic drifting blobs)
  // Base coordinates are concentrated toward center and upper-right (X: 0.45 - 0.85)
  // so the left side remains predominantly clean/white for headline contrast.
  zones: [
    {
      colorKey: 'mint',
      baseX: 0.64,
      baseY: 0.22,
      radiusRatio: 0.54,
      driftX: 0.09,
      driftY: 0.06,
      frequency: 1.0,
      phase: 0.0,
      scaleAmp: 0.10,
    },
    {
      colorKey: 'aqua',
      baseX: 0.84,
      baseY: 0.36,
      radiusRatio: 0.60,
      driftX: 0.07,
      driftY: 0.08,
      frequency: 0.82,
      phase: 1.9,
      scaleAmp: 0.12,
    },
    {
      colorKey: 'lavender',
      baseX: 0.52,
      baseY: 0.46,
      radiusRatio: 0.52,
      driftX: 0.08,
      driftY: 0.07,
      frequency: 1.15,
      phase: 3.6,
      scaleAmp: 0.14,
    },
    {
      colorKey: 'cream',
      baseX: 0.78,
      baseY: 0.14,
      radiusRatio: 0.46,
      driftX: 0.05,
      driftY: 0.05,
      frequency: 0.75,
      phase: 5.1,
      scaleAmp: 0.08,
    },
    {
      colorKey: 'sky',
      baseX: 0.44,
      baseY: 0.18,
      radiusRatio: 0.48,
      driftX: 0.06,
      driftY: 0.06,
      frequency: 0.94,
      phase: 2.8,
      scaleAmp: 0.09,
    },
  ],
};

// Pre-compute multi-stop radial diffusion stops for smooth Gaussian-like falloff
function computeColorStops(rgba) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return [{ stop: 0, color: rgba }, { stop: 1, color: 'transparent' }];
  const [, r, g, b, a = '1'] = match;
  const alpha = parseFloat(a);

  return [
    { stop: 0.00, color: `rgba(${r}, ${g}, ${b}, ${alpha})` },
    { stop: 0.22, color: `rgba(${r}, ${g}, ${b}, ${(alpha * 0.82).toFixed(3)})` },
    { stop: 0.46, color: `rgba(${r}, ${g}, ${b}, ${(alpha * 0.52).toFixed(3)})` },
    { stop: 0.70, color: `rgba(${r}, ${g}, ${b}, ${(alpha * 0.22).toFixed(3)})` },
    { stop: 0.88, color: `rgba(${r}, ${g}, ${b}, ${(alpha * 0.05).toFixed(3)})` },
    { stop: 1.00, color: `rgba(${r}, ${g}, ${b}, 0)` },
  ];
}

/**
 * PastelMeshAura Component
 *
 * @param {object} props
 * @param {string} [props.className] - Extra Tailwind/CSS classes
 * @param {object} [props.config] - Optional config overrides (palette, speed, zones)
 * @param {React.RefObject} [props.interactiveTargetRef] - Element to listen for mouse move (defaults to parent)
 */
export function PastelMeshAura({
  className = '',
  config = AURA_CONFIG,
  interactiveTargetRef,
}) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const isVisibleRef = React.useRef(true);
  const isPausedRef = React.useRef(false);

  // Mouse interaction state (normalized -0.5 to 0.5)
  const targetMouseRef = React.useRef({ x: 0, y: 0 });
  const currentMouseRef = React.useRef({ x: 0, y: 0 });

  // Animation timestamp reference
  const timeRef = React.useRef(0);
  const rafIdRef = React.useRef(null);

  // Pre-calculate stops for all configured colors
  const colorStopsMap = React.useMemo(() => {
    const map = {};
    for (const [key, rgba] of Object.entries(config.palette)) {
      map[key] = computeColorStops(rgba);
    }
    return map;
  }, [config.palette]);

  // Handle mouse move on interactive target
  React.useEffect(() => {
    const targetEl = (interactiveTargetRef && interactiveTargetRef.current) || containerRef.current?.parentElement || containerRef.current;
    if (!targetEl) return;

    const handlePointerMove = (e) => {
      // Skip coarse pointers for battery / touch optimization
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const rect = targetEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Normalized coordinates: -0.5 (left/top) to +0.5 (right/bottom)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetMouseRef.current = { x, y };
    };

    const handlePointerLeave = () => {
      // Gently return to center when mouse leaves
      targetMouseRef.current = { x: 0, y: 0 };
    };

    targetEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    targetEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      targetEl.removeEventListener('pointermove', handlePointerMove);
      targetEl.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [interactiveTargetRef]);

  // Check prefers-reduced-motion and document motion state
  React.useEffect(() => {
    const checkMotionPref = () => {
      const isOsReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDocPaused = document.documentElement.dataset.motion === 'paused' || document.documentElement.dataset.motion === 'reduce';
      isPausedRef.current = isOsReduced || isDocPaused;
    };

    checkMotionPref();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkMotionPref);

    const observer = new MutationObserver(() => checkMotionPref());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });

    return () => {
      mediaQuery.removeEventListener('change', checkMotionPref);
      observer.disconnect();
    };
  }, []);

  // IntersectionObserver to pause when off-screen
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '120px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Main Canvas render loop
  React.useEffect(() => {
    // In headless test environments (jsdom), skip canvas loop
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return;

    let ctx = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      // Graceful fallback in environments without Canvas (e.g. jsdom / SSR)
      return;
    }
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for high performance
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      // Smooth continuous time accumulator
      if (!isPausedRef.current && isVisibleRef.current) {
        timeRef.current += 16.6; // ~60fps step
      }

      // Smooth mouse lerp
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * config.mouseEasing;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * config.mouseEasing;

      if (width > 0 && height > 0) {
        ctx.save();
        ctx.scale(dpr, dpr);

        // 1. Clear with base background
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // 2. Draw each drifting pastel zone with multi-stop radial diffusion
        const t = timeRef.current * config.speed;
        const baseDim = Math.max(width, height);

        config.zones.forEach((zone) => {
          const stops = colorStopsMap[zone.colorKey] || [];
          if (stops.length === 0) return;

          // Sinusoidal ambient drift (multi-frequency)
          const angle = t * zone.frequency + zone.phase;
          const driftOffsetNormX = Math.sin(angle) * zone.driftX;
          const driftOffsetNormY = Math.cos(angle * 0.85 + zone.phase) * zone.driftY;

          // Mouse reactive displacement
          const mouseDisplaceX = currentMouseRef.current.x * config.mouseInfluence;
          const mouseDisplaceY = currentMouseRef.current.y * config.mouseInfluence;

          // Compute pixel center
          const cx = (zone.baseX + driftOffsetNormX + mouseDisplaceX) * width;
          const cy = (zone.baseY + driftOffsetNormY + mouseDisplaceY) * height;

          // Gentle scale breathing
          const scaleMod = 1.0 + Math.sin(angle * 1.2 + zone.phase) * zone.scaleAmp;
          const radius = baseDim * zone.radiusRatio * scaleMod;

          if (radius <= 0) return;

          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          stops.forEach(({ stop, color }) => {
            grad.addColorStop(stop, color);
          });

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // 3. Contrast falloff protection layer for display typography on left:
        // Soft gradient wash from solid background on the left to transparent on the right
        const contrastGrad = ctx.createLinearGradient(0, 0, width * 0.65, 0);
        contrastGrad.addColorStop(0.0, 'rgba(246, 247, 252, 0.92)');
        contrastGrad.addColorStop(0.35, 'rgba(246, 247, 252, 0.65)');
        contrastGrad.addColorStop(0.70, 'rgba(246, 247, 252, 0.20)');
        contrastGrad.addColorStop(1.0, 'rgba(246, 247, 252, 0.0)');

        ctx.fillStyle = contrastGrad;
        ctx.fillRect(0, 0, width, height);

        // 4. Subtle top wash for seamless navbar integration
        const topWash = ctx.createLinearGradient(0, 0, 0, height * 0.4);
        topWash.addColorStop(0, 'rgba(203, 234, 255, 0.35)');
        topWash.addColorStop(1, 'rgba(203, 234, 255, 0)');
        ctx.fillStyle = topWash;
        ctx.fillRect(0, 0, width, height * 0.4);

        ctx.restore();
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [colorStopsMap, config]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Hardware-accelerated canvas background */}
      <canvas
        ref={canvasRef}
        className="h-full w-full block will-change-transform"
      />

      {/* Subtle organic noise/dither overlay to eliminate 8-bit banding */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.022] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="mesh-aura-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#mesh-aura-noise)" />
      </svg>
    </div>
  );
}
