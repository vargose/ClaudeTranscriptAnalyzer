# Tasks Directory

Agile-style user stories and sprint planning for ClaudeTranscriptAnalyzer.

## Files

- **BACKLOG.md** - Product backlog with all user stories, organized by epic
- **SPRINTS.md** - Sprint breakdown with story point estimates
- **DONE.md** - Completed stories (archive)

## Story Format

Each user story follows:
```
### US-XXX: Title
**As a** [role]
**I want** [feature]
**So that** [benefit]

**AC:** (Acceptance Criteria)
- Bullet points

**Story Points:** [estimate]
```

## Story Points Reference

- 1-2: Trivial (config change, minor tweak)
- 3: Simple (single component, clear requirements)
- 5: Medium (multiple files, some complexity)
- 8: Complex (API integration, state management)
- 13: Very complex (core algorithm, multi-component)
- 21+: Epic (break down further)

## Epics

1. **Transcript Intake** - File I/O, session management, UI
2. **Pass 0** - Summarization with caching
3. **Pass 1** - Failure pattern detection
4. **Pass 2** - Solution matching
5. **Concrete Tools** - WebSearch, installation guides
6. **Configuration** - API keys, settings
7. **Testing** - Unit, integration, mocks

## Workflow

1. Pick story from BACKLOG.md
2. Implement + test
3. Move to DONE.md when complete
4. Update sprint progress in SPRINTS.md

## Future: Kanban Integration

Will integrate with a Kanban tool (GitHub Projects, Linear, or similar) once board is set up. These markdown files serve as the source of truth.
