const assert = require('assert');
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

// Test 2: Critical invariant symbol triggers Tier 2
{
  const result = calculateBlastRadius('authSecretToken', process.cwd());
  assert.strictEqual(result.tier, 'Tier 2', 'Critical token symbol must trigger Tier 2');
  console.log('  ✓ Invariant heuristic triggers Tier 2 classification');
}

// Test 3: Null input handling
{
  const result = calculateBlastRadius('');
  assert.strictEqual(result, null, 'Empty symbol must return null safely');
  console.log('  ✓ Edge-case validation verified');
}

console.log('All Blast-Radius Tests Passed Successfully.\n');
