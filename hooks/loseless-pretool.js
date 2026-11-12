#!/usr/bin/env node

/**
 * Loseless PreToolUse Physical Gatekeeper Hook
 * Intercepts tool calls and physically blocks modifications when in Phase 1 (Locked).
 */

const { loadConfig, loadSession } = require('./loseless-mode-tracker');

const BLOCKED_TOOLS = new Set([
  'write_file',
  'replace_file_content',
  'edit_file',
  'write_to_file',
  'apply_diff',
  'insert_content',
  'patch'
]);

function checkToolAuthorization(toolName, targetFile) {
  const config = loadConfig();
  const session = loadSession();

  if (config.ariseMode === 'off' || session.bypassed) {
    return { allowed: true };
  }

  // Fast-track micro diffs for non-code files (if configured)
  if (config.fastTrackMicroDiffs && targetFile) {
    const isDocOrStyle = /\.(md|txt|svg)$/i.test(targetFile);
    if (isDocOrStyle) {
      return { allowed: true, reason: 'fast_track_micro_diff' };
    }
  }

  const isWriteTool = BLOCKED_TOOLS.has(toolName);
  if (isWriteTool && session.phase === 1) {
    const keyword = config.gateKeyword || 'Arise';
    return {
      allowed: false,
      error: `[BLOCKED BY LOSELESS GATEKEEPER] Phase 1 is Active (Read-Only Planning). Explicit authorization token '${keyword}' required before modifying source files.`
    };
  }

  return { allowed: true };
}

function run() {
  const toolName = process.argv[2] || process.env.TOOL_NAME || '';
  const targetFile = process.argv[3] || process.env.TARGET_FILE || '';

  const check = checkToolAuthorization(toolName, targetFile);
  if (!check.allowed) {
    console.error(check.error);
    process.exit(1);
  }

  process.exit(0);
}

if (require.main === module) {
  run();
}

module.exports = { checkToolAuthorization, BLOCKED_TOOLS };
