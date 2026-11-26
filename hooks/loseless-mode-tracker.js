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

function readStdinPayload() {
  if (process.stdin.isTTY) return { raw: "", json: null };
  try {
    const piped = fs.readFileSync(0, "utf-8");
    if (!piped) return { raw: "", json: null };
    try {
      const json = JSON.parse(piped.replace(/^\uFEFF/, ""));
      return { raw: piped, json };
    } catch (e) {
      return { raw: piped, json: null };
    }
  } catch (e) {
    return { raw: "", json: null };
  }
}

function resolveWorkspaceDir(jsonPayload = null, overrideDir = null) {
  let candidate =
    overrideDir ||
    process.env.LOSELESS_WORKSPACE_DIR ||
    jsonPayload?.cwd ||
    (Array.isArray(jsonPayload?.workspacePaths) && jsonPayload.workspacePaths[0]) ||
    process.cwd();

  if (typeof candidate === "string" && candidate.startsWith("file://")) {
    try {
      const { fileURLToPath } = require("url");
      candidate = fileURLToPath(candidate);
    } catch (e) {}
  }
  return path.resolve(String(candidate || process.cwd()));
}

function hasWorkspaceConfig(workspaceDir = null) {
  const dir = resolveWorkspaceDir(null, workspaceDir);
  return fs.existsSync(path.join(dir, "loseless.config.json"));
}

function buildOnboardingDirective(config, workspaceDir) {
  const keyword = config.gateKeyword || "Arise";
  return `\n[LOSELESS DIRECTIVE: PROACTIVE_ONBOARDING_REQUIRED]\nNo loseless.config.json detected in workspace (${workspaceDir}).\nMANDATORY FIRST ACTION: Before running file edits or tasks, ask the user to confirm: (1) Gate mode ('adaptive' / 'strict' / 'off'), and (2) Verification token (default: '${keyword}'). Once confirmed, request '${keyword}' to authorize writing loseless.config.json (locked in Phase 1).`;
}

function getSessionFilePath(workspaceDir = null) {
  if (process.env.LOSELESS_SESSION_DIR) {
    const dir = process.env.LOSELESS_SESSION_DIR;
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {}
    }
    return path.join(dir, "session.json");
  }

  const targetDir = resolveWorkspaceDir(null, workspaceDir);
  return path.join(targetDir, ".loseless", "session.json");
}

function loadConfig(workspaceDir = null) {
  const targetDir = resolveWorkspaceDir(null, workspaceDir);
  const configPath = path.join(targetDir, "loseless.config.json");
  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return { ...DEFAULT_CONFIG, ...userConfig };
    } catch (e) {}
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Non-busy synchronous sleep using Atomics.wait to prevent CPU spinlock during Windows lock contention.
 */
function sleepSync(ms) {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch (e) {
    const start = Date.now();
    while (Date.now() - start < ms) {}
  }
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWordPhrase(text, phrase, caseSensitive = false) {
  if (!phrase) return false;
  const escaped = escapeRegExp(phrase);
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, caseSensitive ? "" : "i");
  return regex.test(text);
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
        return false;
      }
      sleepSync(attempts * 5);
    }
  }
  return false;
}

