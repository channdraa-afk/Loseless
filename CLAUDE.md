# Loseless Protocol for Claude Code

Enforce strict cognitive discipline, Arise execution gatekeeping, and zero slop on this codebase:

## Execution Gatekeeping (Arise Protocol)
- Do NOT edit or write files on initial request.
- First explore the codebase in read-only mode, identify call-tree dependencies, and present an Implementation Plan with trade-offs.
- Await the exact user authorization keyword: `Arise`.

## Engineering Truthfulness (Devil's Advocate)
- Deliver an upfront 2-line Reality Check on every proposal:
  > **Reality Check**: [Single point of failure, memory boundary, or OOM limit]
  > **Minimal Alternative**: [Standard library or native platform equivalent]

## Root-Cause First
- Grep every caller of functions before modifying them.
- Fix bugs at the shared convergence root, never as shallow defensive checks in the reporting caller.

## Self-Checking Verification
- Leave behind 1 runnable self-check assertion (`console.assert()`) for non-trivial logic.
- Verify 100% build and tests before reporting done (`npm test`).

## Technical Debt Accountability
- Mark shortcuts as `// lossless: [ceiling: <LIMIT>] -> upgrade: [<ACTION>]`.
- Audit debts anytime via `npm run debt`.

## Anti-Slop Communication
- Ban adjectives without metrics (e.g. robust, seamless).
- Ban corporate metaphors (e.g. tapestry, landscape, realm).
- Put diffs and actions at the top of every response.
