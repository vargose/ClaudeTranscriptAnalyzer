/**
 * Failure Taxonomy Types
 *
 * Defines the structured types for root causes, failure states, and solutions
 * used in transcript analysis.
 */

// ============================================================================
// Root Causes
// ============================================================================

export type RootCauseCategory =
  | 'Context & Memory Deficits'
  | 'Capability & Knowledge Deficits'
  | 'Validation & Verification Gaps'
  | 'Behavioral & Reasoning Issues';

export type RootCause =
  // Context & Memory Deficits
  | 'Missing Foundational Context'
  | 'Missing Situational Context'
  | 'Context Window Degradation'
  | 'Aggressive Context Compression'
  // Capability & Knowledge Deficits
  | 'Missing Abilities'
  | 'Hallucinated Capabilities'
  // Validation & Verification Gaps
  | 'Weak Feedback Loops'
  | 'Insufficient Guardrails'
  | 'Lack of Risk Assessment'
  // Behavioral & Reasoning Issues
  | 'Overconfidence Without Calibration'
  | 'Systematic Bias'
  | 'Infinite Loops & Repetition';

// ============================================================================
// Failure States (Observable Patterns)
// ============================================================================

export type FailureCategory = 'Critical' | 'High Impact' | 'Medium Impact' | 'Low Impact';

export type FailureState =
  // Critical (Breaks Functionality)
  | 'Library/API Hallucination'
  | 'Tool Selection Errors'
  | 'Tool Avoidance'
  | 'Verification Theater'
  | 'Fake User Input Hallucination'
  // High Impact (Major Degradation)
  | 'Instruction Amnesia'
  | 'CLAUDE.md Ignoring'
  | 'Context Degradation'
  | 'Context Rot'
  | 'Infinite Loop Failures'
  | 'Premature Completion Claims'
  | 'Security Vulnerabilities'
  // Medium Impact (Quality Issues)
  | 'Selective Hearing'
  | 'Interpretive Compliance'
  | 'Systematic Simplification Bias'
  | 'Progressive Degradation'
  | 'Incomplete Error Handling'
  | 'Performance Blindness'
  | 'Lack of Risk Assessment'
  // Low Impact (Behavioral)
  | 'Semantic Inversion'
  | 'Unauthorized Actions'
  | 'Plan-as-Shield'
  | 'Self-Awareness Without Correction'
  | 'Frustration Escalation'
  | 'Overconfidence';

// ============================================================================
// Solutions (Extensions)
// ============================================================================

export type SolutionCategory =
  | 'Context & Memory'
  | 'Automation & Enforcement'
  | 'Capabilities & Abilities'
  | 'Architecture & Isolation'
  | 'Communication';

export type Solution =
  // Context & Memory
  | 'CLAUDE.md'
  | 'CLAUDE.md size reduction'
  | 'CLAUDE.local.md'
  | 'Modular Rules'
  | 'Session Handoffs'
  | 'Context MCPs'
  | 'Auto Memory'
  | 'MCP Session Management'
  | 'MCP Streaming'
  | 'ToolSearch setup'
  // Automation & Enforcement
  | 'Permissions'
  | 'Hooks'
  | 'Post-Save Hooks'
  | 'Git Hooks'
  | 'Lightweight Checks'
  // Capabilities & Abilities
  | 'Ability MCPs'
  | 'LSP Servers'
  | 'Skills'
  | 'Plugins'
  // Architecture & Isolation
  | 'Subagents'
  | 'Model Selection'
  | 'disabledMcpServers'
  // Communication
  | 'Prompt Engineering';

// ============================================================================
// Detection & Analysis
// ============================================================================

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface FailureDetection {
  /** Observable failure pattern */
  failure_state: FailureState;

  /** Category of failure for grouping */
  category: FailureCategory;

  /** Inferred root cause */
  root_cause: RootCause;

  /** Category of root cause */
  root_cause_category: RootCauseCategory;

  /** Confidence in root cause inference (0-1) */
  root_cause_confidence: number;

  /** Evidence from transcript (line numbers, quotes) */
  evidence: string;

  /** Impact severity */
  severity: Severity;

  /** Confidence in failure state detection (0-1) */
  confidence: number;

  /** Optional: line range in transcript */
  line_range?: {
    start: number;
    end: number;
  };
}

