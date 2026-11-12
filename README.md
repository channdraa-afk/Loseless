<p align="center">
  <img src="assets/logo.svg" width="128" height="128" alt="Loseless Logo" />
</p>

<h1 align="center">Loseless</h1>

<p align="center">
  <strong>Zero Context Drift. Anti-Sycophancy. Strict Cognitive Discipline for Coding Agents.</strong>
</p>

<p align="center">
  <a href="https://github.com/channdraa-afk/Loseless/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-10b981.svg" alt="License MIT" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/ecosystem-Gemini%20%7C%20Antigravity-38bdf8.svg" alt="Ecosystem" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/discipline-Strict%20Protocol-059669.svg" alt="Strict Protocol" /></a>
  <a href="https://github.com/channdraa-afk/Loseless"><img src="https://img.shields.io/badge/lexicon-Anti--Slop%20Engine-emerald.svg" alt="Anti-Slop Engine" /></a>
</p>

---

## Mission & Overview

Modern AI coding assistants frequently degrade during extended engineering sessions, routinely exhibiting four systemic failure modes:

1. **Eager Vandalism**: Modifying or generating code immediately upon receiving a prompt, before exploring the dependency graph, tracing caller trees, or securing human authorization.
2. **Agent Sycophancy ("Yes-Man" Syndrome)**: Uncritically praising flawed architectural suggestions, smiling at anti-patterns, and accumulating invisible technical debt.
3. **Context Drift & Premature Done**: Losing rule fidelity across long context windows (*Lost-in-the-Middle*) and prematurely declaring tasks complete while background subprocesses, builds, or edge cases remain broken.
4. **AI Slop & Rhetorical Inflation**: Generating fluffy, promotional prose filled with hollow corporate adjectives (*robust, seamless, transformative, tapestry*) that provide zero technical data.

**Loseless** is a battle-hardened cognitive discipline and execution gatekeeper plugin engineered natively for the **Google Gemini & Antigravity** agent ecosystem. It maintains mathematical signal fidelity across thousands of tokens, enforces radical root-cause engineering, and replaces sycophantic praise with empirical systems truth.

---

## The Anti-Slop Engine (The 3 Engineer's Axioms)

Generic AI models default to generic corporate jargon because their training sets are saturated with marketing blogs and promotional copy. Loseless bans rhetorical inflation and enforces the communication standard of a Lead Systems Architect:

### 1. The Metric Axiom (Adjectives to Numbers)
- **Banned**: Unqualified superlatives such as *robust*, *seamless*, *lightning-fast*, or *highly scalable*.
- **Required**: Concrete metrics and tolerances.
  - *Slop*: "We implemented a robust and seamless caching layer."
  - *Loseless*: "In-memory LRU cache configured with a 50MB ceiling, 10,000 key eviction threshold, and sub-2ms hit latency."

### 2. The Primitive Axiom (Metaphors to Physical Computes)
- **Banned**: Poetic and scenic metaphors such as *tapestry*, *landscape*, *journey*, *realm*, or *beacon*.
- **Required**: Concrete compute primitives. Name the exact physical or logical entity: `socket`, `heap`, `AST`, `disk`, `mutex`, `table`, or `thread`.
  - *Slop*: "Navigating the rich landscape of asynchronous operations."
  - *Loseless*: "Managing Node.js event loop microtasks and backpressure on the TCP socket stream."

### 3. The Reality Axiom (Promises to Contracts & Trade-Offs)
- **Banned**: Promotional claims such as *game-changer*, *transformative*, or *effortless solution*.
- **Required**: Explicit failure boundaries. State the Single Point of Failure (SPOF), resource consumption, and technical ceiling.
  - *Slop*: "A game-changing architecture that scales infinitely."
  - *Loseless*: "Throughput verified up to 5,000 req/s. Bottlenecks at database connection pool limits (max: 100); requires read-replicas beyond this ceiling."

---

## Core Architectural Pillars

### 1. The Arise Protocol (Anti-Eager Vandalism)

