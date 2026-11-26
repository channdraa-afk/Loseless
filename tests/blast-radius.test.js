const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const { calculateBlastRadius } = require('../scripts/blast-radius');

console.log('Running Loseless Blast-Radius Scanner Test Suite...');

// Test 1: Scan for known symbol in current project (e.g. walk)
{
  const result = calculateBlastRadius('walk', process.cwd());
  assert.ok(result, 'Result must not be null');
  assert.ok(result.totalRefs > 0, 'Must find references to walk');
  assert.ok(result.distinctModules > 0, 'Must identify distinct modules');
  console.log(`  ✓ Reference aggregation verified (${result.totalRefs} references found)`);
}

// Test 2: Invariant heuristic triggers Tier 2
{
  const result = calculateBlastRadius('authSecretToken', process.cwd());
  assert.strictEqual(result.tier, 'Tier 2', 'Critical token symbol must trigger Tier 2');
  console.log('  ✓ Invariant heuristic triggers Tier 2 classification');
}

// Test 3: Special character symbols ($state, @Directive) with universal lookaround
{
  const tempFile = path.join(process.cwd(), 'tests', 'temp-symbol-sample.js');
  fs.writeFileSync(tempFile, 'const count = $state(0);\nconst view = @Directive();\n', 'utf-8');

  const stateRes = calculateBlastRadius('$state', process.cwd());
  const dirRes = calculateBlastRadius('@Directive', process.cwd());

  try {
    fs.unlinkSync(tempFile);
  } catch (e) {}

  assert.ok(stateRes && stateRes.totalRefs >= 1, 'Must detect symbol starting with $');
  assert.ok(dirRes && dirRes.totalRefs >= 1, 'Must detect symbol starting with @');
  console.log('  ✓ Universal lookaround matches special symbols ($state, @Directive)');
}

// Test 4: Null input handling
{
  const result = calculateBlastRadius('');
  assert.strictEqual(result, null, 'Empty symbol must return null safely');
  console.log('  ✓ Edge-case validation verified');
}

// Test 5: Multi-Language Reference Aggregation (Python, Go, Rust)
{
  const fixtureDir = path.join(process.cwd(), 'tests', 'fixtures', 'multilang');
  const result = calculateBlastRadius('verify_token', fixtureDir);
  assert.ok(result, 'Result must not be null');
  assert.strictEqual(result.totalRefs, 6, 'Must detect exactly 6 references across Python, Go, and Rust fixtures');
  assert.strictEqual(result.languageBreakdown.python, 2, 'Must detect Python references');
  assert.strictEqual(result.languageBreakdown.go, 2, 'Must detect Go references');
  assert.strictEqual(result.languageBreakdown.rust, 2, 'Must detect Rust references');
  assert.ok(result.kindBreakdown.definition >= 1, 'Must detect definition kinds');
  assert.ok(result.kindBreakdown.import >= 2, 'Must detect import kinds');
  assert.ok(result.kindBreakdown['call-site'] >= 3, 'Must detect call-site kinds');
  console.log('  ✓ Multi-language symbol reference aggregation verified (Python, Go, Rust)');
}

// Test 6 (V3-01): Markdown docs are excluded from source symbol reference counts
{
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'loseless-blast-md-'));
  try {
    fs.writeFileSync(path.join(tempDir, 'docs.md'), 'verifyUniqueSymbol verifyUniqueSymbol\n', 'utf-8');
    fs.writeFileSync(path.join(tempDir, 'app.js'), 'verifyUniqueSymbol();\n', 'utf-8');
    const res = calculateBlastRadius('verifyUniqueSymbol', tempDir);
    assert.strictEqual(res.totalRefs, 1, 'Markdown prose must not inflate code reference counts');
    console.log('  ✓ Markdown prose exclusion verified in blast-radius scanner');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

// Test 7 (V2-01): Universal CLI entrypoint executes blast and debt subcommands end-to-end
{
  const cliPath = path.join(process.cwd(), 'bin', 'loseless.js');
  const blastProc = spawnSync(process.execPath, [cliPath, 'blast', 'calculateBlastRadius'], {
    cwd: process.cwd(),
    encoding: 'utf-8'
  });
  assert.strictEqual(blastProc.status, 0, 'CLI blast subcommand must exit 0');
  assert.ok(blastProc.stdout.includes('LOSELESS BLAST-RADIUS IMPACT TELEMETRY'), 'CLI blast must emit full telemetry report');

  const debtProc = spawnSync(process.execPath, [cliPath, 'debt'], {
    cwd: process.cwd(),
    encoding: 'utf-8'
  });
  assert.strictEqual(debtProc.status, 0, 'CLI debt subcommand must exit 0');
  assert.ok(debtProc.stdout.includes('LOSELESS TECHNICAL DEBT SCANNER'), 'CLI debt must emit full scanner report');
  console.log('  ✓ CLI entrypoint execution verified for blast and debt subcommands');
}

console.log('All Blast-Radius Tests Passed Successfully.\n');
