---
name: loseless-impact
description: >
  Computes the blast-radius impact and caller distribution of any symbol or function across the codebase.
  Offloads reference searches to local CLI to preserve 95%+ context window tokens.
---

# Loseless Impact: AST Blast-Radius Telemetry

Calculate the blast-radius impact of any symbol, function, or table across the repository without flooding the context window with raw grep dumps.

## CLI Execution

Run the local offloader:
```bash
npm run blast-radius -- <symbolOrFunction>
```

## Report Format

Emit a compact 3-line aggregate report:
1. **Target Symbol & Tier**: Classify into Tier 0 (Aesthetic/Local), Tier 1 (Scoped Component), or Tier 2 (Systemic/Critical Invariant).
2. **Distribution**: Count of call-sites grouped by module.
3. **Primary Root & Safety Gate**: Convergence root file and mandated Arise safety protocol.
