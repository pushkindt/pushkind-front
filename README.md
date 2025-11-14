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
- **OTP-based authentication:** Customers enter their phone number and confirm access via SMS to unlock ordering. The flow is split into two guided steps inside `LoginModal` with input masking, optimistic feedback, and error messaging.
- **Rich catalog discovery:** `HomeView`, `CategoryView`, and `TagView` expose curated sections, image-led hero cards, and quick tag filters so shoppers can jump between curated slices of inventory.
- **Detailed product sheets:** `ProductView` showcases image galleries with keyboard-accessible pagination, unit-price callouts, SKU metadata, and contextual category breadcrumbs.
- **Cart management:** Customers can add items from any layout, adjust quantities inline, inspect totals, and remove entries. A transient feedback hook (`useTransientFlag`) reinforces add-to-cart actions.
- **Order readiness:** Authenticated users can initiate checkout from the drawer, while guests are prompted to log in before confirming purchases.
- **Global toast notifications:** `ToastContainer` listens to the lightweight toast service and surfaces success/error events from API helpers anywhere in the app.
- **Responsive, accessible UI:** Tailwind utility classes, focus styles, and semantic markup maintain parity across mobile/desktop breakpoints.
- **Type-safe data layer:** Shared interfaces live in `types.ts` and every service call is wrapped with fetch helpers plus defensive fallbacks.

## Technology Stack
- **Framework:** [React 19](https://react.dev/) with functional components and hooks.
- **Build tooling:** [Vite 7](https://vitejs.dev/) for fast local development and optimized builds.
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) for static typing and developer tooling.
- **Linting & Formatting:** ESLint, TypeScript ESLint, and Prettier configured via `eslint.config.ts` and repository guidelines.
- **State management:** Local component state and hooks; shared domain types live in `types.ts`.

## Application Architecture
- **Entry point:** `index.tsx` boots the React tree, wires `BrowserRouter`, and hydrates the cart context before handing off to `AppRoutes`.
- **Navigation & state:** `useViewNavigation` reads the current URL and distills it into a `View` union so `App.tsx` can render the correct screen without brittle route logic.
- **Data fetching hooks:** `useCatalogData` and `useProductDetail` manage server requests, loading states, and error boundaries per view, keeping components pure and focused.
- **UI components:** Layout primitives (`Layout`, `Header`, `Cart`, `Modal`, `ToastContainer`) encapsulate visual structure, while `ProductCard` powers both grid and list presentations.
- **Domain constants & types:** `constants.ts` validates environment variables during startup, and `types.ts` centralizes contracts for categories, tags, products, users, cart items, and layout variants.
- **API integration:** `services/api.ts` collects every HTTP call, adds query composition helpers, normalizes phone numbers, and surfaces toast-based error feedback.
- **Cross-cutting services:** `services/toast.ts` exposes a simple publish/subscribe pattern used by network helpers and UI components to show transient notifications.
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
The Vite dev server runs at [http://localhost:5173](http://localhost:5173) with hot module replacement (HMR). Start it together with the Pushkind Orders API (or mocked endpoints) so catalog and auth requests succeed locally.

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
├── contexts/             # React context providers (Cart state lives here)
├── hooks/                # Focused hooks for navigation, catalog data, product detail, and UI feedback
├── services/             # API + toast utilities with matching tests
├── utils/                # Pure formatting helpers shared across components
├── views/                # Route-level UI slices (home, category, tag, product)
├── constants.ts          # Static domain constants and configuration helpers
├── types.ts              # Shared TypeScript interfaces and type definitions
├── public/               # Static assets served as-is (favicon, manifest, images)
├── index.tsx             # React entry point bootstrapping the app
├── index.html            # Static HTML shell used by Vite
├── vite.config.ts        # Vite build and dev server configuration
└── tsconfig.json         # TypeScript compiler configuration
```

## Experience Flow
1. **Landing / Home view:** Visitors see featured categories, curated tag filters, and the latest products. Adding to cart is instant thanks to the shared context.
2. **Category view:** Selecting a category narrows the catalog and updates the hero ribbon while preserving layout preferences.
3. **Tag view:** Tag filters highlight cross-category collections such as promotions or seasonal offerings.
4. **Product view:** Customers drill into detailed descriptions, rotate through image galleries, and initiate purchases via the CTA.
5. **Authentication:** The OTP modal captures a phone number, sends a verification code, and hydrates the user profile upon success.
6. **Cart & checkout:** The cart drawer summarizes selections, enforces login before checkout, and surfaces totals along with messaging.

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
- **Environment variable issues:** Confirm `.env.local` is loaded, variables use the `VITE_` prefix, and `constants.ts` validation passes on boot.
- **API connectivity problems:** Check `services/api.ts` for request helpers, inspect browser network logs, and confirm the configured hub has published data.
- **Authentication glitches:** Use a known-good phone number in staging, and inspect server responses for OTP throttling errors.
- **Build failures:** Run `npm install` to ensure dependencies match `package-lock.json`, then re-run `npm run build`.

## Contributing
- Follow the repository's commit guidelines (concise, imperative messages; reference issues when applicable).
- Include screenshots for UI changes when opening PRs.
- Coordinate reviews with teammates and ensure CI (if configured) is green before merging.

