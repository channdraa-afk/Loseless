---
name: loseless-debt
description: >
  Scans the entire repository for 'lossless:' comment tags and compiles an
  actionable Technical Debt Ledger. Use when assessing shortcuts taken during
  rapid development, evaluating refactoring priorities, or preparing for production.
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

## Scanner Workflow
When invoked (via `/loseless-debt` or "scan technical debt"):
1. Grep the workspace for `lossless:` (case-insensitive across `.ts`, `.js`, `.py`, `.go`, `.rs`, `.sql`, etc.).
2. Ignore vendor folders (`node_modules`, `dist`, `.git`, `vendor`).
3. Parse each finding into:
   - **File & Line**: Clickable link to source.
   - **Ceiling / Constraint**: The operational limit of the current shortcut.
   - **Upgrade Path**: The exact recommended architecture when the ceiling is reached.
4. Output a clean Markdown table summarizing total debt items and highest priority bottlenecks.

## Output Format
```markdown
### 📋 Loseless Technical Debt Ledger

| Priority | Location | Ceiling / Constraint | Upgrade Path |
| :--- | :--- | :--- | :--- |
| 🔴 High | `src/auth.ts:42` | Global mutex lock | Partition by account ID |
| 🟡 Medium | `src/cache.ts:18` | In-memory Map | Redis with TTL eviction |

*Total Debt Items Found: 2. Zero undocumented hacks detected.*
```