export interface SolutionRecommendation {
  /** Primary solution to implement */
  solution: Solution;

  /** Category for grouping */
  category: SolutionCategory;

  /** Why this solution addresses the root cause */
  rationale: string;

  /** Confidence in recommendation (0-1) */
  confidence: number;

  /** Implementation priority (1 = highest) */
  priority: number;

  /** Alternative solutions */
  alternatives?: Solution[];

  /** Concrete implementation guide */
  implementation?: {
    /** Step-by-step instructions */
    steps: string[];

    /** Example configuration or code */
    example?: string;

    /** Links to documentation */
    docs?: string[];
  };

  /** Discovered tools/MCPs/skills that implement this solution */
  discovered_resources?: {
    name: string;
    type: 'mcp' | 'skill' | 'plugin';
    source: string;
    description: string;
  }[];
}

export interface AnalysisResult {
  /** Transcript metadata */
  transcript: {
    /** File path */
    path: string;

    /** Timestamp from file metadata */
    timestamp: string;

    /** Summary (from Pass 0) */
    summary?: string;
  };

  /** All detected failures */
  failures: FailureDetection[];

  /** All recommended solutions */
  recommendations: SolutionRecommendation[];

  /** Overall session health score (0-100) */
  health_score: number;

  /** Analysis metadata */
  analysis: {
    /** When analysis ran */
    timestamp: string;

    /** Model used (e.g., "claude-haiku-4.5") */
    model: string;

    /** Pass 1 duration (ms) */
    pass1_duration?: number;

    /** Pass 2 duration (ms) */
    pass2_duration?: number;
  };
}

// ============================================================================
// Mappings (for implementation logic)
// ============================================================================

/** Maps root causes to primary solutions */
export const ROOT_CAUSE_SOLUTIONS: Record<
  RootCause,
  { primary: Solution[]; secondary: Solution[] }
> = {
  // Context & Memory Deficits
  'Missing Foundational Context': {
    primary: ['CLAUDE.md', 'Modular Rules'],
    secondary: ['CLAUDE.local.md'],
  },
  'Missing Situational Context': {
    primary: ['Context MCPs', 'LSP Servers'],
    secondary: ['MCP Session Management'],
  },
  'Context Window Degradation': {
    primary: ['Subagents', 'Session Handoffs'],
    secondary: ['Context MCPs', 'disabledMcpServers'],
  },
  'Aggressive Context Compression': {
    primary: ['CLAUDE.md size reduction', 'ToolSearch setup'],
    secondary: ['Context MCPs', 'disabledMcpServers'],
  },
  // Capability & Knowledge Deficits
  'Missing Abilities': {
    primary: ['Ability MCPs', 'Skills'],
    secondary: ['Plugins', 'LSP Servers'],
  },
  'Hallucinated Capabilities': {
    primary: ['Post-Save Hooks', 'LSP Servers'],
    secondary: ['Lightweight Checks', 'Skills'],
  },
  // Validation & Verification Gaps
  'Weak Feedback Loops': {
    primary: ['Post-Save Hooks', 'Git Hooks'],
    secondary: ['LSP Servers', 'Lightweight Checks'],
  },
  'Insufficient Guardrails': {
    primary: ['Permissions', 'Hooks'],
    secondary: ['Git Hooks'],
  },
  'Lack of Risk Assessment': {
    primary: ['CLAUDE.md', 'Hooks'],
    secondary: ['Skills'],
  },
  // Behavioral & Reasoning Issues
  'Overconfidence Without Calibration': {
    primary: ['CLAUDE.md', 'Hooks'],
    secondary: ['LSP Servers'],
  },
  'Systematic Bias': {
    primary: ['CLAUDE.md', 'Post-Save Hooks'],
    secondary: ['Hooks'],
  },
  'Infinite Loops & Repetition': {
    primary: ['CLAUDE.md', 'Hooks'],
    secondary: ['Subagents', 'Skills'],
  },
};

