# Ecommerce Admin Panel - Complete Implementation Plan

## Context

The NestJS ecommerce backend is production-ready with 91 API endpoints (42 admin-specific), full auth, Swagger docs, and 605 passing tests. The next step is building an admin dashboard to manage the store. This is a **separate repository** — a Vite + React SPA (no SSR needed for admin panels, no SEO requirement).

## Tech Stack

| Category | Library | Version |
|----------|---------|---------|
| Build | Vite | 7.x |
| Framework | React | 19.x |
| Language | TypeScript | 5.7+ (strict) |
| Routing | TanStack Router | 1.x |
| Server State | TanStack Query | 5.x |
| Client State | Zustand | 5.x |
| Data Tables | TanStack Table | 8.x (via shadcn) |
| UI Components | shadcn/ui | latest |
| Styling | Tailwind CSS | 4.x |
| Forms | React Hook Form + Zod 4 | RHF 7.x + Zod 4.x |
| Charts | Recharts | 3.x |
| Toasts | Sonner | 2.x |
| API Client | @hey-api/openapi-ts | 0.x |
| Unit Tests | Vitest + React Testing Library | Vitest 4.x + RTL 16.x |
| E2E Tests | Playwright | 1.x |
| Package Manager | pnpm | 10.x |

## Development Principles

- **YAGNI**: Create files/folders only when implementing features that need them
- **Type-safe**: Zod 4 for runtime validation, OpenAPI codegen for API types
- **Backend parity**: Follow same coding conventions (strict TS, no `any`, Zod validation)
- **Component-driven**: Build reusable components, compose into pages
- **Test as you go**: Each feature gets unit tests before moving on

---

## Phase 1: Project Setup & Configuration

### Step 1.1: Initialize Vite + React Project

- [ ] Create new Vite project with React + TypeScript template
- [ ] Configure `tsconfig.json` (strict mode, path aliases `@/`)
- [ ] Configure `vite.config.ts` (path aliases, port 3001)
- [ ] Set up `.editorconfig`, `.prettierrc`, `.eslintrc` (match backend conventions)
- [ ] Create `.node-version` (Node 22 LTS)
- [ ] Initialize git repo with `.gitignore`
- [ ] Create `README.md` with project setup instructions

### Step 1.2: Tailwind CSS v4

- [ ] Install `tailwindcss` and `@tailwindcss/vite` plugin
- [ ] Configure in `vite.config.ts` (plugin)
- [ ] Create `src/index.css` with `@import "tailwindcss"`
- [ ] Set up CSS custom properties for design tokens (colors, spacing)

### Step 1.3: shadcn/ui Setup

- [ ] Initialize shadcn/ui with `npx shadcn@latest init`
- [ ] Configure `components.json` (style: default, baseColor, aliases)
- [ ] Install initial components: Button, Input, Label, Card, Badge, Separator
- [ ] Set up `src/components/ui/` directory (shadcn-managed)
- [ ] Set up `src/lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)

### Step 1.4: Environment Configuration

- [ ] Create `.env` and `.env.example`
- [ ] Define env vars: `VITE_API_URL` (default `http://localhost:3000`)
- [ ] Create `src/config/env.ts` — Zod-validated env at build time
- [ ] Type-safe env access throughout the app

### Step 1.5: ESLint + Prettier

- [ ] Install ESLint 9 (flat config) with TypeScript plugin
- [ ] Configure rules to match backend: `no-explicit-any` (error), inline type imports
- [ ] Install Prettier with same config as backend (singleQuote, trailingComma, semi)
- [ ] Add lint and format scripts to `package.json`

---

## Phase 2: Core Infrastructure

### Step 2.1: TanStack Router Setup

