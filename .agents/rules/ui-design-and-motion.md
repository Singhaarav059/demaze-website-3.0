# UI Design & Motion System Rules

These design and animation rules govern all user interface development, redesigns, and styling across the project.

---

## 1. The 60-30-10 Color Balance Rule for UI
Maintain strict visual balance and intentional hierarchy across all pages and components:

- **60% Neutral (Base Surface)**:
  - Used for primary backgrounds, page canvas, section containers, and expansive surfaces.
  - Keeps the interface calm, clean, breathable, and distraction-free (e.g., warm paper `#fbf7f2`, soft off-white `#f7f4ef`, `#ffffff`).
- **30% Secondary (Support & Structure)**:
  - Used for cards, UI wrappers, dividers, subtle borders, secondary typography, badges, and inactive states.
  - Provides structure without fighting for attention (e.g., muted ink `rgba(28, 24, 20, 0.62)`, soft warm borders `rgba(28, 24, 20, 0.08)`, neutral chip backgrounds).
- **10% Accent (High-Intent Highlight)**:
  - Reserved strictly for key focal points: Primary CTAs, active tabs/pills, key links, and critical interactive feedback.
  - Ensures the user's eye is guided immediately to primary actions without visual clutter (e.g., brand orange `--color-primary: #c2410c`).

---

## 2. Animation & Motion Standards ($1000 Premium Feel)
Every interaction must feel deliberate, fluid, and expensive. Follow the 4 core animation pillars:

### Pillar 01: Scroll -> Storytelling ("Make the Page Move With You")
1. **Parallax**:
   - Background and middleground layers move at calibrated differential speeds relative to foreground content.
   - Gives spatial depth to the page surface without blocking readability.
2. **Scrub**:
   - Motion and state transitions follow the exact passive scroll progress (`--scroll-y`, `--scroll-progress`) rather than firing once and freezing.
   - Reversible when scrolling back up.
3. **Pin + Transform**:
   - Anchor a section in view while its sub-panels, active indicators, or illustrative elements transform before releasing the scroll.

### Pillar 02: Entrance -> Hierarchy ("Don't Show Everything At Once")
1. **Fade + Lift**:
   - Agency-standard entrance: subtle upward translation (`translateY(16px)` to `0`) coupled with opacity reveal (`opacity: 0` to `1`).
   - Clean, lightweight, reliable.
2. **Stagger**:
   - Sibling elements (cards, badges, grid items, metrics) enter sequentially with calibrated delays (e.g., 50ms – 80ms per index) to create dynamic visual rhythm.
3. **Clip Reveal**:
   - Dynamic `clip-path` (e.g., `polygon()` or `inset()`) uncovers impactful headlines, banner media, and hero imagery as the element enters the viewport.

---

## 3. Engineering & Performance Invariants
- **Non-blocking Scroll**: Never intercept native scroll (`preventDefault`, `wheel` hijacking, or artificial smooth-scroll momentum). Drive motion via passive scroll listeners, CSS custom properties, and requestAnimationFrame.
- **Hardware Acceleration**: Only animate compositor-friendly properties (`transform`, `opacity`, `clip-path`). Never animate layout properties (`width`, `height`, `margin`, `top`, `left`).
- **Accessibility & Reduced Motion**: Always respect `@media (prefers-reduced-motion: reduce)`. When active, disable all parallax displacement, set transition durations to 0s or instant, and render all content immediately visible.
- **Responsive Fluidity**: Zero horizontal overflow across all screen sizes (375px mobile, 768px tablet, 1440px+ desktop). Multi-column grids must always collapse gracefully on smaller viewports.
