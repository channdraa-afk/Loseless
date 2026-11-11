<p align="center">
  <img src="assets/logo.svg" width="120" height="120" alt="Loseless Logo" />
</p>

<h1 align="center">Loseless</h1>

<p align="center">
  <strong>Zero Context Drift. Anti-Sycophancy. Strict Cognitive Discipline for Coding Agents.</strong>
</p>

<p align="center">
  <a href="https://github.com/channdraa-afk/Loseless/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-10b981.svg" alt="License MIT" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/ecosystem-Gemini%20%7C%20Antigravity-38bdf8.svg" alt="Ecosystem" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/discipline-Strict%20Protocol-059669.svg" alt="Strict Protocol" /></a>
</p>

---

## Overview

Modern AI coding assistants frequently degrade under extended development sessions, manifesting three systemic failure modes:

1. **Eager Vandalism**: Writing, refactoring, or generating code before analyzing dependency graphs, tracing call paths, or securing human approval.
2. **Agent Sycophancy**: Uncritically validating architectural anti-patterns, agreeing with fragile suggestions, and accumulating invisible technical debt.
3. **Context Drift & Premature Completion**: Losing instruction fidelity across lengthy context windows and declaring tasks complete while background compilations or edge cases remain unverified.

**Loseless** is a deterministic cognitive discipline and execution gatekeeper plugin engineered natively for the **Google Gemini & Antigravity** agent runtime. It maximizes signal-to-noise ratio, enforces rigorous root-cause investigation, and replaces sycophantic validation with empirical truthfulness.

---

## Architectural Principles

### 1. The Arise Protocol (Execution Gatekeeping)

Before modifying any source file in the repository, the agent adheres to an immutable two-phase state machine:

- **Phase 1 (Discovery & Analysis)**: Strictly read-only. The agent investigates caller trees, surfaces architectural trade-offs, formulates an execution plan, and stops unconditionally.
- **Phase 2 (Verified Execution)**: Code generation remains locked until the user provides the exact authorization token: `Arise`.
- **Anti-Premature Completion**: A task is never marked finished while tests, linters, or background subprocesses are running. Verified status requires zero errors and zero dangling tasks.

### 2. Mandatory Devil's Advocate (The Anti-Sycophancy Engine)

Generic assistants default to agreeable confirmation. Loseless mandates an upfront architectural critique whenever evaluating proposals:

> **Reality Check**: In-memory hash maps without eviction policies will trigger Out-Of-Memory (OOM) faults once tenant volume scales.  
> **Minimal Alternative**: Stream data via database cursors; let native engine backpressure govern resource allocation.

### 3. Root-Cause Convergence (No Symptom Patching)

A bug ticket reports a symptom, not the root cause.
- Loseless explicitly forbids adding defensive guards to the single caller that crashed.
- The engine greps the entire dependency hierarchy and implements one definitive guard at the shared origin, eliminating bugs across all sibling paths simultaneously.

### 4. Explicit Technical Debt Tracking

Deliberate simplifications are never concealed. Any calculated trade-off must declare its constraints using the standardized tag:

```typescript
// lossless: [ceiling: 100 req/sec] -> upgrade: [introduce Redis stream when latency spikes]
```

Run `/loseless-debt` at any point to compile an actionable Technical Debt Ledger across the codebase.

### 5. Zero-Framework Self-Checking Assertions

Complex business logic must leave behind an inline, runnable assertion check using platform-native capabilities (`console.assert()`, standard `assert`). No external test framework scaffolding is required for baseline mathematical verification.

### 6. Signal-to-Noise Ratio (SNR) Maximization

Eliminates conversational filler, redundant preambles, and generic apologies. Actions, diffs, and diagnostics occupy the highest priority in the response stream.

---

## Architecture Matrix

| Dimension | Generic Coding Assistants | Loseless Plugin Architecture |
| :--- | :--- | :--- |
| **Execution Safety** | Eager file modification on initial prompt | **Two-Phase Arise Gatekeeper (Read-Only until approved)** |
| **Architectural Review** | Sycophantic agreement | **Mandatory Devil's Advocate Reality Check** |
| **Cognitive Entropy** | Static, arbitrary randomness | **Dual Mental Temperature (Cold Precision vs. Warm Ideation)** |
| **Technical Debt** | Untracked, implicit shortcuts | **Structured `lossless:` scanner & automated ledger** |
| **Defect Remediation** | Shallow patch applied to reporting caller | **Root-Cause Convergence (Fixed at the architectural root)** |
| **Completion Criteria** | Speculative or premature status claims | **Strict zero-dangling verification** |

---

## Getting Started

### Installation

Clone directly into the local Antigravity/Gemini plugins configuration:

```bash
git clone https://github.com/channdraa-afk/Loseless.git ~/.gemini/config/plugins/loseless
```

Alternatively, register within an Antigravity workspace manifest:

```json
{
  "plugins": ["loseless"]
}
```

### Command Reference

| Command | Purpose |
| :--- | :--- |
| `/loseless cold` | Engages zero-entropy, deterministic root-cause mode (Default). |
| `/loseless warm` | Engages divergent, creative architectural exploration mode. |
| `/loseless-debt` | Scans workspace for `// lossless:` annotations and generates the Technical Debt Ledger. |
| `/loseless-critique` | Triggers a one-shot Devil's Advocate architectural audit on proposed code. |

---

## Repository Structure

```text
loseless/
├── plugin.json               # Antigravity Plugin manifest
├── gemini-extension.json     # Gemini CLI extension manifest
├── package.json              # NPM package metadata & self-check script
├── rules/
│   └── AGENTS.md             # Always-on context rules (< 50 lines)
├── skills/
│   ├── loseless/SKILL.md     # Cognitive temperature regulator
│   ├── loseless-debt/SKILL.md # Technical debt harvester
│   ├── loseless-critique/SKILL.md # Devil's advocate review engine
│   └── loseless-arise/SKILL.md # Two-phase execution gatekeeper
└── assets/
    └── logo.svg              # Brand vector mark
```

---

## License

Distributed under the [MIT License](LICENSE). Engineered with precision by [Chandra](https://github.com/channdraa-afk).