/** Maps failure states to likely root causes (for detection logic) */
export const FAILURE_STATE_ROOT_CAUSES: Record<FailureState, RootCause[]> = {
  // Critical
  'Library/API Hallucination': [
    'Hallucinated Capabilities',
    'Missing Foundational Context',
    'Overconfidence Without Calibration',
  ],
  'Tool Selection Errors': [
    'Missing Abilities',
    'Missing Foundational Context',
    'Hallucinated Capabilities',
  ],
  'Tool Avoidance': [
    'Missing Abilities',
    'Hallucinated Capabilities',
    'Missing Situational Context',
  ],
  'Verification Theater': [
    'Weak Feedback Loops',
    'Hallucinated Capabilities',
    'Overconfidence Without Calibration',
  ],
  'Fake User Input Hallucination': [
    'Hallucinated Capabilities',
    'Context Window Degradation',
    'Infinite Loops & Repetition',
  ],
  // High Impact
  'Instruction Amnesia': [
    'Infinite Loops & Repetition',
    'Context Window Degradation',
    'Aggressive Context Compression',
  ],
  'CLAUDE.md Ignoring': [
    'Missing Foundational Context',
    'Aggressive Context Compression',
    'Systematic Bias',
  ],
  'Context Degradation': ['Context Window Degradation', 'Aggressive Context Compression'],
  'Context Rot': ['Context Window Degradation', 'Aggressive Context Compression'],
  'Infinite Loop Failures': [
    'Infinite Loops & Repetition',
    'Weak Feedback Loops',
    'Missing Abilities',
  ],
  'Premature Completion Claims': [
    'Weak Feedback Loops',
    'Hallucinated Capabilities',
    'Overconfidence Without Calibration',
  ],
  'Security Vulnerabilities': [
    'Weak Feedback Loops',
    'Systematic Bias',
    'Missing Foundational Context',
  ],
  // Medium Impact
  'Selective Hearing': ['Context Window Degradation', 'Systematic Bias', 'Insufficient Guardrails'],
  'Interpretive Compliance': [
    'Missing Foundational Context',
    'Systematic Bias',
    'Weak Feedback Loops',
  ],
  'Systematic Simplification Bias': [
    'Systematic Bias',
    'Missing Foundational Context',
    'Missing Abilities',
  ],
  'Progressive Degradation': [
    'Context Window Degradation',
    'Weak Feedback Loops',
    'Lack of Risk Assessment',
  ],
  'Incomplete Error Handling': [
    'Systematic Bias',
    'Weak Feedback Loops',
    'Missing Foundational Context',
  ],
  'Performance Blindness': [
    'Systematic Bias',
    'Weak Feedback Loops',
    'Missing Foundational Context',
  ],
  'Lack of Risk Assessment': [
    'Lack of Risk Assessment',
    'Missing Foundational Context',
    'Systematic Bias',
  ],
  // Low Impact
  'Semantic Inversion': [
    'Systematic Bias',
    'Missing Foundational Context',
    'Context Window Degradation',
  ],
  'Unauthorized Actions': ['Insufficient Guardrails', 'Systematic Bias', 'Lack of Risk Assessment'],
  'Plan-as-Shield': [
    'Context Window Degradation',
    'Infinite Loops & Repetition',
    'Systematic Bias',
  ],
  'Self-Awareness Without Correction': [
    'Infinite Loops & Repetition',
    'Weak Feedback Loops',
    'Hallucinated Capabilities',
  ],
  'Frustration Escalation': [
    'Infinite Loops & Repetition',
    'Insufficient Guardrails',
    'Missing Foundational Context',
  ],
  Overconfidence: [
    'Overconfidence Without Calibration',
    'Weak Feedback Loops',
    'Hallucinated Capabilities',
  ],
};
