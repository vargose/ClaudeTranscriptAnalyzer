# Failure Taxonomy

**Consolidated framework based on real-world Claude Code failures (2025-2026) and research.**

This document defines the causal chain from **root causes** → **failure states** → **solutions** for Claude Code transcript analysis.

## Framework

```
Root Cause → Failure State (Observable) → Solution (Extension)
```

## Research Sources

Analysis incorporates patterns from:
- [Claude Code Systematic Failure Patterns (Issue #19739)](https://github.com/anthropics/claude-code/issues/19739)
- [Massive Quality Regression (Issue #21431)](https://github.com/anthropics/claude-code/issues/21431)
- [Hallucinations and Instruction Following Failures (Issue #5810)](https://github.com/anthropics/claude-code/issues/5810)
- [Context Amnesia Protocol](https://medium.com/@ilyas.ibrahim/the-4-step-protocol-that-fixes-claude-codes-context-amnesia-c3937385561c)
- [Anthropic's Reduce Hallucinations Guide](https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
- [Debugging AI-Generated Code: 8 Failure Patterns](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)
- [MCP Best Practices Guide](https://modelcontextprotocol.info/docs/best-practices/)

## Root Cause Categories

### 1. Context & Memory Deficits

**Missing Foundational Context**
- **What**: No persistent project knowledge (conventions, architecture, constraints)
- **Why it matters**: Defaults to training data patterns instead of project-specific rules
- **Observable failures**: CLAUDE.md Ignoring, Systematic Simplification Bias, Interpretive Compliance, Library/API Hallucination
- **Solutions**: CLAUDE.md, CLAUDE.local.md, Modular Rules

**Missing Situational Context**
- **What**: Can't access real-time or external data (APIs, databases, issue trackers, docs)
- **Why it matters**: Makes decisions without current state information
- **Observable failures**: Tool Avoidance, Premature Completion Claims, Library/API Hallucination
- **Solutions**: Context MCPs, LSP Servers, MCP Session Management

**Context Window Degradation**
- **What**: LLMs optimized for prediction, not state management; information falls out of window
- **Why it matters**: Quality degrades as conversation lengthens (≥70% capacity) even without hitting limits
- **Observable failures**: Context Rot, Context Degradation, Instruction Amnesia, Context Pollution
- **Solutions**: Subagents, Session Handoffs, Context MCPs, disabledMcpServers, MCP Streaming

**Aggressive Context Compression**
- **What**: Too frequent compaction cycles lose important information (memory loss)
- **Why it matters**: Critical instructions and context get compressed out before they're no longer needed
- **Observable failures**: Context Degradation, Instruction Amnesia, CLAUDE.md Ignoring, Context Rot
- **Solutions**: CLAUDE.md size reduction (compress instructions into shorter form), ToolSearch tool setup (reduce context pollution from tool discovery), Context MCPs (structured data vs raw dumps)

### 2. Capability & Knowledge Deficits

**Missing Abilities**
- **What**: Can't perform needed actions OR lacks specialized domain knowledge
- **Why it matters**: Generic tools and training data insufficient for specialized tasks
- **Observable failures**: Tool Avoidance, Tool Selection Errors, Systematic Simplification Bias, Unauthorized Actions
- **Solutions**: Ability MCPs, Skills, Plugins, LSP Servers

**Hallucinated Capabilities (Critical)**
- **What**: Confidently references non-existent libraries, APIs, tools, or data (affects 1 in 5 code samples)
- **Why it matters**: LLMs estimate completions, don't verify existence; creates unrunnable code
- **Observable failures**: Library/API Hallucination, Verification Theater, Fake User Input Hallucination, Premature Completion Claims, Self-Awareness Without Correction
- **Solutions**: Post-Save Hooks (validation), LSP Servers (real-time diagnostics), Lightweight Checks (AST/grep/regex), Skills (explicit declarations)

### 3. Validation & Verification Gaps

**Weak Feedback Loops**
- **What**: No validation of outputs against requirements; errors propagate undetected
- **Why it matters**: LLMs optimize for correctness perception, not actual correctness; miss edge cases
- **Observable failures**: Premature Completion Claims, Verification Theater, Incomplete Error Handling, Security Vulnerabilities, Performance Blindness
- **Solutions**: Post-Save Hooks, Git Hooks (test/build/coverage), LSP Servers, Lightweight Checks (AST/grep/regex)

**Insufficient Guardrails**
- **What**: No enforcement mechanisms for critical requirements or permissions
- **Why it matters**: Can drift from requirements, take unauthorized actions
- **Observable failures**: Unauthorized Actions, Selective Hearing, Progressive Degradation, Security Vulnerabilities
- **Solutions**: Permissions, Hooks (PreToolUse with block), Git Hooks

**Lack of Risk Assessment**
- **What**: Jumps to implementation without planning; discovers problems mid-way; patches reactively
- **Why it matters**: Creates cascading failures and technical debt
- **Observable failures**: Progressive Degradation, Unauthorized Actions, Incomplete Error Handling
- **Solutions**: CLAUDE.md (require planning), Hooks (enforce design phase), Skills (structured workflows)

### 4. Behavioral & Reasoning Issues

**Overconfidence Without Calibration**
- **What**: Asserts with equal confidence whether certain or guessing; no uncertainty signals
- **Why it matters**: User can't distinguish reliable from unreliable outputs
- **Observable failures**: Library/API Hallucination, Premature Completion Claims, Verification Theater, Security Vulnerabilities
- **Solutions**: CLAUDE.md (require uncertainty markers), Hooks (validate claims), LSP Servers (ground truth)

**Systematic Bias**
- **What**: Consistent preference for easier/simpler solutions; not random errors but directional bias
- **Why it matters**: Training data contains common patterns, misses edge cases; compounds over time
- **Observable failures**: Systematic Simplification Bias, Interpretive Compliance, Incomplete Error Handling, Performance Blindness
- **Solutions**: CLAUDE.md (explicit requirements), Hooks (enforce standards), Post-Save Hooks (validation)

**Infinite Loops & Repetition**
- **What**: Retries the same failed approach without trying alternatives; gets stuck in correction cycles
- **Why it matters**: User frustration escalates, productivity halts
- **Observable failures**: Instruction Amnesia, Infinite Loop Failures, Frustration Escalation, Self-Awareness Without Correction
- **Solutions**: CLAUDE.md (break patterns), Hooks (block repetition), Subagents (fresh context), Skills (alternative strategies)

## Consolidated Failure States (Observable)

### Critical (Breaks Functionality)
- **Library/API Hallucination** — References non-existent libraries, functions, APIs (1 in 5 code samples)
- **Tool Selection Errors** — Wrong tool or incorrect parameters for the task
- **Tool Avoidance** — Has the right tool but doesn't use it
- **Verification Theater** — Simulates validation without actual execution
- **Fake User Input Hallucination** — Generates simulated user messages mid-response

### High Impact (Major Degradation)
- **Instruction Amnesia** — Repeats errors after correction; enters apology-repeat loops
- **CLAUDE.md Ignoring** — Defaults to training data patterns instead of project rules
- **Context Degradation** — Quality decay as window fills (≥70%)
- **Context Rot** — Quality degradation even within context limits
- **Infinite Loop Failures** — Retries same failed approach without alternatives
- **Premature Completion Claims** — Says "done" with contradicting evidence
- **Security Vulnerabilities** — Exposes sensitive info; unfiltered errors

### Medium Impact (Quality Issues)
- **Selective Hearing** — Parses part of multi-part instruction, ignores rest
- **Interpretive Compliance** — Interprets intent instead of implementing literally
- **Systematic Simplification Bias** — Consistently chooses easier implementations
- **Progressive Degradation** — Each fix introduces new deviations
- **Incomplete Error Handling** — Handles expected errors, misses edge cases
- **Performance Blindness** — Optimizes for correctness, ignores performance
- **Lack of Risk Assessment** — Jumps to implementation without planning

### Low Impact (Behavioral)
- **Semantic Inversion** — Does opposite of explicit instruction while claiming compliance
- **Unauthorized Actions** — Takes actions user didn't request
- **Plan-as-Shield** — Uses degraded understanding to justify errors
- **Self-Awareness Without Correction** — Identifies failure pattern, then reproduces it
- **Frustration Escalation** — Acknowledges verbally but doesn't change behavior
- **Overconfidence** — Equal confidence whether certain or guessing

## Causal Chain Examples

### Example 1: Tool Avoidance
```
Root Cause: Missing Abilities (Action)
    ↓
Can't access external API needed for task
    ↓
Failure State: Tool Avoidance
    ↓
Uses wrong tools as workarounds, produces incomplete results
    ↓
Solution: Ability MCP
    ↓
Adds API integration tool, task becomes achievable
```

### Example 2: CLAUDE.md Ignoring
```
Root Cause: Missing Foundational Context
    ↓
Project conventions not documented in persistent memory
    ↓
Failure State: CLAUDE.md Ignoring
    ↓
Defaults to training data patterns (generic React instead of Ink patterns)
    ↓
Solution: CLAUDE.md
    ↓
Documents Ink-specific patterns, loaded at every session start
```

### Example 3: Context Pollution → Degradation
```
Root Cause: Context Window Issues (Pollution)
    ↓
Tool results dump entire files instead of structured data
    ↓
Failure State: Context Degradation
    ↓
Important instructions pushed out of scope, coherence decays
    ↓
Solution: Context MCP + LSP Server
    ↓
Structured queries return focused data, precise navigation avoids broad searches
```

### Example 4: Hallucinated Abilities
```
Root Cause: Hallucinated Abilities
    ↓
Claude thinks it has a Trello skill that doesn't exist
    ↓
Failure State: Verification Theater
    ↓
Simulates Trello updates, produces fake confirmation output
    ↓
Solution: Ability MCP (Trello) + Hook (validate tool use)
    ↓
Actual Trello integration + Hook confirms real API calls happened
```

## Detection Strategy

When analyzing transcripts, Pass 1 should identify:

1. **Failure State** (what went wrong — observable)
2. **Evidence** (where in the transcript)
3. **Inferred Root Cause** (why it likely happened)

Example output:
```json
{
  "failure_state": "Tool Avoidance",
  "category": "Scope & Authorization",
  "root_cause": "Missing Abilities (Action)",
  "root_cause_confidence": 0.85,
  "evidence": "Lines 102-145: User asked to update Trello card, Claude used comments in code instead. Mentioned 'I can help track this in code comments' — suggests no Trello access.",
  "severity": "medium",
  "confidence": 0.91
}
```

Pass 2 uses `root_cause` to select the right solution category, then maps to specific extensions.

## Root Cause → Solution Quick Reference

| Root Cause | Primary Solutions | Secondary Solutions |
|------------|------------------|---------------------|
| **Context & Memory Deficits** |
| Missing Foundational Context | CLAUDE.md, Modular Rules | CLAUDE.local.md |
| Missing Situational Context | Context MCPs, LSP Servers | MCP Session Management |
| Context Window Degradation | Subagents, Session Handoffs | Context MCPs, disabledMcpServers |
| Aggressive Context Compression | CLAUDE.md size reduction, ToolSearch setup | Context MCPs, disabledMcpServers |
| **Capability & Knowledge Deficits** |
| Missing Abilities | Ability MCPs, Skills | Plugins, LSP Servers |
| Hallucinated Capabilities | Post-Save Hooks, LSP Servers | Lightweight Checks, Skills |
| **Validation & Verification Gaps** |
| Weak Feedback Loops | Post-Save Hooks, Git Hooks | LSP Servers, Lightweight Checks |
| Insufficient Guardrails | Permissions, Hooks (PreToolUse) | Git Hooks |
| Lack of Risk Assessment | CLAUDE.md (planning), Hooks | Skills (workflows) |
| **Behavioral & Reasoning Issues** |
| Overconfidence | CLAUDE.md (uncertainty), Hooks | LSP Servers (ground truth) |
| Systematic Bias | CLAUDE.md (requirements), Post-Save Hooks | Hooks |
| Infinite Loops & Repetition | CLAUDE.md (patterns), Hooks | Subagents, Skills |

## Next Steps

1. **Refine detection heuristics**: What transcript patterns indicate each root cause?
2. **Build confidence scoring**: How certain can we be about root cause inference?
3. **Create solution templates**: Pre-built configs for common scenarios
4. **Test with real transcripts**: Validate the taxonomy against actual failures