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
Pre-commit hook automatically runs:
1. **lint-staged**: Auto-fixes and formats staged files with ESLint and Prettier
   - Auto-fixable issues (formatting, simple style) are fixed and included in the commit
   - Non-fixable issues (unused variables, logic errors) will **fail the commit**
2. **Type checking**: Ensures no TypeScript errors - **fails commit if errors found**
3. **Test coverage**: Enforces 89% coverage thresholds - **fails commit if not met**

**Commit Failure Scenarios:**
- ❌ ESLint errors that can't be auto-fixed (e.g., unused variables, missing return types)
- ❌ TypeScript compilation errors
- ❌ Test failures
- ❌ Coverage below 89% threshold

**Concise Error Messages:**
Pre-commit failures provide single-line, actionable guidance optimized for token efficiency:
- `❌ ESLint errors: Fix issues above, stage files, and commit again`
- `❌ TypeScript errors: Fix type issues above, stage files, and commit again`
- `❌ Test/coverage failure: Fix failing tests or add tests to reach 89% coverage, then commit again`
- `✅ All checks passed` on success

All checks must pass before commits are allowed, ensuring code quality at every stage. Auto-fixable formatting issues are handled automatically, but code quality issues must be resolved manually.

## Project Demonstrates

- ✅ TypeScript development with strong typing
- ✅ React hooks in a CLI context (useState, useEffect, custom hooks)
- ✅ CLI tool development with Ink
- ✅ Comprehensive test coverage with Vitest (v8 coverage)
- ✅ Modern ESLint 9 flat config
- ✅ Automated quality gates with git hooks
