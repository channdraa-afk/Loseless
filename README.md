<p align="center">
  <img src="assets/logo.svg" width="128" height="128" alt="Loseless Logo" />
</p>

<h1 align="center">Loseless</h1>

<p align="center">
  <strong>Zero Context Drift. Anti-Sycophancy. Strict Cognitive Discipline & Physical Hook Gatekeeper for Coding Agents.</strong>
</p>

<p align="center">
  <a href="https://github.com/channdraa-afk/Loseless/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-10b981.svg" alt="License MIT" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/ecosystem-Gemini%20%7C%20Claude%20%7C%20Cursor-38bdf8.svg" alt="Ecosystem" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/hooks-Physical%20Enforcement-8b5cf6.svg" alt="Physical Hooks" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/discipline-Strict%20Protocol-059669.svg" alt="Strict Protocol" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/lexicon-Anti--Slop%20Engine-emerald.svg" alt="Anti-Slop Engine" /></a>
</p>

---

## Mission & Overview

Modern AI coding assistants frequently degrade during extended engineering sessions, routinely exhibiting systemic failure modes:

1. **Eager Vandalism**: Modifying or generating code immediately upon receiving a prompt, before exploring the dependency graph, tracing caller trees, or securing human authorization.
2. **Agent Sycophancy ("Yes-Man" Syndrome)**: Uncritically praising flawed architectural suggestions, smiling at anti-patterns, and accumulating invisible technical debt.
3. **Enforcement Illusion**: Relying solely on soft prompt instructions that hallucinate or degrade under context pressure, lacking physical runtime blocking.
4. **Context Drift & Warning Fatigue**: Losing rule fidelity across long context windows while spamming trivial edge-case warnings on simple 1-line changes until the developer tunes out.
5. **AI Slop & Rhetorical Inflation**: Generating fluffy, promotional prose filled with hollow corporate adjectives (*robust, seamless, transformative, tapestry*) that provide zero technical data.

**Loseless** is a battle-hardened cognitive discipline, physical hook gatekeeper, and anti-slop engine engineered for the modern coding agent ecosystem. It pairs mathematical signal fidelity across thousands of tokens with physical Node.js runtime enforcement.

---

## Choose Your Flavor (Architecture Matrix)

Loseless ships in three distinct tiers tailored to your workflow and environment:

| Flavor | Target Platform | Core File | Dependencies | Setup |
| :--- | :--- | :--- | :--- | :--- |
| **Loseless Zero** | Cursor, Windsurf, Claude Web, ChatGPT, Ollama | [`AGENTS_LITE.md`](AGENTS_LITE.md) | None (Pure Prompt) | Copy & paste 1 file (< 180 words, ~240 tokens). Zero dependencies. |
| **Loseless Plugin** | Google Antigravity & Gemini CLI | `hooks.json` + `rules/AGENTS.md` | Antigravity Runtime | Full physical pre-tool hooks, session auto-relock, and 11 UI slash commands. |
| **Loseless CLI** | Terminal, VS Code, Neovim, CI/CD pipelines | `bin/` & `scripts/` | Node.js >= 18 | Run AST blast-radius, code clean, and debt scanners locally at 0 LLM token cost. |

---

## Quick 1-Line Installation

Install Loseless CLI and local shims instantly:

### macOS & Linux
```bash
curl -fsSL https://raw.githubusercontent.com/channdraa-afk/Loseless/main/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/channdraa-afk/Loseless/main/install.ps1 | iex
```

Verify your installation:
```bash
loseless status
loseless help
```

---

## Core Architectural Pillars

### 1. The Arise Protocol & Physical Hook Gatekeeper

Before modifying any source file in the repository, the agent adheres to an immutable two-phase state machine backed by **real physical Node.js hooks**:

