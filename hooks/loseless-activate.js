#!/usr/bin/env node

/**
 * Loseless SessionStart Activation Hook
 * Initializes session boundary, checks configuration, and enforces proactive onboarding.
 */

const fs = require('fs');
const path = require('path');
const { loadConfig, loadSession, saveSession } = require('./loseless-mode-tracker');

function activate() {
  const config = loadConfig();
  const session = loadSession();
  const configExists = fs.existsSync(path.join(process.cwd(), 'loseless.config.json'));

  let systemMessageText = '';

  if (config.ariseMode === 'off') {
    session.phase = 2;
    session.bypassed = true;
    saveSession(session);
    systemMessageText = '[Loseless] Arise Protocol is configured to OFF. Direct execution enabled.';
  } else {
    // Reset to locked Phase 1 on session start
    session.phase = 1;
    session.bypassed = false;
    session.bypassOffered = false;
    saveSession(session);

    const keyword = config.gateKeyword || 'Arise';
    const mode = config.ariseMode || 'strict';

    systemMessageText = `[Loseless] Active. Mode: ${mode} | Gate Token: '${keyword}' | Cognitive Discipline: Active`;

    // Proactive Zero-Turn Onboarding Directive
    if (!configExists) {
      systemMessageText += `\n[LOSELESS DIRECTIVE: PROACTIVE_ONBOARDING_REQUIRED]\nNo loseless.config.json detected in this repository.\nMANDATORY: On the very first response, you MUST proactively present the Arise Protocol Onboarding Dialog to confirm the user's preferred gate mode ('adaptive' / 'strict') and custom keyword token before processing tasks.`;
    }
  }

  if (process.stdout.isTTY) {
    console.log(systemMessageText);
  } else {
    // Antigravity SessionStart stdout contract
    const payload = {
      injectSteps: [
        {
          systemMessage: {
            systemMessage: systemMessageText
          }
        }
      ]
    };
    process.stdout.write(JSON.stringify(payload));
  }
}

if (require.main === module) {
  activate();
}

module.exports = { activate };
