#!/usr/bin/env node

/**
 * Loseless PreToolUse Physical Gatekeeper Hook
 * Intercepts tool calls and physically blocks modifications when in Phase 1 (Locked).
 * Supports JSON payload streaming via stdin, environment variables, or CLI arguments.
 */

const fs = require('fs');
const path = require('path');
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

const CRITICAL_CONFIG_FILES = new Set([
  'package.json',
  'package-lock.json',
  'loseless.config.json',
  'plugin.json',
  'gemini-extension.json',
  '.env',
  '.env.local'
]);

const SAFE_MICRO_EXTENSIONS = new Set([
  '.md',
  '.txt',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg'
]);

function checkToolAuthorization(toolName, targetFile) {
  const config = loadConfig();
  const session = loadSession();

  if (config.ariseMode === 'off' || session.bypassed) {
    return { allowed: true };
  }

  // Fast-track micro diffs for non-code files (if configured)
  if (config.fastTrackMicroDiffs && targetFile) {
    const baseName = path.basename(targetFile).toLowerCase();
    const ext = path.extname(targetFile).toLowerCase();

    // Critical config files are NEVER fast-tracked
    if (!CRITICAL_CONFIG_FILES.has(baseName) && SAFE_MICRO_EXTENSIONS.has(ext)) {
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

function readToolContext() {
  let toolName = process.argv[2] || process.env.TOOL_NAME || '';
  let targetFile = process.argv[3] || process.env.TARGET_FILE || '';

  if (!toolName && !process.stdin.isTTY) {
    try {
      const piped = fs.readFileSync(0, 'utf-8');
      if (piped) {
        try {
          const json = JSON.parse(piped.replace(/^\uFEFF/, ''));
          toolName = json.tool || json.tool_name || json.name || '';
          targetFile = json.tool_input?.path || json.tool_input?.file_path || json.parameters?.path || json.parameters?.target || json.path || '';
        } catch (e) {
          toolName = piped.trim();
        }
      }
    } catch (e) {}
  }

  return { toolName, targetFile };
}

function run() {
  const { toolName, targetFile } = readToolContext();

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

module.exports = {
  checkToolAuthorization,
  readToolContext,
  BLOCKED_TOOLS,
  CRITICAL_CONFIG_FILES,
  SAFE_MICRO_EXTENSIONS
};
