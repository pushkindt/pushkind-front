# Repository Guidelines

## Project Structure & Module Organization

This Vite + React app loads through `index.tsx` with the main view logic in `App.tsx`. Reusable interface pieces live in `components/` (e.g., cart, header, modal, product card). Shared domain details stay in `types.ts` and `constants.ts`, while all network traffic is wrapped in `services/api.ts`. The static shell is `index.html`. Vite writes production bundles to `dist/`; avoid modifying generated assets. Deployment automation sits under `.github/workflows/deploy.yml`.

## Build, Test, and Development Commands

- `npm install`: Restore dependencies; run after cloning or pulling changes that touch `package.json`.
- `npm run dev`: Start the Vite dev server with hot reload at `http://localhost:5173`.
- `npm run build`: Create optimized bundles in `dist/`; execute before shipping config or API changes.
- `npm run preview`: Serve the latest build locally for production-like smoke checks.

## Formatting & Linting

Run `npx eslint .` and `npx prettier --write .` after every change to keep linting and formatting consistent.

## Coding Style & Naming Conventions

Use TypeScript with React functional components and hooks. Match the existing four-space indentation, single-quote imports, and PascalCase component names. Keep props and helper functions camelCased, and centralize shared types in `types.ts` instead of redefining inline interfaces. Prefer clear, composable functions over large effect handlers, and separate view logic from API calls by expanding `services/api.ts` when new endpoints appear.

### React Craftsmanship Principles

- Build components that are small, pure, focused, and predictable.
- Keep local state minimal and lift it only when data or behavior must be shared.
- Favor the unidirectional dataflow mantra: data flows down, events flow up.
- Treat hooks as logic primitives—compose them rather than embedding imperative branches in JSX.
- Avoid excessive prop drilling; reach for context sparingly and only when state must be global.
- Memoize only when a profiling signal shows a real benefit.
- Reserve `useEffect` for genuine side effects and keep them tidy.
- Co-locate files with their components, colocate tests, and treat JSX as declarative templates (no complex logic inline).
- Prefer composition over configuration, and rely on TypeScript for type-safety throughout the tree.
- Embrace server-driven UI for data fetching when it improves performance, and wrap complex flows with declarative state machines.
- Always design for accessibility (a11y), think in UI states, and add behavior-focused tests instead of implementation tests.
- Use error boundaries, Suspense, and consistent CSS modules scoped to the component boundary for resilience.
- Document every exported symbol with docstrings or meaningful comments so future contributors understand intent instantly.

## Testing Guidelines

Automated tests are not yet configured. When adding coverage, align with the Vite ecosystem by introducing Vitest plus React Testing Library. Place specs alongside source files using the `ComponentName.test.tsx` pattern and include both success and error-path assertions for `services/api.ts`. Until a dedicated test script exists, run `npm run build` as the minimum regression check before opening a pull request.

## Commit & Pull Request Guidelines

History mixes plain imperative subjects (`Update deploy.yml`) with prefix-style commits (`feat:`). Favor concise imperative verbs (`Add cart quantity reducer`) and add a short body when intent needs explanation. Reference issue IDs or task links when available. Pull requests should summarize intent, list user-facing changes, attach before/after screenshots for UI updates, and note any new env variables or scripts. Request review from a teammate before merging.

## Security & Configuration Tips

Store secrets in `.env.local`; never commit the file. The app expects `GEMINI_API_KEY`, so document additional variables in an `.env.example` diff when needed. When debugging, go through `services/api.ts` rather than bypassing request helpers, and rotate keys if they appear in logs or screenshots.
