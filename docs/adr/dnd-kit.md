# Architecture Decision Record (ADR): Selection of @dnd-kit for Criteria Builder Drag-and-Drop

## Status
Accepted

## Context
The Vantrix Screen hiring-criteria builder requires smooth, accessible drag-and-drop interactions to reorder criteria priority within lists and move criteria between "Must have" (hard filter) and "Nice to have" (weighted priority).

Key constraints:
1. **Accessibility (WCAG 2.2):** Must support keyboard navigation (Space to pick up, arrows to move, Space to drop, Esc to cancel), screen reader announcements via `aria-live`, and touch devices.
2. **Performance & Bundle Budget:** The library must be tree-shakable and lazy-loaded so it does not inflate the initial bundle (`≤ 56.4 KB gzip`). The lazy chunk must be well under 25 KB gzip.
3. **Rendering & Compositing:** Drag movements must rely strictly on CSS `transform` (GPU composited) without layout thrashing.

## Decision
We selected the modular `@dnd-kit` suite:
- `@dnd-kit/core`: Core sensory dispatchers, collision detection, and drag overlay primitives.
- `@dnd-kit/sortable`: Virtual sorting algorithms (`verticalListSortingStrategy`, `arrayMove`).
- `@dnd-kit/utilities`: Lightweight transform utilities (`CSS.Translate.toString`).

## Alternatives Considered

1. **HTML5 Native Drag and Drop API:**
   - *Pros:* Zero external bundle size.
   - *Cons:* Extremely poor touch support on mobile/tablets; non-existent keyboard accessibility without building a separate custom engine from scratch; styling drag previews is notoriously inconsistent across browsers.
2. **react-beautiful-dnd (Atlassian):**
   - *Pros:* Familiar API.
   - *Cons:* Deprecated and unmaintained; incompatible with modern React 18 concurrent features without legacy workarounds; monolithic bundle size (>35 KB gzip).
3. **Framer Motion Reorder:**
   - *Pros:* High-quality animations.
   - *Cons:* Heavy runtime dependency (>45 KB gzip); lacks dedicated multi-container cross-list sorting primitives and accessible live region announcements out of the box.

## Bundle & Performance Impact
- `@dnd-kit` is lazy-loaded in `CapabilitiesSection.jsx` via `React.lazy()` when the section is within 300px of the viewport.
- The resulting lazy chunk is ~12.8 KB gzip, staying well below the 25 KB threshold.
- Zero impact on initial page load LCP or initial bundle budget (56.4 KB gzip maintained).
