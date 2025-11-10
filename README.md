# Pushkind Frontend

Pushkind Frontend is the client-facing storefront for the Pushkind Orders platform. It enables customers to browse hubs, categories, and curated product catalogs, authenticate with a one-time password (OTP) sent by SMS, and submit orders to the Pushkind backend.

## Table of Contents
- [Project Goals](#project-goals)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Environment Configuration](#environment-configuration)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Project Goals
- Provide a seamless, mobile-friendly storefront experience for Pushkind hubs.
- Allow authenticated customers to discover products by category and tag, manage a cart, and place orders.
- Integrate with the Pushkind Orders API while encapsulating network calls and shared types for maintainability.
- Serve as a reference implementation for future Pushkind storefront experiences.

## Key Features
- **OTP-based authentication:** Customers enter their phone number and confirm access via SMS to unlock ordering.
- **Product browsing:** Categories, tags, and hub metadata help customers find the right products quickly.
- **Cart management:** Customers can add items, adjust quantities, and review totals before checkout.
- **Order submission:** Authenticated users can submit cart contents directly to the Pushkind Orders API.
- **Toast notifications:** Global toasts inform customers about successful actions and errors.

## Technology Stack
- **Framework:** [React 19](https://react.dev/) with functional components and hooks.
- **Build tooling:** [Vite 7](https://vitejs.dev/) for fast local development and optimized builds.
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) for static typing and developer tooling.
- **Linting & Formatting:** ESLint, TypeScript ESLint, and Prettier configured via `eslint.config.ts` and repository guidelines.
- **State management:** Local component state and hooks; shared domain types live in `types.ts`.

## Application Architecture
- **Entry point:** `index.tsx` mounts the root React tree into `index.html` using Vite's hydration pipeline.
- **Root composition:** `App.tsx` orchestrates layout, routing between storefront states, and manages providers and global UI scaffolding.
- **UI components:** Reusable UI pieces reside in `components/`, including cart, header, modal, and product card implementations.
- **Domain constants & types:** `constants.ts` and `types.ts` centralize shared enumerations, configuration values, and domain interfaces.
- **API integration:** `services/api.ts` wraps HTTP requests to the Pushkind Orders backend, providing typed, reusable helpers.
- **Static assets:** The `public/` directory hosts favicon, manifest, and static images served without bundling.

## Environment Configuration
1. Copy `.env.example` to `.env.local`.
2. Set `VITE_HUB_ID` to the identifier for the Pushkind hub you are targeting.
3. Set `VITE_API_URL` to the base URL of the Pushkind Orders API instance.
4. Provide any additional Vite environment variables required by your deployment (all `VITE_` prefixed variables are exposed to the client).

## Getting Started
### Prerequisites
- Node.js 20.x (matching the version defined in `.nvmrc` if present).
- npm 10.x (bundled with Node.js 20).

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
The Vite dev server runs at [http://localhost:5173](http://localhost:5173) with hot module replacement (HMR).

## Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite development server with HMR and source maps. |
| `npm run build` | Generates an optimized production build in the `dist/` directory. |
| `npm run preview` | Serves the latest build locally to simulate production behavior. |

## Project Structure
```
.
├── App.tsx               # Root component rendering the storefront experience
├── components/           # Reusable UI components (cart, header, modals, product cards, icons)
├── constants.ts          # Static domain constants and configuration helpers
├── services/api.ts       # API wrapper functions that communicate with Pushkind Orders
├── types.ts              # Shared TypeScript interfaces and type definitions
├── public/               # Static assets served as-is (favicon, manifest, images)
├── index.tsx             # React entry point bootstrapping the app
├── index.html            # Static HTML shell used by Vite
├── vite.config.ts        # Vite build and dev server configuration
└── tsconfig.json         # TypeScript compiler configuration
```

## Development Workflow
1. Create a feature branch from the latest `main`.
2. Make changes following the coding standards in `AGENTS.md` (four-space indentation, camelCase helpers, etc.).
3. Run linting and formatting before committing:
   ```bash
   npx eslint .
   npx prettier --write .
   ```
4. Run a production build to catch regressions:
   ```bash
   npm run build
   ```
5. Commit using a concise, imperative subject line and open a pull request summarizing user-facing changes.

## Deployment Notes
- Vite outputs built assets into the `dist/` directory; deploy its contents to your static hosting provider.
- Ensure environment variables are defined at build time (e.g., `VITE_API_URL`, `VITE_HUB_ID`).
- The application relies on the Pushkind Orders API for dynamic data; verify network access from the hosting environment.

## Troubleshooting
- **Environment variable issues:** Confirm `.env.local` is loaded and variables use the `VITE_` prefix.
- **API connectivity problems:** Check `services/api.ts` for request helpers and inspect browser network logs for failures.
- **Build failures:** Run `npm install` to ensure dependencies match `package-lock.json`, then re-run `npm run build`.

## Contributing
- Follow the repository's commit guidelines (concise, imperative messages; reference issues when applicable).
- Include screenshots for UI changes when opening PRs.
- Coordinate reviews with teammates and ensure CI (if configured) is green before merging.

