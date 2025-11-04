# Repository Guidelines

## Project Structure & Module Organization

This Vite + React app loads through `index.tsx` with the main view logic in `App.tsx`. Reusable interface pieces live in `components/` (e.g., cart, header, modal, product card). Shared domain details stay in `types.ts` and `constants.ts`, while all network traffic is wrapped in `services/api.ts`. The static shell is `index.html`. Vite writes production bundles to `dist/`; avoid modifying generated assets. Deployment automation sits under `.github/workflows/deploy.yml`.

## Build, Test, and Development Commands

- `npm install`: Restore dependencies; run after cloning or pulling changes that touch `package.json`.
- `npm run dev`: Start the Vite dev server with hot reload at `http://localhost:5173`.
- `npm run build`: Create optimized bundles in `dist/`; execute before shipping config or API changes.
- `npm run preview`: Serve the latest build locally for production-like smoke checks.

## Coding Style & Naming Conventions

Use TypeScript with React functional components and hooks. Match the existing four-space indentation, single-quote imports, and PascalCase component names. Keep props and helper functions camelCased, and centralize shared types in `types.ts` instead of redefining inline interfaces. Prefer clear, composable functions over large effect handlers, and separate view logic from API calls by expanding `services/api.ts` when new endpoints appear.

## Testing Guidelines

Automated tests are not yet configured. When adding coverage, align with the Vite ecosystem by introducing Vitest plus React Testing Library. Place specs alongside source files using the `ComponentName.test.tsx` pattern and include both success and error-path assertions for `services/api.ts`. Until a dedicated test script exists, run `npm run build` as the minimum regression check before opening a pull request.

## Commit & Pull Request Guidelines

History mixes plain imperative subjects (`Update deploy.yml`) with prefix-style commits (`feat:`). Favor concise imperative verbs (`Add cart quantity reducer`) and add a short body when intent needs explanation. Reference issue IDs or task links when available. Pull requests should summarize intent, list user-facing changes, attach before/after screenshots for UI updates, and note any new env variables or scripts. Request review from a teammate before merging.

## Security & Configuration Tips

Store secrets in `.env.local`; never commit the file. The app expects `GEMINI_API_KEY`, so document additional variables in an `.env.example` diff when needed. When debugging, go through `services/api.ts` rather than bypassing request helpers, and rotate keys if they appear in logs or screenshots.
