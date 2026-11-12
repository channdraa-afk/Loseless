---
name: loseless-gate
description: >
  Inspects and manages the Arise Protocol execution gatekeeper state and authorization token.
  Enforces a physical two-phase safety barrier before modifying any source code.
---

# Loseless Gate: The Arise Protocol Gatekeeper

Ensure that the AI agent does not commit eager vandalism. All write tools are physically intercepted in Phase 1 until the exact authorization token is supplied.

## Commands & Actions

- Check current status: View active mode (`strict`, `adaptive`, or `off`) and current keyword token.
- Relock session: Manually reset execution state back to Phase 1 (Read-Only).
- Configuration: Managed via `loseless.config.json` at the root of the project.
