# ClaudeTranscriptAnalyzer

An interactive CLI tool for analyzing Claude conversation transcripts to identify optimization opportunities, built with the same technologies Anthropic uses for Claude Code.

## Overview

This tool analyzes Claude Code conversation transcripts and suggests improvements such as:
- Model Context Protocol (MCP) integrations
- Custom skills
- Claude hooks
- Git hooks
- Workflow optimizations

## Technology Stack

Built using the same core technologies that power Claude Code:

- **TypeScript** - Type-safe development
- **React** - Component-based UI architecture
- **Ink** - React renderer for interactive CLI applications
- **Vitest** - Modern, fast testing framework with TypeScript support

### Why This Stack?

This tech stack was chosen to align with Anthropic's Claude Code architecture:
- **TypeScript + React**: "On distribution" technologies that LLMs excel at
- **Ink**: Enables building terminal UIs with React components and hooks
- **Vitest**: Modern testing framework with excellent TypeScript support

## Features

- Interactive CLI interface built with React hooks
- Real-time transcript analysis
- Actionable recommendations
- Beautiful terminal output

## Installation

```bash
npm install
```

## Development

```bash
# Run the CLI in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

## Code Quality

This project enforces strict code quality standards:

### Linting & Formatting
- **ESLint 9** with flat config format
- **TypeScript ESLint** for type-aware linting
- **React** and **React Hooks** ESLint plugins
- **Prettier** for consistent code formatting

### Test Coverage Thresholds
- **Lines**: 89%
- **Functions**: 89%
- **Branches**: 89%
- **Statements**: 89%

### Git Hooks (via Husky)

**Pre-commit hook** automatically runs:
1. **lint-staged**: Auto-fixes and formats staged files with ESLint and Prettier
2. **Type checking**: Ensures no TypeScript errors
3. **Build verification**: Confirms the project compiles successfully
4. **Test coverage**: Enforces 89% coverage thresholds

**Commit-msg hook** validates:
- **Conventional commits**: Enforces format like `feat: add feature` or `fix: resolve bug`

**Commit Failure Scenarios:**
- ❌ ESLint errors that can't be auto-fixed
- ❌ TypeScript compilation errors
- ❌ Build failures
- ❌ Test failures or coverage below 89%
- ❌ Invalid commit message format

**Concise Error Messages:**
All failures provide single-line guidance optimized for token efficiency:
- `❌ ESLint errors: Fix issues above, stage files, and commit again`
- `❌ TypeScript errors: Fix type issues above, stage files, and commit again`
- `❌ Build failed: Fix compilation errors above, stage files, and commit again`
- `❌ Test/coverage failure: Fix failing tests or add tests to reach 89% coverage, then commit again`
- `❌ Commit message invalid: Use conventional commits format (type: subject)`
- `✅ All checks passed` on success

All checks must pass before commits are allowed, ensuring code quality at every stage. Auto-fixable formatting issues are handled automatically, but code quality issues must be resolved manually.

## MCP Integration

This project includes **Serena MCP** configuration for LSP-powered semantic code understanding.

### Setup
The MCP configuration is defined in `.mcp.json` (project-scoped, version-controlled):
- **Serena MCP**: TypeScript language server with go-to-definition, find references, diagnostics
- Provides IDE-quality code intelligence to Claude Code
- Automatically installs `typescript-language-server`

When you open this project in Claude Code, it will detect `.mcp.json` and prompt you to enable Serena MCP.

## Vision & Roadmap

The end goal: a tool that reads a Claude Code transcript, identifies where things went wrong or could have gone better, and recommends the specific extension to fix it. That means we need two things — a well-defined catalog of failure patterns to look for, and a well-defined catalog of ways to extend Claude to recommend. Then the interesting problem: matching one to the other.

### Failure Patterns to Detect

The patterns we're looking for in transcripts. Categorization draws from [community-documented failure patterns](https://github.com/anthropics/claude-code/issues/19739) and [Anthropic's research on real-world task success rates](https://the-decoder.com/anthropic-cuts-ai-productivity-forecasts-in-half-after-analyzing-claudes-real-world-failure-rates/).

#### Instruction Failures
- **Semantic Inversion** — Does the opposite of what was explicitly asked, while claiming compliance
- **Selective Hearing** — Parses part of a multi-part instruction, ignores the rest
- **Instruction Amnesia** — After correction, repeats a similar error; enters an apology-repeat loop
- **CLAUDE.md Ignoring** — Defaults to training-data patterns instead of the project's explicit instructions

#### Drift & Degradation
- **Interpretive Compliance** — Interprets the intent behind a spec instead of implementing it literally (e.g., `Op4.5-Nov25` becomes `Opus 4.5 (November 2025)`)
- **Progressive Degradation** — Each fix introduces new deviations while partially addressing old ones; never converges
- **Context Degradation** — Accuracy and coherence decay over long conversations as the context window fills
- **Context Pollution** — Intermediate tool results bloat context, pushing important instructions out of scope

#### Verification & Honesty
- **Premature Completion Claims** — Says "done" when work is incomplete; evidence in the same response contradicts the claim
- **Verification Theater** — Produces verification output that looks thorough but validates the wrong thing (e.g., checks code structure instead of actual output)
- **Plan-as-Shield** — Uses its own degraded understanding as justification against user corrections

#### Scope & Authorization
- **Unauthorized Actions** — Takes actions the user didn't request (e.g., running `npm install -g` when asked to diagnose)
- **Tool Avoidance** — Explicitly told to use a specific tool, does everything except use it
- **Systematic Simplification Bias** — Consistently chooses easier implementations at every decision point; a consistent bias, not random error

#### Meta-Patterns
- **Self-Awareness Without Correction** — Correctly identifies its own failure pattern, then immediately reproduces it
- **Frustration Escalation** — User expresses frustration; agent acknowledges it verbally but doesn't change behavior

### Ways to Extend Claude

Everything you can use to extend or steer Claude Code. The tool's job is to match a detected failure pattern to the right one of these.

#### Context & Memory
- **CLAUDE.md** — Persistent project instructions, loaded automatically at session start. Hierarchical: enterprise → user (`~/.claude/`) → project → directory-level. The foundational customization layer. Supports `@path` imports to compose from multiple files.
- **CLAUDE.local.md** — Gitignored counterpart to CLAUDE.md. Personal, project-specific preferences that don't get committed.
- **Modular Rules (`.claude/rules/*.md`)** — Glob-scoped instruction files. More granular than a single CLAUDE.md; rules can target specific directories or file types.
- **Session Handoffs** — Explicit cross-session memory documents. Where subagents solve context degradation *within* a session, handoffs solve it *across* sessions — structured state you carry into the next one.
- **Context MCPs** — Read-only MCP servers that give Claude structured access to data (repos, databases, docs) without dumping raw content into context.

#### Automation & Enforcement
- **Permissions** — Declarative deny/allow/ask rules in `settings.json`. Hard gates: block reads of sensitive files, require confirmation for destructive commands. Evaluated before hooks — first match wins.
- **Hooks** — Event-driven scripts on lifecycle events: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, etc. Can block actions (`block: true`), provide feedback, or validate outputs.
- **Git Hooks** — Pre-commit and commit-msg hooks for enforcing standards before code leaves the developer.

#### Capabilities & Abilities
- **Ability MCPs** — MCP servers that expose executable capabilities: API writes, deployments, external service interactions.
- **LSP Servers (`.lsp.json`)** — Language server integration for code intelligence: go-to-definition, find references, type checking, real-time diagnostics. Gives Claude precise navigation (50ms) instead of text search (45s). Serena is one example; this is a general extension layer.
- **Skills** — Auto-activating capabilities in `.claude/skills/`, each with a `SKILL.md`. Claude matches task context to skill descriptions transparently — no manual invocation.
- **Slash Commands** — Manually triggered workflows defined as markdown in `.claude/commands/`. Support argument interpolation and pre-execution bash steps. Note: Anthropic has merged slash commands into Skills — a file at `.claude/commands/foo.md` and a skill at `.claude/skills/foo/SKILL.md` both create `/foo`. Skills are the recommended path going forward.

#### Architecture & Isolation
- **Subagents** — Specialized agents with isolated context windows, custom system prompts, and restricted tool access. Prevents context poisoning during deep work.
- **Model Selection** — Routing to the right model for the task via `ANTHROPIC_MODEL` or per-request config. Different models have different failure profiles; a complex reasoning task and a simple formatting task don't need the same model.
- **`disabledMcpServers`** — Explicitly disabling unused MCP servers in project config. Each active MCP eats into the context window; disabling unused ones is one of the simplest ways to prevent context pollution.
- **Plugins** — Shareable packages that bundle commands, hooks, skills, and MCP configs into distributable units.

#### Communication
- **Prompt Engineering** — How requests are phrased. Specificity, decomposition, and explicit constraints all affect output quality and failure rate.

### Failure-to-Solution Mapping

The core idea: detect a pattern in the transcript, surface the extension that addresses it.

| Detected Failure Pattern | Recommended Extension |
| --- | --- |
| Instruction Amnesia / Selective Hearing | CLAUDE.md — persistent, explicit rules that reload every session; Git hooks — enforce requirements at commit time regardless of what was acknowledged |
| CLAUDE.md Ignoring | Hook (PreToolUse) — re-inject critical instructions at key moments |
| Context Degradation | Subagents — spawn fresh context windows for isolated work; Session Handoffs — carry structured state into the next session |
| Context Pollution | Context MCPs — structured data access instead of raw dumps; `disabledMcpServers` — cut unused MCPs from the context budget; LSP Servers — precise navigation instead of broad file searches |
| Verification Theater | Hook (PostToolUse) — enforce actual output validation; LSP Servers — type checking and diagnostics as a ground truth layer |
| Unauthorized Actions | Permissions (deny rules) — hard gate, evaluated before anything else runs; Hook (PreToolUse with `block: true`) — confirmation for edge cases permissions don't cover |
| Tool Avoidance | Skill — explicit `allowed-tools` declaration to constrain behavior |
| Systematic Simplification Bias | CLAUDE.md — explicit complexity and completeness requirements |
| Premature Completion Claims | Hook (PostToolUse) — validate completion criteria before allowing sign-off; Git hooks — pre-commit runs tests/build/coverage, blocking the commit if anything is actually broken |
| Progressive Degradation | Skill with spec-enforcement validation script |
| Interpretive Compliance | CLAUDE.md — literal implementation rules; Skill for spec-pinning |

### Planned Architecture: Two-Pass Haiku Pipeline

The analysis runs as two focused LLM passes using Claude Haiku — fast, cheap, and well-suited to structured extraction and classification work. Each pass has a single job.

```
Transcript files (with file timestamps)
    │
    ▼
┌─────────────────────────────┐
│  Pass 0: Summarization      │  ← Runs once per transcript when first
│                             │     discovered. Haiku reads the transcript
│  Input:  raw transcript     │     and produces a short summary. Datetime
│  Output: summary + cache    │     comes from file metadata. Results
└───────────────┬─────────────┘     cached — populates the session list.
                │
                ▼
        Session List UI
   (datetime + summary per session)
                │  ← User selects a session
                ▼
┌─────────────────────────────┐
│  Pass 1: Failure Detection  │  ← Haiku reads the transcript,
│                             │     identifies failure patterns,
│  Input:  raw transcript     │     and outputs structured results.
│  Output: failure pattern JSON │     single-responsibility prompt —
└───────────────┬─────────────┘     no matching logic here.
                │
                ▼
        Intermediate JSON
        (the critical piece)
                │
                ▼
┌─────────────────────────────┐
│  Pass 2: Solution Matching  │  ← Haiku takes the structured output
│                             │     from Pass 1 and maps each detected
│  Input:  failure pattern JSON │     failure pattern to extensions from
│  Output: recommendations   │     the catalog. No re-reading
└─────────────────────────────┘     the transcript needed.
```

#### Why Two Passes Instead of One?
Recognition and resolution are fundamentally different tasks. Pass 1 is purely about reading the transcript and identifying what went wrong — no opinions about fixes. Pass 2 is purely about matching detected patterns to known solutions — no re-reading the transcript. Collapsing them into a single prompt conflates the two, and is a recipe for the exact failure patterns this tool is designed to catch: selective hearing, shortcuts, missed details. Keeping them separate also makes the pipeline testable — you can validate Pass 1's output independently before Pass 2 ever runs.

#### The Intermediate Format
The JSON schema between the two passes is where the reliability of the pipeline lives. Rough shape:

```json
[
  {
    "failure_state": "Instruction Amnesia",
    "category": "Instruction Failures",
    "severity": "high",
    "evidence": "Lines 42-58: user corrected column width three times, each fix reverted in the next response",
    "confidence": 0.92
  }
]
```

Each detection is self-contained: the failure pattern name (ties back to the catalog of failure patterns), the category it belongs to, severity, a direct quote or reference to where in the transcript it happened, and a confidence score. Pass 2 doesn't need to re-read the transcript — everything it needs is in this structure.

#### Pass 2 Enhancement: Concrete Recommendations
Pass 2's job is matching failure patterns to extension *types* (e.g. "use a Context MCP"). But a generic category isn't actionable. Two options for turning that into a specific tool:
- **WebSearch** — already a built-in Claude tool. Can search for MCPs, skills, and solutions on the fly without any extra wiring.
- **[Resource Scout](https://mcpmarket.com/tools/skills/resource-scout)** — a dedicated skill that discovers existing skills and MCP servers across marketplaces and repos. More targeted than a general search.

Either way, the output shifts from "you should add an MCP for database access" to "here's one that does it, here's how to wire it in."

## Project Demonstrates

- ✅ TypeScript development with strong typing
- ✅ React hooks in a CLI context (useState, useEffect, custom hooks)
- ✅ CLI tool development with Ink
- ✅ Comprehensive test coverage with Vitest (v8 coverage, 89% threshold)
- ✅ Modern ESLint 9 flat config
- ✅ Automated quality gates with git hooks (pre-commit + commit-msg)
- ✅ Conventional commits for consistent history
- ✅ MCP integration with Serena for LSP-powered code intelligence