- [ ] Install `@tanstack/react-router` and Vite plugin `@tanstack/router-plugin`
- [ ] Configure file-based routing in `src/routes/`
- [ ] Create root layout route (`__root.tsx`) with app shell
- [ ] Create route tree structure:
  ```
  src/routes/
  ├── __root.tsx              # Root layout (providers, app shell)
  ├── login.tsx               # Public login page
  ├── _authenticated.tsx      # Auth layout (sidebar + header + outlet)
  ├── _authenticated/
  │   ├── index.tsx           # Dashboard (/)
  │   ├── users/
  │   │   ├── index.tsx       # Users list
  │   │   └── $userId.tsx     # User detail
  │   ├── products/
  │   │   ├── index.tsx       # Products list
  │   │   ├── new.tsx         # Create product
  │   │   └── $productId.tsx  # Edit product
  │   ├── categories/
  │   │   ├── index.tsx       # Categories list
  │   │   └── ...
  │   ├── orders/
  │   │   ├── index.tsx       # Orders list
  │   │   └── $orderId.tsx    # Order detail
  │   ├── payments/
  │   │   └── index.tsx       # Payments list
  │   ├── reviews/
  │   │   └── index.tsx       # Reviews moderation
  │   ├── coupons/
  │   │   ├── index.tsx       # Coupons list
  │   │   ├── new.tsx         # Create coupon
  │   │   └── $couponId.tsx   # Edit coupon
  │   ├── shipping/
  │   │   └── index.tsx       # Shipping methods
  │   ├── inventory/
  │   │   └── index.tsx       # Inventory + low stock
  │   └── notifications/
  │       └── index.tsx       # Admin notifications
  ```
- [ ] Set up `beforeLoad` auth guard on `_authenticated` route
- [ ] Create `NotFound` component for 404 routes

### Step 2.2: TanStack Query Setup

- [ ] Install `@tanstack/react-query` and `@tanstack/react-query-devtools`
- [ ] Create `QueryClientProvider` in root with sensible defaults:
  - `staleTime: 30_000` (30s for admin data)
  - `retry: 1` (single retry on failure)
  - `refetchOnWindowFocus: true`
- [ ] Create `src/lib/query-client.ts` with configured client
- [ ] Add React Query DevTools (dev only)

### Step 2.3: API Client Generation (OpenAPI)

- [ ] Install `@hey-api/openapi-ts` as dev dependency
- [ ] Add script: `"api:generate": "openapi-ts -i http://localhost:3000/docs-json -o src/api/generated"`
- [ ] Generate initial client from backend Swagger spec
- [ ] Create `src/api/client.ts` — configured fetch instance with:
  - Base URL from `VITE_API_URL`
  - Auth header injection (access token from memory)
  - 401 interceptor → trigger token refresh
  - Response unwrapping (`response.data` from `{ data, meta }` envelope)
- [ ] Create `src/api/` barrel exports for clean imports

### Step 2.4: Auth Module

- [ ] Create `src/stores/auth.store.ts` (Zustand):
  - `accessToken: string | null` (in-memory only, never persisted)
  - `user: User | null` (current admin user profile)
  - `isAuthenticated: boolean` (derived)
  - `setAuth(token, user)` — store after login
  - `clearAuth()` — clear on logout
  - `setAccessToken(token)` — update after refresh
- [ ] Create `src/features/auth/api/auth.api.ts`:
  - `login(email, password)` → returns `{ accessToken, refreshToken, user }`
  - `refresh(refreshToken)` → returns new `{ accessToken, refreshToken }`
  - `logout(refreshToken)` → invalidates session
  - `getProfile()` → returns current user
- [ ] Create refresh token flow:
  - Store refresh token in memory (Zustand, not localStorage)
  - On 401 response → attempt refresh → retry original request
  - On refresh failure → redirect to login
  - Queue concurrent requests during refresh (prevent multiple refresh calls)
- [ ] Create `src/features/auth/components/LoginPage.tsx`:
  - Email + password form (React Hook Form + Zod)
  - Error display for invalid credentials
  - Redirect to dashboard on success
  - Only accessible when NOT authenticated
- [ ] Role validation: verify user has ADMIN role after login, reject CUSTOMER

### Step 2.5: Protected Route Layout

- [ ] Create `_authenticated.tsx` route layout:
  - `beforeLoad` — check auth store, redirect to `/login` if not authenticated
  - `loader` — fetch user profile to validate session is still valid
- [ ] On app mount: attempt silent refresh (if refresh token exists in memory)
  - If refresh succeeds → user stays logged in
  - If fails → redirect to login (expected on fresh page load)

---

## Phase 3: Layout & Navigation

### Step 3.1: App Shell Layout

- [ ] Create `src/components/layout/AppLayout.tsx`:
  - Sidebar (left, collapsible)
  - Top header bar (breadcrumbs, user menu, notification bell)
  - Main content area with `<Outlet />`
  - Responsive: sidebar collapses to hamburger on mobile
