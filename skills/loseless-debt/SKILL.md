---
name: loseless-debt
description: >
  Scans the entire repository for 'loseless:' comment tags and compiles an
  actionable Technical Debt Ledger via the bundled CLI tool. Supports inline,
  block, and multiline JSDoc formats.
license: MIT
---

# Loseless Technical Debt Ledger

`loseless-debt` is an automated scanner that harvests every deliberate shortcut marked with the `loseless:` or `lossless:` comment tag across your codebase.

## The Debt Tag Convention
Developers and agents mark intentional simplifications using:
```typescript
// loseless: [ceiling: 100 req/sec] -> upgrade: [introduce Redis stream when latency spikes]
/* loseless: [ceiling: 50 conns] => upgrade: [connection pooler] */
```
Or multiline JSDoc blocks:
```javascript
/**
 * @loseless
 * ceiling: 1000 items in memory
 * upgrade: stream chunking pipeline
 */
```
Or in Python/Shell/YAML:
```python
# loseless: [ceiling: O(N) linear search] -> upgrade: [use binary search or hash index if len > 1000]
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
1. Recursively scans the workspace across all major language extensions.
2. Automatically skips `node_modules`, `dist`, `.git`, `.cache`, `coverage`.
3. Parses each finding into:
   - **File & Line**: Source location.
   - **Ceiling / Constraint**: The operational capacity limit.
   - **Upgrade Path**: The exact recommended architectural upgrade.
4. Outputs an actionable summary table and operational ceiling metrics.
