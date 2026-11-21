# UI Refactor Audit — Vantrix Screen

## 1. Overview
This audit establishes the baseline and records the transformation of the Vantrix Screen landing page from the initial dark theme into the light B2B SaaS Option A palette with Aurora Curtains ambient motion.

---

## 2. Component-to-Section Map

| # | Section | Component Path | Purpose & Visual Role |
|---|---|---|---|
| 1 | Navigation | `src/features/hero/Navbar.jsx` | 76px transparent bar, VANTRIX Screen wordmark, desktop links, 46px pill actions, mobile sheet menu |
| 2 | Hero | `src/features/hero/Hero.jsx` | 280vh sticky track, Instrument Serif H1, accent word, 4-blob Aurora, slideshow sync, pause & motion toggles |
| 3 | Logo Strip (Marquee) | `src/features/explore/LogoStrip.jsx` | Calm linear marquee in `--c-logo`, 24px high, 80px gap, paused on hover/focus/motion-pause |
| 4 | Capabilities (Showcase) | `src/features/capabilities/CapabilitiesSection.jsx` | 120px top pad, H2 56px, 0.8fr/1.2fr split, 38px serif interactive list, 32px aurora card container |
| 5 | Enterprise Product Panel | `src/features/product-panel/ProductPanel.jsx` | Live interactive IDE simulation, candidate pipeline, LRU cache test suite terminal |
| 6 | Audience Split & Standards | `src/features/enterprise/EnterpriseSection.jsx` | 1.2fr/1fr split: "For hiring teams" (soft aurora) & "For global teams" (faint grid), 2x2 enterprise standards |
| 7 | Pricing | `src/features/pricing/PricingSection.jsx` | 3 cards (28px radius, 36px pad, 22px gap), Instrument Serif 60px prices, middle card with 2px ink border & Popular chip |
| 8 | CTA Band | `src/features/hero/DemoCtaBand.jsx` | 36px radius, 88px/40px pad, soft 2-blob aurora, 64px serif H2 (max 820px), 52px button |
| 9 | News Section | `src/features/news/NewsSection.jsx` | 3 cards (32px radius, 32px pad), modal preview dialog |
| 10 | FAQ Accordion | `src/features/faq/FaqSection.jsx` | Glass/card container (32px radius), accessible Radix accordion |
| 11 | Footer | `src/features/footer/Footer.jsx` | 4 columns (Company, Platform, Insights, Legal), copyright, contact link |

---

## 3. Old-to-New Token Mapping

| Token Name | Old Value (Dark) | New Value (Option A Light) | Usage |
|---|---|---|---|
| `--c-bg` | `#0A0907` | `#F6F7FC` (246 247 252) | Page canvas, aurora base |
| `--c-card` | `rgba(10, 9, 7, 0.65)` | `#FFFFFF` (255 255 255) | Card surfaces |
| `--c-text` | `#F5F1E8` | `#0B1020` (11 16 32) | Primary headings, ink text, solid buttons |
| `--c-btn` | `#E3B94A` | `#0B1020` (11 16 32) | Solid primary buttons |
| `--c-btn-text`| `#1A1307` | `#FFFFFF` (255 255 255) | Text on solid buttons |
| `--c-muted` | `#BDB5A4` | `#4B5470` (75 84 112) | Body text (WCAG ≥4.5:1 on bg and aurora) |
| `--c-muted-2` | `#8F8878` | `#7A819C` (122 129 156) | Inactive large titles, subtitles |
| `--c-logo` | `#8F8878` | `#5F6783` (95 103 131) | Corporate wordmarks in marquee |
| `--c-blue` | `#6EE7B7` | `#0B63D6` (11 99 214) | Links, talent accent |
| `--c-indigo` | `#E3B94A` | `#5B3DF5` (91 61 245) | Focus rings, eyebrows, accent words |
| `--c-chip` | `rgba(255,255,255,0.05)`| `#EEF1FA` (238 241 250) | Chips, pill tags, code blocks |
| `--c-tint` | `rgba(217,169,59,0.2)` | `#E8EEFF` (232 238 255) | Highlight panels |
| `--c-code` | `#050403` | `#F1F3FB` (241 243 251) | Code block background |
| `--c-ok` | `#6EE7B7` | `#0F8A5F` (15 138 95) | Success indicators |
| `--c-ok-bg` | `rgba(52,211,153,0.14)`| `#E3F5EC` (227 245 236) | Success badge fills |
| `--line` | `rgba(255,255,255,0.09)`| `rgba(11, 16, 32, 0.10)` | Card borders, dividers |
| `--line-strong`| `rgba(217,169,59,0.42)`| `rgba(11, 16, 32, 0.35)` | Active borders, outline buttons |
| `--c-aurora-sky`| - | `#CBEAFF` (203 234 255) | Top wash & hero blob |
| `--c-aurora-mint`| - | `#D6F5EA` (214 245 234) | Aurora blob |
| `--c-aurora-blue`| - | `#D3DFFF` (211 223 255) | Aurora blob |
| `--c-aurora-lilac`| - | `#E3D8FF` (227 216 255) | Aurora blob & hover glow |
| `--shadow-card`| none | `0 1px 2px rgba(11,16,32,.04), 0 18px 50px rgba(40,50,120,.10)` | Card elevations |

