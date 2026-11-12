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
  assert.ok(pkg.scripts && pkg.scripts['blast-radius'], 'Package must declare blast-radius script');
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

// Test 4: loseless.config.json validation
{
  const configRaw = fs.readFileSync(path.join(process.cwd(), 'loseless.config.json'), 'utf-8');
  const config = JSON.parse(configRaw);
  assert.ok(config.gateKeyword, 'Config must declare gateKeyword');
  assert.strictEqual(config.gateKeyword, 'Arise', 'Default gateKeyword must be Arise');
  assert.ok(config.ariseMode, 'Config must declare ariseMode');
  assert.strictEqual(config.ariseMode, 'strict', 'Current calibrated ariseMode must be strict');
  console.log('  ✓ loseless.config.json schema and default keyword verified');
}

// Test 5: Verify required rule files, hook manifests, and skill definitions exist
{
  assert.ok(fs.existsSync(path.join(process.cwd(), 'rules', 'AGENTS.md')), 'rules/AGENTS.md must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'AGENTS.md')), 'Root AGENTS.md must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), '.cursorrules')), '.cursorrules must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'CLAUDE.md')), 'CLAUDE.md must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'hooks', 'claude-codex-hooks.json')), 'claude-codex-hooks.json must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'hooks', 'cursor-hooks.json')), 'cursor-hooks.json must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'hooks', 'sentiment-patterns.json')), 'sentiment-patterns.json must exist');

  // Verify skills
  assert.ok(fs.existsSync(path.join(process.cwd(), 'skills', 'loseless', 'SKILL.md')), 'skills/loseless must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'skills', 'loseless-arise', 'SKILL.md')), 'skills/loseless-arise must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'skills', 'loseless-debt', 'SKILL.md')), 'skills/loseless-debt must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'skills', 'loseless-critique', 'SKILL.md')), 'skills/loseless-critique must exist');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'skills', 'loseless-blast', 'SKILL.md')), 'skills/loseless-blast must exist');

  // Verify UI commands (*.toml)
  const requiredCommands = ['loseless.toml', 'loseless-debt.toml', 'loseless-blast.toml', 'loseless-critique.toml', 'loseless-arise.toml'];
  requiredCommands.forEach(cmd => {
    assert.ok(fs.existsSync(path.join(process.cwd(), 'commands', cmd)), `commands/${cmd} must exist`);
  });
  console.log('  ✓ Multi-platform rule adapter files, physical hook manifests, skill bundles, and UI slash commands verified');
}

console.log('All Manifest Integrity Tests Passed Successfully.\n');
