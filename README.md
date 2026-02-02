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

## Project Demonstrates

- ✅ TypeScript development with strong typing
- ✅ React hooks in a CLI context (useState, useEffect, custom hooks)
- ✅ CLI tool development with Ink
- ✅ Comprehensive test coverage with Vitest (v8 coverage, 89% threshold)
- ✅ Modern ESLint 9 flat config
- ✅ Automated quality gates with git hooks (pre-commit + commit-msg)
- ✅ Conventional commits for consistent history
- ✅ MCP integration with Serena for LSP-powered code intelligence
