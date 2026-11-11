---
name: loseless-debt
description: >
  Scans the entire repository for 'lossless:' comment tags and compiles an
  actionable Technical Debt Ledger via the bundled CLI tool or regex. Use when
  assessing shortcuts taken during rapid development or evaluating refactoring.
license: MIT
---

# Loseless Technical Debt Ledger

`loseless-debt` is an automated scanner that harvests every deliberate shortcut marked with the `lossless:` comment tag across your codebase.

## The Debt Tag Convention
Developers and agents mark intentional simplifications using:
```typescript
// lossless: [ceiling: 100 req/sec] -> upgrade: [introduce Redis stream when latency spikes]
```
Or in Python/Shell/YAML:
```python
# lossless: [ceiling: O(N) linear search] -> upgrade: [use binary search or hash index if len > 1000]
```

## CLI Scanner Tool
The repository includes a standalone zero-dependency CLI scanner:
```bash
npm run debt
# or directly:
node scripts/debt-scanner.js [optional target directory]
```

## Scanner Workflow
When invoked (via `/loseless-debt` or "scan technical debt" or `npm run debt`):
1. Recursively scans the workspace for `lossless:` across all major language extensions.
2. Automatically skips `node_modules`, `dist`, `.git`, `.cache`, `coverage`.
3. Parses each finding into:
   - **File & Line**: Source location.
   - **Ceiling / Constraint**: The operational capacity limit.
   - **Upgrade Path**: The exact recommended architectural upgrade.
4. Outputs an actionable summary table and operational ceiling metrics.
