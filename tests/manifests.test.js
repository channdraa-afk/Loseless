const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Running Loseless Manifest Integrity Test Suite...');

// Test 1: package.json validation
{
  const pkgRaw = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8');
  const pkg = JSON.parse(pkgRaw);
  assert.strictEqual(pkg.name, 'loseless', 'Package name must be loseless');
  assert.ok(pkg.version, 'Package must declare version');
  assert.ok(pkg.scripts && pkg.scripts.test, 'Package must declare test script');
  assert.ok(pkg.scripts && pkg.scripts.debt, 'Package must declare debt script');
  console.log('  ✓ package.json syntax and scripts verified');
}

// Test 2: plugin.json validation
{
  const pluginRaw = fs.readFileSync(path.join(process.cwd(), 'plugin.json'), 'utf-8');
  const plugin = JSON.parse(pluginRaw);
  assert.strictEqual(plugin.name, 'loseless', 'Plugin name must be loseless');
  assert.ok(plugin.version, 'Plugin must declare version');
  assert.ok(plugin.description, 'Plugin must declare description');
  console.log('  ✓ plugin.json schema verified');
}

// Test 3: gemini-extension.json validation
{
  const extRaw = fs.readFileSync(path.join(process.cwd(), 'gemini-extension.json'), 'utf-8');
  const ext = JSON.parse(extRaw);
  assert.strictEqual(ext.name, 'loseless', 'Extension name must be loseless');
  assert.strictEqual(ext.contextFileName, 'rules/AGENTS.md', 'contextFileName must point to rules/AGENTS.md');
  console.log('  ✓ gemini-extension.json integration verified');
}

// Test 4: Verify required rule files exist
{
  assert.ok(fs.existsSync(path.join(process.cwd(), 'rules', 'AGENTS.md')), 'rules/AGENTS.md must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'AGENTS.md')), 'Root AGENTS.md must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), '.cursorrules')), '.cursorrules must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'CLAUDE.md')), 'CLAUDE.md must exist');
  console.log('  ✓ Multi-platform rule adapter files verified');
}

console.log('All Manifest Integrity Tests Passed Successfully.\n');
