#!/usr/bin/env node

/**
 * Loseless Mode Tracker & Sentiment Interceptor
 * Intercepts user prompt input at zero LLM token cost.
 * Manages Phase 1 (Locked) vs Phase 2 (Unlocked), auto-relock lifecycle, and detects friction/bypass cues.
 */

const fs = require("fs");
const path = require("path");

const SESSION_TTL_MS = 10 * 60 * 1000; // 10 minutes

const DEFAULT_CONFIG = {
  gateKeyword: "Arise",
  ariseMode: "adaptive",
  fastTrackMicroDiffs: true,
  autoInjectGatekeeperCard: true,
  strictMode: true,
  cognitiveMode: "auto",
};

function getSessionFilePath() {
  if (process.env.LOSELESS_SESSION_DIR) {
    const dir = process.env.LOSELESS_SESSION_DIR;
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {}
    }
    return path.join(dir, "session.json");
  }

  const pluginSession = path.join(
    path.resolve(__dirname, ".."),
    ".loseless",
    "session.json"
  );
  const cwdSession = path.join(process.cwd(), ".loseless", "session.json");

  // If both exist, return the one updated most recently
  if (fs.existsSync(cwdSession) && fs.existsSync(pluginSession) && cwdSession !== pluginSession) {
    try {
      const cwdMtime = fs.statSync(cwdSession).mtimeMs;
      const pluginMtime = fs.statSync(pluginSession).mtimeMs;
      return pluginMtime >= cwdMtime ? pluginSession : cwdSession;
    } catch (e) {}
  }

  if (fs.existsSync(cwdSession)) return cwdSession;
  if (fs.existsSync(pluginSession)) return pluginSession;

  const defaultDir = path.join(process.cwd(), ".loseless");
  if (!fs.existsSync(defaultDir)) {
    try {
      fs.mkdirSync(defaultDir, { recursive: true });
    } catch (e) {}
  }
  return path.join(defaultDir, "session.json");
}

function loadConfig() {
  const configPath = path.join(process.cwd(), "loseless.config.json");
  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return { ...DEFAULT_CONFIG, ...userConfig };
    } catch (e) {}
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Atomic file writer with Windows retry backoff to prevent EBUSY/EPERM lock collisions.
 */
function atomicWriteFileSync(targetPath, content) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  }
  const tempPath = path.join(
    dir,
    `.session.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`
  );

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      fs.writeFileSync(tempPath, content, "utf-8");
      // Atomic rename overwrite
      fs.renameSync(tempPath, targetPath);
      return true;
    } catch (err) {
      attempts++;
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (e) {}

      if (attempts >= maxAttempts) {
        try {
          fs.writeFileSync(targetPath, content, "utf-8");
          return true;
        } catch (e) {
          return false;
        }
      }
      const start = Date.now();
      while (Date.now() - start < attempts * 5) {}
    }
  }
  return false;
}

function loadSession() {
  const filePath = getSessionFilePath();
  if (fs.existsSync(filePath)) {
    let raw = "";
    let attempts = 0;
    while (attempts < 3) {
      try {
        raw = fs.readFileSync(filePath, "utf-8");
        break;
      } catch (e) {
        attempts++;
        const start = Date.now();
        while (Date.now() - start < attempts * 5) {}
      }
    }

    if (raw && raw.trim()) {
      try {
        const data = JSON.parse(raw);
        // Auto-relock if session has expired beyond TTL
        if (
          data.updatedAt &&
          Date.now() - data.updatedAt > SESSION_TTL_MS &&
          !data.bypassed
        ) {
          data.phase = 1;
          data.bypassOffered = false;
          saveSession(data);
        }
        return data;
      } catch (parseErr) {
        // Corrupted JSON detected: self-healing quarantine & reset
        try {
          const corruptPath = `${filePath}.corrupt.${Date.now()}`;
          fs.renameSync(filePath, corruptPath);
        } catch (e) {}
      }
    }
  }

  return {
    phase: 1, // 1: Locked (Read-Only Planning), 2: Unlocked (Execution Allowed)
    bypassed: false,
    bypassOffered: false,
    lastKeyword: null,
    updatedAt: Date.now(),
  };
}