- [ ] Create `src/components/layout/Sidebar.tsx`:
  - Logo/brand at top
  - Navigation links grouped by section:
    - **Main**: Dashboard
    - **Catalog**: Products, Categories, Inventory
    - **Sales**: Orders, Payments, Coupons
    - **Customers**: Users, Reviews
    - **Settings**: Shipping Methods, Notifications
  - Active link highlighting (from TanStack Router)
  - Collapse/expand toggle
- [ ] Create `src/components/layout/Header.tsx`:
  - Breadcrumbs (auto-generated from route tree)
  - Notification bell with unread count badge
  - User avatar + dropdown menu (profile, logout)
- [ ] Use Zustand for sidebar state (`sidebarOpen: boolean`)

### Step 3.2: Theme (Dark/Light Mode)

- [ ] Create `src/stores/theme.store.ts` (Zustand with persist middleware):
  - `theme: 'light' | 'dark' | 'system'`
  - Persist to `localStorage`
- [ ] Apply theme via CSS class on `<html>` element
- [ ] shadcn/ui supports dark mode natively via `.dark` class
- [ ] Add theme toggle in Header user dropdown

### Step 3.3: Shared UI Components

- [ ] Install shadcn components: Dialog, DropdownMenu, Sheet, Skeleton, Table, Tabs, Tooltip, Avatar, Select, Textarea, Switch, Calendar, Popover, Command
- [ ] Create `src/components/shared/DataTable.tsx` — reusable server-side paginated table:
  - Uses TanStack Table v8
  - Server-side pagination, sorting, filtering
  - Column visibility toggle
  - Syncs state with URL search params (via TanStack Router)
  - Loading skeleton state
  - Empty state
- [ ] Create `src/components/shared/PageHeader.tsx` — title + description + action buttons
- [ ] Create `src/components/shared/ConfirmDialog.tsx` — reusable confirmation modal
- [ ] Create `src/components/shared/StatusBadge.tsx` — colored badges for order/payment/review status
- [ ] Create `src/components/shared/FormField.tsx` — standardized form field wrapper with label + error
- [ ] Create `src/components/shared/ImageUpload.tsx` — drag-and-drop image upload component
- [ ] Create `src/components/shared/MoneyDisplay.tsx` — format PLN amounts consistently

---

## Phase 4: Dashboard

### Step 4.1: Dashboard Overview Page

- [ ] Create `src/routes/_authenticated/index.tsx`
- [ ] Stat cards row (4 cards):
  - Total orders (today / this month)
  - Revenue (today / this month)
  - Active products count
  - Registered users count
- [ ] Note: some stats may need new backend endpoints — use existing list endpoints with limits initially
- [ ] Loading skeletons while data fetches

### Step 4.2: Dashboard Charts

- [ ] Install `recharts`
- [ ] Revenue chart (line chart, last 30 days) — may need backend endpoint
- [ ] Orders by status (pie/donut chart) — derive from GET /orders with status filter
- [ ] Responsive chart containers

### Step 4.3: Dashboard Quick Views

- [ ] Recent orders table (last 5 orders, link to full list)
- [ ] Low stock alerts (from GET /inventory/low-stock, limit 5)
- [ ] Pending reviews count (from GET /reviews/admin?status=PENDING)
- [ ] Each section links to its full management page

---

## Phase 5: Feature Modules

Each module follows the same pattern:
1. **API hooks** — TanStack Query queries + mutations in `src/features/<name>/api/`
2. **List page** — DataTable with server-side pagination/filtering
3. **Detail/Edit page** — Form with React Hook Form + Zod validation
4. **Components** — Module-specific components in `src/features/<name>/components/`

### Step 5.1: Users Module

**API Hooks (`src/features/users/api/`):**
- [ ] `useUsers(params)` — paginated list (GET /users)
- [ ] `useUser(id)` — single user detail (GET /users/:id)
- [ ] `useUpdateUser()` — mutation (PATCH /users/:id)
- [ ] `useDeactivateUser()` — mutation (POST /users/:id/deactivate)
- [ ] `useDeleteUser()` — mutation (DELETE /users/:id)

**Pages:**
- [ ] Users list — DataTable with columns: name, email, role, status, created, actions
- [ ] User detail — view/edit form (role dropdown, active toggle), order history summary
- [ ] Confirm dialog for deactivate/delete actions

### Step 5.2: Categories Module

