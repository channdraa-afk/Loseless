#!/usr/bin/env node

/**
 * Loseless PreToolUse Physical Gatekeeper Hook
 * Intercepts tool calls and physically blocks modifications when in Phase 1 (Locked).
 * Supports JSON payload streaming via stdin, environment variables, or CLI arguments.
 */

const fs = require('fs');
const path = require('path');
const { loadConfig, loadSession, readStdinPayload, resolveWorkspaceDir } = require('./loseless-mode-tracker');

const BLOCKED_TOOLS = new Set([
  'write_file',
  'replace_file_content',
  'multi_replace_file_content',
  'edit_file',
  'write_to_file',
  'apply_diff',
  'insert_content',
  'patch',
  'patch_file',
  'str_replace_editor',
  'delete_file',
  'remove_file',
  'create_file',
  'multi_edit',
  'MultiEdit',
  'NotebookEdit',
  'Edit',
  'Write'
]);

const SHELL_TOOLS = new Set([
  'run_command',
  'bash',
  'Bash',
  'execute_command',
  'run_terminal_cmd'
]);

const CRITICAL_CONFIG_FILES = new Set([
  'package.json',
  'package-lock.json',
  'loseless.config.json',
  'plugin.json',
  'gemini-extension.json',
  'hooks.json',
  'go.mod',
  '.env',
  '.env.local',
  'agents.md',
  'agents_lite.md',
  'claude.md',
  'gemini.md',
  'skill.md',
  '.cursorrules',
  '.windsurfrules',
  '.clinerules',
  'loseless.mdc'
]);

const SAFE_MICRO_EXTENSIONS = new Set([
  '.md',
  '.txt',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg'
]);

const MAX_MICRO_DIFF_LINES = 5;

