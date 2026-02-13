# Product Backlog

## Epic 1: Transcript Intake & Session Management

### US-001: Read transcript files from filesystem
**As a** user
**I want** to point the CLI at transcript files
**So that** I can analyze my Claude conversations

**AC:**
- Accept file path(s) as CLI arg or stdin
- Support single file and directory glob
- Read .txt, .md, .json formats
- Handle file read errors gracefully

**Story Points:** 3

---

### US-002: Extract metadata from transcript files
**As a** system
**I want** to extract timestamp from file metadata
**So that** sessions can be sorted chronologically

**AC:**
- Use file creation/modification time
- Parse filename timestamps if present (e.g., `transcript-2026-02-13.txt`)
- Fallback to file mtime
- Store datetime with session

**Story Points:** 2

---

### US-003: Display session list UI
**As a** user
**I want** to see a list of available sessions
**So that** I can choose which one to analyze

**AC:**
- Show datetime + summary per session
- Use Ink components (Box, Text)
- Support arrow key navigation
- Highlight selected session
- Enter to confirm selection

**Story Points:** 5

---

## Epic 2: Pass 0 - Summarization

### US-004: Generate transcript summaries with Haiku
**As a** system
**I want** to summarize each transcript on first load
**So that** users can quickly identify sessions

**AC:**
- Call Claude Haiku API with transcript
- Single-job prompt: "Summarize this transcript in 1-2 sentences"
- Return summary string
- Handle API errors (rate limits, timeouts)
- Token limit handling for long transcripts

**Story Points:** 8

---

### US-005: Cache summarization results
**As a** system
**I want** to cache summaries locally
**So that** we don't re-summarize on every run

**AC:**
- Store summaries in `.cache/summaries/`
- Key by file path hash + file mtime
- Invalidate cache if file changes
- JSON format: `{ filePath, mtime, summary, generatedAt }`
- Gitignore cache directory

**Story Points:** 5

---

## Epic 3: Pass 1 - Failure Pattern Detection

### US-006: Define failure pattern catalog
**As a** developer
**I want** a structured catalog of failure patterns
**So that** Pass 1 has a reference schema

**AC:**
- JSON/TS schema with all patterns from README
- Categories: Instruction Failures, Drift, Verification, Scope, Meta
- Each pattern: name, category, description, severity
- Export as typed constant

**Story Points:** 3

---

### US-007: Detect failure patterns with Haiku
**As a** system
**I want** to identify failure patterns in selected transcript
**So that** I can recommend fixes

**AC:**
- Prompt Haiku with transcript + failure catalog
- Single job: pattern detection only (no matching)
- Output structured JSON: `[{ failure_state, category, severity, evidence, confidence }]`
- Include line number references in evidence
- Handle edge case: no failures detected

**Story Points:** 13

---

### US-008: Display detected failures in UI
**As a** user
**I want** to see which patterns were detected
**So that** I understand what went wrong

**AC:**
- Show list of detected failures
- Group by severity (high → low)
- Show category, pattern name, confidence score
- Expandable to show evidence quotes
- Color-coded by severity (red/yellow/blue)

**Story Points:** 8

---

## Epic 4: Pass 2 - Solution Matching

### US-009: Define extension catalog
**As a** developer
**I want** a structured catalog of Claude extensions
**So that** Pass 2 can match patterns to solutions

**AC:**
- JSON/TS schema with all extensions from README
- Categories: Context, Automation, Capabilities, Architecture, Communication
- Each extension: name, category, description, use_cases
- Include failure-to-solution mapping table

**Story Points:** 3

---

### US-010: Match failures to solutions with Haiku
**As a** system
**I want** to map detected failures to recommended extensions
**So that** users get actionable guidance

**AC:**
- Input: Pass 1 JSON output
- Prompt Haiku with failure JSON + extension catalog + mapping table
- Single job: matching only (no re-reading transcript)
- Output: `[{ failure_id, recommended_extensions: [], rationale }]`
- Support multiple recommendations per failure