**API Hooks (`src/features/categories/api/`):**
- [ ] `useCategories(params)` — paginated list (GET /categories)
- [ ] `useCategoryTree()` — tree view (GET /categories/tree)
- [ ] `useCreateCategory()` — mutation (POST /categories)
- [ ] `useUpdateCategory()` — mutation (PATCH /categories/:id)
- [ ] `useUploadCategoryImage()` — mutation (POST /categories/:id/image/upload)
- [ ] `useDeactivateCategory()` / `useDeleteCategory()`

**Pages:**
- [ ] Categories list with tree view toggle
- [ ] Create/edit category form (name, slug auto-gen, parent select, description, image upload)
- [ ] Image upload with preview (drag-and-drop)

### Step 5.3: Products Module

**API Hooks (`src/features/products/api/`):**
- [ ] `useProducts(params)` — paginated list with filters (GET /products)
- [ ] `useProduct(slug)` — single product detail (GET /products/:slug)
- [ ] `useCreateProduct()` — mutation (POST /products)
- [ ] `useUpdateProduct()` — mutation (PATCH /products/:id)
- [ ] `useUploadProductImage()` — mutation (POST /products/:id/images/upload)
- [ ] `useDeleteProductImage()` — mutation (DELETE /products/:id/images/:imageId)
- [ ] `useDeactivateProduct()` / `useDeleteProduct()`

**Pages:**
- [ ] Products list — DataTable with columns: image thumb, name, price, stock, category, status, actions
- [ ] Create product form — multi-step or single page:
  - Basic info (name, description, price, comparePrice, sku)
  - Category select (dropdown from categories list)
  - Images (multi-upload with drag-and-drop reorder)
  - Inventory (stock, low stock threshold)
  - Settings (isActive, isFeatured)
- [ ] Edit product — pre-filled form with existing data
- [ ] Image management — add, remove, reorder images inline

### Step 5.4: Orders Module

**API Hooks (`src/features/orders/api/`):**
- [ ] `useOrders(params)` — paginated list with status/date filters (GET /orders)
- [ ] `useOrder(id)` — single order detail (GET /orders/:id)
- [ ] `useUpdateOrderStatus()` — mutation (PATCH /orders/:id/status)

**Pages:**
- [ ] Orders list — DataTable with columns: order number, customer, status (badge), total, date, actions
- [ ] Filterable by status (dropdown), date range (calendar picker)
- [ ] Order detail page:
  - Order info (number, date, status with timeline)
  - Customer info
  - Shipping address
  - Order items table (product image, name, sku, qty, unit price, line total)
  - Financial summary (subtotal, discount, shipping, tax, total)
  - Status update dropdown (only valid next statuses shown)
  - Admin notes field
  - Link to payment info

### Step 5.5: Payments Module

**API Hooks (`src/features/payments/api/`):**
- [ ] `usePayments(params)` — paginated list with status filter (GET /payments)
- [ ] `useRefundPayment()` — mutation (POST /payments/:paymentId/refund)
- [ ] `useExpireAbandoned()` — mutation (POST /payments/expire-abandoned)

**Pages:**
- [ ] Payments list — DataTable with columns: order number, amount, status (badge), date, actions
- [ ] Refund dialog — full or partial amount input, reason text
- [ ] "Expire abandoned" button with confirmation

### Step 5.6: Reviews Module

**API Hooks (`src/features/reviews/api/`):**
- [ ] `useReviews(params)` — paginated list with status/rating filter (GET /reviews/admin)
- [ ] `useModerateReview()` — mutation (PATCH /reviews/:id/moderate)
- [ ] `useDeleteReview()` — mutation (DELETE /reviews/:id/admin)

**Pages:**
- [ ] Reviews list — DataTable with columns: product, customer, rating (stars), status (badge), date, actions
- [ ] Quick actions: approve/reject inline buttons
- [ ] Moderate dialog — approve/reject radio + admin note textarea
- [ ] Filter tabs: All | Pending | Approved | Rejected

### Step 5.7: Coupons Module

**API Hooks (`src/features/coupons/api/`):**
- [ ] `useCoupons(params)` — paginated list with filters (GET /coupons)
- [ ] `useCoupon(id)` — single coupon detail (GET /coupons/:id)
- [ ] `useCreateCoupon()` — mutation (POST /coupons)
- [ ] `useUpdateCoupon()` — mutation (PATCH /coupons/:id)
- [ ] `useDeactivateCoupon()` / `useDeleteCoupon()`

