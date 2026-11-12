#!/usr/bin/env node

/**
 * Loseless Mode Tracker & Sentiment Interceptor
 * Intercepts user prompt input at zero LLM token cost.
 * Manages Phase 1 (Locked) vs Phase 2 (Unlocked) and detects friction/bypass cues.
 */

const fs = require('fs');
const path = require('path');

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
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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

function loadPatterns() {
  const patternsPath = path.join(__dirname, 'sentiment-patterns.json');
  if (fs.existsSync(patternsPath)) {
    try {
      return JSON.parse(fs.readFileSync(patternsPath, 'utf-8')).categories;
    } catch (e) {}
  }
  return {};
}

function analyzePrompt(promptText) {
  if (!promptText || typeof promptText !== 'string') return { action: 'none' };

  const config = loadConfig();
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
  if (session.bypassed || session.phase === 2) {
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
  }

  return { action: 'none', phase: session.phase };
}

function run() {
  const promptInput = process.argv[2] || process.env.USER_PROMPT || '';
  const result = analyzePrompt(promptInput);
  if (result.message) {
    console.log(result.message);
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
  getSessionFilePath
};
