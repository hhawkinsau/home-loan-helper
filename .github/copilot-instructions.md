# Copilot Instructions for AI Coding Agents

## Project Overview
- **Home Loan Helper** is a modern React + TypeScript web app for comparing and understanding home loans, now structured as a pnpm monorepo.
- Uses [Vite](https://vitejs.dev/) for fast builds and HMR, [Chakra UI](https://chakra-ui.com/) for styling, and [Storybook](https://storybook.js.org/) for component development.
- Key packages: `packages/web` (frontend), `packages/api` (backend, planned). Frontend source: `packages/web/src/`.

## Build & Development (Monorepo)
- **Start frontend dev server:** `pnpm --filter web dev` (Vite, HMR at http://localhost:5173)
- **Build frontend:** `pnpm --filter web build`
- **Preview frontend build:** `pnpm --filter web preview`
- **Storybook:** `pnpm --filter web storybook` (dev), `pnpm --filter web build-storybook` (static)
- **Lint:** `pnpm --filter web lint` (ESLint, flat config, see `eslint.config.*`)
- **Format:** `pnpm --filter web format` (Prettier)
- **Test:** `pnpm --filter web test` (Playwright, E2E)

## Testing
- **E2E:** Playwright (`npx playwright test` or VS Code task)
- **Unit/component:** [@testing-library/react] (not yet fully scaffolded)
- Test results: `test-results/` (gitignored)

## Patterns & Conventions
- **Component-driven:** Build UI as small, reusable components in `packages/web/src/components/`, compose in `packages/web/src/pages/`.
- **Storybook stories:** In `packages/web/src/stories/`, use `.stories.ts(x)` for each component. Stories use `@storybook/react-vite` and can include interaction tests.
- **TypeScript strictness:** Strict mode enabled, type errors are build-blocking.
- **Chakra UI:** Theme customizations go in `packages/web/src/theme/`. Use Chakra components for layout and styling.
- **Forms:** Use `react-hook-form` + `zod` for validation.
- **Charts:** Use `recharts` (or `victory`, TBD) for data visualization.
- **Backend:** (Planned) All logic is client-side for now; backend will be in `packages/api`.

## Integration Points
- **No API layer yet:** All data is local or mocked. (Backend will be in `packages/api`.)
- **Static assets:** In `packages/web/public/` and `packages/web/src/assets/`.
- **Storybook Addons:** Docs, a11y, onboarding, vitest, chromatic (see `.storybook/main.ts`).

## Project-Specific Notes
- **ESLint:** Uses both JS and TS flat configs, with Storybook and React plugin rules.
- **TypeScript:** Multiple `tsconfig.*.json` for app/node separation, now in `packages/web/`.
- **Testing:** Playwright is set up, but unit test infra is minimal.
- **Contribute:** Run lint and test before PRs. See `README.md` for workflow.

## Examples
- See `packages/web/src/stories/Button.stories.ts` for Storybook/interaction test pattern.
- See `packages/web/src/components/` for reusable UI structure (if present).

---
For more, see `README.md`, `.storybook/`, and `package.json` scripts.