**Pages:**
- [ ] Coupons list — DataTable with columns: code, type, value, usage (x/limit), valid dates, status, actions
- [ ] Create/edit coupon form:
  - Code (uppercase), description
  - Type (PERCENTAGE / FIXED_AMOUNT), value
  - Rules (minimumOrderAmount, maximumDiscount, usageLimit, usageLimitPerUser)
  - Validity dates (date range picker)
  - Active toggle

### Step 5.8: Shipping Methods Module

**API Hooks (`src/features/shipping/api/`):**
- [ ] `useShippingMethods()` — all methods including inactive (GET /shipping/methods/all)
- [ ] `useCreateShippingMethod()` — mutation
- [ ] `useUpdateShippingMethod()` — mutation
- [ ] `useDeactivateShippingMethod()` / `useDeleteShippingMethod()`

**Pages:**
- [ ] Shipping methods list (simple table, not paginated — small dataset)
- [ ] Create/edit form: name, description, basePrice, freeShippingThreshold, estimatedDays, sortOrder, isActive

### Step 5.9: Inventory Module

**API Hooks (`src/features/inventory/api/`):**
- [ ] `useLowStock(params)` — paginated low stock products (GET /inventory/low-stock)
- [ ] `useStockInfo(productId)` — single product stock (GET /inventory/:productId)
- [ ] `useStockHistory(productId, params)` — movement audit trail (GET /inventory/:productId/history)
- [ ] `useAdjustStock()` — mutation (POST /inventory/:productId/adjust)

**Pages:**
- [ ] Low stock alerts — DataTable with columns: product name, sku, current stock, reserved, available, threshold, actions
- [ ] Stock detail page (per product):
  - Current stock info card
  - Adjust stock form (quantity +/-, type dropdown, reason)
  - Stock movement history table (type, quantity, before/after, reason, date)

---

## Phase 6: Notifications

### Step 6.1: Admin Notifications

- [ ] `useAdminNotifications(params)` — paginated list (GET /notifications/admin)
- [ ] Notifications page — DataTable with all system notifications
- [ ] Filter by type, read status

### Step 6.2: Notification Bell (Header)

- [ ] Poll unread count periodically (GET /notifications/unread-count) — admin's own notifications
- [ ] Dropdown panel showing recent notifications
- [ ] Mark as read on click
- [ ] "Mark all read" button

### Step 6.3: Toast Notifications

- [ ] Install and configure Sonner `<Toaster />` in root layout
- [ ] Success toasts on create/update/delete operations
- [ ] Error toasts on API failures (from TanStack Query `onError`)

---

## Phase 7: Testing

### Step 7.1: Unit Testing Setup

- [ ] Install Vitest + React Testing Library + jsdom
- [ ] Configure `vitest.config.ts` (jsdom environment, path aliases, setup file)
- [ ] Create test setup file (cleanup, mock setup)
- [ ] Create shared test utilities:
  - `renderWithProviders()` — wraps component in Router + Query + Zustand providers
  - API mock helpers (MSW or manual mocks)

### Step 7.2: Component Tests

- [ ] Test shared components (DataTable, ConfirmDialog, StatusBadge, ImageUpload)
- [ ] Test form components (validation, submission, error display)
- [ ] Test auth flow (login form, token refresh, protected routes)

### Step 7.3: Page Tests

- [ ] Test each list page (renders table, handles pagination, filters)
- [ ] Test create/edit forms (validation, API calls, success/error states)
- [ ] Test dashboard (stat cards render, charts render)

### Step 7.4: E2E Testing

- [ ] Install Playwright
- [ ] Configure `playwright.config.ts` (baseURL, webServer)
- [ ] Create test fixtures (login helper, seed data)
- [ ] E2E scenarios:
  - Login flow (success + failure)
  - CRUD a product (create → edit → deactivate → delete)
  - Order status workflow
  - Review moderation
  - Navigation between all pages

---

## Phase 8: Production Preparation

### Step 8.1: Docker

- [ ] Create `Dockerfile` (multi-stage: build → nginx serve)
- [ ] Create `nginx.conf` for SPA routing (all paths → `index.html`)
- [ ] Create `.dockerignore`

### Step 8.2: CI/CD

- [ ] Create `.github/workflows/ci.yml`:
  - Lint job
  - Unit test job (Vitest)
  - Build job (TypeScript + Vite)
  - E2E test job (Playwright, requires backend running)
- [ ] pnpm caching, Node 22 LTS

### Step 8.3: Performance

