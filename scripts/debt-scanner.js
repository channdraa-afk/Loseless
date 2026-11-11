#!/usr/bin/env node

/**
 * Loseless Technical Debt Scanner
 * Zero-dependency CLI scanner for harvesting intentional technical debt annotations.
 * Syntax: // lossless: [ceiling: <LIMIT>] -> upgrade: [<ACTION>]
 */

const fs = require('fs');
const path = require('path');

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

const DEBT_REGEX = /(?:\/\/|#|--|\/\*)\s*lossless:\s*\[ceiling:\s*([^\]]+)\]\s*->\s*upgrade:\s*\[([^\]]+)\]/i;

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
        scanFile(fullPath, results);
      }
    }
  }
  return results;
}

function scanFile(filePath, results) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return;
  }

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const match = line.match(DEBT_REGEX);
    if (match) {
      results.push({
        file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        line: index + 1,
        ceiling: match[1].trim(),
        upgrade: match[2].trim()
      });
    }
  });
}

function run() {
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  console.log('\n=============================================================');
  console.log('            LOSELESS TECHNICAL DEBT SCANNER                  ');
  console.log('=============================================================');
  console.log(`Target: ${targetDir}\n`);

  const startTime = Date.now();
  const debts = walk(targetDir);
  const duration = Date.now() - startTime;

  if (debts.length === 0) {
    console.log('  [Clean] Zero technical debt detected across scanned files.');
    console.log(`  Scanned in ${duration}ms.\n`);
    return;
  }

  console.log(`Found ${debts.length} documented debt item(s):\n`);
  debts.forEach((debt, idx) => {
    console.log(`[#${idx + 1}] ${debt.file}:${debt.line}`);
    console.log(`  Ceiling : ${debt.ceiling}`);
    console.log(`  Upgrade : ${debt.upgrade}\n`);
  });

  console.log('-------------------------------------------------------------');
  console.log(`Summary: ${debts.length} total debt items identified in ${duration}ms.`);
  console.log('Status : All shortcuts are bounded and explicitly tracked.\n');
}

if (require.main === module) {
  run();
}

module.exports = { walk, scanFile, DEBT_REGEX };
