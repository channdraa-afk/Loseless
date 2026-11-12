/**
 * Loseless TypeScript Definitions
 * Type contracts and developer experience schemas for Loseless configurations and telemetry.
 */

export type AriseMode = 'strict' | 'adaptive' | 'off';

export type CognitiveMode = 'focus' | 'idea' | 'auto';

export interface LoselessConfig {
  /**
   * Execution gatekeeper mode:
   * - 'strict': Requires explicit keyword authorization for all write tools.
   * - 'adaptive': Automatically fast-tracks micro-diffs (< 3 lines non-code) and activates zero-token friction radar.
   * - 'off': Turbo mode. Bypasses the gatekeeper entirely for instant execution.
   * @default 'adaptive'
   */
  ariseMode?: AriseMode;

  /**
   * Sacred keyword required to unlock Phase 2 verified execution.
   * @default 'Arise'
   */
  gateKeyword?: string;

  /**
   * Whether documentation, markdown, and style micro-diffs (< 3 lines) can bypass Phase 1.
   * @default true
   */
  fastTrackMicroDiffs?: boolean;

  /**
   * Strict anti-typo enforcement. When enabled, only exact token matches are accepted.
   * @default true
   */
  strictMode?: boolean;

  /**
   * Cognitive mindset posture:
   * - 'focus': Deterministic, zero-fluff, first-principles logic.
   * - 'idea': Divergent, multi-angle architectural brainstorming.
   * - 'auto': Context-aware dynamic intent sensing.
   * @default 'auto'
   */
  cognitiveMode?: CognitiveMode;

  /**
   * Automatically append Phase 1 gatekeeper cards to planning turn outputs.
   * @default true
   */
  autoInjectGatekeeperCard?: boolean;
}

export type BlastTier = 'Tier 0' | 'Tier 1' | 'Tier 2';

export type ReferenceKind = 'definition' | 'import' | 'call-site';

export interface ReferenceSite {
  file: string;
  line: number;
  module: string;
  language: string;
  kind: ReferenceKind;
  snippet: string;
}

export interface BlastRadiusResult {
  targetSymbol: string;
  totalRefs: number;
  distinctModules: number;
  moduleBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  kindBreakdown: Record<ReferenceKind, number>;
  tier: BlastTier;
  tierDescription: string;
  topReference: ReferenceSite | null;
  references: ReferenceSite[];
}

export interface DebtItem {
  file: string;
  line: number;
  ceiling: string;
  upgrade: string;
  format: 'inline' | 'block' | 'jsdoc';
}

export interface GateSessionState {
  phase: 1 | 2;
  bypassed: boolean;
  bypassOffered: boolean;
  lastKeyword: string | null;
  updatedAt: number;
}

/**
 * Type-safe configuration helper for loseless.config.ts / loseless.config.js
 * @param config User configuration object
 */
export function defineConfig(config: LoselessConfig): LoselessConfig;