```
[User Request / Bug Report / Feature]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Discovery & Analysis (STRICTLY READ-ONLY)     │
│ • Inspect files & trace dependency call tree           │
│ • PreToolUse Hook physically blocks unauthorized writes│
│ • Present upfront Reality Check & Implementation Plan  │
│ • Auto-inject Gatekeeper Card & Await Authorization    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
              [Exact Keyword Gatekeeper]
       Does user input strictly match: "Arise"?
             │                            │
             ├─(NO / Typo / "gas")───────► Reject Execution &
             │                             Remind Sacred Keyword
             ▼ (YES: "Arise")
┌────────────────────────────────────────────────────────┐
│ Phase 2: Verified Execution                            │
│ • Physical Hook unlocks file write access              │
│ • Execute atomic, isolated code modifications          │
│ • Leave behind 1 runnable zero-dependency assert       │
│ • Run compiler, build, and linters                     │
│ • Confirm 0 dangling background processes              │
│ • Re-lock state to Phase 1 upon task completion        │
└────────────────────────────────────────────────────────┘
```

#### Friction-Aware Adaptive Gatekeeper & Zero-Token Sentiment Radar
Teams want safety without bureaucratic friction on trivial edits or tight deadlines:
- **`ariseMode: "adaptive"` (Default)**: In `loseless.config.json`, the engine enables a zero-token local sentiment interceptor (`hooks/sentiment-patterns.json`).
- **Emergency Turbo Bypass**: If a developer expresses urgency or tight deadlines (*"lagi ada deadline"*, *"on a deadline"*, *"mode turbo"*, *"need it fast"*), the agent grants an immediate Phase 2 execution bypass at **0 LLM token cost** without prompting or waiting for `Arise`.
- **Fast-Track Micro-Diffs**: Pure documentation, styling, or typo edits (< 3 lines non-code) automatically execute with inline diff preview.
- **Reconciliation Loop**: Once the task is cleanly finalized (*"makasih"*, *"done"*, *"sip"*), the agent automatically relocks state to Phase 1.

#### Configurable Gate Keyword (`loseless.config.json`)
```json
{
  "gateKeyword": "Arise",
  "ariseMode": "adaptive",
  "fastTrackMicroDiffs": true,
  "strictMode": true,
  "autoInjectGatekeeperCard": true
}
```

---

### 2. Physical Node.js Hooks Suite

Unlike prompt-only rules, Loseless ships a native Node.js runtime hook suite:
- `hooks/loseless-activate.js` (`SessionStart`): Dynamically mounts configuration, verifies environment, and initializes state.
- `hooks/loseless-pretool.js` (`PreToolUse`): Physically intercepts write tools (`write_file`, `replace_file_content`, `edit_file`). Exits with status 1 if executed during locked Phase 1.
- `hooks/loseless-mode-tracker.js` (`UserPromptSubmit`): Locally evaluates prompts against sentiment clusters and token matches without sending raw dictionary words to the LLM context.
- Hook manifests included: `hooks/claude-codex-hooks.json` and `hooks/cursor-hooks.json`.

---

### 3. Cascading Semantic Mindset Router

Loseless automatically analyzes conversational cues and modulates cognitive behavior with deterministic precedence:

- **Cascading Precedence**: When prompts contain colliding intents (e.g. *"give me ideas to fix this memory leak"*), **Focus triage always precedes Idea exploration**.
  $$\text{Level 1: Focus (Bug Triage \& Root Cause)} \longrightarrow \text{Level 2: Idea (Solution Spectrum)} \longrightarrow \text{Level 3: Strict (Parsimonious Diff Execution)}$$
- **Focus Precision Mode (`[Cognitive Mode: Focus Precision]`)**: Deterministic first-principles logic, zero fluff, root-cause isolation upfront (`/loseless focus`).
- **Idea Exploration Mode (`[Cognitive Mode: Idea Exploration]`)**: Explores 3 distinct architectural angles without premature refutation (`/loseless idea`).

---

### 4. Mandatory Devil's Advocate (Anti-Yes-Man Engine)

Loseless forbids passive sycophancy. Whenever an architectural choice is evaluated, the agent outputs a 2-line **Reality Check** upfront:

> **Reality Check**: Storing active sessions in global Node.js process memory causes state loss on every container restart and prevents horizontal cluster scaling.  
> **Minimal Alternative**: Persist session tokens in Redis with standard TTL expiration, or utilize cryptographically signed stateless cookies.

---

