# Task Completion Checklist

When completing a task, the following checks are automatically enforced by the pre-commit hook:

## Automatic Checks (Pre-commit Hook)
The pre-commit hook runs 4 checks in sequence:

1. **lint-staged** - Auto-fixes ESLint and Prettier issues on staged files
   - Runs `eslint --fix` on `.ts` and `.tsx` files
   - Runs `prettier --write` on all staged files

2. **Type Checking** - Validates TypeScript types
   - Command: `npm run typecheck`
   - Must pass with zero type errors

3. **Build Verification** - Ensures compilation succeeds
   - Command: `npm run build`
   - Must complete without errors

4. **Test Coverage** - Runs tests with 89% coverage threshold
   - Command: `npm run test:coverage`
   - Enforces 89% coverage for lines, functions, branches, and statements

## Commit Message Format (commit-msg hook)
Must use conventional commits format:
- Format: `type: subject` or `type(scope): subject`
- Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

Examples:
- ✅ `feat: add transcript parser`
- ✅ `fix: resolve type error in analyzer`
- ✅ `test: add coverage for Header component`
- ❌ `Add new feature` (missing type prefix)

## Failure Scenarios
If any check fails, you'll see a concise error message:
- `❌ ESLint errors: Fix issues above, stage files, and commit again`
- `❌ TypeScript errors: Fix type issues above, stage files, and commit again`
- `❌ Build failed: Fix compilation errors above, stage files, and commit again`
- `❌ Test/coverage failure: Fix failing tests or add tests to reach 89% coverage, then commit again`
- `❌ Commit message invalid: Use conventional commits format (type: subject)`

## Manual Checks Before Committing
1. Ensure all new code has corresponding tests
2. Check that tests pass: `npm test`
3. Verify types are correct: `npm run typecheck`
4. Format code if needed: `npm run format`
5. Fix any linting issues: `npm run lint:fix`

## Success Message
- `✅ All checks passed` - Commit allowed

All checks must pass before commits are allowed, ensuring code quality at every stage.
