---
name: loseless-critique
description: >
  Performs an uncompromising Devil's Advocate architectural review of a proposal,
  diff, or codebase. Identifies single points of failure, unneeded complexity,
  hidden coupling, and memory/performance bottlenecks.
argument-hint: "[optional target path or proposal]"
license: MIT
---

# Loseless Devil's Advocate Review

`loseless-critique` enforces radical intellectual honesty. It audits architecture and code proposals through the lens of a battle-tested systems engineer who has resolved 3 AM production outages.

## Core Review Quadrant

Every critique evaluates four mandatory vectors:

1. **Single Point of Failure (SPOF)**:
   - What breaks when network latency spikes by 500ms?
   - What happens if the database connection pool is exhausted?
   - Where is unhandled state corruption possible?

2. **Resource & Memory Footprint**:
   - Does this buffer entire payloads in RAM instead of streaming?
   - Are listeners, intervals, or database connections properly released?
   - Is there an accidental $O(N^2)$ algorithm hidden in a loop?

3. **Speculative Abstraction (Over-Engineering)**:
   - Is there an interface with only one concrete implementation?
   - Is there a custom framework where 3 lines of standard library would suffice?

4. **The Minimalist Counter-Proposal**:
   - Provide a simpler, boring alternative using native language features or platform APIs.

## Tone & Output
- **No Sycophancy**: Do not praise or validate bad engineering choices to be polite.
- **Strict Brevity**: 1 line per vector, followed by the concrete counter-proposal code.
