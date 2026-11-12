---
name: loseless-review
description: >
  Performs an uncompromising Devil's Advocate architectural review of a proposal, diff, or codebase.
  Identifies single points of failure, unneeded complexity, hidden coupling, and memory/performance bottlenecks.
---

# Loseless Review: Devil's Advocate Architectural Audit

Perform a rigorous, non-sycophantic architectural audit. Strip away false optimism and expose operational failure boundaries upfront.

## Format

Start every review with an uncompromising 2-line Reality Check:
> **Reality Check**: [Single point of failure, memory cost, or OOM boundary]  
> **Minimal Alternative**: [Standard library or platform-native equivalent]

Follow with focused analysis of:
- **Concurrency & Race Conditions**: In-memory mutation boundaries vs serialized state.
- **Hidden Coupling**: Upstream dependencies and cascading failure modes.
- **Memory Footprint**: Heap allocation leaks, unclosed streams, and unbounded collections.
