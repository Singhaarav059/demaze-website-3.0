# Project Guidelines & Autonomous Rules

This repository follows strict UI, motion, and architectural rules across all pages and features.

---

## 1. Color Balance: 60-30-10 Rule
- **60% Neutral (Base)**: Background canvas, containers, and large surfaces (warm paper/light neutral `#fbf7f2`, `#f7f4ef`, `#ffffff`).
- **30% Secondary (Support)**: Supporting text, subtle card borders, inactive pills, icons, and structure (`rgba(28, 24, 20, 0.62)`, light borders).
- **10% Accent (Highlight)**: Primary CTAs, active pills, links, and high-intent interactive states (`#c2410c`).

---

## 2. Animation & Interaction Rules ($1000 Premium Standard)
*"Good animation isn't decoration. It's feedback."*

### A. Scroll -> Storytelling
- **Parallax**: Layers move at different speeds.
- **Scrub**: Motion follows passive scroll progress (`--scroll-progress`).
- **Pin + Transform**: Anchor the section while content transforms.

### B. Entrance -> Hierarchy
- **Fade + Lift**: Subtle upward translation and opacity reveal.
- **Stagger**: Sequence sibling elements one after another (50–80ms intervals).
- **Clip Reveal**: Use `clip-path` masks to uncover key headlines and media.

### C. Click -> Confirmation
- **Press + Spring**: Button compresses on press (`scale(0.97)`) and springs back dynamically. Every click must receive immediate tactile response.
- **State Change**: Explicit status transitions (`Send` ──> `Sending...` with spinner ──> `Sent ✓`). Never leave user actions unacknowledged.

---

## 3. Orchestration & Verification Invariants
*"AI that can be trusted to ship."*

### A. Agent Orchestration: Think in Systems, Not Prompts
- Pipeline: `PLAN` ──> `BUILD` ──> `TEST` ──> `SHIP`.
- Break complex work into tasks; operate autonomously end-to-end.

### B. Context Engineering: Context, Not Chaos
- Hierarchy: `PROJECT` ──> `RULES` ──> `SKILLS` ──> `AGENT` ──> `OUTPUT`.
- Make the right context available at the right time.

### C. Verification Loops: Don't Trust the Agent. Verify It.
- Closed Loop: `BUILD` ──> `VERIFY` ──> `FEEDBACK` ──> `ITERATE`.
- Always inspect the actual runtime in the browser:
  - 0 console errors
  - 0 broken assets/links
  - 0 horizontal overflow across viewports (375px, 768px, 1440px)
  - Seamless responsive collapse

---

## Rule References
- [.agents/rules/ui-design-and-motion.md](.agents/rules/ui-design-and-motion.md)
- [.agents/rules/agent-orchestration-and-verification.md](.agents/rules/agent-orchestration-and-verification.md)
