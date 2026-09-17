# Project Guidelines & Autonomous Rules

This repository follows strict UI, motion, and architectural rules across all pages and features.

## 1. Color Balance: 60-30-10 Rule
- **60% Neutral (Base)**: Background canvas, containers, and large surfaces (warm paper/light neutral `#fbf7f2`, `#f7f4ef`, `#ffffff`).
- **30% Secondary (Support)**: Supporting text, subtle card borders, inactive pills, icons, and structure (`rgba(28, 24, 20, 0.62)`, light borders).
- **10% Accent (Highlight)**: Primary CTAs, active pills, links, and high-intent interactive states (`#c2410c`).

## 2. Animation & Scroll Rules
- **Scroll -> Storytelling**:
  - **Parallax**: Layers move at different speeds.
  - **Scrub**: Motion follows passive scroll progress.
  - **Pin + Transform**: Anchor the section while content transforms.
- **Entrance -> Hierarchy**:
  - **Fade + Lift**: Subtle upward translation and opacity reveal.
  - **Stagger**: Sequence sibling elements one after another.
  - **Clip Reveal**: Use `clip-path` masks to uncover key headlines and media.

## 3. Implementation Standards
- Never intercept user scroll input (`preventDefault` / wheel hijacking is strictly prohibited).
- Always respect `prefers-reduced-motion: reduce`.
- Zero horizontal overflow across all viewports (375px, 768px, 1440px+).
- Reference: [.agents/rules/ui-design-and-motion.md](.agents/rules/ui-design-and-motion.md)
