# Design System Specification — Vantrix Screen

## 1. Typography System

### Display & Heading Typeface: Instrument Serif
- **Family:** `Instrument Serif, Georgia, serif`
- **Weights:** 400 Normal, 400 Italic only.
- **Synthesized Faux-Bold:** Explicitly forbidden (`font-synthesis: none`).
- **Files:** Self-hosted in `public/fonts/`:
  - `InstrumentSerif-Regular.woff2` (Latin subset, 21 KB)
  - `InstrumentSerif-Italic.woff2` (Latin subset, 22 KB)
- **Preloading:** `<link rel="preload" href="/fonts/InstrumentSerif-Regular.woff2" as="font" type="font/woff2" crossorigin>` in `index.html`.
- **Display Scales:**
  - Hero H1: `clamp(58px, 6.4vw, 92px)` / line-height `0.98` / tracking `-0.015em`
  - Section H2: `clamp(34px, 3.9vw, 56px)` / line-height `1.04` / tracking `-0.015em`
  - CTA Band H2: `clamp(40px, 4.4vw, 64px)` / line-height `1.04` / tracking `-0.015em`
  - Pricing Price: `60px` / line-height `1.0` / tracking `-0.02em`
  - Showcase Active Item: `38px` / line-height `1.15`
  - Audience Split Titles: `56px` / line-height `1.0`

### UI & Body Typeface: Manrope
- **Family:** `'Manrope', system-ui, -apple-system, sans-serif`
- **Weights:** 400, 500, 600, 700, 800
- **Body Text:** 17px/1.6 or 15px/1.6 in `--c-muted` (`#4B5470`)
- **Buttons & Pills:** 15px / weight 600 / height 46px-52px / radius 9999px (full pill)
- **Eyebrow:** 13px / weight 700 / tracking `0.14em` / uppercase in `--c-indigo` (`#5B3DF5`)

---

## 2. Radii & Surface Elevation
- **Cards:** `28px` (`rounded-[28px]`, `rounded-card`)
- **Large Panels:** `32px` (`rounded-[32px]`, `rounded-lg-panel`)
- **CTA Band:** `36px` (`rounded-[36px]`, `rounded-cta`)
- **Inner Sub-panels & Code Blocks:** `20px` (`rounded-[20px]`, `rounded-inner`)
- **Buttons & Chips:** Full pill (`9999px`)
- **Card Shadow:** `0 1px 2px rgba(11,16,32,.04), 0 18px 50px rgba(40,50,120,.10)`

---

## 3. Ambient Pastel Mesh / Aura System

### Visual Concept & Analysis (HackerRank Reference Style)
A slow-moving, atmospheric ambient pastel mesh/aura animation with smooth mouse-reactive parallax drift. Modeled after light editorial tech landing pages:
- Low-saturation pastel tones: mint/sage green, pale aqua/cyan, faint lavender/periwinkle, warm pale yellow/cream, soft sky blue.
- Left-side contrast protection: the left side under the primary H1 headline stays clean/white for maximum typography readability and WCAG contrast (15:1+), while the soft aura blossoms across the center-right and upper-right.
- Seamless continuous ambient drift: 12s–20s sinusoidal motion loops with multi-frequency phase offsets.
- Mouse-interactive inertia: colors subtly float and follow cursor movement with smoothed spring/lerp physics.
- Wide multi-stop radial diffusion + subtle SVG noise dither (`#mesh-aura-noise`) to completely eliminate gradient banding.
- Hardware-accelerated Canvas with 60fps compositor performance and automatic off-screen pause via `IntersectionObserver`.

### Component & Tuning Config (`src/components/PastelMeshAura.jsx`)
```javascript
export const AURA_CONFIG = {
  backgroundColor: '#F6F7FC',
  palette: {
    mint:     'rgba(196, 242, 221, 0.72)',
    aqua:     'rgba(201, 238, 247, 0.68)',
    lavender: 'rgba(226, 218, 250, 0.62)',
    cream:    'rgba(252, 248, 228, 0.58)',
    sky:      'rgba(214, 238, 255, 0.62)',
  },
  speed: 0.00045,        // ambient drift speed multiplier
  mouseInfluence: 0.075, // mouse displacement strength
  mouseEasing: 0.045,    // inertia smoothness (lerp step)
  zones: [ ... ],        // 5 fluid color zones
};
```

### Motion Constraints & Rules
- **Properties Animated:** Strictly `transform: translate3d(...) scale(...)`.
- **Zero Heavy Filters:** No `filter: blur()`, `backdrop-filter`, or `mix-blend-mode`.
- **GPU Promotion:** `will-change: transform` only on `.aurora__blob`.
- **Durations:** 28s – 44s, ease-in-out, infinite alternate, negative delays.
- **Max Instances:** At most 2 running instances in viewport concurrently.

---

## 4. Hooks Specification
- `useAuroraVisibility(ref)`: IntersectionObserver with `rootMargin: '100px'` that sets `data-motion="running" | "paused"` on the aurora element when off-screen.
- `useMotionPreference()`: Sole writer of `<html data-motion>`. Reads/writes `localStorage.getItem('motion')`, listens to `(prefers-reduced-motion: reduce)`.
- `useHoverGlow()`: Attaches mouse move handlers to fine pointers that update `--glow-x` and `--glow-y` CSS properties on requestAnimationFrame for `.hover-glow::before` radial lilac glow.
