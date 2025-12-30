# Pushkind Storefront (Frontend) — Specification

## Summary

This repository is a Vite + React storefront UI for browsing a hub-scoped product catalog, managing a cart, authenticating via SMS OTP, and creating/viewing/updating orders through the Pushkind Orders backend API.

Key characteristics:

- Single-page app rendered via `index.html` + `index.tsx`.
- Client-side routing (React Router) with a single app shell (`App.tsx`) that switches views based on URL.
- Session-based auth (cookies) + OTP login; authenticated user is cached in `localStorage`.
- Cart is in-memory (React context), with checkout creating an order via the API.

## Goals

- Provide a fast, mobile-friendly browsing experience (home/category/tag/product views).
- Allow customers to add products to a cart, adjust quantities, and submit orders.
- Support OTP login flow and “My Orders” history for authenticated customers.
- Keep network access centralized in `services/api.ts` with shared types in `types.ts`.

## Non-goals

- Admin/catalog management UI.
- Payment processing (checkout creates an order; no payment capture in this app).
- Multi-hub switching within the UI (hub is configured at build-time via env).
- Persistent cart across reloads (currently not implemented).

## Invariants (contractual behaviors)

These invariants are part of product semantics. Changes to them are considered breaking UX/auth behavior and must be intentional.

- **Hub is build-time fixed.** The active hub is determined by `VITE_HUB_ID` and must not be user-switchable at runtime.
- **Cookie session is authoritative.** `localStorage` user caching is a UI optimization only; the backend session (cookie) determines whether a user is authenticated.
- **Session refresh wins over cache.** On startup the app may optimistically show a cached user, but once `GET /auth/session` resolves, its result must overwrite the cached user (set + persist on success, clear on unauthenticated).
- **Session refresh failure deauths.** If the app cannot confirm the current session (`fetchCurrentUser()` returns `null`, including network/parse failures), user state becomes unauthenticated and `USER_STORAGE_KEY` is cleared.
- **All API calls include credentials.** Every backend request must use `fetch(..., { credentials: 'include' })` so cookie sessions work reliably.
- **Order success clears the cart.** After a successful `createOrder(...)`, the cart must be empty.
- **Orders view is auth-gated.** When `user` is `null`, the Orders view must show a login prompt and must not call `GET /orders`.

## Runtime entrypoints

- `index.html`
  - Static shell (language `ru`, title “Витрина”).
  - Loads Tailwind via CDN (`https://cdn.tailwindcss.com`).
  - Mount point: `<div id="root"></div>`.
  - Loads the app module: `/index.tsx`.
- `index.tsx`
  - Mounts React, wraps in:
    - `ErrorBoundary` (render-time crash fallback)
    - `React.Suspense` (global “Загрузка...” screen)
    - `BrowserRouter`
    - `CartProvider`
  - Renders `routes/index.tsx` (`AppRoutes`).

## Routing & navigation

### Route map

Defined in `routes/index.tsx`:

- `/orders` → `<App />`
- `/*` → `<App />` (all other routes also render the same app shell)

Within `App.tsx`, the actual rendered view is derived from the current URL via `hooks/useViewNavigation.ts`:

- `/` → `View: { type: 'home' }`
- `/categories/:categoryId` → `View: { type: 'category', categoryId, categoryName }`
- `/tags/:tagId` → `View: { type: 'tag', tagId, tagName }`
- `/products/:productId` → `View: { type: 'product', productId }`
- `/orders` → `View: { type: 'orders' }`

Notes:

- `categoryName` / `tagName` are passed through `location.state` on navigation (used as a title fallback if metadata is not yet loaded).
- The `search` query param is preserved across navigation so filters persist when switching views.

### Search query

- Search state is stored in the URL query param `search`.
- `App.tsx` keeps an input state (`searchInput`) and updates the URL after a debounce (300ms via `hooks/useDebouncedValue.ts`).
- When `search` is active (non-empty), category/tag filter sections are hidden to focus on results.

### Layout preference

- Product list layout is toggled between `'grid'` and `'list'`.
- Persisted in `localStorage` under `PRODUCT_LAYOUT_STORAGE_KEY` (`pushkind-product-layout`).

## UI composition

### Global shell

`App.tsx` composes:

- Header (`components/Header.tsx`)
  - Brand (“Витрина”) → navigates home
  - Login button (“Войти” / “Привет, {name}”) → opens OTP modal
  - Cart button → opens cart drawer
  - “Мои заказы” link shows only when `user` exists
- Layout frame (`components/Layout.tsx`)
  - Container + padding + background
- Overlays
  - Login modal (`components/LoginModal.tsx`)
  - Cart drawer (`components/Cart.tsx`)
  - Toasts (`components/ToastContainer.tsx`)

### Views

