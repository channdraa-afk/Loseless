---
name: loseless-clean
description: >
  Audits the codebase for over-engineering, dead code, and unnecessary bloat.
  Uses the Parsimony Hunter taxonomy (delete, stdlib, native, yagni, shrink) to produce
  a ranked, actionable list of line and dependency reductions.
---

# Loseless Clean: The Parsimony Hunter

Scan the codebase or target diff specifically for architectural bloat and speculative complexity.

## Hunter Taxonomy

Audit every finding under one of 5 specific tags:

1. `delete:` Dead code, unreachable functions, unused exports, speculative options. Replacement: nothing.
2. `stdlib:` Hand-rolled algorithms or utilities that the language standard library already provides.
3. `native:` Heavy external dependencies (e.g. moment.js, lodash) that modern Web APIs or runtime features cover natively.
4. `yagni:` Premature abstractions, single-implementation interfaces, config flags nobody sets, wrappers that only forward calls.
5. `shrink:` Over-engineered 20-line loops that can be expressed in 1-2 readable lines.

## Output Format

Output one line per finding, ranked biggest impact first:
`<tag> <what to cut>. <replacement>. [<path>:<line>]`

End with the net impact score:
`Net: -<N> lines, -<M> dependencies possible. (Or: Lean already. Ship.)`
