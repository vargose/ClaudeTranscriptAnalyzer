# Taxonomy Consolidation Summary

## What Changed

### Root Cause Categories (Consolidated from 5 → 4)

**Before:**
- Knowledge Gaps
- Capability Gaps
- Constraint Violations
- Context Window Issues
- Behavioral Drift

**After:**
- **Context & Memory Deficits** (merged Knowledge Gaps + Context Window Issues)
- **Capability & Knowledge Deficits** (consolidated Capability Gaps)
- **Validation & Verification Gaps** (consolidated Constraint Violations)
- **Behavioral & Reasoning Issues** (expanded Behavioral Drift)

### New Root Causes Added (From Research)

1. **Aggressive Context Compression** — Memory loss from too frequent compaction cycles
2. **Overconfidence Without Calibration** — Equal confidence whether certain or guessing
3. **Lack of Risk Assessment** — Jumps to implementation without planning

### New Failure States Added (From Research)

**Critical:**
- **Library/API Hallucination** — References non-existent libraries (1 in 5 code samples)
- **Tool Selection Errors** — Wrong tool or incorrect parameters
- **Fake User Input Hallucination** — Generates simulated user messages mid-response

**High Impact:**
- **Context Rot** — Quality degradation even within context limits
- **Infinite Loop Failures** — Retries same failed approach
- **Security Vulnerabilities** — Exposes sensitive info in error handling

**Medium Impact:**
- **Incomplete Error Handling** — Handles expected errors, misses edge cases
- **Performance Blindness** — Optimizes for correctness, ignores performance
- **Lack of Risk Assessment** — Jumps to implementation without planning

**Low Impact:**
- **Overconfidence** — Equal confidence whether certain or guessing

### New Solutions Added

**Context & Memory:**
- **CLAUDE.md size reduction** — Compress instructions for less context usage
- **MCP Session Management** — Caching, cursors, pagination
- **MCP Streaming** — For long-running operations
- **ToolSearch setup** — Reduce context pollution from tool discovery

**Validation & Enforcement:**
- **Post-Save Hooks** — Validate code after writing
- **Lightweight Checks** — AST analysis, grep, regex scripts

### Impact Severity Added

Reorganized failure states by impact instead of behavioral category:
- **Critical** (5 states) — Breaks functionality
- **High Impact** (7 states) — Major degradation
- **Medium Impact** (7 states) — Quality issues
- **Low Impact** (6 states) — Behavioral quirks

This prioritization helps Pass 1 assign severity scores based on observed patterns.

## Key Research Insights

### Hallucination Rate
- **1 in 5 AI code samples** contains references to fake libraries ([source](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes))
- Not a small problem but a **systematic failure mode**

### Context Degradation Threshold
- Quality degrades at **≥70% context window capacity** ([source](https://deepwiki.com/FlorianBruniaux/claude-code-ultimate-guide/15.2-context-management-issues))
- Happens **even before hitting hard limits**

### Systematic Issues (Jan 2026)
- Elevated error rates on Opus 4.5 (Dec 21-22, 2025)
- **5 documented incidents** in December 2025 alone
- Jan 26, 2026 harness issue caused quality regression (rolled back Jan 28)
- [Status page](https://status.claude.com)

### Root Behavioral Patterns
- **Lack of risk assessment** — Jumps to implementation, discovers problems mid-way
- **Overconfidence without calibration** — Asserts with equal confidence whether certain or guessing
- **Training data bias** — Common patterns miss edge cases, security, performance

## Consolidated Mapping

### Most Common Root Causes → Solutions

| Root Cause | When to Use | Primary Solution |
|------------|-------------|------------------|
| Missing Foundational Context | Project conventions ignored | CLAUDE.md |
| Hallucinated Capabilities | Fake libraries, tools | Post-Save Hooks, LSP Servers |
| Context Window Degradation | Quality decay in long sessions | Subagents, Session Handoffs |
| Aggressive Context Compression | Memory loss from compaction | CLAUDE.md size reduction |
| Weak Feedback Loops | No output validation | Post-Save Hooks, Git Hooks |
| Systematic Bias | Always chooses shortcuts | CLAUDE.md requirements |
| Infinite Loops & Repetition | Retries same failed approach | Hooks (block), Subagents |

### Critical Failure States (Fix First)

1. **Library/API Hallucination** → Post-Save Hooks + LSP Servers
2. **Tool Selection Errors** → Skills (explicit declarations) + CLAUDE.md
3. **Verification Theater** → Post-Save Hooks + Git Hooks
4. **Fake User Input Hallucination** → Hooks (detect pattern) + Subagents

## Implementation Priorities

### Phase 1: Detection (Pass 1)
Build prompts that identify:
1. Hallucinated capabilities (libraries, APIs, tools)
2. Context window issues (degradation, compression)
3. Validation failures (verification theater, premature completion)
4. Behavioral loops (repetition, infinite retries)

### Phase 2: Root Cause Inference
Map observed failures → likely root causes using `FAILURE_STATE_ROOT_CAUSES`

### Phase 3: Solution Matching (Pass 2)
Map root causes → concrete solutions using `ROOT_CAUSE_SOLUTIONS`

### Phase 4: Resource Discovery
Use WebSearch or Resource Scout to find specific tools/MCPs/skills that implement solutions

## Research Sources

- [Claude Code Systematic Failure Patterns (Issue #19739)](https://github.com/anthropics/claude-code/issues/19739)
- [Massive Quality Regression (Issue #21431)](https://github.com/anthropics/claude-code/issues/21431)
- [Hallucinations and Instruction Following Failures (Issue #5810)](https://github.com/anthropics/claude-code/issues/5810)
- [Context Amnesia Protocol](https://medium.com/@ilyas.ibrahim/the-4-step-protocol-that-fixes-claude-codes-context-amnesia-c3937385561c)
- [Anthropic's Reduce Hallucinations Guide](https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
- [Debugging AI-Generated Code: 8 Failure Patterns](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)
- [MCP Best Practices Guide](https://modelcontextprotocol.info/docs/best-practices/)
- [Model Context Protocol Use Cases](https://medium.com/@laowang_journey/model-context-protocol-mcp-real-world-use-cases-adoptions-and-comparison-to-functional-calling-9320b775845c)
- [When Claude Forgets How to Code](https://hyperdev.matsuoka.com/p/when-claude-forgets-how-to-code)
- [Claude Keeps Making the Same Mistakes](https://medium.com/@elliotJL/your-ai-has-infinite-knowledge-and-zero-habits-heres-the-fix-e279215d478d)