---
name: loseless-blast
description: >
  Scans and computes the blast-radius impact of any symbol, function, or class across
  the codebase using the local CLI tool. Prevents token exhaustion on large repos
  by outputting a compact 3-line aggregate report rather than raw call trees.
license: MIT
---

# Loseless Blast-Radius Offloader

`loseless-blast` is an AST reference aggregator designed to prevent context window bloat during refactoring sessions in large repos and monorepos.

## CLI Usage
Run directly from terminal or trigger via agent:
```bash
npm run blast-radius -- <symbol>
# or directly:
node scripts/blast-radius.js <symbol>
```

## Output Structure
The offloader aggregates cross-module references and classifies the change into a Tiered Risk Matrix:
- **Tier 0**: Localized / Aesthetic (Zero Invariant Risk)
- **Tier 1**: Scoped Module Impact (Internal Refactoring)
- **Tier 2**: Systemic Impact (Cross-Module or Critical Invariant like Auth, DB, Payments)

```text
=== LOSELESS BLAST-RADIUS IMPACT TELEMETRY ===
Target Symbol : authenticateUser
Blast Tier    : Tier 2 — Systemic Impact (Cross-Module or Critical Invariant)
Reference Map : 24 call-site(s) across 3 module(s) [auth: 14, router: 7, api: 3]
Primary Root  : src/auth/jwt.ts:42
Action Gate   : Mandates Full SPOF, Rollback Strategy, and Strict Arise Execution Gate.
```

## Agent Guideline
When analyzing dependencies in chat, the agent must output a concise 3-line summary:
1. Impact Tier & Classification
2. Call-site count and module distribution
3. Primary root file & required verification gate
Do NOT dump raw grep lists into conversational context.
