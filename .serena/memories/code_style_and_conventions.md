# Code Style and Conventions

## TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext (bundler resolution)
- **Strict mode**: Enabled
- **JSX**: React (with React.createElement)
- **Root directory**: `./src`
- **Output directory**: `./dist`
- Tests excluded from compilation

## Component Patterns
- All components export as **named exports** with explicit types: `export const Foo: React.FC`
- Use `.js` extension in imports even for `.tsx` files (ESM requirement)
- Components use standard React hooks (useState, useEffect, custom hooks)
- React in JSX scope not required (modern React, rule disabled)

## Naming Conventions
- Components: PascalCase (e.g., `Header`, `App`)
- Files: PascalCase for components (e.g., `App.tsx`, `Header.tsx`)
- Unused variables: Prefix with `_` to avoid ESLint errors

## Prettier Configuration
- **Semicolons**: Required
- **Quotes**: Single quotes
- **Trailing commas**: ES5 style
- **Print width**: 100 characters
- **Tab width**: 2 spaces (no tabs)
- **Arrow parens**: Avoid when possible
- **Line endings**: LF

## ESLint Rules
- TypeScript recommended rules enabled
- React recommended rules enabled
- React Hooks rules enforced
- Unused imports flagged as errors
- `react/react-in-jsx-scope` disabled (not needed with modern React)
- Unused variables with `_` prefix allowed

## Testing Patterns
- Use `render()` from `ink-testing-library`
- Check output with `lastFrame()`
- Use **real timeouts** for async behavior, NOT `vi.useFakeTimers()` (Ink doesn't work well with fake timers)
- Example:
  ```typescript
  it('updates after delay', async () => {
    const { lastFrame } = render(<App />);
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(lastFrame()).toContain('updated text');
  });
  ```

## File Organization
```
src/
├── cli.tsx              # Entry point - renders <App /> to terminal
├── App.tsx              # Root component with state/effects
├── components/          # Reusable UI components
│   └── Header.tsx
└── __tests__/          # Vitest tests
    └── App.test.tsx
```

## Import Conventions
- Always use `.js` extension in imports (even for `.tsx` files)
- Example: `import { Header } from './components/Header.js'`