Before modifying any source file in the repository, the agent adheres to an immutable two-phase state machine:

```
[User Request / Bug Report / Feature]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Discovery & Analysis (STRICTLY READ-ONLY)     │
│ • Inspect files & trace dependency call tree           │
│ • Identify single points of failure & resource costs   │
│ • Present upfront Reality Check & Implementation Plan  │
│ • STOP TOTAL & AWAIT AUTHORIZATION                     │
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
│ • Execute atomic, isolated code modifications          │
│ • Leave behind 1 runnable zero-dependency assert       │
│ • Run compiler, build, and linters                     │
│ • Confirm 0 dangling background processes              │
│ • Return state to Phase 1                              │
└────────────────────────────────────────────────────────┘
```

### 2. Mandatory Devil's Advocate (The Anti-Yes-Man Engine)

Loseless forbids passive sycophancy. Whenever an architectural choice or proposal is evaluated, the agent must output a 2-line **Reality Check** upfront:

> **Reality Check**: Storing active sessions in global Node.js process memory causes state loss on every container restart and prevents horizontal cluster scaling.  
> **Minimal Alternative**: Persist session tokens in Redis with standard TTL expiration, or utilize cryptographically signed stateless cookies.

### 3. Dynamic Semantic Entropy Router (Auto-Sensing Dual Modes)

Loseless automatically analyzes conversational cues and modulates the agent's cognitive entropy:

- **Cold Precision Mode (`[Cognitive Mode: ❄️ Cold Precision]`)**:
  - *Triggered by*: `bug`, `error`, `exception`, `trace`, `schema`, `auth`, `leak`, `latency`, `OOM`, `refactor`.
  - *Behavior*: Mental temperature ~0.1, deterministic logic, zero conversational filler, first-principles deduction, strict assertion checks.
- **Warm Ideation Mode (`[Cognitive Mode: 🔥 Warm Ideation]`)**:
  - *Triggered by*: `idea`, `concept`, `brainstorm`, `explore`, `naming`, `analogy`, `how about`.
  - *Behavior*: Mental temperature ~0.8, high divergence, explores 3 distinct structural perspectives without premature refutation.

### 4. Root-Cause Convergence (Anti-Symptom Patching)

A defect ticket reports a symptom, not the root cause.
- Loseless explicitly forbids adding defensive guards only to the caller that threw the exception.
- The engine greps the entire dependency hierarchy and implements one definitive guard at the shared origin, eliminating bugs across all sibling paths simultaneously.

### 5. Zero-Framework Self-Checking Assertions

Complex utilities must leave behind an inline, runnable assertion check using platform-native capabilities (`console.assert()`, standard `assert`). No external test framework scaffolding (Jest, Vitest, Mocha) is required for verifying baseline logic.

### 6. The Blast-Radius Protocol & Anti-Gaslighting Engine

Generic assistants frequently create regressive bugs by patching a single file in isolation without recognizing that downstream callers depend on the original behavior. Simultaneously, models engage in "honey-tongued gaslighting"—falsely assuring users that code is "100% bug-free and completely safe" while leaving behind subtle runtime landmines.

Loseless enforces two immutable guardrails:
- **Blast-Radius Tracing**: Before modifying shared functions, schemas, or data contracts, the agent must grep the full caller tree, declare the exact blast radius (impacted files), and execute **Atomic Refactoring** across all consumers in the same turn. Half-broken states are forbidden.
- **Banned False Certainty**: Agents are strictly forbidden from declaring code "100% safe" or "guaranteed bug-free". Every completed change must explicitly disclose **Residual Risks & Uncovered Edge Cases** (e.g. dropped network streams, unbounded memory payloads, concurrency collisions).

---

## Technical Debt Scanner CLI Tool

Deliberate shortcuts are never hidden. Any intentional trade-off must declare its boundaries using the standardized annotation:

```typescript
// lossless: [ceiling: <OPERATIONAL_LIMIT>] -> upgrade: [<ARCHITECTURAL_ACTION>]
```

