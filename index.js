/**
 * Loseless Core Entry Point
 * Exports configuration helpers and programmatic utility APIs.
 */

const { calculateBlastRadius, walk } = require('./scripts/blast-radius');
const { loadConfig, loadSession } = require('./hooks/loseless-mode-tracker');

/**
 * Type-safe configuration helper for loseless.config.js / loseless.config.ts
 * @param {import('./types').LoselessConfig} config
 * @returns {import('./types').LoselessConfig}
 */
function defineConfig(config) {
  return config;
}

module.exports = {
  defineConfig,
  calculateBlastRadius,
  walk,
  loadConfig,
  loadSession
};