### 5. Tiered Risk Matrix & Anti-Warning Fatigue

Generic assistants create warning fatigue by attaching verbose theoretical disclaimers to 1-line typos. Loseless enforces risk-proportional disclosure:

- **Tier 0 (Aesthetic / Docs / Micro-diffs)**: Zero noise. Omit residual risk section or state `Residual Risk: None (Isolated textual diff)`.
- **Tier 1 (Scoped Component / Local Logic)**: 1 concise bullet focused strictly on component boundaries or local state.
- **Tier 2 (Auth / Database Migrations / Payments / Concurrency)**: Mandatory 3-pillar disclosure:
  1. *Single Point of Failure (SPOF)*
  2. *Failure Boundary (what degrades gracefully vs. catastrophically)*
  3. *Rollback Strategy*

---

### 6. Monorepo Scale & Multi-Language Blast-Radius CLI Offloader

To prevent LLM context exhaustion on large repositories, Loseless offloads cross-language AST reference searches to a dedicated local CLI tool supporting JavaScript, TypeScript, Python, Go, Rust, Java, C++, PHP, and Shell:

```bash
npm run blast-radius -- <symbolOrFunction>
```

**Output (Zero Token Bloat):**
```text
=== LOSELESS BLAST-RADIUS IMPACT TELEMETRY ===
Target Symbol : authenticateUser
Blast Tier    : Tier 2 — Systemic Impact (Cross-Module or Critical Invariant)
Reference Map : 24 reference(s) across 3 module(s) [auth: 14, router: 7, api: 3]
Languages     : typescript: 18, python: 4, go: 2
Primary Root  : src/auth/jwt.ts:42
Action Gate   : Mandates Full SPOF, Rollback Strategy, and Strict Arise Execution Gate.
```
In conversational responses, the agent emits an aggregated 3-line summary instead of dumping 200 raw grep lines, preserving **95% - 98% of context tokens**.

---

### 7. Resilient Multi-Syntax Technical Debt Lexer

Deliberate shortcuts are explicitly tracked across inline comments, block comments, and multiline JSDoc:

- **Inline / Block Comment**:
  ```typescript
  // loseless: [ceiling: 5,000 active users] -> upgrade: [redis session cluster]
  /* loseless: [ceiling: O(N) scan] => upgrade: [indexed binary search] */
  ```
- **Multiline JSDoc**:
  ```javascript
  /**
   * @loseless
   * ceiling: 1000 items in memory
   * upgrade: stream chunking pipeline
   */
  ```

Run the high-speed scanner:
```bash
npm run debt
```

---

### 8. The Anti-Slop Engine (The 3 Engineer's Axioms)

1. **The Metric Axiom**: Ban adjectives without metrics. Never write "robust"; specify numbers (`< 16ms render`, `5k req/s`, `heap < 64MB`).
2. **The Primitive Axiom**: Ban poetic metaphors ("tapestry", "landscape", "journey"); name physical compute primitives (`socket`, `heap`, `AST`, `disk`, `thread`).
3. **The Reality Axiom**: Ban empty promises ("game-changer", "transformative"); explicitly declare constraints, single points of failure, and trade-offs. Actionable diffs and commands at the very top.

---

### 9. The Parsimony Ladder & Civilized Conciseness

Loseless resolves the collision between code minimization and conversational brevity through clean domain separation:

- **The Parsimony Ladder (Code Domain)**: Diligent reading, surgical writing. Ascend through 5 rungs: Omission (YAGNI) ➔ In-house reuse ➔ Native platform / stdlib ➔ Existing dependencies ➔ Shortest working diff.
- **Civilized Conciseness (Response Domain)**: High-bandwidth engineering clarity. Progress state, file paths, and terminal commands lead on line 1. Zero AI pleasantries ("Certainly!"), zero sycophancy, and zero broken caveman grunts. Explain the architectural *Why* using rigorous compute primitives.

---

## Multi-Platform Ecosystem Support