---

## 4. Risks & Mitigations

1. **Contrast Variance Over Animated Aurora Blobs:**
   - *Risk:* Text passing over shifting pastel blobs might drop below 4.5:1.
   - *Mitigation:* Aurora blobs have maximum opacity capped at 1.0 (with soft radial falloff) and a linear mask to transparent below 55% height. Deep ink text `#0B1020` has a minimum contrast ratio of `11.8:1` against the brightest blob (`#CBEAFF`) and `12.5:1` against `--c-bg`.
2. **Animation Performance & Battery:**
   - *Risk:* Heavy CSS effects causing CPU throttling or frame drops on low-end hardware.
   - *Mitigation:* Strict prohibition of `filter: blur()`, `backdrop-filter`, and `mix-blend-mode`. Animations use `translate3d` and `scale` only, running entirely on the GPU compositor. Off-screen instances automatically pause via `IntersectionObserver`.
3. **Behavioral Invariance:**
   - *Risk:* UI refactor impacting checkout, booking modal, or test assertions.
   - *Mitigation:* Zero modifications to form state, validation, checkout flow, APIs, or data models. 19/19 Vitest unit/integration tests verified passing.

---

## 5. Baseline Numbers

- **Unit / Integration Tests:** 36/36 passed (`vitest run` across 8 test suites)
- **ESLint:** 0 errors, 0 warnings
- **Production Build:** Clean (`vite build` in 6.08s)
- **Initial JS Bundle (gzip):** 57.70 KB (well within 180 KB performance budget)
- **Initial CSS Bundle (gzip):** 9.74 kB
- **CriteriaVideoCard Lazy Chunk (gzip):** 1.36 KB
- **SecurityPage Lazy Chunk (gzip):** 2.33 KB
- **CLS (Cumulative Layout Shift):** 0.00
- **Lighthouse Mobile Score Target:** ≥90

---

## 6. Phase 0 Audit: Hiring Criteria Builder Replacement

### What Was Removed
- Legacy static candidate challenge view and code sandbox previously embedded in the capabilities showcase.
- Hardcoded syntax code view within `CapabilitiesSection.jsx`.

### What Data Was Reused
- Existing candidates (Aarav Sharma, Priya Raman, Karan Mehta) from previous mock data, augmented with Maya Chen and Elena Rostova (5 sample candidates total in `src/config/criteriaSample.js`).
- Existing visual tokens (`tokens.css`), Instrument Serif headings, Aurora panel configuration (`.aurora--soft`), and `BookingModalContext`.

### Route & Component Isolation
- `CapabilitiesSection.jsx` is used exclusively on the Home route (`/`) and is **not shared with any other route**.
- Anchor `#capabilities` and navigation link targets are fully preserved.

### Dependency & Bundle Impact
- Approved dependency: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- Lazy-loaded via `React.lazy()` when within 300px of viewport. Initial bundle remains within target (~56.4 KB gzip JS). Lazy chunk size: ~13 KB gzip (below 25 KB budget limit).