function isMutatingShellCommand(commandLine) {
  if (!commandLine || typeof commandLine !== 'string') return false;
  // Strip benign null/fd redirections (e.g. 2>/dev/null, >/dev/null, 2>&1) before checking file writes
  const cleaned = commandLine
    .replace(/\b[0-9]*>\s*\/dev\/null\b/gi, '')
    .replace(/\b[0-9]*>\s*NUL\b/gi, '')
    .replace(/\b[0-9]*>&[0-9]+\b/g, '');

  // Web Arise Protocol: block state-mutating browser automation commands in Phase 1
  if (/\bagent-browser\s+(?:click|fill|type|press|select|check|uncheck|submit|upload|set|eval)\b/i.test(cleaned)) {
    return true;
  }

  // File/directory/system mutation verbs at command, newline, or subshell boundaries
  if (/(?:^|[;&|(\r\n`]\s*)(?:rm|rmdir|del|erase|rd|mv|move|cp|copy|mkdir|md|touch|chmod|chown|unlink|truncate|dd|tee|Set-Content|Add-Content|Out-File|New-Item|Remove-Item|Move-Item|Copy-Item)\b/i.test(cleaned)) {
    return true;
  }

  // In-place editing, package mutation, or git state mutation
  if (/\bsed\s+-i\b|\bnpm\s+(?:install|i|uninstall|rm|update|publish)\b|\bpip\s+install\b/i.test(cleaned)) {
    return true;
  }
  if (/\bgit\s+(?:commit|push|reset|rebase|merge|cherry-pick|clean|rm|mv|checkout\s+--|restore|apply|am|branch\s+-[dD]|tag\s+-d)\b/i.test(cleaned)) {
    return true;
  }

  // Inline interpreter filesystem writes (node -e / python -c)
  if (/\b(?:node|python|python3)\s+-[ec]\b.*(?:writeFile|appendFile|copyFile|mkdir|unlink|rename|rmdir|rmSync|truncate|\bopen\s*\([^)]*['"][wa+])/i.test(cleaned)) {
    return true;
  }

  // Shell output redirection to a file (ignoring operators like -> or =>)
  if (/(?:^|[\s;|&])(?:1?>>?|&\s*>)\s*[^\s;|&>]+/.test(cleaned)) {
    return true;
  }

  return false;
}

function checkToolAuthorization(toolName, targetFile, workspaceDir = null, options = {}) {
  const resolvedWorkspace = resolveWorkspaceDir(null, workspaceDir);
  const config = loadConfig(resolvedWorkspace);
  const session = loadSession(resolvedWorkspace);

  if (config.ariseMode === 'off' || session.bypassed) {
    return { allowed: true };
  }

  const isWriteTool = BLOCKED_TOOLS.has(toolName);
  const isShellTool = SHELL_TOOLS.has(toolName);

  // Check shell/browser mutations first
  if (isShellTool && session.phase === 1) {
    const cmdLine = options.commandLine || '';
    if (isMutatingShellCommand(cmdLine)) {
      const keyword = config.gateKeyword || 'Arise';
      return {
        allowed: false,
        error: `[BLOCKED BY LOSELESS GATEKEEPER] Mutating shell/browser operation blocked in Phase 1. Explicit authorization token '${keyword}' required.`
      };
    }
    return { allowed: true };
  }

  // Fast-track micro diffs for non-code docs/assets (strictly excluding critical configs/agent rules and oversized edits)
  if (config.fastTrackMicroDiffs && isWriteTool && targetFile) {
    const normalizedPath = path.resolve(resolvedWorkspace, targetFile);
    const baseName = path.basename(normalizedPath).toLowerCase();
    const ext = path.extname(normalizedPath).toLowerCase();
    const withinLineLimit = typeof options.diffLines !== 'number' || options.diffLines <= MAX_MICRO_DIFF_LINES;

    if (!CRITICAL_CONFIG_FILES.has(baseName) && SAFE_MICRO_EXTENSIONS.has(ext) && withinLineLimit) {
      return { allowed: true, reason: 'fast_track_micro_diff' };
    }
  }

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
  let workspaceDir = null;
  let commandLine = process.argv[4] || '';
  let diffLines = null;

  const { raw, json } = toolName ? { raw: '', json: null } : readStdinPayload();
  if (json) {
    // Antigravity standard toolCall structure vs generic
    toolName = json.toolCall?.name || json.tool || json.tool_name || json.name || '';
    const args = json.toolCall?.args || json.tool_input || json.parameters || {};
    targetFile = args.Path || args.path || args.TargetFile || args.AbsolutePath || args.filePath || args.file_path || args.target || json.path || '';
    commandLine = args.CommandLine || args.command || args.cmd || '';
    const contentPayload = args.Replacement || args.ReplacementContent || args.Content || args.CodeContent || args.content || args.new_str || '';
    if (typeof contentPayload === 'string' && contentPayload.length > 0) {
      diffLines = contentPayload.split(/\r?\n/).length;
    }
    workspaceDir = resolveWorkspaceDir(json, null);
  } else if (!toolName && raw) {
    toolName = raw.trim();
  }

  return { toolName, targetFile, workspaceDir, options: { commandLine, diffLines } };
}

function run() {
  const { toolName, targetFile, workspaceDir, options } = readToolContext();

  const check = checkToolAuthorization(toolName, targetFile, workspaceDir, options);
  if (!check.allowed) {
    if (!process.stdout.isTTY) {
      process.stdout.write(JSON.stringify({
        decision: 'deny',
        reason: check.error
      }));
    }
    console.error(check.error);
    process.exit(1);
  }

  if (!process.stdout.isTTY) {
    process.stdout.write(JSON.stringify({
      decision: 'allow'
    }));
  }
  process.exit(0);
}

if (require.main === module) {
  run();
}

module.exports = {
  checkToolAuthorization,
  readToolContext,
  isMutatingShellCommand,
  BLOCKED_TOOLS,
  SHELL_TOOLS,
  CRITICAL_CONFIG_FILES,
  SAFE_MICRO_EXTENSIONS,
  MAX_MICRO_DIFF_LINES
};
