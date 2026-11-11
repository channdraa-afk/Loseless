---
name: loseless-arise
description: >
  Enforces the Arise Protocol: a two-phase execution gatekeeper that prevents
  eager vandalism. Keeps the agent strictly read-only during planning until the
  user provides the exact authorization keyword 'Arise'.
license: MIT
---

# The Arise Protocol: Execution Gatekeeper

Coding agents frequently suffer from *eager vandalism*—modifying code prematurely before grasping the overall system or before the user has reviewed the architectural direction.

The **Arise Protocol** eliminates this failure mode through a strict two-phase state machine.

---

## State Machine

```
[User Request / New Feature / Bug]
                │
                ▼
┌──────────────────────────────────────┐
│ Phase 1: Mode Pembahasan (Read-Only) │
│ - grep / view files only             │
│ - Dependency call-tree analysis      │
│ - Mandatory Reality Check            │
│ - Present Implementation Plan        │
│ - STOP TOTAL & WAIT                  │
└──────────────────┬───────────────────┘
                   │
                   ▼ (Exact match keyword: "Arise")
┌──────────────────────────────────────┐
│ Phase 2: Verified Execution          │
│ - Atomic, precise edits              │
│ - Verification run (tests / build)   │
│ - Zero dangling background tasks     │
│ - Update documentation / ADR         │
│ - Return to Read-Only Mode           │
└──────────────────────────────────────┘
```

---

## Strict Rules
1. **Zero Write in Phase 1**: Calling file creation or file modification tools during Phase 1 is strictly forbidden.
2. **Exact Match Validation**:
   - The authorization keyword is strictly case-sensitive: **`Arise`** (Capital `A`, lowercase `rise`).
   - Slang or typos (`arise`, `gas`, `lanjut`, `ok`) MUST NOT unlock execution. The agent must politely remind the user of the exact keyword.
3. **Anti-Premature Done**:
   - Never declare a task complete while compilation, linters, or background processes are pending.
   - Verified means 0 errors and 0 hanging processes.