function saveSession(session) {
  try {
    session.updatedAt = Date.now();
    const filePath = getSessionFilePath();
    const content = JSON.stringify(session, null, 2);
    atomicWriteFileSync(filePath, content);

    // Mirror to sibling/parent session location if it exists to maintain cross-workspace sync
    if (!process.env.LOSELESS_SESSION_DIR) {
      const pluginSession = path.join(path.resolve(__dirname, ".."), ".loseless", "session.json");
      const cwdSession = path.join(process.cwd(), ".loseless", "session.json");
      if (filePath === pluginSession && fs.existsSync(path.dirname(cwdSession))) {
        atomicWriteFileSync(cwdSession, content);
      } else if (filePath === cwdSession && fs.existsSync(path.dirname(pluginSession))) {
        atomicWriteFileSync(pluginSession, content);
      }
    }
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
  const patternsPath = path.join(__dirname, "sentiment-patterns.json");
  if (fs.existsSync(patternsPath)) {
    try {
      return JSON.parse(fs.readFileSync(patternsPath, "utf-8")).categories;
    } catch (e) {}
  }
  return {};
}

function analyzePrompt(promptText, configOverride = null) {
  if (!promptText || typeof promptText !== "string") return { action: "none" };

  const config = configOverride || loadConfig();
  const session = loadSession();
  const patterns = loadPatterns();
  const trimmed = promptText.trim();
  const lower = trimmed.toLowerCase();

  // 1. Exact match for gate keyword (Case-Sensitive exact match per Rule 2.1)
  const gateKeyword = config.gateKeyword || "Arise";
  const isExactKeyword = trimmed === gateKeyword;
  const isSealKeyword = new RegExp("(?:^|[\\s,;])" + gateKeyword + "$").test(
    trimmed,
  );
  if (isExactKeyword || isSealKeyword) {
    session.phase = 2;
    session.bypassed = false;
    session.lastKeyword = gateKeyword;
    saveSession(session);
    return {
      action: "unlocked",
      phase: 2,
      message: `[Loseless] Execution Gate Unlocked via token '${gateKeyword}'. Phase 2 active.`,
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
        action: "bypass",
        phase: 2,
        message: `[Loseless] Arise Protocol bypassed for this session.`,
      };
    }
  }

  // 3. Frustration / Friction detection (if ariseMode is adaptive)
  if (config.ariseMode === "adaptive" && !session.bypassed) {
    const frustrationList = [
      ...(patterns.frustration_id || []),
      ...(patterns.frustration_en || []),
      ...(patterns.impatience_caps || []),
    ];

    for (const pattern of frustrationList) {
      if (
        lower.includes(pattern.toLowerCase()) ||
        (promptText.includes(pattern) && pattern === pattern.toUpperCase())
      ) {
        session.bypassOffered = true;
        saveSession(session);
        return {
          action: "frustration_detected",
          pattern,
          message: `[Loseless Radar] Detected friction/urgency ('${pattern}'). Suggesting temporary bypass.`,
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
        action: "reconciled",
        phase: 1,
        message: `[Loseless] Task reconciled. Gatekeeper relocked (Phase 1).`,
      };
    }
  }

  // 5. Auto-Relock Turn Policy:
  // Any subsequent prompt arriving while in Phase 2 (that is neither the gate keyword nor an explicit bypass)
  // MUST unconditionally relock back to Phase 1 (Discovery & Planning Mode).
  if (session.phase === 2) {
    session.phase = 1;
    session.bypassed = false;
    session.bypassOffered = false;
    session.lastKeyword = null;
    saveSession(session);
    return {
      action: "auto_relocked",
      phase: 1,
      message: `[Loseless] New task detected. Gatekeeper relocked (Phase 1 Discovery Mode).`,
    };
  }

  return { action: "none", phase: session.phase };
}

function readInputFromEnvironment() {
  if (process.argv[2]) {
    return process.argv.slice(2).join(" ");
  }
  if (process.env.USER_PROMPT) {
    return process.env.USER_PROMPT;
  }
  if (!process.stdin.isTTY) {
    try {
      const piped = fs.readFileSync(0, "utf-8");
      if (piped) {
        try {
          const json = JSON.parse(piped.replace(/^\uFEFF/, ""));
          return (
            json.lastUserInput ||
            json.prompt ||
            json.text ||
            json.input ||
            json.message ||
            piped
          );
        } catch (e) {
          return piped.trim();
        }
      }
    } catch (e) {}
  }
  return "";
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
              systemMessage: result.message,
            },
          },
        ],
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
  readInputFromEnvironment,
};