### Multi-Language Syntax

- **TypeScript / JavaScript**:
  ```typescript
  // lossless: [ceiling: < 10,000 items] -> upgrade: [implement cursor-based keyset pagination]
  ```
- **Python**:
  ```python
  # lossless: [ceiling: single-process memory] -> upgrade: [offload to celery background queue]
  ```
- **SQL**:
  ```sql
  -- lossless: [ceiling: 50k rows] -> upgrade: [partition table by created_at quarter]
  ```

### Running the Scanner

Loseless includes a standalone, zero-dependency Node.js CLI scanner:

```bash
npm run debt
# Or direct execution:
node scripts/debt-scanner.js
```

**Real Terminal Output (4ms scan time):**

```text
=============================================================
            LOSELESS TECHNICAL DEBT SCANNER                  
=============================================================
Target: /workspace

Found 2 documented debt item(s):

[#1] src/auth.ts:42
  Ceiling : < 5,000 active users
  Upgrade : implement distributed redis session store

[#2] src/cache.ts:18
  Ceiling : single-node instance memory
  Upgrade : introduce redis cluster when multi-node required

-------------------------------------------------------------
Summary: 2 total debt items identified in 4ms.
Status : All shortcuts are bounded and explicitly tracked.
```

---

## Real-World Comparison

| Dimension | Generic Coding Assistant | Loseless Plugin Engine |
| :--- | :--- | :--- |
| **Execution Safety** | Immediately writes/edits code on prompt | **Two-Phase Arise Gatekeeper (Read-Only until approved)** |
| **Architectural Critique** | Sycophantic praise ("Great idea!") | **Mandatory Devil's Advocate Reality Check** |
| **Cognitive Temperature** | Fixed, arbitrary randomness | **Semantic Entropy Router (Cold Precision vs. Warm Ideation)** |
| **Code Shortcuts** | Hidden `// TODO:` comments that rot | **Structured `lossless:` scanner with ceiling metrics** |
| **Bug Fixing** | Patches reporting caller with shallow `if (!x)` | **Root-Cause Convergence (Fixed at shared architectural root)** |
| **Regression Prevention** | Isolated local edits causing breaking side-effects | **Blast-Radius Tracing & Atomic Refactoring across consumers** |
| **Certainty & Claims** | Honey-tongued gaslighting ("100% bug-free & safe") | **Banned False Certainty & Mandatory Residual Risk Disclosure** |
| **Communication Tone** | Fluffy AI prose (*tapestry, seamless*) | **The 3 Engineer's Axioms (Metrics, Primitives, Reality)** |
| **Completion Criteria** | Premature "Done!" while builds run | **Zero dangling tasks, 100% verified status** |

---

## Getting Started

### Method 1: Local Plugin Installation (Antigravity & Gemini)

Clone directly into the local Antigravity/Gemini configuration directory:

```bash
git clone https://github.com/channdraa-afk/Loseless.git ~/.gemini/config/plugins/loseless
```

### Method 2: Workspace Manifest Registration

In an Antigravity workspace, register the plugin in your workspace configuration:

```json
{
  "plugins": ["loseless"]
}
```

### Method 3: Standalone NPM Tool in Any Project

You can copy `scripts/debt-scanner.js` into any existing codebase and add to `package.json`:

```json
{
  "scripts": {
    "debt": "node scripts/debt-scanner.js"
  }
}
```

---

## Multi-Platform Ecosystem Support

Loseless natively exports configuration adapters for every major coding agent:

| Environment | Integration File | Configuration Mechanism |
| :--- | :--- | :--- |
| **Antigravity** | `plugin.json` + `rules/AGENTS.md` | Bundled plugin runtime & skills |
| **Gemini CLI** | `gemini-extension.json` | Manifest context link to `rules/AGENTS.md` |
| **Cursor** | `.cursorrules` & `.cursor/rules/loseless.mdc` | Always-on workspace rule files |
| **Claude Code** | `CLAUDE.md` | Root instruction file |
| **Windsurf / Cascade** | `.windsurfrules` | Workspace agent rules |
| **Cline / Roo Code** | `.clinerules` | Root behavior protocol |
| **Universal Codex** | `AGENTS.md` | Generic root agent instruction standard |

