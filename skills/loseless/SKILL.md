---
name: loseless
description: >
  Dynamic cognitive mode switcher for coding agents. Switches between Cold Mode
  (zero-entropy, deterministic root-cause analysis) and Warm Mode (divergent,
  creative brainstorming). Also manages protocol status and Anti-Slop engine.
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

## 1. Cold Mode (`cold`)
When in Cold Mode:
- **Visual Badge**: Display `[Cognitive Mode: ❄️ Cold Precision]` on line 1.
- **Zero Hallucination / Zero Assumption**: Never assume API signatures or file paths. Grep and inspect first.
- **Root-Cause Convergence**: Refuse to patch symptoms at the caller site. Find the single shared convergence point.
- **Ruthless Devil's Advocate**: If the approach introduces architectural debt, point it out immediately in a Reality Check.
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

## 3. Protocol Persistence
The selected mode persists across the conversation until explicitly switched.
Default mode is **cold**.
