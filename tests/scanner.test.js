const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { DEBT_REGEX, INLINE_DEBT_REGEX, walk, scanFile } = require('../scripts/debt-scanner.js');

console.log('Running Loseless Scanner Test Suite (Multi-Syntax)...');

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

// Test 4: Flexible Arrow and Case-Insensitive Inline Syntax
{
  const testLines = [
    '// loseless: [ceiling: 100 conns] => upgrade: [connection pooler]',
    '// LOSELESS: [ceiling: 100 conns] --> upgrade: [connection pooler]',
    '/* loseless: [ceiling: 100 conns] ➔ upgrade: [connection pooler] */'
  ];

  testLines.forEach((tl, idx) => {
    const match = tl.match(INLINE_DEBT_REGEX) || tl.match(DEBT_REGEX);
    assert.ok(match, `Flexible line #${idx + 1} must match`);
    console.log(`  ✓ Flexible inline arrow variant #${idx + 1} verified`);
  });
}

// Test 5: Multiline JSDoc parsing via scanFile
{
  const tempTestPath = path.join(__dirname, 'temp-jsdoc-sample.js');
  const sampleContent = `
/**
 * Sample worker
 * @loseless
 * ceiling: 1000 items in memory
 * upgrade: stream chunking pipeline
 */
function worker() {}
`;
  fs.writeFileSync(tempTestPath, sampleContent, 'utf-8');
  const results = [];
  scanFile(tempTestPath, results);
  try {
    fs.unlinkSync(tempTestPath);
  } catch (e) {}

  assert.strictEqual(results.length, 1, 'JSDoc block must produce exactly 1 debt item');
  assert.strictEqual(results[0].ceiling, '1000 items in memory');
  assert.strictEqual(results[0].upgrade, 'stream chunking pipeline');
  console.log('  ✓ Multiline JSDoc block debt parsing verified');
}

// Test 6: False-positive prevention
{
  const line = '// TODO: fix later';
  const match = line.match(DEBT_REGEX) || line.match(INLINE_DEBT_REGEX);
  assert.strictEqual(match, null, 'Standard TODO comments must be ignored');
  console.log('  ✓ False-positive prevention verified');
}

// Test 7: End-to-end repository scan finds items
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