- `views/HomeView.tsx`
  - Shows category tiles + tag filter chips (hidden while searching)
  - Renders product list via `components/ProductCard.tsx` in selected layout
- `views/CategoryView.tsx`
  - Shows nested categories (children of current category) when available and not searching
  - Renders filtered products
- `views/TagView.tsx`
  - Renders products filtered by tag
- `views/ProductView.tsx`
  - Product detail: image gallery, description (sanitized), SKU/units, price, add-to-cart CTA
  - Image gallery supports:
    - Prev/Next buttons when multiple images
    - Thumbnail strip selection
- `views/OrdersView.tsx`
  - If not authenticated: prompts user to log in.
  - If authenticated:
    - Loads orders (sorted newest-first).
    - Expands/collapses order line items.
    - Allows editing of optional fields (shipping address, consignee, delivery notes, payer) and persists via API `PATCH`.

### Product cards

`components/ProductCard.tsx` supports grid and list layout:

- Clicking name/image navigates to `/products/:id`.
- “Добавить в корзину” uses cart context and a transient UI feedback state.
- Tag badges are currently hard-coded by tag IDs:
  - Tag `id=1` → “Новинка”
  - Tag `id=2` → “Скидка”

### Cart & checkout

`components/Cart.tsx` is a slide-over drawer:

- In-memory cart state from `contexts/CartContext.tsx`.
- Quantity controls (`+` / `-`), remove item, subtotal display.
- Checkout behavior:
  - If not logged in: shows toast + opens login modal.
  - If logged in and cart has items: submits `POST /orders` (hub-scoped).
  - On success:
    - Clears cart
    - Shows toast with order id when available
    - Closes cart and navigates to orders (if callback provided)

## State management & persistence

### User session

- The backend session is cookie-based (`fetch(..., { credentials: 'include' })`).
- On app start, `App.tsx`:
  - Loads cached user from `localStorage` (`USER_STORAGE_KEY` = `pushkind-user`).
  - Calls `fetchCurrentUser()` to confirm/refresh session.
  - Updates local state + cache accordingly.
- Successful OTP verification sets the user and caches it in `localStorage`.

#### Auth authority rule

- `localStorage` is **never** treated as proof of auth; it is used only to reduce UI flicker while the authoritative cookie session is checked.
- If `localStorage` and the cookie session disagree, the cookie session result wins and `localStorage` must be updated to match.

### Cart

- Stored in React context (`contexts/CartContext.tsx`).
- Not persisted to `localStorage` (cart resets on refresh).
- Derived values:
  - `itemCount`: sum of quantities
  - `subtotalCents`: sum of `priceCents * quantity` for priced items
- When a user logs in, cart prices are refreshed by refetching each product (`fetchProductById`) to pick up user-specific pricing.

### UI feedback

- `hooks/useTransientFlag.ts` provides short-lived boolean state used for add-to-cart animations/feedback.
- `services/toast.ts` provides a small pub/sub notification system; `ToastContainer` renders messages.

## Data model (TypeScript)

Defined in `types.ts`:

- `Category`: `id`, `parentId`, `name`, `description?`, `imageUrl?`
- `Tag`: `id`, `name`
- `Product`:
  - `id`, `categoryId?`, `name`
  - `sku?`, `description`, `units?`, `amount?`
  - `currency`, `priceCents?`
  - `tags: Tag[]`, `imageUrls: string[]`
- `User`: `id`, `hub_id`, `name`, `email?`, `phone`
- `Order`:
  - `id`, `status`, `currency`, `totalCents`, `createdAt`
  - `products: OrderLineItem[]`
  - `shippingAddress?`, `consignee?`, `deliveryNotes?`, `payer?`

## Backend API contract (client expectations)

All API calls are hub-scoped and built as:

`{API_URL (without trailing slash)}/{VITE_HUB_ID}{path}`

All requests:

- Send `Accept: application/json`
- Use `credentials: 'include'` (session cookies)

### Minimum status/shape expectations

The frontend treats these as the minimum contract. When backend behavior differs, UI behavior may degrade to generic error states.

- `GET /auth/session`
  - `200` + JSON payload containing either `{ customer: ... }` or the user fields at the top level → authenticated.
  - `401` → unauthenticated (`null`).
  - Any other non-2xx or invalid JSON → treated as unauthenticated (see “Session refresh failure deauths” invariant).
- `GET /products/:id`
  - `404` → product not found (`undefined`), UI renders “Товар не найден.”
  - Other non-2xx → treated as an error; UI may fall back to “not found” presentation depending on caller state.
- OTP endpoints (`POST /auth/otp`, `POST /auth/otp/verify`)
  - Non-2xx → treated as failure (`success: false`).
  - Wrong OTP, throttling, or validation failures are not distinguished in UI today; failures surface as generic inline error plus an error toast.
