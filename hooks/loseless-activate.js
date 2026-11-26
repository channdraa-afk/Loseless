#!/usr/bin/env node

/**
 * Loseless SessionStart Activation Hook
 * Initializes session boundary, checks configuration, and enforces proactive onboarding.
 */

const {
  loadConfig,
  loadSession,
  saveSession,
  readStdinPayload,
  resolveWorkspaceDir,
  hasWorkspaceConfig,
  buildOnboardingDirective
} = require('./loseless-mode-tracker');

function activate(options = {}) {
  const workspaceDir = resolveWorkspaceDir(options.stdinJson || null, options.workspaceDir || null);
  const config = loadConfig(workspaceDir);
  const session = loadSession(workspaceDir);
  const configExists = hasWorkspaceConfig(workspaceDir);

  let systemMessageText = '';

  if (config.ariseMode === 'off') {
    session.phase = 2;
    session.bypassed = true;
    session.onboardingPrompted = true;
    saveSession(session, workspaceDir);
    systemMessageText = '[Loseless] Arise Protocol is configured to OFF. Direct execution enabled.';
  } else {
    // Reset to locked Phase 1 on session start
    session.phase = 1;
    session.bypassed = false;
    session.bypassOffered = false;

    const keyword = config.gateKeyword || 'Arise';
    const mode = config.ariseMode || 'strict';

    systemMessageText = `[Loseless] Active. Mode: ${mode} | Gate Token: '${keyword}' | Cognitive Discipline: Active`;

    // Proactive Zero-Turn Onboarding Directive
    if (!configExists) {
      session.onboardingPrompted = true;
      systemMessageText += buildOnboardingDirective(config, workspaceDir);
    } else {
      session.onboardingPrompted = true;
    }

    saveSession(session, workspaceDir);
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
  const { json } = readStdinPayload();
  activate({ stdinJson: json });
}

module.exports = { activate };
