const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { analyzePrompt, loadSession, saveSession, relockSession, getSessionFilePath } = require('../hooks/loseless-mode-tracker');
const { checkToolAuthorization } = require('../hooks/loseless-pretool');
const { activate } = require('../hooks/loseless-activate');

console.log('Running Loseless Physical Hooks Test Suite...');

// Setup clean session
const sessionFile = getSessionFilePath();
try {
  if (fs.existsSync(sessionFile)) fs.unlinkSync(sessionFile);
} catch (e) {}

// Test 1: Activation hook sets Phase 1 (Locked)
{
  activate();
  const session = loadSession();
  assert.strictEqual(session.phase, 1, 'Initial session phase must be 1 (Locked)');
  assert.strictEqual(session.bypassed, false, 'Initial session must not be bypassed');
  console.log('  ✓ SessionStart activation verified (Phase 1 Locked)');
}

// Test 2: PreToolUse blocks write tools in Phase 1
{
  const check = checkToolAuthorization('write_file', 'src/core/auth.ts');
  assert.strictEqual(check.allowed, false, 'write_file must be blocked in Phase 1');
  assert.ok(check.error.includes('BLOCKED BY LOSELESS GATEKEEPER'), 'Error message must explain gatekeeper requirement');
  console.log('  ✓ PreToolUse physical block verified in Phase 1');
}

// Test 3: Fast-track micro diffs allows non-code files (markdown/svg)
{
  const check = checkToolAuthorization('write_file', 'docs/README.md');
  assert.strictEqual(check.allowed, true, 'Docs fast-track micro diffs must be allowed');
  console.log('  ✓ Fast-track micro-diff for non-code files verified');
}

// Test 4: Critical config file (e.g. package.json) is NEVER fast-tracked
{
  const check = checkToolAuthorization('write_file', 'package.json');
  assert.strictEqual(check.allowed, false, 'Critical config file must never be fast-tracked');
  console.log('  ✓ Critical config protection boundary verified');
}

// Test 5: Typo or casual keyword does NOT unlock Phase 2
{
  const res = analyzePrompt('gas lanjut');
  assert.notStrictEqual(res.action, 'unlocked', 'Casual keyword must not unlock gate');
  const session = loadSession();
  assert.strictEqual(session.phase, 1, 'Phase must remain 1 on unauthorized input');
  console.log('  ✓ Strict anti-typo / exact-match gate verified');
}

// Test 6: Exact token unlocks Phase 2
{
  const res = analyzePrompt('Arise');
  assert.strictEqual(res.action, 'unlocked', 'Exact token Arise must unlock gate');
  assert.strictEqual(res.phase, 2, 'Session phase must transition to 2');
  const check = checkToolAuthorization('write_file', 'src/core/auth.ts');
  assert.strictEqual(check.allowed, true, 'write_file must be allowed once unlocked');
  console.log('  ✓ Exact token Arise unlocks Phase 2 and permits file write');
}

// Test 7: Auto-Relock Turn Policy (Subsequent new prompt relocks to Phase 1)
{
  const res = analyzePrompt('buat fitur baru payment gateway');
  assert.strictEqual(res.action, 'auto_relocked', 'New prompt after execution must trigger auto-relock');
  assert.strictEqual(res.phase, 1, 'Phase must reset to 1 for the new task');
  const check = checkToolAuthorization('write_file', 'src/core/auth.ts');
  assert.strictEqual(check.allowed, false, 'Write tools must be locked again in Phase 1');
  console.log('  ✓ Auto-relock turn policy verified (anti-stale unlock leak)');
}

// Test 8: Frustration detection via local patterns dataset (0 token cost)
{
  relockSession();
  const res = analyzePrompt('ngapain sih pake arise ribet amat');
  assert.strictEqual(res.action, 'frustration_detected', 'Frustration pattern must be detected');
  console.log('  ✓ Sentiment Radar catches user frustration cues locally');
}

// Test 9: Explicit bypass command unlocks execution
{
  const res = analyzePrompt('tolong bypass-arise');
  assert.strictEqual(res.action, 'bypass', 'Explicit bypass command must trigger bypass');
  assert.strictEqual(res.phase, 2, 'Bypassed session must enter phase 2');
  const check = checkToolAuthorization('write_file', 'src/core/auth.ts');
  assert.strictEqual(check.allowed, true, 'write_file must be allowed under bypass');
  console.log('  ✓ Explicit bypass command verified');
}

// Test 10: Reconciliation loop relocks session on completion keywords
{
  const res = analyzePrompt('makasih tuntas mantap');
  assert.strictEqual(res.action, 'reconciled', 'Satisfaction keyword must trigger reconciliation');
  assert.strictEqual(res.phase, 1, 'Reconciled session must return to Phase 1');
  console.log('  ✓ Reconciliation loop relocks session to Phase 1');
}

console.log('All Physical Hooks Tests Passed Successfully.\n');