function loadSession(workspaceDir = null) {
  const filePath = getSessionFilePath(workspaceDir);
  if (fs.existsSync(filePath)) {
    let raw = "";
    let attempts = 0;
    while (attempts < 3) {
      try {
        raw = fs.readFileSync(filePath, "utf-8");
        break;
      } catch (e) {
        attempts++;
        sleepSync(attempts * 5);
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
          saveSession(data, workspaceDir);
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
    onboardingPrompted: false,
    lastKeyword: null,
    updatedAt: Date.now(),
  };
}

function saveSession(session, workspaceDir = null) {
  try {
    session.updatedAt = Date.now();
    const filePath = getSessionFilePath(workspaceDir);
    const content = JSON.stringify(session, null, 2);
    atomicWriteFileSync(filePath, content);
  } catch (e) {}
}

function relockSession(workspaceDir = null) {
  const session = loadSession(workspaceDir);
  session.phase = 1;
  session.bypassed = false;
  session.bypassOffered = false;
  saveSession(session, workspaceDir);
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

function analyzePrompt(promptText, configOverride = null, workspaceDir = null) {
  if (!promptText || typeof promptText !== "string") return { action: "none" };

  const trimmed = promptText.trim();
  const session = loadSession(workspaceDir);

  // Ignore system notifications, background task messages, and IDE notices
  if (
    trimmed.startsWith("[Message]") ||
    trimmed.startsWith("[Notice]") ||
    trimmed.startsWith("<SYSTEM_MESSAGE>") ||
    trimmed.startsWith("The following is a <SYSTEM_MESSAGE>")
  ) {
    return { action: "none", phase: session.phase };
  }

  const config = configOverride || loadConfig(workspaceDir);
  const patterns = loadPatterns();
  const lower = trimmed.toLowerCase();

  // 1. Exact match for gate keyword (Case-Sensitive exact match per Rule 2.1)
  const gateKeyword = config.gateKeyword || "Arise";
  const isExactKeyword = trimmed === gateKeyword;
  const isSealKeyword = new RegExp("(?:^|[\\s,;])" + escapeRegExp(gateKeyword) + "$").test(
    trimmed,
  );
  if (isExactKeyword || isSealKeyword) {
    session.phase = 2;
    session.bypassed = false;
    session.onboardingPrompted = true;
    session.lastKeyword = gateKeyword;
    saveSession(session, workspaceDir);
    return {
      action: "unlocked",
      phase: 2,
      message: `[Loseless] Execution Gate Unlocked via token '${gateKeyword}'. Phase 2 active.`,
    };
  }

  // 2. Check explicit CLI / protocol bypass commands (word-boundary safe)
  const explicitBypassList = patterns.explicit_bypass || [];
  for (const bypassWord of explicitBypassList) {
    if (hasWordPhrase(lower, bypassWord)) {
      session.bypassed = true;
      session.phase = 2;
      saveSession(session, workspaceDir);
      return {
        action: "bypass",
        phase: 2,
        message: `[Loseless] Arise Protocol bypassed for this session.`,
      };
    }
  }

  // 3. Adaptive Mode Only: Conversational urgency bypass & Frustration Radar
  if (config.ariseMode === "adaptive") {
    const urgencyBypassList = patterns.adaptive_urgency_bypass || [];
    for (const urgencyWord of urgencyBypassList) {
      if (hasWordPhrase(lower, urgencyWord)) {
        session.bypassed = true;
        session.phase = 2;
        saveSession(session, workspaceDir);
        return {
          action: "bypass",
          phase: 2,
          message: `[Loseless] Adaptive Turbo Bypass granted for urgency cue.`,
        };
      }
    }

    if (!session.bypassed) {
      const textFrustration = [
        ...(patterns.frustration_id || []),
        ...(patterns.frustration_en || []),
      ];
      for (const pattern of textFrustration) {
        if (hasWordPhrase(lower, pattern)) {
          session.bypassOffered = true;
          saveSession(session, workspaceDir);
          return {
            action: "frustration_detected",
            pattern,
            message: `[Loseless Radar] Detected friction/urgency ('${pattern}'). Suggesting temporary bypass.`,
          };
        }
      }

      const capsFrustration = patterns.impatience_caps || [];
      for (const pattern of capsFrustration) {
        if (hasWordPhrase(promptText, pattern, true)) {
          session.bypassOffered = true;
          saveSession(session, workspaceDir);
          return {
            action: "frustration_detected",
            pattern,
            message: `[Loseless Radar] Detected friction/urgency ('${pattern}'). Suggesting temporary bypass.`,
          };
        }
      }
    }
  }

  // 4. Reconciliation detection (word-boundary safe: prevents 'gossip' -> 'sip' false relocks)
  const reconcileList = patterns.satisfaction_reconcile || [];
  for (const recWord of reconcileList) {
    if (hasWordPhrase(lower, recWord)) {
      session.phase = 1;
      session.bypassed = false;
      session.bypassOffered = false;
      saveSession(session, workspaceDir);
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
    saveSession(session, workspaceDir);
    return {
      action: "auto_relocked",
      phase: 1,
      message: `[Loseless] New task detected. Gatekeeper relocked (Phase 1 Discovery Mode).`,
    };
  }

  // 6. Fallback Zero-Turn Onboarding Guard when plugin is enabled mid-session without SessionStart
  if (
    !configOverride &&
    config.ariseMode !== "off" &&
    !hasWorkspaceConfig(workspaceDir) &&
    !session.onboardingPrompted
  ) {
    session.onboardingPrompted = true;
    saveSession(session, workspaceDir);
    const resolvedDir = resolveWorkspaceDir(null, workspaceDir);
    return {
      action: "onboarding_required",
      phase: session.phase,
      message: `[Loseless] Active in unconfigured workspace.${buildOnboardingDirective(config, resolvedDir)}`,
    };
  }

  return { action: "none", phase: session.phase };
}

function readInputContext() {
  if (process.argv[2]) {
    return {
      promptInput: process.argv.slice(2).join(" "),
      workspaceDir: resolveWorkspaceDir(null, null),
    };
  }
  if (process.env.USER_PROMPT) {
    return {
      promptInput: process.env.USER_PROMPT,
      workspaceDir: resolveWorkspaceDir(null, null),
    };
  }
  const { raw, json } = readStdinPayload();
  if (json) {
    const promptInput =
      json.lastUserInput ||
      json.prompt ||
      json.text ||
      json.input ||
      json.message ||
      raw;
    return {
      promptInput,
      workspaceDir: resolveWorkspaceDir(json, null),
    };
  }
  return {
    promptInput: raw ? raw.trim() : "",
    workspaceDir: resolveWorkspaceDir(null, null),
  };
}

function readInputFromEnvironment() {
  return readInputContext().promptInput;
}

function run() {
  const { promptInput, workspaceDir } = readInputContext();
  const result = analyzePrompt(promptInput, null, workspaceDir);
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
  readStdinPayload,
  resolveWorkspaceDir,
  hasWorkspaceConfig,
  buildOnboardingDirective,
};