---

## Empirical Benchmark Telemetry

Measured using `npm run benchmark` over 100 test iterations on a live repository:

```text
=============================================================
              LOSELESS ENGINE BENCHMARK SUITE                
=============================================================

1. SCANNER PERFORMANCE BENCHMARK
-------------------------------------------------------------
  Iterations        : 100 runs
  Average Latency   : 1.854 ms
  Min / Max Latency : 1.144 ms / 3.673 ms
  Execution Speed   : 539 scans/second
  Heap Allocation   : 1017.77 KB

2. COGNITIVE TOKEN FOOTPRINT EVALUATION
-------------------------------------------------------------
  Rule File         : rules/AGENTS.md
  Total Lines       : 45 lines
  Word Count        : 470 words
  Estimated Tokens  : ~853 tokens
  Monolith Baseline : ~3500 tokens
  Context Savings   : 75.6% overhead reduction (~2647 tokens preserved)

=============================================================
BENCHMARK VERDICT:
✓ Scanner throughput is sub-millisecond per item.
✓ Token footprint occupies less than 25% of standard rule sets.
✓ Zero external runtime dependencies confirmed.
=============================================================
```

---

## Command Reference & Skills

| Command / Trigger | Category | Purpose |
| :--- | :--- | :--- |
| `/loseless cold` | Mental Mode | Engages zero-entropy, deterministic root-cause mode (Default). |
| `/loseless warm` | Mental Mode | Engages divergent, creative architectural exploration mode. |
| `/loseless status` | Diagnostics | Displays currently active cognitive mode and protocol status. |
| `/loseless-debt` | Technical Debt | Scans workspace for `// lossless:` annotations and generates ledger. |
| `/loseless-critique` | Architecture | Triggers an uncompromising one-shot Devil's Advocate audit. |
| `/loseless-arise` | Execution | Displays Arise Protocol gatekeeper status and validation rules. |
| `npm run debt` | CLI Tool | Executes local high-speed regex technical debt scanner. |
| `npm run benchmark` | Telemetry | Executes performance & token density benchmark suite. |
| `npm test` | Testing | Runs scanner unit tests and manifest integrity checks. |

---

## Repository Structure

```text
loseless/
├── AGENTS.md                 # Universal root agent instruction standard
├── .cursorrules              # Cursor workspace rule adapter
├── .cursor/rules/            # Modern Cursor MDC rules
├── CLAUDE.md                 # Claude Code agent protocol
├── .windsurfrules            # Windsurf / Cascade rule adapter
├── .clinerules               # Cline & Roo Code rule adapter
├── plugin.json               # Antigravity Plugin manifest
├── gemini-extension.json     # Gemini CLI extension manifest
├── package.json              # NPM package metadata, tests & scripts
├── rules/
│   └── AGENTS.md             # Always-on context rules (< 60 lines)
├── scripts/
│   ├── debt-scanner.js       # Zero-dependency technical debt harvester
│   └── benchmark.js          # Live performance & token density benchmark suite
├── tests/
│   ├── scanner.test.js       # Multi-language scanner unit tests
│   └── manifests.test.js     # Manifest and adapter integrity tests
├── skills/
│   ├── loseless/SKILL.md     # Cognitive temperature regulator
│   ├── loseless-debt/SKILL.md # Technical debt harvester skill
│   ├── loseless-critique/SKILL.md # Devil's advocate review engine
│   └── loseless-arise/SKILL.md # Two-phase execution gatekeeper
└── assets/
    └── logo.svg              # Brand vector mark
```

---

## License

Distributed under the [MIT License](LICENSE). Engineered with precision by [Chandra](https://github.com/channdraa-afk).
