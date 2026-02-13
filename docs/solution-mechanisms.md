# Solution Mechanisms: Why & How Each Solution Works

This document explains **why** each solution addresses specific root causes and **how** it actually works under the hood.

## Sources

- [Using CLAUDE.MD Files](https://claude.com/blog/using-claude-md-files)
- [How Claude's Memory Actually Works](https://rajiv.com/blog/2025/12/12/how-claude-memory-actually-works-and-why-claude-md-matters/)
- [Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Configure Claude Code Hooks to Automate Your Workflow](https://www.gend.co/blog/configure-claude-code-hooks-automation)
- [LSP: The Secret Weapon for AI Coding Tools](https://amirteymoori.com/lsp-language-server-protocol-ai-coding-tools/)
- [Claude Code LSP Complete Setup Guide](https://www.aifreeapi.com/en/posts/claude-code-lsp)
- [MCP Best Practices](https://modelcontextprotocol.info/docs/best-practices/)

---

## Context & Memory Solutions

### CLAUDE.md

**Why it works:**
- Loaded into Claude's system prompt at **every session start**
- If there's a conflict, **CLAUDE.md ALWAYS wins** over conversation history
- Instructions from early conversation can get lost; CLAUDE.md persists
- [Source](https://claude.com/blog/using-claude-md-files)

**How it works:**
1. File placed in repository root (or parent directories for monorepos)
2. Automatically loaded into context when Claude Code launches
3. Becomes part of system prompt before any conversation
4. Claude checks CLAUDE.md for conventions before making decisions
5. Run `/context` to see what's using your context window

**What it prevents:**
- ❌ CLAUDE.md Ignoring (instructions always loaded)
- ❌ Systematic Simplification Bias (explicit complexity requirements)
- ❌ Interpretive Compliance (literal rules, not interpretations)
- ❌ Security Vulnerabilities (document security patterns)
- ❌ Incomplete Error Handling (specify error handling requirements)

**Best practices:**
- Keep concise and human-readable
- Include only information essential for **every** session
- Document conventions, not implementation details
- [Source](https://rajiv.com/blog/2025/12/12/how-claude-memory-actually-works-and-why-claude-md-matters/)

---

### CLAUDE.md Size Reduction

**Why it works:**
- Smaller instruction set = less context consumed
- Reduces chance of compression pushing out critical rules
- Frees context budget for tool results and conversation

**How to do it:**
1. Remove redundant explanations (examples can be in separate files)
2. Use bullet points instead of paragraphs
3. Link to external docs instead of duplicating content
4. Use `@path` imports to compose from multiple files

**What it prevents:**
- ❌ Aggressive Context Compression (less to compress out)
- ❌ Context Degradation (more room for conversation)
- ❌ CLAUDE.md Ignoring (rules stay in window longer)

---

### Context MCPs

**Why it works:**
- Provides **structured** data access instead of raw file dumps
- LLM queries specific information instead of reading entire files
- Reduces context pollution by orders of magnitude
- [Source](https://modelcontextprotocol.info/docs/best-practices/)

**How it works:**
1. MCP server exposes resources (databases, APIs, docs) via structured interface
2. Claude asks "get user with ID 123" instead of "read entire users table"
3. MCP returns only requested data as JSON
4. Context window contains answer, not entire dataset

**Example:**
```
Without MCP: Read entire 5000-line database dump → 150K tokens
With MCP:    Query "SELECT * FROM users WHERE id=123" → 200 tokens
```

**What it prevents:**
- ❌ Context Pollution (structured queries vs raw dumps)
- ❌ Context Degradation (less noise = clearer signal)
- ❌ Tool Avoidance (has access to external data)
- ❌ Missing Situational Context (real-time data access)

**MCP best practices:**
- Each server should have **one clear purpose** (not "everything MCP")
- Send logs to stderr, not stdout (stdout carries protocol messages)
- Use session management for caching expensive queries
- [Source](https://modelcontextprotocol.info/docs/best-practices/)

---

### LSP Servers

**Why it works:**
- Provides **ground truth** about code structure and types
- Real-time diagnostics catch errors before Claude generates wrong code
- Precise navigation (50ms) instead of text search (45s)
- [Source](https://amirteymoori.com/lsp-language-server-protocol-ai-coding-tools/)

**How it works:**
1. Editor sends `textDocument/didOpen` when file opens
2. Language server analyzes code and responds with diagnostics
3. Claude can query: `goToDefinition`, `findReferences`, `hover`, `documentSymbol`
4. Server returns structured data: line numbers, types, errors
5. Claude uses precise information instead of guessing
6. [Source](https://www.aifreeapi.com/en/posts/claude-code-lsp)

**Core operations:**
- **goToDefinition** — Jump to symbol definitions (no search needed)
- **findReferences** — Locate all usages of function/variable
- **documentSymbol** — View file structure
- **hover** — Display type information and documentation
- **getDiagnostics** — Real-time error and warning detection

**What it prevents:**
- ❌ Library/API Hallucination (LSP validates APIs exist)
- ❌ Tool Selection Errors (knows exact function signatures)
- ❌ Verification Theater (LSP provides ground truth)
- ❌ Context Pollution (precise navigation vs broad file reads)
- ❌ Incomplete Error Handling (LSP shows type errors)

**Performance benefit:**
- Language servers run in **separate process** (no performance cost to editor)
- Implemented in any language, communicate via JSON RPC

---

### Subagents

**Why it works:**
- Fresh context window = no inherited pollution
- Isolated scope = can't break unrelated code
- Specialized system prompt = domain expertise
- Results returned to parent = no context leak

**How it works:**
1. Parent agent delegates task to subagent
2. Subagent spawns with empty context window
3. Gets minimal task description + relevant files only
4. Completes work in isolation
5. Returns summary to parent (not full transcript)

**What it prevents:**
- ❌ Context Degradation (fresh window)
- ❌ Context Pollution (isolated scope)
- ❌ Infinite Loop Failures (fresh perspective breaks loops)
- ❌ Selective Hearing (focused on single task)

---

### Session Handoffs

**Why it works:**
- Structured state transfer across sessions
- Subagents solve context degradation **within** session; handoffs solve it **across** sessions
- Explicit documentation of decisions made and why

**How to do it:**
1. Before ending session, create handoff document
2. Document: completed work, pending tasks, decisions made, blockers, context needed
3. Next session starts by loading handoff document
4. New agent has compressed summary, not full transcript

**What it prevents:**
- ❌ Context Degradation (structured summary vs full history)
- ❌ Instruction Amnesia (decisions documented explicitly)
- ❌ Progressive Degradation (fresh start with context)

---

## Validation & Enforcement Solutions

### Post-Save Hooks

**Why it works:**
- **Deterministic validation** after every file write
- Runs automatically, doesn't rely on LLM choosing to validate
- Can block Claude from continuing until validation passes
- [Source](https://code.claude.com/docs/en/hooks-guide)

**How it works:**
1. Claude writes a file using Write tool
2. PostToolUse hook triggers automatically
3. Hook runs validation (AST check, type check, security scan)
4. If validation fails: exit code 2 + error message to stderr
5. Claude sees error and must fix before continuing
6. [Source](https://www.gend.co/blog/configure-claude-code-hooks-automation)

**Communication mechanism:**
- Hook receives event data as JSON via stdin
- Hook outputs result to stdout/stderr
- Exit code tells Claude what happened:
  - `0` = success, continue
  - `2` = blocked, show error to user
  - Other = tool failed

**What it prevents:**
- ❌ Library/API Hallucination (validate imports exist)
- ❌ Security Vulnerabilities (scan for exposed secrets)
- ❌ Verification Theater (actual validation, not simulated)
- ❌ Incomplete Error Handling (check for try/catch coverage)
- ❌ Performance Blindness (run performance linters)
- ❌ Premature Completion Claims (validate output actually works)

**Example hook:**
```bash
#!/bin/bash
# PostToolUse hook: validate Python imports exist

if [[ "$TOOL_NAME" == "Write" ]]; then
  FILE_PATH=$(jq -r '.file_path' <<< "$TOOL_INPUT")

  if [[ "$FILE_PATH" == *.py ]]; then
    # Check for non-existent imports
    if ! python -m py_compile "$FILE_PATH" 2>/dev/null; then
      echo "Import validation failed: file has syntax/import errors" >&2
      exit 2  # Block and show error to Claude
    fi
  fi
fi

exit 0
```

---

### Git Hooks

**Why it works:**
- Runs before commit succeeds (can't bypass)
- Validates actual output (tests, build, coverage)
- Enforces standards at team level (every developer, every commit)

**How it works:**
1. Developer runs `git commit`
2. Pre-commit hook runs (linting, type checking, tests)
3. If any check fails, commit is blocked
4. Developer must fix issues before code is committed

**What it prevents:**
- ❌ Premature Completion Claims (tests must pass)
- ❌ Security Vulnerabilities (pre-commit security scans)
- ❌ Incomplete Error Handling (coverage threshold enforced)
- ❌ Performance Blindness (performance tests run)
- ❌ CLAUDE.md Ignoring (enforcement at commit time)

---

### Hooks (PreToolUse with `block: true`)

**Why it works:**
- Executes **before** action happens (can prevent it)
- Can modify tool inputs before execution
- Provides interactive confirmation for risky operations
- [Source](https://code.claude.com/docs/en/hooks-guide)

**How it works:**
1. Claude attempts to use a tool (e.g., Bash with `rm -rf`)
2. PreToolUse hook intercepts before execution
3. Hook analyzes command for risk patterns
4. If dangerous: exit code 2 → blocked
5. Claude must ask user or find alternative approach
6. [Source](https://www.gend.co/blog/configure-claude-code-hooks-automation)

**Advanced: Input modification (v2.0.10+):**
- PreToolUse can modify JSON input before tool runs
- Example: Automatically add dry-run flags to dangerous commands
- Example: Redact secrets from logs before writing

**What it prevents:**
- ❌ Unauthorized Actions (block dangerous commands)
- ❌ Insufficient Guardrails (enforce permissions)
- ❌ Infinite Loop Failures (detect and block repetition)
- ❌ Lack of Risk Assessment (force confirmation for risky ops)

**Example hook:**
```bash
#!/bin/bash
# PreToolUse hook: block destructive Bash commands

if [[ "$TOOL_NAME" == "Bash" ]]; then
  COMMAND=$(jq -r '.command' <<< "$TOOL_INPUT")

  # Block dangerous patterns
  if [[ "$COMMAND" =~ (rm -rf|DROP TABLE|--force|git push -f) ]]; then
    echo "Blocked: Destructive command requires manual approval" >&2
    exit 2
  fi
fi

exit 0
```

---

### Lightweight Checks (AST/grep/regex)

**Why it works:**
- Fast validation without expensive analysis
- Can run in hooks or CI/CD
- Detects specific patterns reliably

**How to implement:**
1. **AST analysis** — Parse code into syntax tree, check structure
2. **grep/regex** — Search for anti-patterns (hardcoded secrets, SQL injection)
3. **Custom scripts** — Domain-specific validations

**What it prevents:**
- ❌ Library/API Hallucination (grep imports against known libraries)
- ❌ Security Vulnerabilities (regex for exposed API keys)
- ❌ Hallucinated Capabilities (AST checks method exists)

---

### Permissions

**Why it works:**
- Hard gates evaluated **before hooks**
- Declarative rules (no scripting needed)
- First match wins (clear precedence)

**How it works:**
1. Claude attempts to use a tool
2. Permission system checks rules in `settings.json`
3. If matched rule says `deny` → blocked (no hook runs)
4. If `ask` → user approval required
5. If `allow` → continues to hooks

**What it prevents:**
- ❌ Unauthorized Actions (deny dangerous operations)
- ❌ Insufficient Guardrails (hard limits on tool use)
- ❌ Security Vulnerabilities (block access to sensitive files)

---

## Capability Solutions

### Ability MCPs

**Why it works:**
- Adds actual functionality (not just context)
- Claude can **perform** actions, not just simulate them
- Validates tool exists before use

**How it works:**
1. MCP server exposes tools (API writes, deployments, Trello, etc.)
2. Claude Code discovers available tools at startup
3. Claude can invoke: `mcp__trello__create_card(...)`
4. MCP executes real API call and returns result
5. Claude sees actual output, not hallucinated simulation

**What it prevents:**
- ❌ Tool Avoidance (tool now exists)
- ❌ Hallucinated Capabilities (actual tool, not fake)
- ❌ Verification Theater (real execution, real results)
- ❌ Missing Abilities (functionality added)

---

### Skills

**Why it works:**
- Explicit tool declarations (Claude knows what it has)
- Structured workflows (not ad-hoc)
- Auto-activation based on task context
- Constrained tool use (only allowed tools)

**How it works:**
1. Skill defined in `.claude/skills/foo/SKILL.md`
2. Claude matches task context to skill description
3. Activates transparently (no manual invocation)
4. Uses only tools declared in `allowed-tools`

**What it prevents:**
- ❌ Tool Avoidance (workflow includes correct tool)
- ❌ Tool Selection Errors (explicit tool declarations)
- ❌ Hallucinated Capabilities (skill declares what exists)
- ❌ Systematic Simplification Bias (workflow enforces steps)
- ❌ Infinite Loop Failures (provides alternative strategies)

---

## Architecture Solutions

### disabledMcpServers

**Why it works:**
- Each active MCP consumes context window
- Unused MCPs add noise (tool discovery, documentation)
- Explicitly disabling frees context budget

**How to do it:**
```json
{
  "disabledMcpServers": ["unused-server-1", "unused-server-2"]
}
```

**What it prevents:**
- ❌ Context Pollution (fewer tools = less noise)
- ❌ Aggressive Context Compression (more room for conversation)

---

### ToolSearch Setup

**Why it works:**
- Reduces context pollution from tool discovery
- Claude searches for tools only when needed
- Cached tool information reduces repeated lookups

**What it prevents:**
- ❌ Context Pollution (tool search results don't bloat context)
- ❌ Aggressive Context Compression (less to compress)

---

## Summary: Solution → Root Cause Mapping

| Solution | Addresses Root Cause | Mechanism |
|----------|---------------------|-----------|
| **CLAUDE.md** | Missing Foundational Context | Persistent instructions loaded every session |
| **Context MCPs** | Missing Situational Context | Structured queries instead of raw data dumps |
| **LSP Servers** | Hallucinated Capabilities | Ground truth validation of code structure |
| **Post-Save Hooks** | Weak Feedback Loops | Deterministic validation after every file write |
| **PreToolUse Hooks** | Insufficient Guardrails | Block actions before they execute |
| **Subagents** | Context Window Degradation | Fresh context window for isolated work |
| **Ability MCPs** | Missing Abilities | Add actual functionality (API calls, integrations) |
| **Skills** | Systematic Bias | Structured workflows with explicit requirements |
| **Git Hooks** | Weak Feedback Loops | Enforce standards at commit time (team-level) |
| **Permissions** | Insufficient Guardrails | Hard gates evaluated before hooks |

---

## Decision Tree: Which Solution?

```
Is the problem about Claude not knowing project rules?
  └─> CLAUDE.md (persistent instructions)

Is Claude making up libraries/APIs that don't exist?
  └─> LSP Servers (ground truth) + Post-Save Hooks (validation)

Is Claude producing code that looks right but fails when run?
  └─> Post-Save Hooks (actual validation) + Git Hooks (pre-commit tests)

Is Claude doing dangerous things without asking?
  └─> Permissions (hard deny) + PreToolUse Hooks (interactive confirm)

Is Claude missing access to external data (DB, API, docs)?
  └─> Context MCPs (read-only) or Ability MCPs (read-write)

Is quality degrading as conversation gets long?
  └─> Subagents (fresh context) + Session Handoffs (structured state)

Is Claude retrying the same failed approach?
  └─> Hooks (detect repetition) + Skills (alternative strategies)

Is Claude taking shortcuts or simplifying too much?
  └─> CLAUDE.md (explicit requirements) + Post-Save Hooks (enforce standards)
```