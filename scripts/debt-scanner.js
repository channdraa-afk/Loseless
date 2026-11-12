#!/usr/bin/env node

/**
 * Loseless Technical Debt Scanner
 * Zero-dependency CLI scanner for harvesting intentional technical debt annotations.
 * Supports inline comments, block comments, and multiline JSDoc blocks.
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

// Original standard regex with support for both lossless/loseless and arrow variants:
const DEBT_REGEX = /(?:\/\/|#|--|\/\*)\s*(?:lossless|loseless):\s*\[ceiling:\s*([^\]]+)\]\s*(?:->|=>|-->|➔)\s*upgrade:\s*\[([^\]]+)\]/i;

// Resilient inline regex supporting missing brackets, whitespace, and alternate styles:
const INLINE_DEBT_REGEX = /(?:\/\/|#|--|\/\*)\s*@?(?:loseless|lossless):\s*\[?(?:ceiling:\s*)?([^\]\-\=\➔\n]+?)\]?\s*(?:->|=>|-->|➔)\s*\[?(?:upgrade:\s*)?([^\]\n\*\r]+?)\]?(?:\s*\*\/)?/i;

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
  let inJsDoc = false;
  let jsDocStartLine = 0;
  let jsDocCeiling = null;
  let jsDocUpgrade = null;

  for (let index = 0; index < lines.length; index++) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    // Check for JSDoc multiline blocks
    if (trimmed.startsWith('/**')) {
      inJsDoc = true;
      jsDocStartLine = index + 1;
      jsDocCeiling = null;
      jsDocUpgrade = null;
    }

    if (inJsDoc) {
      const ceilingMatch = trimmed.match(/(?:\*|\/\/)?\s*ceiling:\s*\[?([^\]\r\n]+)\]?/i);
      if (ceilingMatch && !jsDocCeiling) {
        jsDocCeiling = ceilingMatch[1].trim();
      }
      const upgradeMatch = trimmed.match(/(?:\*|\/\/)?\s*upgrade:\s*\[?([^\]\r\n]+)\]?/i);
      if (upgradeMatch && !jsDocUpgrade) {
        jsDocUpgrade = upgradeMatch[1].trim();
      }

      if (trimmed.endsWith('*/')) {
        inJsDoc = false;
        if (jsDocCeiling && jsDocUpgrade) {
          results.push({
            file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
            line: jsDocStartLine,
            ceiling: jsDocCeiling,
            upgrade: jsDocUpgrade
          });
        }
        jsDocCeiling = null;
        jsDocUpgrade = null;
      }
      continue;
    }

    // Standard format scan
    const legacyMatch = rawLine.match(DEBT_REGEX);
    if (legacyMatch) {
      results.push({
        file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        line: index + 1,
        ceiling: legacyMatch[1].trim(),
        upgrade: legacyMatch[2].trim()
      });
      continue;
    }

    // Flexible inline comment scan
    const inlineMatch = rawLine.match(INLINE_DEBT_REGEX);
    if (inlineMatch && (rawLine.includes('->') || rawLine.includes('=>') || rawLine.includes('-->') || rawLine.includes('➔'))) {
      results.push({
        file: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        line: index + 1,
        ceiling: inlineMatch[1].replace(/^ceiling:\s*/i, '').trim(),
        upgrade: inlineMatch[2].replace(/^upgrade:\s*/i, '').trim()
      });
    }
  }
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

module.exports = { walk, scanFile, DEBT_REGEX, INLINE_DEBT_REGEX };
