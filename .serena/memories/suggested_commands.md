# Suggested Commands

## Development Commands

### Running the Application
```bash
npm run dev              # Run CLI with hot reload (uses tsx)
npm run build            # Compile TypeScript to dist/
```

### Testing
```bash
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run with coverage (89% threshold enforced)
npx vitest src/__tests__/App.test.tsx  # Run single test file
```

### Type Checking
```bash
npm run typecheck        # Type check without building
```

### Linting
```bash
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
```

### Formatting
```bash
npm run format           # Format all code with Prettier
npm run format:check     # Check if code is formatted
```

## Git Operations
```bash
git status               # Check repository status
git add <files>          # Stage specific files
git commit -m "type: message"  # Commit with conventional format
git log --oneline        # View commit history
git diff                 # See unstaged changes
git diff --staged        # See staged changes
```

## macOS (Darwin) Utility Commands
```bash
ls -la                   # List all files with details
pwd                      # Print working directory
find . -name "*.tsx"     # Find TypeScript React files
grep -r "pattern" src/   # Search for pattern in src directory
cat file.txt             # Display file contents
```

## Package Management
```bash
npm install              # Install dependencies
npm install <package>    # Install new package
npm install -D <package> # Install dev dependency
npm update               # Update dependencies
```

## Project Initialization
```bash
npm run prepare          # Initialize Husky git hooks
```
