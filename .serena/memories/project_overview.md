# Project Overview

## Purpose
ClaudeTranscriptAnalyzer is an interactive CLI tool for analyzing Claude conversation transcripts to identify optimization opportunities. The tool suggests improvements such as:
- Model Context Protocol (MCP) integrations
- Custom skills
- Claude hooks
- Git hooks
- Workflow optimizations

## Tech Stack
This project uses the same core technologies that power Anthropic's Claude Code:

### Core Technologies
- **TypeScript** (5.9.3) - Type-safe development with strict mode enabled
- **React** (19.2.4) - Component-based UI architecture
- **Ink** (6.6.0) - React renderer for interactive CLI applications (renders React components to terminal)
- **Vitest** (4.0.18) - Modern testing framework with v8 coverage provider

### Development Tools
- **ESLint 9** - Flat config format with TypeScript-aware linting
- **Prettier** (3.8.1) - Code formatting
- **Husky** (9.1.7) - Git hooks (pre-commit, commit-msg)
- **lint-staged** (16.2.7) - Run linters on staged files
- **commitlint** - Conventional commits enforcement
- **tsx** - TypeScript execution for development mode

### Key Dependencies
- `@typescript-eslint` - TypeScript ESLint integration
- `eslint-plugin-react` & `eslint-plugin-react-hooks` - React linting
- `ink-testing-library` - Testing Ink components with virtual terminal renderer
- `@vitest/coverage-v8` - Code coverage

## Architecture
- **Ink** renders React components to the terminal using React's reconciler
- Components use standard React hooks (useState, useEffect, etc.)
- Terminal UI updates reactively like a web app
- Module system: ESM (ES Modules)
- Build output: `dist/` directory
- Entry point: `dist/cli.js` (binary: `claude-analyzer`)
