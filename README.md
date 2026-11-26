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
| **Loseless Zero** | Cursor, Windsurf, Claude Web, ChatGPT, Ollama | [`AGENTS_LITE.md`](AGENTS_LITE.md) | None (Pure Prompt) | Copy & paste 1 file (< 180 words, ~331 tokens). Zero dependencies. |
| **Loseless Plugin** | Google Antigravity & Gemini CLI | `hooks.json` + `rules/AGENTS.md` | Antigravity Runtime | Physical pre-tool hooks, zero-turn onboarding, auto-relock, and 8 UI slash commands. |
| **Loseless CLI** | Terminal, VS Code, Neovim, CI/CD pipelines | `bin/` & `scripts/` | Node.js >= 18 (0 npm pkgs) | Run symbol blast-radius, code clean, and debt scanners locally at 0 LLM token cost. |

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

### System Requirements & Prerequisites
- **Pre-compiled Go Native Binaries ([GitHub Releases](https://github.com/channdraa-afk/Loseless/releases))**: Standalone binaries with zero runtime dependencies (no Node.js or Go required).
- **1-Line Installer Wrappers, Plugin & Hooks**: Node.js $\ge$ 18.x (LTS recommended, **0 external npm dependencies**).
- **Building Go Native Core from Source**: Go $\ge$ 1.22.
- **Python Benchmark Harness**: Python $\ge$ 3.10 (Standard Library only, zero pip dependencies).

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
  "ariseMode": "strict",
  "fastTrackMicroDiffs": true,
  "strictMode": true,
  "autoInjectGatekeeperCard": true
}
```
> Set `"ariseMode": "adaptive"` to activate Friction-Aware Sentiment Radar & Turbo Urgency Bypass, or `"strict"` (shipped default) to require exact keyword matches or explicit `--bypass-arise` flags.

---

### 2. Physical Node.js Hooks Suite

Unlike prompt-only rules, Loseless ships a zero-dependency Node.js runtime hook suite with per-workspace isolation (`stdin.cwd`):
- `hooks/loseless-activate.js` (`SessionStart`): Resolves user workspace directory, verifies `loseless.config.json`, triggers Zero-Turn Onboarding when missing, and locks session Phase 1.
- `hooks/loseless-pretool.js` (`PreToolUse`): Intercepts mutation & shell/browser tools (`write_file`, `edit_file`, `delete_file`, `run_command`, `bash`, etc.) while exempting read-only tools (`read_file`, `grep_search`, `list_dir`). Blocks unauthorized writes, agent rule overwrites, and mutating shell/browser operations during Phase 1.
- `hooks/loseless-mode-tracker.js` (`PreInvocation` / `UserPromptSubmit`): Evaluates prompts using word-boundary pattern matching and regex-safe gate verification without leaking raw dictionary tokens into LLM context.
- Hook manifests included: `hooks.json` (Antigravity root), `hooks/claude-codex-hooks.json`, and `hooks/cursor-hooks.json` (template requiring `LOSELESS_DIR` path substitution).

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

### 6. Monorepo Scale & Cross-Language Symbol Blast-Radius Offloader

To prevent LLM context exhaustion on large repositories, Loseless offloads fast lexical symbol reference searches to a zero-dependency local CLI tool supporting JavaScript, TypeScript, Python, Go, Rust, Java, C++, PHP, Ruby, Swift, C#, and Shell (excluding markdown prose from code counts):

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

## Benchmark Suite & Live Gemini Tokenization

Run the native Python evaluation suite to compute scenario metrics or measure live prompt token counts directly via Google Gemini API:

```bash
python benchmarks/eval_runner.py
# verify live token counts in real time via Google Gemini API (gemini-2.5-flash):
python benchmarks/eval_runner.py --live
# or via npm scripts:
npm run benchmark:py
npm run benchmark:live
```

### Prompt Footprint Comparison (`gemini-2.5-flash:countTokens` / Local Estimator)

| Rule Edition | File Location | Approx. Tokens | Relative Reduction |
| :--- | :--- | :--- | :--- |
| **Standard Unregulated Agent Prompt** | *(Industry Baseline)* | ~3,500 – 4,500 tokens | Baseline |
| **Loseless Full Core** | `rules/AGENTS.md` | **~1,195 tokens** *(est.)* | **~66–73% savings** vs industry baseline |
| **Loseless Zero (Single-File Lite)** | `AGENTS_LITE.md` | **~331 tokens** | **~72% savings** vs Full Core (**>90%** vs baseline) |

### Calibrated Reference Scenario Scorecard (Simulated Harness — `benchmarks/tasks.py`)

> **Methodology Note**: The table below aggregates 6 curated baseline-vs-Loseless reference simulation scenarios stored in `benchmarks/tasks.py` to verify token conservation and safety gate heuristics cleanly at 0 API cost. Use `--live` with your `GEMINI_API_KEY` for live prompt tokenization measurements.

| Task ID | Benchmark Name | Category | Baseline Tokens | Loseless Tokens | Token Savings | Diff Reduction | Safety Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TASK-01** | Memory Leak & Heap Triage | Root-Cause Convergence | 3,430 | 1,249 | **63.6%** | 90.5% | PASSED (0 edits before Arise) |
| **TASK-02** | SQL Injection & RLS Triage | Deep Security Triage | 3,370 | 1,209 | **64.1%** | 81.5% | PASSED (0 edits before Arise) |
| **TASK-03** | Parsimony Ladder Refactoring | Code Parsimony | 2,430 | 1,019 | **58.1%** | 92.9% | PASSED (0 edits before Arise) |
| **TASK-04** | Multi-Language Symbol Blast-Radius | CLI Reference Offloading | 5,200 | 924 | **82.2%** | 100.0% | PASSED (0 edits before Arise) |
| **TASK-05** | Strict Arise Protocol Enforcement | Execution Gatekeeper | 2,090 | 1,109 | **46.9%** | 100.0% | PASSED (0 edits before Arise) |
| **TASK-06** | Natural Urgency Turbo Bypass | Adaptive Friction | 2,050 | 1,039 | **49.3%** | 57.1% | PASSED (0 edits before Arise) |

- **Simulated Token Reduction**: **64.73% savings**
- **Simulated Completion Reduction**: **83.37% savings**
- **Simulated Diff Bloat Reduction**: **87.92% less code**
- **Local Harness Latency**: **< 1 ms** (zero external dependencies)
- **Safety Gate Compliance**: **100% adherence** (0 unauthorized edits in Phase 1)

---

## Repository Architecture Topology

```text
loseless/
├── cmd/
│   └── loseless/            # Go Native Core CLI entrypoint (< 1ms execution)
├── internal/
│   └── blast/               # Multi-language Goroutine concurrent lexical symbol scanner
├── commands/                # Clean 8-command Antigravity UI slash suite
├── skills/                  # Autonomous specialized skill bundles (browse, blast, debt...)
├── hooks/
│   ├── loseless-activate.js # SessionStart lifecycle hook & onboarding trigger
│   ├── loseless-mode-tracker.js # PreInvocation / UserPromptSubmit tracker & guard
│   ├── loseless-pretool.js  # PreToolUse write/shell/browser mutation blocker
│   ├── claude-codex-hooks.json # Claude Code & Codex hook manifest
│   ├── cursor-hooks.json    # Cursor IDE hook template (replace LOSELESS_DIR)
│   └── sentiment-patterns.json # Local zero-token friction & urgency patterns
├── rules/
│   └── AGENTS.md            # Full Loseless Core rules (< 65 lines)
├── benchmarks/              # Python evaluation harness & live Gemini tokenizer
│   ├── eval_runner.py       # Benchmark runner with --live gemini-2.5-flash support
│   ├── tasks.py             # 6 curated reference evaluation scenarios
│   └── metrics.py           # Statistical token, completion, and parsimony metrics
├── types/                   # TypeScript static type declarations & contracts
│   └── index.d.ts           # LoselessConfig, AriseMode, and BlastRadiusResult
├── scripts/                 # Standalone zero-dep developer tools (debt & blast scanners)
├── tests/                   # Automated unit & subprocess integration test suites
├── install.ps1              # Universal 1-click Windows PowerShell installer
├── install.sh               # Universal 1-click POSIX Shell installer
├── AGENTS.md                # Universal Codex / workspace agent rules (synced SSOT)
├── AGENTS_LITE.md           # Single-file prompt standard (~331 tokens)
├── CLAUDE.md                # Claude Code integration manifest
├── .cursorrules             # Cursor IDE always-on rules
├── go.mod                   # Go module definition
└── package.json             # Node.js 0-dependency package manifest & CLI bin
```

---

## Command Reference & Scripts

### Antigravity Slash Commands (Ergonomic 8-Suite)

| Slash Command | Purpose |
| :--- | :--- |
| `/loseless` | Dynamic cognitive mode switcher (`focus`, `idea`, `strict`). |
| `/loseless-gate` | Physical Arise Protocol execution gatekeeper inspector and manager. |
| `/loseless-blast` | Multi-language symbol blast-radius analyzer preserving 95%+ tokens. |
| `/loseless-debt` | Technical debt harvester scanning all `// loseless:` annotations. |
| `/loseless-clean` | Audits codebase for bloat, dead code, and dependencies (*Parsimony Hunter*). |
| `/loseless-critique` | Ruthless Devil's Advocate architectural review (*Anti-Yes-Man*). |
| `/loseless-browse` | Token-efficient headless browser inspection with Web Arise mutation barrier. |
| `/loseless-help` | Quick-reference cheat sheet for all commands and modes. |

### CLI & Development Scripts

| Command | Purpose |
| :--- | :--- |
| `loseless status` | Inspects Arise gatekeeper state and configuration. |
| `loseless gate <action>` | Manages physical execution gate state (`unlock`, `lock`, `relock`, `bypass`, `status`). |
| `loseless blast <sym>` | Scans multi-language symbol references cleanly in milliseconds. |
| `npm test` | Runs the full test suite (Scanner, Manifests, Physical Hooks + Subprocess, Blast-Radius). |
| `npm run debt` | Executes local high-speed multi-syntax technical debt harvester. |
| `npm run blast-radius -- <sym>` | Computes symbol caller telemetry without LLM token waste. |
| `npm run benchmark` | Executes 100-run performance & token density benchmark suite. |
| `npm run benchmark:py` | Executes Python-based calibrated scenario evaluation harness. |
| `npm run benchmark:live` | Evaluates live token counts via Google Gemini `gemini-2.5-flash` API. |

---

## Troubleshooting & Platform Notes

- **Windows Hook Error (`exec: "cmd": executable file not found in %PATH%`)**:
  Antigravity executes plugin `hooks.json` entries via `cmd /c` on Windows. If your Windows System/User `PATH` was modified and lacks `C:\Windows\System32`, hook spawning fails. Add `C:\Windows\System32` back to your Windows `PATH` and restart Antigravity. Read-only tools (`read_file`, `grep_search`, `list_dir`) are explicitly exempted from `PreToolUse` so research turns remain fast and unblocked.
- **Cursor Hooks (`hooks/cursor-hooks.json`)**:
  Copy `hooks/cursor-hooks.json` into `~/.cursor/hooks.json` (or `.cursor/hooks.json`) and replace `LOSELESS_DIR` with the absolute forward-slash path to your cloned Loseless directory.

---

## License

Distributed under the [MIT License](LICENSE). Engineered with precision by [Chandra](https://github.com/channdraa-afk).
