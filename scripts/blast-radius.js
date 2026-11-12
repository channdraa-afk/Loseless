#!/usr/bin/env node

/**
 * Loseless Blast-Radius Offloader
 * CLI tool for high-density impact analysis across monorepos and large projects.
 * Prevents LLM context exhaustion by aggregating cross-file references into a compact 3-line report.
 */

const fs = require('fs');
const path = require('path');

// Resilient terminal styling (zero-crash fallback)
let pc;
try {
  pc = require('picocolors');
} catch (e) {
  pc = {
    cyan: (s) => s,
    green: (s) => s,
    yellow: (s) => s,
    red: (s) => s,
    bold: (s) => s,
    dim: (s) => s
  };
}

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.cache',
  'coverage',
  '.vscode',
  '.idea'
]);

const SUPPORTED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.py', '.go', '.rs', '.sql', '.sh', '.bash',
  '.html', '.css', '.scss', '.yaml', '.yml', '.md'
]);

function walk(dir, results = []) {
  let list;
  try {
    list = fs.readdirSync(dir);
  } catch (err) {
    return results;
  }

  for (const item of list) {
    if (IGNORED_DIRS.has(item)) continue;
    const fullPath = path.join(dir, item);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      continue;
    }

    if (stat.isDirectory()) {
      walk(fullPath, results);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function calculateBlastRadius(targetSymbol, baseDir = process.cwd()) {
  if (!targetSymbol || typeof targetSymbol !== 'string') {
    return null;
  }

  const files = walk(baseDir);
  const references = [];
  const moduleCounts = new Map();

  const regex = new RegExp(`\\b${targetSymbol.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'g');

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch (e) {
      continue;
    }

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (regex.test(line)) {
        const relPath = path.relative(baseDir, file).replace(/\\/g, '/');
        const parts = relPath.split('/');
        const topModule = parts.length > 1 ? parts[0] : 'root';

        references.push({
          file: relPath,
          line: index + 1,
          module: topModule,
          snippet: line.trim()
        });

        moduleCounts.set(topModule, (moduleCounts.get(topModule) || 0) + 1);
      }
    });
  }

  // Determine Blast Radius Tier
  let tier = 'Tier 0';
  let tierDescription = 'Localized / Aesthetic (Zero Invariant Risk)';
  const totalRefs = references.length;
  const distinctModules = moduleCounts.size;

  if (totalRefs > 15 || distinctModules > 2 || /auth|payment|token|secret|session|migrate|db/i.test(targetSymbol)) {
    tier = 'Tier 2';
    tierDescription = 'Systemic Impact (Cross-Module or Critical Invariant)';
  } else if (totalRefs > 2 || distinctModules > 1) {
    tier = 'Tier 1';
    tierDescription = 'Scoped Module Impact (Internal Refactoring)';
  }

  return {
    targetSymbol,
    totalRefs,
    distinctModules,
    moduleBreakdown: Object.fromEntries(moduleCounts),
    tier,
    tierDescription,
    topReference: references[0] || null,
    references
  };
}

function printReport(result) {
  if (!result) {
    console.error('Usage: loseless-blast-radius <symbol_name>');
    return;
  }

  console.log(`\n${pc.bold(pc.cyan('=== LOSELESS BLAST-RADIUS IMPACT TELEMETRY ==='))}`);
  console.log(`Target Symbol : ${pc.bold(result.targetSymbol)}`);
  
  const tierColor = result.tier === 'Tier 2' ? pc.red : (result.tier === 'Tier 1' ? pc.yellow : pc.green);
  console.log(`Blast Tier    : ${tierColor(pc.bold(`${result.tier} — ${result.tierDescription}`))}`);

  const breakdownStr = Object.entries(result.moduleBreakdown)
    .map(([mod, count]) => `${mod}: ${count}`)
    .join(', ');

  console.log(`Reference Map : ${result.totalRefs} call-site(s) across ${result.distinctModules} module(s) [${breakdownStr || 'none'}]`);

  if (result.topReference) {
    console.log(`Primary Root  : ${pc.dim(`${result.topReference.file}:${result.topReference.line}`)}`);
  }

  if (result.tier === 'Tier 2') {
    console.log(pc.yellow(`Action Gate   : Mandates Full SPOF, Rollback Strategy, and Strict Arise Execution Gate.`));
  } else if (result.tier === 'Tier 1') {
    console.log(pc.cyan(`Action Gate   : Localized Verification via Test Suite.`));
  } else {
    console.log(pc.green(`Action Gate   : Fast-Track Micro-Diff Permitted.`));
  }
  console.log('');
}

function run() {
  const symbol = process.argv[2];
  if (!symbol) {
    console.error('Error: Please provide a symbol or identifier to scan.');
    console.error('Example: node scripts/blast-radius.js calculateBlastRadius');
    process.exit(1);
  }

  const result = calculateBlastRadius(symbol);
  printReport(result);
}

if (require.main === module) {
  run();
}

module.exports = { calculateBlastRadius, walk };
