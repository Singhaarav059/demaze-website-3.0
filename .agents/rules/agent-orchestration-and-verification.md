# Agent Orchestration & Verification Invariants

Guidelines for building, verifying, and shipping with Google Antigravity.

---

## 1. Agent Orchestration: Think in Systems, Not Prompts
> *"Stop micromanaging. Start orchestrating."*

- **Autonomous Multi-Stage Pipeline**:
  ```
  PLAN ──> BUILD ──> TEST ──> SHIP
  ```
- Break complex work into clear, modular phases.
- Avoid halting for routine trivial confirmations when intent and architectural standards are defined.
- Run parallel checks and isolated tasks where applicable to maximize throughput.

---

## 2. Context Engineering: Context, Not Chaos
> *"Make the right context available at the right time."*

- **Structured Knowledge Flow**:
  ```
  PROJECT ──> RULES ──> SKILLS ──> AGENT ──> OUTPUT
  ```
- Define architectural invariants, color tokens, responsive constraints, and design systems once in centralized rules.
- Ground implementation directly in existing code, project tokens, and verified conventions.

---

## 3. Verification Loops: Don't Trust the Agent. Verify It.
> *"AI that can be trusted to ship."*

- **Closed Feedback Loop**:
  ```
  BUILD ──> VERIFY ──> FEEDBACK ──> ITERATE ──┐
    ▲                                         │
    └─────────────────────────────────────────┘
  ```
- Never assume code works simply because it compiles or passes static syntax check.
- **Mandatory Verification Standards**:
  1. **Review the Artifact**: Inspect generated code, CSS rules, and markup structure.
  2. **Test the Result**: Run live builds (`npm run build`), spin up the local runtime, and verify across viewports (375px, 768px, 1440px).
  3. **Inspect Actual Behavior**: Verify zero console errors, zero layout clipping, zero horizontal overflow, and working interactive feedback.
  4. **Iterate Autonomously**: Fix discovered discrepancies immediately before concluding the turn.
