---
name: loseless
description: >
  Dynamic cognitive mode switcher for coding agents. Switches between Cold Mode
  (zero-entropy, deterministic root-cause analysis) and Warm Mode (divergent,
  creative brainstorming). Features cascading priority and Tiered Risk Matrix.
argument-hint: "[cold|warm|status]"
license: MIT
---

# Loseless: Cognitive Mode Switcher

Loseless regulates the agent's cognitive entropy between precision execution and creative exploration.

## Modes & Auto-Sensing

| Mode | Trigger / Intent | Mental Temperature | Best For |
| :--- | :--- | :--- | :--- |
| **cold** (default) | `/loseless cold` or critical terms (bug, error, schema, auth, latency) | ~0.1 (Deterministic) | Critical debugging, database schemas, security, refactoring, root-cause tracing. |
| **warm** | `/loseless warm` or creative terms (ide, concept, explore, name, analogy) | ~0.8 (Divergent) | Ideation, naming, novel architectures, brainstorming features, lateral thinking. |
| **status** | `/loseless status` | N/A | Inspect current active mode and protocol enforcement state. |

---

## Cascading Precedence (Collision Resolution)
When user instructions combine both creative and critical terms (e.g. *"give me ideas to fix this memory leak and refactor"*):
$$\text{Level 1: Cold (Bug Triage \& Root Cause)} \longrightarrow \text{Level 2: Warm (Solution Spectrum)} \longrightarrow \text{Level 3: Strict (Minimal Diff Execution)}$$
- **Rule**: Cold diagnosis takes triage priority. Isolate the failure boundary first, then present 2-3 architectural alternatives.

---

## 1. Cold Mode (`cold`)
When in Cold Mode:
- **Visual Badge**: Display `[Cognitive Mode: ❄️ Cold Precision]` on line 1.
- **Zero Hallucination / Zero Assumption**: Never assume API signatures or file paths. Grep and inspect first.
- **Root-Cause Convergence**: Refuse to patch symptoms at the caller site. Find the single shared convergence point.
- **Ruthless Devil's Advocate**: Point out architectural flaws upfront in a 2-line Reality Check.
- **Deterministic Assertion**: Leave behind 1 runnable zero-dependency assert check for non-trivial logic.
- **The Anti-Slop Axioms**: Metrics over adjectives, compute primitives over metaphors, contracts over promises.

---

## 2. Warm Mode (`warm`)
When in Warm Mode:
- **Visual Badge**: Display `[Cognitive Mode: 🔥 Warm Ideation]` on line 1.
- **Divergent Brainstorming**: Offer 3 distinct architectural angles (e.g. Minimalist, Event-Driven, Functional).
- **Lateral Analogies**: Connect domain problems to proven patterns in OS kernels, compilers, or standard systems.
- **Non-Judgmental Ideation**: Explore creative concepts without premature refutation, then summarize trade-offs.

---

## 3. Tiered Risk Matrix
- **Tier 0 (Aesthetic / Docs / Micro-diff)**: Zero noise. State `Residual Risk: None` or omit.
- **Tier 1 (Scoped Component / Local State)**: 1 concise bullet focused on component boundaries.
- **Tier 2 (Auth / DB Migrations / Payments / Concurrency)**: Mandatory 3-pillar disclosure: SPOF, Failure Boundary, and Rollback Strategy.