**Story Points:** 8

---

### US-011: Display recommendations in UI
**As a** user
**I want** to see recommended solutions
**So that** I know how to fix the issues

**AC:**
- Show recommendations grouped by failure
- Extension name + category
- Brief rationale from Pass 2
- Link to docs/examples if available
- Copy-friendly output format

**Story Points:** 5

---

## Epic 5: Concrete Tool Recommendations

### US-012: Integrate WebSearch for tool discovery
**As a** system
**I want** to search for specific MCP/skills
**So that** recommendations include real tools

**AC:**
- Use Claude WebSearch tool
- Query format: "[extension type] for [use case]"
- Parse results for GitHub repos, MCP marketplace links
- Cache search results
- Fallback if search unavailable

**Story Points:** 8

---

### US-013: Format installation instructions
**As a** user
**I want** step-by-step setup instructions
**So that** I can quickly implement recommendations

**AC:**
- Generate instructions based on extension type
- CLAUDE.md: show file path + example content
- MCP: show .mcp.json snippet
- Hook: show settings.json snippet
- Skill: show directory structure
- Copy buttons for each snippet

**Story Points:** 8

---

## Epic 6: Configuration & Polish

### US-014: Configure Anthropic API credentials
**As a** user
**I want** to provide my API key securely
**So that** the tool can call Claude Haiku

**AC:**
- Check env var `ANTHROPIC_API_KEY`
- Fallback to `~/.config/claude/api_key`
- Clear error if missing
- Never log/display key
- Document in README

**Story Points:** 3

---

### US-015: Add progress indicators
**As a** user
**I want** to see progress during analysis
**So that** I know the tool is working

**AC:**
- Spinner during API calls
- Progress bar for multi-file processing
- Status messages: "Summarizing...", "Detecting patterns...", "Matching solutions..."
- Use Ink Spinner/ProgressBar components

**Story Points:** 5

---

### US-016: Support export to JSON/Markdown
**As a** user
**I want** to export analysis results
**So that** I can share or archive them

**AC:**
- Flag: `--output report.json` or `--output report.md`
- JSON: full structured output (Pass 1 + Pass 2)
- Markdown: formatted report with sections
- Include timestamp, transcript path, model used

**Story Points:** 5

---

## Epic 7: Testing & Quality

### US-017: Unit tests for catalogs
**As a** developer
**I want** tests for catalog schemas
**So that** prompts have valid references

**AC:**
- Validate failure catalog structure
- Validate extension catalog structure
- Check mapping table references exist
- 89% coverage maintained

**Story Points:** 3

---

### US-018: Mock Haiku responses for tests
**As a** developer
**I want** to test without real API calls
**So that** tests are fast and deterministic

**AC:**
- Mock Anthropic SDK responses
- Fixture transcripts with known failures
- Fixture expected JSON outputs
- Test error handling (rate limits, timeouts)

**Story Points:** 8

---

### US-019: Integration test for full pipeline
**As a** developer
**I want** end-to-end test of all passes
**So that** I verify the whole flow works

**AC:**
- Test transcript → summary → detection → matching → output
- Use real catalog data
- Mocked API calls
- Assert on final recommendations
- Test with multiple failure patterns

**Story Points:** 8

---

## Technical Debt / Chores

### TECH-001: Setup API client abstraction
- Wrapper around Anthropic SDK
- Retry logic with exponential backoff
- Rate limit handling
- Token counting
- Error normalization

**Story Points:** 5

---

### TECH-002: Create shared types
- TypeScript interfaces for all data structures
- Transcript, Session, FailurePattern, Extension, Recommendation
- Share between components
- Export from types.ts

**Story Points:** 2

---

### TECH-003: Add logging framework
- Structured logging (pino or winston)
- Debug mode flag (`--debug`)
- Log API calls, cache hits, errors
- Don't log sensitive data

**Story Points:** 3
