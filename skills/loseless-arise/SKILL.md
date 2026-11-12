---
name: loseless-arise
description: >
  Enforces the Arise Protocol: a two-phase execution gatekeeper that prevents
  eager vandalism. Keeps the agent strictly read-only during planning until the
  user provides the exact authorization keyword 'Arise'. Features adaptive friction radar.
license: MIT
---

# The Arise Protocol: Execution Gatekeeper

Coding agents frequently suffer from *eager vandalism*—modifying code prematurely before grasping the overall system or before the user has reviewed the architectural direction.

The **Arise Protocol** eliminates this failure mode through a strict two-phase state machine backed by **real physical Node.js hooks**.

---

## State Machine

```
[User Request / New Feature / Bug]
                │
                ▼
┌──────────────────────────────────────┐
│ Phase 1: Mode Pembahasan (Read-Only) │
│ - grep / view files only             │
│ - PreToolUse physically blocks write │
│ - Mandatory Reality Check            │
│ - Auto-inject Gatekeeper Card        │
│ - STOP TOTAL & WAIT                  │
└──────────────────┬───────────────────┘
                   │
                   ▼ (Exact match keyword: "Arise")
┌──────────────────────────────────────┐
│ Phase 2: Verified Execution          │
│ - Physical Hook unlocks write access │
│ - Atomic, precise edits              │
│ - Verification run (tests / build)   │
│ - Zero dangling background tasks     │
│ - Auto-relocks on subsequent task    │
└──────────────────────────────────────┘
```

---

## Strict Rules
1. **Physical PreTool Enforcement**: Calling file creation or modification tools during Phase 1 is blocked at the runtime level via `hooks/loseless-pretool.js`.
2. **Exact Match Validation**:
   - The authorization keyword is strictly case-sensitive: **`Arise`** (Capital `A`, lowercase `rise`). Configurable via `loseless.config.json` (`"gateKeyword": "<TOKEN>"`).
   - Slang or typos (`arise`, `gas`, `lanjut`, `ok`) MUST NOT unlock execution. The agent must remind the user of the exact keyword.
3. **Adaptive Friction Radar**:
   - In `"ariseMode": "adaptive"`, if the user demonstrates frustration/urgency (*"ngapain pake arise"*, *"cepetan"*), the agent intercepts this locally at 0 token cost and suggests a temporary bypass.
   - Fast-track micro diffs (< 3 lines non-code) execute immediately with inline diff preview.
   - Offers gate re-activation upon task completion.
4. **Auto-Relock Turn Policy**:
   - Once a task is executed, the gate automatically relocks to Phase 1 for subsequent requests to prevent stale unlock leaks.
