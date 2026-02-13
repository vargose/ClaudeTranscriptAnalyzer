# Failure Taxonomy (Consolidated 2026-02-13)

## Structure

Root Cause → Failure State (Observable) → Solution (Extension)

## Root Cause Categories (4)

1. **Context & Memory Deficits** — Missing persistent/situational context, window degradation, compression
2. **Capability & Knowledge Deficits** — Missing abilities, hallucinated capabilities
3. **Validation & Verification Gaps** — Weak feedback, insufficient guardrails, no risk assessment
4. **Behavioral & Reasoning Issues** — Overconfidence, systematic bias, infinite loops

## Key Root Causes

- Missing Foundational Context (CLAUDE.md not used)
- Missing Situational Context (no MCP for real-time data)
- Context Window Degradation (quality drops at ≥70%)
- Aggressive Context Compression (memory loss from compaction)
- Missing Abilities (no tool for task)
- Hallucinated Capabilities (1 in 5 code samples have fake libraries)
- Weak Feedback Loops (no validation)
- Overconfidence Without Calibration (equal confidence guessing vs certain)
- Infinite Loops & Repetition (retries same failed approach)

## Failure States by Severity

**Critical (5):** Library/API Hallucination, Tool Selection Errors, Tool Avoidance, Verification Theater, Fake User Input Hallucination

**High (7):** Instruction Amnesia, CLAUDE.md Ignoring, Context Degradation, Context Rot, Infinite Loop Failures, Premature Completion Claims, Security Vulnerabilities

**Medium (7):** Selective Hearing, Interpretive Compliance, Systematic Simplification Bias, Progressive Degradation, Incomplete Error Handling, Performance Blindness, Lack of Risk Assessment

**Low (6):** Semantic Inversion, Unauthorized Actions, Plan-as-Shield, Self-Awareness Without Correction, Frustration Escalation, Overconfidence

## Solution Categories

**Context & Memory:** CLAUDE.md, CLAUDE.md size reduction, Modular Rules, Session Handoffs, Context MCPs, MCP Session Management, MCP Streaming, ToolSearch setup, Auto Memory

**Validation & Enforcement:** Post-Save Hooks, Git Hooks, Lightweight Checks (AST/grep/regex), Permissions, Hooks (Pre/PostToolUse)

**Capabilities:** Ability MCPs, LSP Servers, Skills, Plugins

**Architecture:** Subagents, Model Selection, disabledMcpServers

## Files

- `/docs/failure-taxonomy.md` — Full taxonomy with research sources
- `/docs/taxonomy-consolidation-summary.md` — What changed, research insights
- `/src/types/failure-taxonomy.ts` — TypeScript types and mappings
