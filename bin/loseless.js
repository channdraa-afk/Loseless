#!/usr/bin/env node

/**
 * Loseless Universal CLI
 * Command-line entrypoint for npx loseless and global binary execution.
 */

const path = require('path');
const { calculateBlastRadius } = require('../scripts/blast-radius');
const { loadConfig, loadSession, relockSession } = require('../hooks/loseless-mode-tracker');

const command = process.argv[2] ? process.argv[2].toLowerCase() : 'help';
const args = process.argv.slice(3);

switch (command) {
  case 'help':
  case '--help':
  case '-h':
    console.log(`
=============================================================
                 LOSELESS UNIVERSAL CLI v1.4.0
=============================================================
Usage: loseless <command> [arguments]

Commands:
  blast, impact <symbol>    Analyze blast-radius & cross-language call sites
  debt                      Scan repository for technical debt tags
  status                    Display current cognitive mode & gate status
  gate <lock|unlock|status> Manage Arise Protocol execution gate
  benchmark                 Run latency & token efficiency benchmarks
  help                      Show this reference card

Examples:
  npx loseless status
  npx loseless blast calculateBlastRadius
  npx loseless debt
=============================================================
`);
    break;

  case 'status': {
    const config = loadConfig();
    const session = loadSession();
    console.log(`
=== LOSELESS SYSTEM TELEMETRY ===
Version        : v1.4.0
Cognitive Mode : ${config.cognitiveMode || 'auto'}
Gate Phase     : Phase ${session.phase} [${session.phase === 2 ? 'UNLOCKED' : 'LOCKED'}]
Gate Policy    : ${config.ariseMode}
Gate Keyword   : '${config.gateKeyword || 'Arise'}'
Session Bypass : ${session.bypassed ? 'Active' : 'Inactive'}
`);
    break;
  }

  case 'gate': {
    const sub = args[0] ? args[0].toLowerCase() : 'status';
    const session = loadSession();
    if (sub === 'lock') {
      relockSession();
      console.log('[Loseless] Execution gate locked. Phase 1 (Read-Only) active.');
    } else if (sub === 'unlock') {
      session.phase = 2;
      session.bypassed = true;
      const fs = require('fs');
      const sessionPath = path.join(process.cwd(), '.loseless', 'session.json');
      fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
      console.log('[Loseless] Execution gate unlocked. Phase 2 (Execution) active.');
    } else {
      console.log(`[Loseless] Gate is currently in Phase ${session.phase} [${session.phase === 2 ? 'UNLOCKED' : 'LOCKED'}].`);
    }
    break;
  }

  case 'blast':
  case 'impact': {
    const targetSymbol = args[0];
    if (!targetSymbol) {
      console.error('Error: Please specify a symbol to scan. Example: loseless blast authenticateUser');
      process.exit(1);
    }
    require('../scripts/blast-radius');
    break;
  }

  case 'debt': {
    require('../scripts/debt-scanner');
    break;
  }

  case 'benchmark': {
    require('../scripts/benchmark');
    break;
  }

  default:
    console.error(`Unknown command: '${command}'. Run 'loseless help' for usage.`);
    process.exit(1);
}