- [ ] Lazy-load route components (TanStack Router code splitting is automatic with file-based routes)
- [ ] Optimize bundle: analyze with `rollup-plugin-visualizer`
- [ ] Image optimization for uploaded assets (Cloudinary already handles backend-side)
- [ ] Preload critical routes

### Step 8.4: Error Handling

- [ ] Global error boundary component
- [ ] Route-level error boundaries (TanStack Router `errorComponent`)
- [ ] API error handling utility (parse backend error format)
- [ ] Offline detection + reconnection banner

---

## Project Structure (Final)

```
ecommerce-admin/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── generated/           # OpenAPI codegen output (gitignored)
│   │   ├── client.ts            # Configured fetch with auth interceptors
│   │   └── index.ts             # Barrel exports
│   ├── components/
│   │   ├── layout/              # AppLayout, Sidebar, Header
│   │   ├── shared/              # DataTable, ConfirmDialog, StatusBadge, etc.
│   │   └── ui/                  # shadcn/ui components (managed by CLI)
│   ├── config/
│   │   └── env.ts               # Zod-validated environment
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/             # Login, refresh, logout API calls
│   │   │   └── components/      # LoginPage, LoginForm
│   │   ├── dashboard/
│   │   │   └── components/      # StatCard, RevenueChart, RecentOrders
│   │   ├── users/
│   │   │   ├── api/             # TanStack Query hooks
│   │   │   └── components/      # UserForm, UserColumns
│   │   ├── products/
│   │   │   ├── api/
│   │   │   └── components/      # ProductForm, ImageManager, ProductColumns
│   │   ├── categories/
│   │   │   ├── api/
│   │   │   └── components/
│   │   ├── orders/
│   │   │   ├── api/
│   │   │   └── components/      # OrderDetail, StatusTimeline, StatusUpdateForm
│   │   ├── payments/
│   │   │   ├── api/
│   │   │   └── components/      # RefundDialog
│   │   ├── reviews/
│   │   │   ├── api/
│   │   │   └── components/      # ModerateDialog, RatingStars
│   │   ├── coupons/
│   │   │   ├── api/
│   │   │   └── components/      # CouponForm
│   │   ├── shipping/
│   │   │   ├── api/
│   │   │   └── components/
│   │   ├── inventory/
│   │   │   ├── api/
│   │   │   └── components/      # AdjustStockForm, StockHistory
│   │   └── notifications/
│   │       ├── api/
│   │       └── components/      # NotificationBell, NotificationList
│   ├── hooks/                   # Shared hooks (useDebounce, useMediaQuery)
│   ├── lib/
│   │   ├── query-client.ts      # TanStack Query client config
│   │   └── utils.ts             # cn() helper, formatters
│   ├── routes/                  # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── login.tsx
│   │   ├── _authenticated.tsx
│   │   └── _authenticated/
│   │       ├── index.tsx        # Dashboard
│   │       ├── users/
│   │       ├── products/
│   │       ├── categories/
│   │       ├── orders/
│   │       ├── payments/
│   │       ├── reviews/
│   │       ├── coupons/
│   │       ├── shipping/
│   │       ├── inventory/
│   │       └── notifications/
│   ├── stores/
│   │   ├── auth.store.ts        # Zustand auth state
│   │   └── theme.store.ts       # Zustand theme (dark/light)
│   ├── App.tsx                  # Router provider
│   ├── main.tsx                 # Entry point (render App)
│   └── index.css                # Tailwind import + global styles
├── tests/
│   ├── setup.ts                 # Vitest setup
│   └── helpers/                 # Test utilities
├── e2e/
│   ├── fixtures/                # Playwright fixtures
│   └── *.spec.ts                # E2E test files
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── .node-version
├── Dockerfile
├── nginx.conf
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── CLAUDE.md                    # Project instructions for Claude Code
```

---

## Verification Plan

After each phase:
1. `pnpm lint` — no ESLint errors
2. `pnpm build` — successful TypeScript + Vite build
3. `pnpm test` — all Vitest tests pass
4. Manual verification — open `http://localhost:3001` and verify features work against the running backend (`http://localhost:3000`)

Full E2E verification:
1. Start backend: `docker compose up` (PostgreSQL + Redis + NestJS on :3000)
2. Start admin: `pnpm dev` (Vite dev server on :3001)
3. Login as admin user (from seed data)
4. Navigate through all pages, verify CRUD operations
5. `pnpm test:e2e` — all Playwright tests pass
