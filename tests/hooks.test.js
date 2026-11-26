const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

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

// Test 11: Conversational urgency cues blocked in strict mode & trigger instant bypass in adaptive mode
{
  relockSession();
  const strictBlock1 = analyzePrompt('Bagaimana rencana arsitektur untuk quick fix modul auth ini?');
  assert.strictEqual(strictBlock1.action, 'none', 'Strict mode must NOT bypass on casual quick fix wording');
  assert.strictEqual(strictBlock1.phase, 1, 'Strict mode must remain locked at Phase 1');

  const strictBlock2 = analyzePrompt('aku lagi ada deadline tolong beresin');
  assert.strictEqual(strictBlock2.action, 'none', 'Strict mode must NOT bypass on deadline urgency without explicit flag');

  const adaptiveConfig = { ariseMode: 'adaptive', gateKeyword: 'Arise' };
  const res1 = analyzePrompt('aku lagi ada deadline tolong beresin', adaptiveConfig);
  assert.strictEqual(res1.action, 'bypass', 'Deadline urgency must trigger instant bypass in adaptive mode');
  assert.strictEqual(res1.phase, 2, 'Session must enter Phase 2');

  const res2 = analyzePrompt('langsung mode turbo aja', adaptiveConfig);
  assert.strictEqual(res2.action, 'bypass', 'Turbo mode phrasing must trigger instant bypass in adaptive mode');
  assert.strictEqual(res2.phase, 2, 'Session must enter Phase 2');
  console.log('  ✓ Strict mode blocks conversational bypass while adaptive deadline & turbo cues trigger bypass');
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

// Test 15: Cross-workspace plugin isolation & SessionStart onboarding detection via stdin.cwd
{
  const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'loseless-onboard-1-'));
  try {
    const childEnv = { ...process.env };
    delete childEnv.LOSELESS_SESSION_DIR;
    delete childEnv.LOSELESS_WORKSPACE_DIR;

    const proc = spawnSync(process.execPath, [path.join(process.cwd(), 'hooks', 'loseless-activate.js')], {
      cwd: process.cwd(), // Simulate plugin root which ALREADY has loseless.config.json
      env: childEnv,
      input: JSON.stringify({ cwd: tempRepo, workspacePaths: [tempRepo] }),
      encoding: 'utf-8'
    });

    assert.strictEqual(proc.status, 0, 'loseless-activate.js subprocess must exit 0');
    assert.ok(proc.stdout.includes('PROACTIVE_ONBOARDING_REQUIRED'), 'Missing loseless.config.json in stdin.cwd must trigger PROACTIVE_ONBOARDING_REQUIRED');
    const createdSession = path.join(tempRepo, '.loseless', 'session.json');
    assert.ok(fs.existsSync(createdSession), 'Session state must be isolated inside user workspaceDir, not plugin root');
    const parsedSession = JSON.parse(fs.readFileSync(createdSession, 'utf-8'));
    assert.strictEqual(parsedSession.phase, 1, 'New unconfigured workspace must initialize at Phase 1');
    assert.strictEqual(parsedSession.onboardingPrompted, true, 'onboardingPrompted flag must be recorded');
    console.log('  ✓ Cross-workspace SessionStart onboarding & stdin.cwd isolation verified');
  } finally {
    fs.rmSync(tempRepo, { recursive: true, force: true });
  }
}

// Test 16: PreInvocation fallback onboarding triggers once when SessionStart did not fire
{
  const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'loseless-onboard-2-'));
  try {
    const childEnv = { ...process.env };
    delete childEnv.LOSELESS_SESSION_DIR;
    delete childEnv.LOSELESS_WORKSPACE_DIR;

    const turn1 = spawnSync(process.execPath, [path.join(process.cwd(), 'hooks', 'loseless-mode-tracker.js')], {
      cwd: process.cwd(),
      env: childEnv,
      input: JSON.stringify({ cwd: tempRepo, lastUserInput: 'tolong rapikan kode php ini' }),
      encoding: 'utf-8'
    });
    assert.strictEqual(turn1.status, 0);
    assert.ok(turn1.stdout.includes('PROACTIVE_ONBOARDING_REQUIRED'), 'First PreInvocation turn in unconfigured repo must trigger onboarding directive');

    const turn2 = spawnSync(process.execPath, [path.join(process.cwd(), 'hooks', 'loseless-mode-tracker.js')], {
      cwd: process.cwd(),
      env: childEnv,
      input: JSON.stringify({ cwd: tempRepo, lastUserInput: 'lanjut cek auth' }),
      encoding: 'utf-8'
    });
    assert.strictEqual(turn2.status, 0);
    assert.strictEqual(turn2.stdout.trim(), '', 'Subsequent turn must not repeat onboarding directive spam');
    console.log('  ✓ PreInvocation fallback onboarding triggers exactly once on unconfigured workspace');
  } finally {
    fs.rmSync(tempRepo, { recursive: true, force: true });
  }
}

// Test 17: hooks.json PreToolUse matcher skips read-only tools and targets mutation tools
{
  const hooksJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'hooks.json'), 'utf-8'));
  const matcherStr = hooksJson['loseless-gate'].PreToolUse[0].matcher;
  assert.notStrictEqual(matcherStr, '*', 'PreToolUse matcher must never use blanket wildcard *');
  const matcherRegex = new RegExp(`^(?:${matcherStr})$`);
  assert.strictEqual(matcherRegex.test('read_file'), false, 'read_file must bypass PreToolUse hook');
  assert.strictEqual(matcherRegex.test('grep_search'), false, 'grep_search must bypass PreToolUse hook');
  assert.strictEqual(matcherRegex.test('list_dir'), false, 'list_dir must bypass PreToolUse hook');
  assert.strictEqual(matcherRegex.test('write_file'), true, 'write_file must be intercepted by PreToolUse hook');
  assert.strictEqual(matcherRegex.test('edit_file'), true, 'edit_file must be intercepted by PreToolUse hook');
  assert.strictEqual(matcherRegex.test('run_command'), true, 'run_command must be intercepted by PreToolUse hook');
  console.log('  ✓ hooks.json PreToolUse matcher targets mutation tools and exempts read-only tools');
}

