#!/usr/bin/env node

/**
 * Loseless SessionStart Activation Hook
 * Initializes session boundary, checks configuration, and registers physical gatekeeper.
 */

const fs = require('fs');
const path = require('path');
const { loadConfig, loadSession, saveSession } = require('./loseless-mode-tracker');

function activate() {
  const config = loadConfig();
  const session = loadSession();

  if (config.ariseMode === 'off') {
    session.phase = 2;
    session.bypassed = true;
    saveSession(session);
    console.log('[Loseless] Arise Protocol is configured to OFF. Direct execution enabled.');
    return;
  }

  // Reset to locked Phase 1 on session start
  session.phase = 1;
  session.bypassed = false;
  session.bypassOffered = false;
  saveSession(session);

  const keyword = config.gateKeyword || 'Arise';
  const mode = config.ariseMode || 'adaptive';

  console.log(`[Loseless] Active. Mode: ${mode} | Gate Token: '${keyword}' | Cognitive Discipline: Active`);
}

if (require.main === module) {
  activate();
}

module.exports = { activate };