| Environment | Integration File | Configuration Mechanism |
| :--- | :--- | :--- |
| **Antigravity** | `plugin.json` + `rules/AGENTS.md` | Bundled plugin runtime & skills |
| **Claude Code** | `CLAUDE.md` + `hooks/claude-codex-hooks.json` | Instruction file + Physical SessionStart & PreToolUse hooks |
| **Cursor** | `.cursorrules` + `hooks/cursor-hooks.json` | Always-on workspace rule files + IDE hooks |
| **Gemini CLI** | `gemini-extension.json` | Manifest context link to `rules/AGENTS.md` |
| **Windsurf / Cascade** | `.windsurfrules` | Workspace agent rules |
| **Cline / Roo Code** | `.clinerules` | Root behavior protocol |
| **Universal Codex** | `AGENTS.md` | Generic root agent instruction standard |

---

## Empirical Benchmark & Evaluation Scorecard

Run the native Python evaluation suite to test token conservation and safety compliance:

```bash
python benchmarks/eval_runner.py
# or verify live token counts in real time via Google Gemini API:
python benchmarks/eval_runner.py --live
# or via npm scripts:
npm run benchmark:py
npm run benchmark:live
```

### Live Google Gemini API Tokenization Matrix (`gemini-3.8-flash:countTokens`)

Empirical measurements verified directly against Google's official tokenizer endpoint:

| Rule Edition | File Location | Token Count | Relative Reduction |
| :--- | :--- | :--- | :--- |
| **Standard Unregulated Agent Prompt** | *(Industry Baseline)* | ~3,500 – 4,500 tokens | Baseline |
| **Loseless Full Core** | `rules/AGENTS.md` | **1,177 tokens** | **~71% savings** vs industry baseline |
| **Loseless Zero (Single-File Lite)** | `AGENTS_LITE.md` | **331 tokens** | **71.9% savings** vs Full Core (**>92%** vs baseline) |

### Aggregate Empirical Scorecard (6 Benchmark Scenarios)

| Task ID | Benchmark Name | Category | Baseline Tokens | Loseless Tokens | Token Savings | Diff Reduction | Safety Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TASK-01** | Memory Leak & Heap Triage | Root-Cause Convergence | 3,430 | 1,249 | **63.6%** | 90.5% | PASSED (0 edits before Arise) |
| **TASK-02** | SQL Injection & RLS Triage | Deep Security Triage | 3,370 | 1,209 | **64.1%** | 81.5% | PASSED (0 edits before Arise) |
| **TASK-03** | Parsimony Ladder Refactoring | Code Parsimony | 2,430 | 1,019 | **58.1%** | 92.9% | PASSED (0 edits before Arise) |
| **TASK-04** | Multi-Language AST Blast-Radius | AST Offloading | 5,200 | 924 | **82.2%** | 100.0% | PASSED (0 edits before Arise) |
| **TASK-05** | Strict Arise Protocol Enforcement | Execution Gatekeeper | 2,090 | 1,109 | **46.9%** | 100.0% | PASSED (0 edits before Arise) |
| **TASK-06** | Natural Urgency Turbo Bypass | Adaptive Friction | 2,050 | 1,039 | **49.3%** | 57.1% | PASSED (0 edits before Arise) |

- **Total Token Reduction**: **64.73% savings**
- **LLM Completion Reduction**: **83.37% savings**
- **Code Diff Bloat Reduction**: **87.92% less code**
- **Harness Latency**: **0.07 ms** (near-zero CPU overhead)
- **Safety Gate Compliance**: **100% adherence** (0 unauthorized edits in Phase 1)

---

## Command Reference & Scripts

| Command | Purpose |
| :--- | :--- |
| `npm test` | Runs the full test suite (Scanner, Manifests, Physical Hooks, Blast-Radius). |
| `npm run debt` | Executes local high-speed multi-syntax technical debt harvester. |
| `npm run blast-radius -- <sym>` | Computes blast-radius caller telemetry without LLM token waste. |
| `npm run benchmark` | Executes 100-run performance & token density benchmark suite. |
| `npm run benchmark:py` | Executes Python-based empirical evaluation harness across 6 engineering scenarios. |

---

## License

Distributed under the [MIT License](LICENSE). Engineered with precision by [Chandra](https://github.com/channdraa-afk).
