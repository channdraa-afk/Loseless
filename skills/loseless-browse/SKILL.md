---
name: loseless-browse
description: >
  Token-efficient browser automation and Web Arise Protocol safety gate.
  Leverages compact accessibility tree references (@e1, @e2) to interact with web
  pages without context window DOM bloat, enforcing read-only inspection until Arise authorization.
argument-hint: "[url or verification target]"
license: MIT
---

# Loseless Browser: Token-Efficient Web Automation & Safety Gate

`loseless-browse` bridges modern coding agents with live web browser automation while enforcing **The Parsimony Ladder** and **The Arise Protocol**.

Built upon the philosophy of [`vercel-labs/agent-browser`](https://github.com/vercel-labs/agent-browser), this skill eliminates the two fatal flaws of traditional browser agents:
1. **Context Window Exhaustion**: Dumping raw HTML or megabytes of vision screenshots exhausts LLM tokens.
2. **Eager Web Vandalism**: Agents blindly clicking destructive forms or production mutations without human authorization.

---

## 1. The Compact Accessibility Tree (@e1, @e2 Model)

Instead of dumping 30,000+ tokens of raw DOM trees, `loseless-browse` extracts an **interactive semantic accessibility tree** mapping every actionable element to a short reference ID:

```text
[heading] @e1 "Account Settings"
[input]   @e2 "Email Address"
[button]  @e3 "Save Changes"
[button]  @e4 "Delete Organization"
```

The agent interacts strictly through compact commands:
```bash
agent-browser click @e3
agent-browser fill @e2 "dev@example.com"
```

---

## 2. The Web Arise Protocol (Two-Phase Web Safety Gate)

Just as code modifications require authorization, browser interactions adhere to a physical two-phase gate:

### Phase 1: Read-Only Web Inspection
- **Permitted**: Navigating (`open`), capturing accessibility snapshots (`snapshot -i`), reading text, inspecting status codes, and checking layout rendering.
- **Workflow**:
  ```bash
  agent-browser open http://localhost:5173
  agent-browser snapshot -i
  ```
- **State**: Strictly read-only. The agent reports findings and plans mutations.

### Phase 2: Verified Mutation (Gate Keyword Required)
- **Gate Enforcement**: Any action that mutates state—submitting forms, clicking buttons with side-effects (`Pay`, `Delete`, `Submit`, `Send`), running custom JavaScript mutations, or clearing cookies—is **strictly blocked** until the user explicitly provides the gate keyword (`Arise`).
- Once authorized, the agent executes the verified action and re-captures the compact snapshot.

---

## 3. Frontend E2E Verification Workflow

Use `loseless-browse` to verify local UI changes immediately after modifying components:

1. Launch local development server (`npm run dev`).
2. Open target URL in background daemon:
   ```bash
   agent-browser open http://localhost:5173
   agent-browser snapshot -i
   ```
3. Check for layout breaks, missing buttons, or console errors.
4. Capture proof screenshot if requested:
   ```bash
   agent-browser screenshot .cache/preview.png
   agent-browser close
   ```

---

## 4. Key Command Reference

| Command | Action | Safety Phase |
| :--- | :--- | :--- |
| `agent-browser open <url>` | Navigate to page via CDP daemon | Phase 1 (Allowed) |
| `agent-browser snapshot -i` | Capture compact a11y tree with `@e` references | Phase 1 (Allowed) |
| `agent-browser screenshot <path>` | Capture PNG screenshot without vision bloat | Phase 1 (Allowed) |
| `agent-browser fill @e<id> <val>` | Fill input field with text | Phase 2 (Arise Required) |
| `agent-browser click @e<id>` | Click interactive element or submit button | Phase 2 (Arise Required) |
| `agent-browser close` | Terminate browser daemon cleanly | Phase 1 (Allowed) |
