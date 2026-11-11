<p align="center">
  <img src="assets/logo.svg" width="128" height="128" alt="Loseless Logo" />
</p>

<h1 align="center">Loseless</h1>

<p align="center">
  <strong>Zero Context Drift. Anti-Sycophancy. Ruthless Root-Cause Discipline for Coding Agents.</strong>
</p>

<p align="center">
  <a href="https://github.com/channdraa-afk/Loseless/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-emerald.svg" alt="License MIT" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/ecosystem-Gemini%20%7C%20Antigravity-blue.svg" alt="Ecosystem" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/discipline-Strict%20Protocol-green.svg" alt="Strict Protocol" /></a>
</p>

---

## ⚡ What is Loseless?

Most AI coding assistants suffer from three chronic failure modes:
1. **Eager Vandalism**: Editing or generating code before reading the full call tree or confirming architecture.
2. **AI Sycophancy ("Yes-Man" syndrome)**: Blindly agreeing with flawed designs, validating anti-patterns, and piling on technical debt.
3. **Context Drift & Premature Done**: Forgetting critical constraints mid-session and prematurely declaring tasks "Done" while background tasks or builds are still broken.

**Loseless** is a battle-hardened cognitive discipline and execution gatekeeper plugin built natively for the **Google / Gemini & Antigravity** agent ecosystem. It enforces mathematical signal fidelity, radical engineering truthfulness, and root-cause verification.

---

## 💎 Core Architectural Pillars

### 1. ⚔️ The Arise Protocol (Anti-Eager Vandalism)
Before editing a single byte of your codebase:
- **Phase 1 (Discovery & Planning)**: Strictly read-only. The agent investigates caller trees, identifies architectural trade-offs, and presents an actionable plan. Then it **STOPS TOTAL**.
- **Phase 2 (Verified Execution)**: Code execution is locked behind an exact authorization keyword: **`Arise`**.
- **Zero Premature Done**: A task is never marked finished until builds and unit checks verify 100% clean with zero hanging background processes.

### 2. 😈 Mandatory Devil's Advocate (The Anti-Yes-Man Engine)
No more uncritical agreement. If a proposal introduces a single point of failure (SPOF) or memory leaks, Loseless forces a 2-line **Reality Check** upfront:
```text
⚠️ Reality Check: In-memory hash map will OOM when tenant records exceed 50k.
💡 Minimal Alternative: Stream chunks via PostgreSQL cursor; standard library handles backpressure natively.
```

### 3. 🎯 Root-Cause Convergence (Anti-Symptom Patching)
A bug report is a symptom, not the root cause.
- Loseless forbids adding band-aids to the single caller that crashed.
- It greps every caller across the codebase and fixes the issue once at the shared convergence point.

### 4. 🏷️ Technical Debt Ledger (`/loseless debt`)
Deliberate shortcuts are never hidden. Any intentional trade-off must leave an explicit debt tag:
```typescript
// lossless: [ceiling: 100 req/sec] -> upgrade: [introduce Redis stream when latency spikes]
```
Run `/loseless-debt` anytime to scan your entire repository and generate an actionable Technical Debt Ledger.

### 5. 🧪 Zero-Framework Runnable Assert
Non-trivial logic leaves behind **one runnable self-check assert** using the language's native capabilities (`console.assert()`, `assert ...`). Zero bulky test frameworks required for verifying core logic.

### 6. 🤐 Fluff Purge & High Signal-to-Noise Ratio (SNR)
Eliminates robotic AI filler phrases. Puts actionable code and diffs at the very top. Saves token overhead and preserves attention span across lengthy sessions.

---

## 🥊 Architecture Matrix

| Capability | Generic Coding Assistant | Loseless Plugin Architecture |
| :--- | :--- | :--- |
| **Execution Safety** | Modifies files on first impulse | **Two-Phase Arise Gatekeeper (Read-Only until approved)** |
| **Architectural Review** | Sycophantic praise / Yes-Man | **Mandatory Devil's Advocate Reality Check** |
| **Cognitive Temperature** | Fixed default temperature | **Dual Modes: Cold (Deterministic) vs Warm (Creative)** |
| **Debt Accountability** | Hidden unrecorded shortcuts | **Structured `lossless:` scanner & ledger** |
| **Bug Fixing** | Shallow patch on caller | **Root-Cause Convergence (Fix at origin)** |
| **Verification Gate** | Premature Done assertions | **Zero hanging tasks, 100% verified status** |

---

## 🚀 Quick Start

### Installation

Clone into your local plugins directory:
```bash
git clone https://github.com/channdraa-afk/Loseless.git ~/.gemini/config/plugins/loseless
```

Or reference within an Antigravity workspace:
```json
{
  "plugins": ["loseless"]
}
```

### Slash Commands & Skills

| Command | Description |
| :--- | :--- |
| `/loseless cold` | Activates zero-entropy, deterministic root-cause mode (Default). |
| `/loseless warm` | Activates divergent, high-creativity brainstorming mode. |
| `/loseless-debt` | Scans workspace for `// lossless:` tags and outputs the Technical Debt Ledger. |
| `/loseless-critique` | Triggers a one-shot Devil's Advocate architectural audit on your current code. |

---

## 🏛️ Repository Layout

```text
loseless/
├── plugin.json               # Antigravity Plugin manifest
├── gemini-extension.json     # Gemini CLI extension manifest
├── package.json              # NPM metadata
├── rules/
│   └── AGENTS.md             # Always-on context rules (< 50 lines)
├── skills/
│   ├── loseless/SKILL.md     # Mental temperature switcher
│   ├── loseless-debt/SKILL.md # Technical debt harvester
│   ├── loseless-critique/SKILL.md # Devil's advocate reviewer
│   └── loseless-arise/SKILL.md # Two-phase execution gatekeeper
└── assets/
    └── logo.svg              # Vector brand mark
```

---

## 📜 License

Distributed under the [MIT License](LICENSE). Built with precision by [Chandra](https://github.com/channdraa-afk).
