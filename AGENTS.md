# AGENTS.md
## 1. Build, Lint, Test Commands
- **build**: `npm run build` – compiles the application for production.
- **lint**: `npm run lint` – runs ESLint and Prettier checks.
- **test**: `npm test` – launches Jest test runner.
- **test:single**: `npm test -- -t "<testPattern>"` – runs a single matching test.
- **watch**: `npm start` – starts the dev server with hot reload.
- **clean**: `rm -rf .webpack webpack-stats.json` – removes generated artifacts.
## 2. Detailed Command Reference
- To **build** the project, execute:
  ```bash
  npm run build
  ```
- To **lint** all files, execute:
  ```bash
  npm run lint
  ```
- To **test** the entire suite, execute:
  ```bash
  npm test
  ```
- To **test a single test** by name or regex:
  ```bash
  npm test -- -t "/my-test-pattern/"
  ```
- To **watch** files during development:
  ```bash
  npm start
  ```
- To **clean** generated artifacts:
  ```bash
  rm -rf .webpack webpack-stats.json
  ```
## 3. Code Style Guidelines
### 3.1 Import Order and Formatting
- Group imports logically:
  1. Node.js core modules
  2. Third‑party libraries
  3. Local relative paths
- Use **named imports** when possible; default imports only when required.
- Keep imports on separate lines for readability in large files.
- Sort imports alphabetically within each group.
- **Prefer** `import { Foo } from './foo'` over `import Foo from './foo'` when only one member is used.
### 3.2 TypeScript Typing
- All exported symbols must have explicit types in public APIs.
- Use `interface` for object shapes; `type` for unions or mapped types.
- Avoid `any`; use `unknown` when type is not yet known.
- Use generic constraints appropriately (`<T extends Base>`).
- Favor `readonly` for immutable references.
### 3.3 Naming Conventions
- Files: kebab-case for markdown, PascalCase for components, camelCase for utilities.
- Variables and functions: camelCase, descriptive, avoid abbreviations.
- Constants: UPPER_SNAKE_CASE for process env variables.
- Types: PascalCase for generic interfaces, CamelCase for type aliases when simple.
- Test files: append `.test` or `.spec` before module name.
### 3.4 Formatting Rules
- Use **Prettier** with default rules; enforce via Git hook.
- Indentation: 2 spaces, no tabs.
- Line length: 100 characters max; wrap beyond that.
- Braces and control statements on new lines where appropriate.
- No trailing whitespace; enforce with trim.
### 3.5 Error Handling
- Throw only `Error` subclasses or strings with clear messages.
- Use `try/catch` only when necessary; propagate errors with meaningful context.
- Reject promises with custom error objects containing `code` and `message`.
- Do not swallow errors; log them or re‑throw.
- For asynchronous functions, always return a promise; avoid missing `return`.
### 3.6 Commenting Practices
- JSDoc for public functions, classes, and interfaces.
- Describe parameters, return types, and thrown errors.
- Inline comments only for non‑obvious logic; avoid redundant statements.
- Remove commented‑out code; use Git history to recover.
### 3.7 Testing Conventions
- Test files live alongside source files with `.test.tsx` extension.
- Use `describe`, `it`, and `expect` from Jest; keep tests atomic.
- Mock external services with `jest.mock`; isolate unit under test.
- Run tests with `npm test -- -u` to update snapshots when appropriate.
- Ensure test coverage stays above 80% overall.
## 4. Git and Release Workflow
- Feature branches must be named `feat/<short-description>`.
- Hotfix branches must be named `fix/<description>`.
- Pull requests require at least one reviewer and passing CI.
- Commit messages follow Conventional Commits format.
- Tag releases using `semantic-release`; version is derived from commit messages.
- Hot releases are tagged with `patch`, `minor`, or `major` as appropriate.
## 5. Dependencies Management
- Run `npm audit` weekly to identify vulnerabilities.
- Keep dependencies up‑to‑date via `npm outdated` and `npm upgrade`.
- Do not commit `node_modules`; it is ignored via `.gitignore`.
- Update `package-lock.json` after any dependency change; commit the updated file.
## 6. Environment Variables
- Store secrets in `.env` files; do not commit them.
- Prefix environment variables with `NEXT_PUBLIC_` when exposed to client.
- Validate required env vars at startup; throw clear error if missing.
## 7. Project Structure
- `src/` – source code (TypeScript/React)
- `extension/` – Chrome extension source
- `scripts/` – automation scripts
- `tests/` – integration and e2e tests
- `docs/` – documentation, guidelines, and references
- `public/` – static assets served by webpack
## 8. Continuous Integration
- CI runs on every push and PR:
  - Linting (`npm run lint`)
  - Type checking (`npm run typecheck`)
  - Unit tests (`npm test`)
  - Build (`npm run build`)
- Failed CI blocks further merges until resolved.
## 9. Helpful Scripts
- `npm run dev` – starts development server with hot reload.
- `npm run inspect` – runs code coverage analysis.
- `npm run lint:fix` – automatically fixes lintable issues.
- `npm run clean` – removes build artifacts.
## 10. Frequently Asked Questions
- **Q:** How do I run a single test?
  **A:** `npm test -- -t "/my‑test‑pattern/"`
- **Q:** Where are environment variables defined?
  **A:** In `.env` files at project root and in `config/` directory.
- **Q:** Which formatter is used?
  **A:** Prettier with the standard config shipped in the repo.
## 11. Cursor & Copilot Rules
- Check `.cursor/rules/` or `.cursor/rules/` for project‑specific rules.
- Check `.github/copilot-instructions.md` for Copilot usage guidelines.
- Incorporate any found rules into the sections above as needed.
