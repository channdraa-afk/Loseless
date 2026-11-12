#!/usr/bin/env node

/**
 * Loseless Mode Tracker & Sentiment Interceptor
 * Intercepts user prompt input at zero LLM token cost.
 * Manages Phase 1 (Locked) vs Phase 2 (Unlocked), auto-relock lifecycle, and detects friction/bypass cues.
 */

const fs = require('fs');
const path = require('path');

const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes

const DEFAULT_CONFIG = {
  gateKeyword: 'Arise',
  ariseMode: 'adaptive',
  fastTrackMicroDiffs: true,
  autoInjectGatekeeperCard: true,
  strictMode: true,
  cognitiveMode: 'auto'
};

function getSessionFilePath() {
  const sessionDir = path.join(process.cwd(), '.loseless');
  if (!fs.existsSync(sessionDir)) {
    try {
      fs.mkdirSync(sessionDir, { recursive: true });
    } catch (e) {}
  }
  return path.join(sessionDir, 'session.json');
}

function loadConfig() {
  const configPath = path.join(process.cwd(), 'loseless.config.json');
  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return { ...DEFAULT_CONFIG, ...userConfig };
    } catch (e) {}
  }
  return { ...DEFAULT_CONFIG };
}

function loadSession() {
  const filePath = getSessionFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // Auto-relock if session has expired beyond TTL
      if (data.updatedAt && (Date.now() - data.updatedAt > SESSION_TTL_MS) && !data.bypassed) {
        data.phase = 1;
        data.bypassOffered = false;
        saveSession(data);
      }
      return data;
    } catch (e) {}
  }
  return {
    phase: 1, // 1: Locked (Read-Only Planning), 2: Unlocked (Execution Allowed)
    bypassed: false,
    bypassOffered: false,
    lastKeyword: null,
    updatedAt: Date.now()
  };
}

function saveSession(session) {
  try {
    const filePath = getSessionFilePath();
    session.updatedAt = Date.now();
    fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
  } catch (e) {}
}

function relockSession() {
  const session = loadSession();
  session.phase = 1;
  session.bypassed = false;
  session.bypassOffered = false;
  saveSession(session);
  return session;
}

function loadPatterns() {
  const patternsPath = path.join(__dirname, 'sentiment-patterns.json');
  if (fs.existsSync(patternsPath)) {
    try {
      return JSON.parse(fs.readFileSync(patternsPath, 'utf-8')).categories;
    } catch (e) {}
  }
  return {};
}

function analyzePrompt(promptText, configOverride = null) {
  if (!promptText || typeof promptText !== 'string') return { action: 'none' };

  const config = configOverride || loadConfig();
  const session = loadSession();
  const patterns = loadPatterns();
  const trimmed = promptText.trim();
  const lower = trimmed.toLowerCase();

  // 1. Exact match for gate keyword (Case-Sensitive exact match per Rule 2.1)
  const gateKeyword = config.gateKeyword || 'Arise';
  if (trimmed === gateKeyword) {
    session.phase = 2;
    session.lastKeyword = gateKeyword;
    saveSession(session);
    return {
      action: 'unlocked',
      phase: 2,
      message: `[Loseless] Execution Gate Unlocked via token '${gateKeyword}'. Phase 2 active.`
    };
  }

  // 2. Check explicit bypass
  const explicitBypassList = patterns.explicit_bypass || [];
  for (const bypassWord of explicitBypassList) {
    if (lower.includes(bypassWord)) {
      session.bypassed = true;
      session.phase = 2;
      saveSession(session);
      return {
        action: 'bypass',
        phase: 2,
        message: `[Loseless] Arise Protocol bypassed for this session.`
      };
    }
  }

  // 3. Frustration / Friction detection (if ariseMode is adaptive)
  if (config.ariseMode === 'adaptive' && !session.bypassed) {
    const frustrationList = [
      ...(patterns.frustration_id || []),
      ...(patterns.frustration_en || []),
      ...(patterns.impatience_caps || [])
    ];

    for (const pattern of frustrationList) {
      if (lower.includes(pattern.toLowerCase()) || (promptText.includes(pattern) && pattern === pattern.toUpperCase())) {
        session.bypassOffered = true;
        saveSession(session);
        return {
          action: 'frustration_detected',
          pattern,
          message: `[Loseless Radar] Detected friction/urgency ('${pattern}'). Suggesting temporary bypass.`
        };
      }
    }
  }

  // 4. Reconciliation detection
  const reconcileList = patterns.satisfaction_reconcile || [];
  for (const recWord of reconcileList) {
    if (lower.includes(recWord)) {
      session.phase = 1;
      session.bypassed = false;
      session.bypassOffered = false;
      saveSession(session);
      return {
        action: 'reconciled',
        phase: 1,
        message: `[Loseless] Task reconciled. Gatekeeper relocked (Phase 1).`
      };
    }
  }

  // 5. Auto-Relock Turn Policy:
  // If the previous turn unlocked phase 2, but a new prompt arrives that is neither Arise nor bypass,
  // we automatically relock to Phase 1 for the new task.
  if (session.phase === 2 && !session.bypassed && session.lastKeyword === gateKeyword) {
    session.phase = 1;
    session.lastKeyword = null;
    saveSession(session);
    return {
      action: 'auto_relocked',
      phase: 1,
      message: `[Loseless] New task detected. Gatekeeper relocked (Phase 1 Discovery Mode).`
    };
  }

  return { action: 'none', phase: session.phase };
}

function readInputFromEnvironment() {
  if (process.argv[2]) {
    return process.argv.slice(2).join(' ');
  }
  if (process.env.USER_PROMPT) {
    return process.env.USER_PROMPT;
  }
  if (!process.stdin.isTTY) {
    try {
      const piped = fs.readFileSync(0, 'utf-8');
      if (piped) {
        try {
          const json = JSON.parse(piped.replace(/^\uFEFF/, ''));
          return json.lastUserInput || json.prompt || json.text || json.input || json.message || piped;
        } catch (e) {
          return piped.trim();
        }
      }
    } catch (e) {}
  }
  return '';
}

function run() {
  const promptInput = readInputFromEnvironment();
  const result = analyzePrompt(promptInput);
  if (result.message) {
    if (process.stdout.isTTY) {
      console.log(result.message);
    } else {
      const payload = {
        injectSteps: [
          {
            systemMessage: {
              systemMessage: result.message
            }
          }
        ]
      };
      process.stdout.write(JSON.stringify(payload));
    }
  }
}

if (require.main === module) {
  run();
}

module.exports = {
  analyzePrompt,
  loadConfig,
  loadSession,
  saveSession,
  relockSession,
  getSessionFilePath,
  readInputFromEnvironment
};
