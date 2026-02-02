# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript + React CLI application built with **Ink** (React renderer for terminal UIs). The project mirrors the technology stack used by Anthropic's Claude Code itself: TypeScript, React, Ink, and Vitest.

**Purpose**: Analyze Claude conversation transcripts to identify optimization opportunities (MCP integrations, skills, hooks, workflow improvements).

## MCP Configuration

This project uses **Serena MCP** for LSP-powered semantic code understanding. The configuration is in `.mcp.json` (project-scoped, version-controlled).

**Serena provides:**
- TypeScript language server integration (automatic)
- Go to definition, find references, rename symbol
- Real-time diagnostics and type checking
- Semantic code search and navigation
- IDE-quality code intelligence for Claude

The `.mcp.json` file is committed to the repository, demonstrating MCP setup for portfolio purposes.

## Architecture

### React in the Terminal
- **Ink** renders React components to the terminal using React's reconciler
- Components use standard React hooks (useState, useEffect, etc.)
- Terminal UI updates reactively like a web app
- Testing uses `ink-testing-library` which provides a virtual terminal renderer

### Project Structure
```
src/
├── cli.tsx              # Entry point - renders <App /> to terminal
├── App.tsx              # Root component with state/effects
├── components/          # Reusable UI components
│   └── Header.tsx
└── __tests__/          # Vitest tests using ink-testing-library
    └── App.test.tsx
```

### Key Patterns
- All components export as named exports with explicit types (`export const Foo: React.FC`)
- Use `.js` extension in imports even for `.tsx` files (ESM requirement)
- Tests use `render()` from `ink-testing-library` and check `lastFrame()` output
- Async behavior in tests: use real timeouts, not fake timers (Ink doesn't play well with fake timers)

## Development Commands

### Essential
```bash
npm run dev              # Run CLI with hot reload (uses tsx)
npm run build            # Compile TypeScript to dist/
npm run typecheck        # Type check without building
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run with coverage (89% threshold enforced)
```

### Code Quality
```bash
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format all code with Prettier
npm run format:check     # Check if code is formatted
```

### Run Single Test
```bash
npx vitest src/__tests__/App.test.tsx
```

## Git Commit Workflow

### Pre-commit Hook (Automatic)
The pre-commit hook runs 4 checks in sequence:
1. **lint-staged** - Auto-fixes ESLint and Prettier issues
2. **typecheck** - Validates TypeScript types
3. **build** - Ensures compilation succeeds
4. **test:coverage** - Runs tests with 89% coverage threshold

If any check fails, you'll see a concise error message. Fix the issue, stage files, and commit again.

### Commit Message Format (Required)
Use conventional commits: `type: subject` or `type(scope): subject`

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

Examples:
- `feat: add transcript parser`
- `fix: resolve type error in analyzer`
- `test: add coverage for Header component`

Invalid format will fail the commit-msg hook.

## Code Quality Standards

### Coverage Requirements
- 89% threshold for lines, functions, branches, and statements
- Coverage enforced in pre-commit hook
- Use Vitest v8 coverage provider (configured in `vitest.config.ts`)

### ESLint Configuration
- **ESLint 9** with flat config (`eslint.config.js`)
- TypeScript-aware linting via `@typescript-eslint`
- React hooks rules enforced
- Unused variables prefixed with `_` are allowed
- `react/react-in-jsx-scope` disabled (not needed with modern React)

### TypeScript Settings
- Strict mode enabled
- Module resolution: `bundler` (required for Ink imports)
- Output: `dist/`
- Tests excluded from compilation

## Testing Ink Components

### Testing Pattern
```typescript
import { render } from 'ink-testing-library';
import { MyComponent } from '../MyComponent.js';

it('renders correctly', () => {
  const { lastFrame } = render(<MyComponent />);
  expect(lastFrame()).toContain('expected text');
});
```

### Async Testing
For components with timers/effects:
```typescript
it('updates after delay', async () => {
  const { lastFrame } = render(<App />);
  await new Promise(resolve => setTimeout(resolve, 1100));
  expect(lastFrame()).toContain('updated text');
});
```

**Important**: Use real timeouts, not `vi.useFakeTimers()` - Ink's internal rendering doesn't work well with fake timers.

## Common Pitfalls

1. **Import extensions**: Always use `.js` in imports even for `.tsx` files
2. **Unused imports**: ESLint will flag these as errors - remove them or prefix with `_`
3. **Missing test coverage**: Add tests before committing to meet 89% threshold
4. **Commit message format**: Must use conventional commits or commit will fail
5. **Type errors**: Pre-commit will catch these - fix before committing

## Token-Efficient Error Messages

All git hooks provide concise, single-line error guidance:
- `❌ ESLint errors: Fix issues above, stage files, and commit again`
- `❌ TypeScript errors: Fix type issues above, stage files, and commit again`
- `❌ Build failed: Fix compilation errors above, stage files, and commit again`
- `❌ Test/coverage failure: Fix failing tests or add tests to reach 89% coverage, then commit again`
- `❌ Commit message invalid: Use conventional commits format (type: subject)`