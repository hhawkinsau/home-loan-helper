# Home Loan Helper

A modern web app to help people compare and understand home loans, built with React, TypeScript, Vite, and Chakra UI.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Linting & Formatting](#linting--formatting)
- [Testing](#testing)
- [Storybook](#storybook)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started


### Prerequisites

- Node.js (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)

### Installation (Monorepo)

1. **Clone the repository**
  ```bash
  git clone https://github.com/hhawkinsau/home-loan-helper.git
  cd home-loan-helper
  ```

2. **Install dependencies (all packages)**
  ```bash
  pnpm install
  ```

3. **Start the frontend development server**
  ```bash
  pnpm --filter web dev
  ```
  The app will run at [http://localhost:5173](http://localhost:5173).

---

## Tech Stack

- **Frontend:** [React](https://reactjs.org/) (with [TypeScript](https://www.typescriptlang.org/))
- **Bundler:** [Vite](https://vitejs.dev/)
- **UI:** [Chakra UI](https://chakra-ui.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charting:** [Recharts](https://recharts.org/) (or [Victory](https://formidable.com/open-source/victory/), TBD)
- **Testing:** [Playwright](https://playwright.dev/) (end-to-end), [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) (unit)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)
- **Component Documentation:** [Storybook](https://storybook.js.org/)

---

## Project Structure


```
home-loan-helper/
├── packages/
│   ├── web/              # Frontend React app (was root)
│   └── api/              # (Planned) Backend API (Node.js, Fastify, etc.)
├── pnpm-workspace.yaml   # pnpm workspace config
├── pnpm-lock.yaml        # pnpm lockfile
├── .vscode/              # VS Code tasks/settings
├── .github/              # GitHub workflows, Copilot instructions
└── README.md
```

---

## Scripts


Common `pnpm` scripts (run from repo root):

| Script                                 | Description                                       |
|----------------------------------------|---------------------------------------------------|
| `pnpm --filter web dev`                | Start Vite development server (frontend)           |
| `pnpm --filter web build`              | Build the frontend app for production              |
| `pnpm --filter web preview`            | Preview the frontend production build locally      |
| `pnpm --filter web storybook`          | Launch Storybook for component development        |
| `pnpm --filter web build-storybook`    | Build static Storybook site                       |
| `pnpm --filter web test`               | Run Playwright tests (frontend)                    |
| `pnpm --filter web lint`               | Run ESLint (frontend)                              |
| `pnpm --filter web format`             | Format code with Prettier (frontend)               |

---

## Linting & Formatting

- **ESLint** is configured for both JavaScript and TypeScript, with React rules and type-aware checks.
  - To lint:  
    ```bash
    npm run lint
    ```
- **Prettier** is used for code formatting.
  - To format:  
    ```bash
    npm run format
    ```

---

## Testing

- **Playwright** is set up for end-to-end testing.
  - Results (e.g., `.last-run.json`) are stored in `test-results/` (excluded from git).
- For unit/component tests, use [@testing-library/react](https://testing-library.com/).


To run all frontend tests:
```bash
pnpm --filter web test
```

---

## Storybook

Storybook provides an isolated environment to develop, test, and document UI components.

- To start Storybook:
  ```bash
  pnpm --filter web storybook
  ```
- To build static Storybook:
  ```bash
  pnpm --filter web build-storybook
  ```

You can preview and interact with all components and their states in Storybook.

---

## Contributing

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Ensure linting and tests pass:
   ```bash
  pnpm --filter web lint
  pnpm --filter web test
   ```
4. Submit a pull request

---

## License

[MIT](./LICENSE)

---

## TODO

- [ ] Implement main app UI
- [ ] Add initial home loan comparison logic
- [ ] Add charts and visualizations
- [ ] Write tests for core features
- [ ] Expand documentation

---