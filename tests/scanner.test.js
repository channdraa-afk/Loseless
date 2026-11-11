const assert = require('assert');
const { DEBT_REGEX, walk, scanFile } = require('../scripts/debt-scanner.js');

console.log('Running Loseless Scanner Test Suite...');

// Test 1: Regex matches JavaScript/TypeScript format
{
  const line = '// lossless: [ceiling: 500 req/s] -> upgrade: [redis stream queue]';
  const match = line.match(DEBT_REGEX);
  assert.ok(match, 'JS debt tag must match');
  assert.strictEqual(match[1].trim(), '500 req/s');
  assert.strictEqual(match[2].trim(), 'redis stream queue');
  console.log('  ✓ JS/TS comment syntax verified');
}

// Test 2: Regex matches Python / Bash format
{
  const line = '# lossless: [ceiling: O(N) scan < 1000] -> upgrade: [binary search index]';
  const match = line.match(DEBT_REGEX);
  assert.ok(match, 'Python debt tag must match');
  assert.strictEqual(match[1].trim(), 'O(N) scan < 1000');
  assert.strictEqual(match[2].trim(), 'binary search index');
  console.log('  ✓ Python/Bash comment syntax verified');
}

// Test 3: Regex matches SQL format
{
  const line = '-- lossless: [ceiling: < 50k rows] -> upgrade: [partition by month]';
  const match = line.match(DEBT_REGEX);
  assert.ok(match, 'SQL debt tag must match');
  assert.strictEqual(match[1].trim(), '< 50k rows');
  assert.strictEqual(match[2].trim(), 'partition by month');
  console.log('  ✓ SQL comment syntax verified');
}

// Test 4: Regex ignores standard comments
{
  const line = '// TODO: fix later';
  const match = line.match(DEBT_REGEX);
  assert.strictEqual(match, null, 'Standard TODO comments must be ignored');
  console.log('  ✓ False-positive prevention verified');
}

// Test 5: End-to-end repository scan finds items
{
  const debts = walk(process.cwd());
  assert.ok(Array.isArray(debts), 'Walk must return an array');
  assert.ok(debts.length > 0, 'Walk must detect existing documented debt items');
  debts.forEach(d => {
    assert.ok(d.file, 'Debt must have file property');
    assert.ok(d.line > 0, 'Debt must have positive line number');
    assert.ok(d.ceiling, 'Debt must have ceiling property');
    assert.ok(d.upgrade, 'Debt must have upgrade property');
  });
  console.log(`  ✓ End-to-end repository walk verified (${debts.length} items parsed cleanly)`);
}

console.log('All Scanner Tests Passed Successfully.\n');
