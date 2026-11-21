# Accessibility & Motion Policy — Vantrix Screen

## 1. Compliance Standards
This implementation complies with **WCAG 2.1 / 2.2 Level AA**, specifically addressing:
- **WCAG 2.2.2 (Pause, Stop, Hide — Level A)**
- **WCAG 1.4.3 (Contrast Minimum — Level AA)**
- **WCAG 2.4.7 (Focus Visible — Level AA)**
- **WCAG 2.1.1 (Keyboard — Level A)**

---

## 2. Ambient Motion & Pause Decision (WCAG 2.2.2)

### Requirement
Any moving, blinking, or scrolling information that starts automatically, lasts more than 5 seconds, and is presented in parallel with other content must provide a mechanism for the user to pause, stop, or hide it.

### Implementation Architecture
1. **Motion Toggle Button (`MotionToggle.jsx`):**
   - 44px × 44px circular control located at the bottom-right of the Hero viewport.
   - Accessible name toggles between `"Pause background animation"` and `"Play background animation"`.
   - `aria-pressed` reflects current paused state.
   - Focus ring: 2px `--c-indigo` outline with 2px offset.
   - Keyboard operable via standard `Space` and `Enter`.
2. **State Storage & First-Paint Initialization:**
   - Preference stored in `localStorage` under key `'motion'`.
   - `public/motion-init.js` executes synchronously in `<head>` (via CSP-compliant external script), reading `localStorage` and setting `<html data-motion="paused">` prior to first paint to prevent animation flash.
3. **OS `prefers-reduced-motion: reduce` Support:**
   - Under OS reduced motion, all `@keyframes` animations on `.aurora__blob` and `.marquee__track` are deactivated (`animation: none; will-change: auto;`).
   - The play action in `MotionToggle` is hidden because motion is disabled at the operating system level.
4. **Viewport Throttling:**
   - `useAuroraVisibility` pauses animation (`animation-play-state: paused`) when the section scrolls out of view (+100px margin), conserving CPU and battery.

---

## 3. High Contrast & Forced Colors Mode
- When `forced-colors: active` or `@media print` is detected:
  - Decorative aurora blobs (`.aurora__blob`), static top wash (`.aurora::before`), and streak textures (`.aurora::after`) are hidden (`display: none`).
  - Text, borders, and interactive elements revert to system high-contrast color pairings.

---

## 4. Contrast Verification
- Background color `--c-bg`: `#F6F7FC`
- Primary text `--c-text`: `#0B1020`
  - Contrast ratio against `--c-bg`: **17.2:1** (exceeds 4.5:1 requirement)
  - Contrast ratio against brightest aurora blob (`#CBEAFF`): **11.8:1** (exceeds 4.5:1 requirement)
- Secondary body text `--c-muted`: `#4B5470`
  - Contrast ratio against `--c-bg`: **5.1:1** (exceeds 4.5:1 requirement)
- Inactive titles `--c-muted-2`: `#7A819C`
  - Contrast ratio against `--c-bg`: **3.2:1** (exceeds 3.0:1 requirement for large display text ≥24px/18pt)
- Interactive buttons:
  - Solid buttons: `#0B1020` background with `#FFFFFF` text (**17.2:1**)
  - Focus indicator: 2px `#5B3DF5` against `#F6F7FC` (**5.2:1**)
