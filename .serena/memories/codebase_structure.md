# Codebase Structure

## Root Directory
```
ClaudeTranscriptAnalyzer/
├── .claude/                 # Claude Code configuration
├── .git/                    # Git repository
├── .husky/                  # Git hooks (pre-commit, commit-msg)
├── .idea/                   # IDE settings
├── .serena/                 # Serena MCP project data
├── coverage/                # Test coverage reports
├── dist/                    # Compiled TypeScript output
├── node_modules/            # Dependencies
└── src/                     # Source code
```

## Source Directory Structure
```
src/
├── cli.tsx                  # Entry point - renders <App /> to terminal
├── App.tsx                  # Root component with state/effects
├── components/              # Reusable UI components
│   └── Header.tsx          # Header component
└── __tests__/              # Test files
    └── App.test.tsx        # App component tests
```

## Configuration Files
- `.mcp.json` - Serena MCP configuration (project-scoped, version-controlled)
- `tsconfig.json` - TypeScript compiler configuration
- `eslint.config.js` - ESLint 9 flat config
- `.prettierrc.json` - Prettier formatting rules
- `.prettierignore` - Files to exclude from Prettier
- `vitest.config.ts` - Vitest test configuration
- `commitlint.config.js` - Conventional commits configuration
- `package.json` - Project metadata, scripts, and dependencies

## Key Files
- **Entry Points**:
  - `src/cli.tsx` - CLI entry point that renders the App component
  - `dist/cli.js` - Compiled binary (npm bin: `claude-analyzer`)
  
- **Main Components**:
  - `src/App.tsx` - Root React component
  - `src/components/Header.tsx` - Header UI component

- **Tests**:
  - `src/__tests__/App.test.tsx` - App component tests using ink-testing-library

## Build Output
- Compiled JavaScript: `dist/`
- Test coverage reports: `coverage/`
- Type declarations: `dist/*.d.ts` (generated during build)

## Git Hooks
- `.husky/pre-commit` - Runs lint-staged, typecheck, build, and test:coverage
- `.husky/commit-msg` - Validates conventional commit format

## Module System
- **Type**: ESM (ES Modules)
- **Import convention**: Use `.js` extension even for `.tsx` files
- **Module resolution**: Bundler mode (TypeScript)