- Orders endpoints (`GET /orders`, `PATCH /orders/:id`, `POST /orders`)
  - Non-2xx → treated as failure.
  - `POST /orders` success may return JSON with `{ id }`; if absent/non-JSON, UI still treats the order as created but cannot display an order id.
  - Item-level validation (e.g., partial availability) is not handled client-side; the response is treated as all-or-nothing success/failure.

Endpoints used by `services/api.ts`:

- `GET /categories?parentId={id?}` → `Category[]`
- `GET /tags` → `Tag[]`
- `GET /products?categoryId?&tagId?&search?` → `Product[]`
- `GET /products/:id` → `Product` (404 → “not found”)
- `GET /auth/session` → current user payload
  - Expected payload shape supports either:
    - `{ customer: { id, hub_id, name, email, phone } }`, or
    - `{ id, hub_id, name, email, phone }`
- `POST /auth/otp` body `{ phone }` → `{ success: boolean }`
- `POST /auth/otp/verify` body `{ phone, otp }` → `{ success: boolean, customer?: {...} }`
- `GET /orders` → `Order[]`
- `PATCH /orders/:id` body `{ shippingAddress?, consignee?, deliveryNotes?, payer? }` → `Order`
- `POST /orders` body `[{ productId, quantity }, ...]` → success response (may optionally include JSON `{ id: number }`)

### Error handling behavior

This section is contractual: it describes what callers can rely on from `services/api.ts`.

- **Catalog reads are fail-soft.** `fetchCategories`, `fetchTags`, `fetchProducts` return an empty array on failure and show an error toast (best-effort).
- **Product detail is fail-soft.** `fetchProductById` returns `undefined` for `404` and returns `undefined` on other failures; an error toast is shown (best-effort).
- **Session check is fail-soft but deauths.** `fetchCurrentUser` returns `null` for `401` and returns `null` on other failures; an error toast is shown (best-effort). Callers must treat `null` as unauthenticated.
- **OTP calls are fail-soft.** `sendOtp` and `verifyOtp` return `{ success: false }` on any failure; an error toast is shown (best-effort). UI additionally renders inline form errors.
- **Orders are fail-loud.** `fetchOrders` and `updateOrderDetails` throw on failure so the Orders UI can render explicit error states; an error toast is also shown (best-effort).
- **Create order is fail-soft.** `createOrder` returns `{ success: false }` on failure and shows an error toast (best-effort).

#### Retry semantics (UI-level)

The app does not implement a unified retry framework, but these rules guide behavior:

- Network errors and `5xx` responses are considered retryable by the user (reload, re-open view, repeat action).
- `4xx` responses are treated as non-retryable in UI, except:
  - `401` on `GET /auth/session` is an expected unauthenticated state.
  - `404` on `GET /products/:id` maps to “not found”.
- Toasts are **best-effort** UI feedback; they are not the only error channel. Callers must still render appropriate empty/error states where relevant (e.g., Orders view).

## Security considerations

- Product descriptions are rendered as HTML in `ProductView` and are sanitized first.
  - `utils/sanitizeHtml.ts` removes forbidden tags (`script`, `style`, `iframe`, etc.) and strips `on*` attributes and `javascript:` URLs.
  - This is a best-effort client-side sanitization; server-side sanitization should still be the primary defense.

## Configuration

### Required environment variables

Validated in `constants.ts` at startup (throws if missing):

- `VITE_HUB_ID` (string/number-like identifier used in URL path)
- `VITE_API_URL` (base store API URL, e.g. `https://orders.pushkind.com/api/v1/store/`)

Local examples:

- `.env.example` contains placeholders.
- `.env` (committed in this repo) contains local dev defaults; prefer `.env.local` for developer-specific overrides.

### Vite dev server

Configured in `vite.config.ts`:

- `host: '0.0.0.0'`
- `port: 3000`
- `allowedHosts: ['app3.test.me']`
- Path alias: `@` → repository root

## Build & deployment

- Build output is generated into `dist/` by `npm run build`.
- GitHub Actions workflow `./.github/workflows/deploy.yml`:
  - Builds on pushes to `main`.
  - Creates a `.env` during CI with `VITE_API_URL` and `VITE_HUB_ID`.
  - Deploys `dist/` via `rsync` to `cicd@store.pushkind.com:/var/www/html/`.

## Testing & quality checks

- Tests run with Vitest (`npm run test`), configured in `vite.config.ts` and `vitest.setup.ts`.
- Lint: `npm run lint`
- Format: `npm run format`

## Known limitations / follow-ups

- Cart is not persisted across page reloads.
- Tag badge logic relies on hard-coded tag IDs (`1` and `2`).
- `useCatalogData` fetches tags for home/category/tag views on every change; no caching layer is implemented beyond component state.
