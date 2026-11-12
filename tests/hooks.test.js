const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Isolate test session from active workspace so tests never pollute production state
const testSessionDir = path.join(__dirname, '.temp-test-session');
process.env.LOSELESS_SESSION_DIR = testSessionDir;

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

// Test 8: Frustration detection via local patterns dataset in adaptive mode (0 token cost)
{
  relockSession();
  const adaptiveConfig = { ariseMode: 'adaptive', gateKeyword: 'Arise' };
  const res = analyzePrompt('ngapain sih pake arise ribet amat', adaptiveConfig);
  assert.strictEqual(res.action, 'frustration_detected', 'Frustration pattern must be detected in adaptive mode');

  // Verify in strict mode frustration does NOT bypass
  const strictRes = analyzePrompt('ngapain sih pake arise ribet amat');
  assert.strictEqual(strictRes.action, 'none', 'Frustration pattern must NOT offer bypass in strict mode');
  console.log('  ✓ Sentiment Radar catches user frustration in adaptive mode & enforces zero-bypass in strict mode');
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

// Test 11: Natural language deadline & turbo mode cues trigger instant bypass
{
  const res1 = analyzePrompt('aku lagi ada deadline tolong beresin');
  assert.strictEqual(res1.action, 'bypass', 'Deadline urgency must trigger instant bypass');
  assert.strictEqual(res1.phase, 2, 'Session must enter Phase 2');

  const res2 = analyzePrompt('langsung mode turbo aja');
  assert.strictEqual(res2.action, 'bypass', 'Turbo mode phrasing must trigger instant bypass');
  assert.strictEqual(res2.phase, 2, 'Session must enter Phase 2');
  console.log('  ✓ Natural language deadline & turbo cues trigger instant bypass');
}

// Test 12: Auto-relock policy strictly locks subsequent turns and clears bypass
{
  const newTurnRes = analyzePrompt('lanjut fitur berikutnya');
  assert.strictEqual(newTurnRes.action, 'auto_relocked', 'Subsequent turn must auto-relock');
  assert.strictEqual(newTurnRes.phase, 1, 'Auto-relocked session must be Phase 1');
  const session = loadSession();
  assert.strictEqual(session.phase, 1, 'Stored session phase must be 1');
  assert.strictEqual(session.bypassed, false, 'Bypass flag must be cleared on auto-relock');
  console.log('  ✓ Auto-relock policy clears bypass and enforces Phase 1 on new turns');
}

// Test 13: Path normalization & traversal defense blocks masked critical config
{
  const check = checkToolAuthorization('write_file', './subfolder/../package.json');
  assert.strictEqual(check.allowed, false, 'Masked traversal to package.json must be blocked');
  console.log('  ✓ Path traversal normalization and critical config defense verified');
}

// Test 14: Corrupted session file self-healing quarantine and recovery
{
  const testFile = getSessionFilePath();
  // Intentionally corrupt the session file
  fs.writeFileSync(testFile, 'INVALID_JSON_CORRUPTED_BYTES{{{', 'utf-8');
  const healed = loadSession();
  assert.strictEqual(healed.phase, 1, 'Corrupted session must safely fall back to Phase 1');
  assert.strictEqual(healed.bypassed, false, 'Corrupted session must not be bypassed');

  // Verify that atomic write creates valid parseable JSON
  saveSession({ phase: 2, bypassed: false, lastKeyword: 'Arise', updatedAt: Date.now() });
  const reloaded = loadSession();
  assert.strictEqual(reloaded.phase, 2, 'Reloaded session after atomic write must be intact');
  console.log('  ✓ Corrupted session self-healing quarantine and atomic write verified');
}

// Cleanup isolated test sandbox
try {
  if (fs.existsSync(sessionFile)) fs.unlinkSync(sessionFile);
  const leftoverFiles = fs.readdirSync(testSessionDir);
  for (const f of leftoverFiles) {
    try { fs.unlinkSync(path.join(testSessionDir, f)); } catch (e) {}
  }
  if (fs.existsSync(testSessionDir)) fs.rmdirSync(testSessionDir);
} catch (e) {}

console.log('All Physical Hooks Tests Passed Successfully.\n');