// Test 18 (V1-02): Agent rules and oversized doc diffs are never fast-tracked in Phase 1
{
  relockSession();
  const blockedTargets = ['rules/AGENTS.md', 'AGENTS.md', 'CLAUDE.md', 'skills/loseless/SKILL.md', 'hooks.json', '.cursorrules'];
  for (const target of blockedTargets) {
    const res = checkToolAuthorization('write_file', target);
    assert.strictEqual(res.allowed, false, `${target} must never be fast-tracked in Phase 1`);
  }
  const bigDocRes = checkToolAuthorization('write_file', 'docs/README.md', null, { diffLines: 25 });
  assert.strictEqual(bigDocRes.allowed, false, 'Oversized markdown edits (>5 lines) must be blocked in Phase 1');
  const smallDocRes = checkToolAuthorization('write_file', 'docs/README.md', null, { diffLines: 2 });
  assert.strictEqual(smallDocRes.allowed, true, 'Small non-critical markdown micro-diff (<=5 lines) must pass');
  console.log('  ✓ Agent rule protection & micro-diff line-limit enforcement verified');
}

// Test 19 (V1-01): Delete tools and mutating shell/browser commands blocked in Phase 1 while read-only cmds allowed
{
  relockSession();
  assert.strictEqual(checkToolAuthorization('delete_file', 'src/index.js').allowed, false, 'delete_file must be blocked in Phase 1');

  const mutatingCmds = [
    'rm -rf src/',
    'echo "hacked" > server.js',
    'sed -i "s/a/b/g" app.js',
    'git commit -m "sneaky"',
    'agent-browser click @e4',
    'agent-browser fill @e2 "test"'
  ];
  for (const cmd of mutatingCmds) {
    const check = checkToolAuthorization('run_command', '', null, { commandLine: cmd });
    assert.strictEqual(check.allowed, false, `Mutating command must be blocked in Phase 1: ${cmd}`);
  }

  const readOnlyCmds = [
    'git status',
    'npm test 2>/dev/null',
    'rg "->" scripts/',
    'agent-browser open http://localhost:5173',
    'agent-browser snapshot -i'
  ];
  for (const cmd of readOnlyCmds) {
    const check = checkToolAuthorization('run_command', '', null, { commandLine: cmd });
    assert.strictEqual(check.allowed, true, `Read-only command must stay allowed in Phase 1: ${cmd}`);
  }
  console.log('  ✓ Mutating shell/browser/delete commands blocked while read-only inspection stays allowed');
}

// Test 20 (V1-03): Word-boundary matching prevents substring collisions & escapes regex metacharacters
{
  relockSession();
  const gossipRes = analyzePrompt('implementasikan gossip protocol untuk distributed cluster');
  assert.notStrictEqual(gossipRes.action, 'reconciled', 'Word "gossip" must not match "sip"');

  const undoneRes = analyzePrompt('verify why cache state is undone');
  assert.notStrictEqual(undoneRes.action, 'reconciled', 'Word "undone" must not match "done"');

  const capsRes = analyzePrompt('I KNOW how it handles timeouts', { ariseMode: 'adaptive', gateKeyword: 'Arise' });
  assert.notStrictEqual(capsRes.action, 'frustration_detected', 'Substring "NOW" inside "KNOW" must not trigger impatience alert');

  const metaRes = analyzePrompt('check status', { ariseMode: 'strict', gateKeyword: 'Arise(?' });
  assert.strictEqual(metaRes.action, 'none', 'Regex metacharacters in gateKeyword must never throw SyntaxError');
  console.log('  ✓ Word-boundary anti-collision & regex-safe gateKeyword verified');
}

// Test 21: End-to-end PreToolUse subprocess blocks mutating shell/file calls via Antigravity stdin payload
{
  const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'loseless-pretool-e2e-'));
  try {
    const childEnv = { ...process.env };
    delete childEnv.LOSELESS_SESSION_DIR;
    delete childEnv.LOSELESS_WORKSPACE_DIR;

    const proc = spawnSync(process.execPath, [path.join(process.cwd(), 'hooks', 'loseless-pretool.js')], {
      cwd: process.cwd(),
      env: childEnv,
      input: JSON.stringify({
        cwd: tempRepo,
        toolCall: { name: 'run_command', args: { CommandLine: 'rm -rf src/' } }
      }),
      encoding: 'utf-8'
    });
    assert.strictEqual(proc.status, 1, 'Mutating PreToolUse subprocess must exit with code 1');
    const out = JSON.parse(proc.stdout);
    assert.strictEqual(out.decision, 'deny', 'PreToolUse stdout JSON must report decision: deny');
    console.log('  ✓ End-to-end PreToolUse stdin/stdout subprocess enforcement verified');
  } finally {
    fs.rmSync(tempRepo, { recursive: true, force: true });
  }
}

// Final isolated test sandbox cleanup
try {
  if (fs.existsSync(sessionFile)) fs.unlinkSync(sessionFile);
  if (fs.existsSync(testSessionDir)) {
    const leftoverFiles = fs.readdirSync(testSessionDir);
    for (const f of leftoverFiles) {
      try { fs.unlinkSync(path.join(testSessionDir, f)); } catch (e) {}
    }
    fs.rmdirSync(testSessionDir);
  }
} catch (e) {}

console.log('All Physical Hooks Tests Passed Successfully.\n');
