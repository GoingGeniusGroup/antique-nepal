# Alena Collection — Technical Requirements Document

## 1. Purpose and scope

This document records the current, checked-in implementation of Alena Collection. It is an as-built description based on `package.json`, `prisma/schema.prisma`, `app/`, and directly related source files. It does not assume services or controls that are not configured in the repository.

## 2. Technology stack and versions

Versions below are those declared in `package.json` (a caret range is not an assertion about the exact installed version).

| Area | Technology | Declared version / implementation |
|---|---|---|
| Web framework | Next.js | `16.4.1`; App Router under `app/` |
| Language | TypeScript | `^5`; strict mode enabled in `tsconfig.json` |
| UI runtime | React / React DOM | `19.2.6` |
| Styling | Tailwind CSS | `^4` and `@tailwindcss/postcss` `^4`; project also contains a legacy-style `tailwind.config.ts` |
| Database access | Prisma Client / Prisma CLI | `^6.19.3`; PostgreSQL provider; Prisma Accelerate extension `^2.0.2` |
| Authentication | `next-auth` (Auth.js) | `5.0.0-beta.30`; Prisma adapter `^2.11.1` |
| Validation | Zod | `^4.1.12`; used on selected registration, product, and bulk-import inputs, not uniformly on all API routes |
| Password hashing | `bcrypt` | `^6.0.0` |
| Email | Nodemailer | `^6.9.3` |
| Image storage/upload | Uploadcare packages | `@uploadcare/react-uploader` `^1.17.0`, `@uploadcare/upload-client` `^6.18.0`; some category image handling writes to local `public/` |

### Database hosting qualification

Prisma declares `provider = "postgresql"` and reads `DATABASE_URL` and `DIRECT_URL`. The checked-in dependencies and searched application configuration do not show a Supabase SDK or Supabase-specific integration. Supabase may be used as a PostgreSQL host outside the repository, but that is not established by this codebase; this document therefore treats the configured database as PostgreSQL, not as a verified Supabase deployment.

### Project commands

- `pnpm dev` / `npm run dev`: start Next.js development server.
- `pnpm build` / `npm run build`: generate Prisma Client, then run `next build`.
- `pnpm start` / `npm run start`: start the production server.
- `pnpm lint` / `npm run lint`: run ESLint.
- `postinstall`: generate Prisma Client.

## 3. System architecture and naming conventions

### Application shape

- `app/` contains App Router layouts, pages, route groups, and API route handlers.
- Route groups such as `(auth)` and `(public)` organize page/layout behavior without adding those names to public URLs.
- `app/api/**/route.ts` defines HTTP endpoints. Server actions are also used under `actions/`.
- `components/` contains shared UI and feature components; `contexts/` and `hooks/` contain client state and reusable hooks.
- `lib/` contains infrastructure and shared logic, including Auth.js configuration and the Prisma client.
- `prisma/` contains the data model and migration history. `data/` contains application data/constants.
- `public/` holds static assets. Runtime code also writes category images under `public/catimage`.

### Naming conventions observed

These are conventions visible in the repository, not enforced naming checks:

- App route directories are lowercase (for example `app/api/products`, `app/admin`) except for Next.js route syntax: parenthesized route groups and bracketed dynamic segments such as `[slug]`, `[id]`, and `[orderId]`.
- Next.js special files use lowercase framework names such as `page.tsx`, `layout.tsx`, `route.ts`, and `loading.tsx`.
- Component exports/types use PascalCase (for example `RootLayout`, `AdminLayout`, and `ProductCard`). Component filenames are generally lowercase or kebab-case (for example `product-card.tsx`); PascalCase filenames are not a universal rule in this repository.
- Shared implementation is separated by purpose (`components`, `contexts`, `hooks`, `lib`, `actions`, `validations`, `data`).

## 4. Database schema blueprint

Prisma Client is generated from `prisma/schema.prisma`. IDs are generally `String` values with `cuid()` defaults. PostgreSQL is the configured provider. Monetary values use Prisma `Decimal` with explicit decimal precision. Model mappings use snake_case table names in several cases.

### Main identity and authentication models

- **User** (`users`): unique email; optional name, password, phone, image, and email-verification fields; `Role` defaults to `CUSTOMER`; `isActive` defaults true. Relates to accounts, sessions, addresses, carts, orders, reviews, wishlists, activity logs, and optional `AdminUser`.
- **Account** (`accounts`), **Session** (`sessions`), and **VerificationToken** (`verification_tokens`): Auth.js adapter models. Account and session records relate to User; account/session foreign keys cascade on user deletion.
- **PasswordResetToken**: unique token, email, expiry, creation time; used by password reset routes.
- **AdminUser** (`admin_users`): one-to-one User relation, JSON permissions, optional last-login timestamp.

### Catalog and inventory

- **Category** (`categories`): name, unique slug, optional description/image, optional self-referencing parent, display order, active flag, timestamps. Categories relate to products through `ProductCategory`.
- **Product** (`products`): name, unique slug and SKU, description fields, optional image, `Decimal(10,2)` price, active/featured flags, SEO metadata, view count, timestamps. Relates to category assignments, images, variants, reviews, and wishlist entries.
- **ProductCategory** (`product_categories`): composite primary key `(productId, categoryId)` implements the many-to-many product/category association.
- **ProductVariant** (`product_variants`): product-specific SKU, name, optional override price, color, size, weight, dimensions, active flag and display order. Relates to inventory, cart/order items, and images.
- **ProductImage** (`product_images`): product, optional variant, URL, alt text, ordering, primary marker, optional Uploadcare UUID.
- **Inventory** (`inventory`): one-to-one variant stock record, quantity, reserved quantity, location, low-stock threshold, and last-restocked/update timestamps.

### Shopping, order, and customer content

- **Cart** (`carts`) and **CartItem** (`cart_items`): optional user or session ownership and expiry; items reference variants and retain quantity and price.
- **Wishlist** (`wishlists`) and **WishlistItem** (`wishlist_items`): user-owned lists and unique product membership per list.
- **Order** (`orders`) and **OrderItem** (`order_items`): order number, user, status/payment status, subtotal/shipping/tax/total, NPR default currency, billing/shipping addresses, notes, tracking number, and item-level purchase snapshots.
- **Address** (`addresses`): user-owned contact and shipping/billing address data, with `AddressType` and default-country `Nepal`.
- **Payment** (`payments`): order-linked amount, currency, status, optional Stripe payment ID/method, JSON metadata and error message. The schema contains a nullable Stripe ID; this alone does not establish an active Stripe integration.
- **Review** (`reviews`) and **ReviewImage** (`review_images`): user/product review, rating, comment, purchase-verification flag, moderation status, helpful count, and optional images.

### Site content and operations

- **ActivityLog** (`activity_logs`): optional user, action/entity identifiers, optional JSON changes, IP/user-agent and timestamp.
- **SiteSetting** (`site_settings`): key/value JSON settings and optional updater ID.
- Footer content models: **FooterBrand**, **FooterSocial**, **FooterSection**, **FooterLink**, **FooterContact**, and **FooterNewsletter**.
- **NewsletterSubscriber** (`newsletter_subscribers`): unique email and `SubscriptionStatus` (`SUBSCRIBED`, `UNSUBSCRIBED`, `BOUNCED`).

### Enums

- `Role`: `CUSTOMER`, `ADMIN`.
- `OrderStatus`: `PENDING`, `PROCESSING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.
- `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`.
- `AddressType`: `SHIPPING`, `BILLING`, `BOTH`.
- `ReviewStatus`: `PENDING`, `APPROVED`, `REJECTED`.
- `SubscriptionStatus`: `SUBSCRIBED`, `UNSUBSCRIBED`, `BOUNCED`.

### Core product categories

The ordered category options in `data/category-options.ts`, also used as the accepted category names by the bulk product import, are:

| Name | Slug |
|---|---|
| tops | `tops` |
| kurthi set | `kurthi-set` |
| cord set | `cord-set` |
| sweater | `sweater` |
| hand bags | `hand-bags` |

These values are application options/import constraints, not a Prisma enum or database seed: `Category` is a general-purpose table and the schema does not guarantee that all five rows exist. Bulk import upserts categories from the names and generates slugs from those names. Separately, `data/categories.ts` contains static sample categories (Dresses, Co-ord Sets, Outerwear, Tops), so consumers should distinguish those sample data from the five configured options.

## 5. API routes and endpoint specifications

All listed endpoints are Next.js App Router handlers under `app/api`. Unless stated, request and response bodies are JSON. The list records methods exported by the current route files; it is not a promise of API stability.

### Authentication and account recovery

| Endpoint | Methods | Current behavior |
|---|---|---|
| `/api/auth/[...nextauth]` | `GET`, `POST` | Delegates to Auth.js handlers configured in `lib/auth.ts`. |
| `/api/auth/register` | `POST` | Creates a password account after required-field and minimum-length checks; hashes password; accepts name/email/password and a role input that is normalized to `ADMIN` only for exact `"ADMIN"`, otherwise `CUSTOMER`; directly marks email verified. |
| `/api/auth/forgot-password` | `POST` | Accepts email, creates a 30-minute reset token when the account exists, sends a reset email; returns a generic response for unknown email. |
| `/api/auth/reset-password` | `POST` | Accepts token/password, checks token existence/expiry, hashes and stores password, then deletes the token. |

The repository also has a `registerUser` server action (not an API endpoint) which validates with `RegisterSchema`, hashes the password, creates an inactive user with a 24-hour email verification token, and sends a verification email.

### Public catalog and content

| Endpoint | Methods | Current behavior |
|---|---|---|
| `/api/categories` | `GET` | Returns active categories ordered by display order, including a product count. |
| `/api/categories/[slug]/products` | `GET` | Looks up category by slug; supports `page`, `perPage`, `searchQuery`, `inStockOnly`, and `sortBy` (`price-low`, `price-high`, otherwise newest). The current `inStockOnly=true` implementation filters on product `isActive`, not `Inventory.quantity`. Returns category, page metadata, and products. |
| `/api/products/[id]/variants` | `GET` | Reads variants for a product ID. |
| `/api/products/popular` | `GET` | Returns the popular-product result, or `null` when none is available. |
| `/api/products/latest` | `GET` | Returns the latest-product result, or `null` when none is available. |
| `/api/products/best-seller` | `GET` | Returns the best-seller result, or `null` when none is available. |
| `/api/footer` | `GET` | Returns public footer data. |
| `/api/revalidate-featured` | `GET` | Revalidates featured product data when the route's configured condition is met; returns a `revalidated` flag and timestamp. |

### Cart, wishlist, and reviews

| Endpoint | Methods | Current behavior |
|---|---|---|
| `/api/cart` | `GET`, `POST`, `PUT`, `DELETE` | Reads a signed-in user's cart; adds a variant and quantity; updates item quantity; or deletes a cart item. The handler rejects some admin operations. |
| `/api/wishlist` | `GET`, `POST`, `DELETE` | Reads and modifies wishlist data; `GET` uses the session identity. |
| `/api/reviews` | `GET`, `POST`, `PUT`, `DELETE` | Lists reviews and supports create/update/delete operations; write operations check for a session, and update/delete check record ownership. |
| `/api/reviews/[id]` | `DELETE` | Deletes a review by ID. |

### Bulk catalog import

| Endpoint | Methods | Current behavior |
|---|---|---|
| `/api/products/bulk` | `POST` | Accepts an array of product rows, validates title/price/stock/SKU/category with Zod, limits category names to the five options above, deduplicates input by SKU, and transactionally creates products, default variants, inventory, and category links (skipping duplicate records). |

### Admin API surface

The following handlers exist under `/api/admin`. Query/body fields and response shapes vary by handler; they are JSON except multipart/form-data handlers. Several collection handlers support pagination, search, or sorting.

| Endpoint | Methods | Responsibility |
|---|---|---|
| `/api/admin/users` | `GET` | List/search/paginate users. |
| `/api/admin/users/[id]` | `PUT`, `DELETE` | Update or delete a user. |
| `/api/admin/products` | `GET`, `POST` | List/search/paginate products; create a product. `POST` uses `AddProductSchema`. |
| `/api/admin/products/[id]` | `PUT`, `DELETE` | Update or delete a product. |
| `/api/admin/products/variants` | `GET`, `POST` | List/create product variants. |
| `/api/admin/products/variants/[id]` | `PUT`, `DELETE` | Update/delete a variant. |
| `/api/admin/products/images` | `POST` | Add product images. |
| `/api/admin/products/images/[id]` | `PUT`, `DELETE` | Update/delete a product image. |
| `/api/admin/products/categories` | `GET`, `POST` | Read or assign product categories. |
| `/api/admin/categories` | `GET`, `POST`, `PUT`, `DELETE` | List, create, update, and delete categories; creation/update use multipart form data and may store images locally. |
| `/api/admin/orders` | `GET` | List orders. |
| `/api/admin/orders/[orderId]` | `GET`, `PUT`, `DELETE` | Read, update, or delete an order. |
| `/api/admin/orders/stats` | `GET` | Return order statistics. |
| `/api/admin/site-settings` | `GET`, `PATCH` | Read/update site settings. |
| `/api/admin/site-logo` | `POST` | Upload/update site logo. |
| `/api/admin/footer-brand` | `GET`, `POST`, `PATCH` | Read/create/update footer brand. |
| `/api/admin/footer-social` | `GET`, `POST`, `PATCH`, `DELETE` | Manage footer social links. |
| `/api/admin/footer-sections` | `GET`, `POST`, `PATCH`, `DELETE` | Manage footer sections and links. |
| `/api/admin/footer-contact` | `GET`, `POST`, `PATCH` | Read/create/update footer contact. |
| `/api/admin/footer-newsletter` | `GET`, `POST`, `PATCH` | Read/create/update footer newsletter content. |

## 6. Security and authentication flow

### Auth.js sign-in

- Auth.js is configured in `lib/auth.ts` with the Prisma adapter and Google, Facebook, and email/password Credentials providers.
- The Credentials provider looks up the user by email, rejects missing/inactive accounts, requires customer email verification, and compares the submitted password with the stored bcrypt hash.
- Google and Facebook profile mapping sets the new provider profile role to `CUSTOMER` and active state to true. The sign-in callback rejects an existing inactive account.
- Sessions use JWT strategy with a one-hour configured maximum age. The JWT callback loads the user from the database on later requests, refreshes role/profile fields, and invalidates a token if the user is missing or inactive. Session data exposes user ID and role to the application.
- `app/layout.tsx` obtains the server session and wraps the client tree in `SessionProvider`.

### Registration and role assignment

- The Prisma `User.role` column defaults to `CUSTOMER`; the Auth.js social-provider profile also assigns `CUSTOMER`.
- The `registerUser` server action applies `RegisterSchema`, bcrypt-hashes the password, leaves the account inactive pending email verification, and does not accept a caller-supplied role.
- The separate `/api/auth/register` handler does **not** use Zod; it performs basic checks, marks the new account verified, and sets role from the request body (`ADMIN` if explicitly provided as exactly `"ADMIN"`, otherwise `CUSTOMER`). This means automatic customer-only role assignment is not consistently enforced across registration paths.
- Since that registration handler is an API route and accepts `ADMIN` from its request body, the current implementation permits a caller to request an administrator account. It should not be treated as a secure administrator-provisioning process.
- `app/admin/layout.tsx` performs a client-side session/role redirect for non-admin UI navigation. This is a UI guard, not a substitute for authorization in API handlers.

### Validation and implementation boundaries

- Zod schemas are present for server-action account registration, product create/update schemas, and bulk import. The inspected Auth.js Credentials, password reset, and `/api/auth/register` flows use manual checks or direct JSON parsing. Zod validation is therefore selective, not a repository-wide invariant.
- The admin route handlers under `app/api/admin` do not contain `auth()` or equivalent role-check calls in the checked-in route files. The admin page layout's client check does not protect direct HTTP requests to those handlers. Treat the current admin API as lacking server-side authorization until each handler (or a shared server-side guard) enforces an authenticated `ADMIN` role.
- `/api/products/bulk` also has no visible authentication/authorization check in its handler, despite creating products, variants, stock, and categories.
- The cart handler uses session identity for `GET`, but `POST` accepts a `userId` in the body and `PUT`/`DELETE` operate on a supplied cart item ID without visible ownership checks in those handlers. API authorization and ownership enforcement should be evaluated at the handler level; client-side navigation controls are not security boundaries.
- Password hashes are generated with bcrypt cost factor 10 in the registration/reset handlers. Reset tokens are random 32-byte values represented as hex and expire after 30 minutes. The server action's email-verification token expires after 24 hours.
- Secrets are read from environment variables, including database URLs, social provider credentials, email credentials, and Uploadcare keys. Configure these in deployment secret storage; do not commit their values.

## 7. Source-of-truth and maintenance notes

- Prisma model names, fields, relations, defaults, and enum values are defined by `prisma/schema.prisma`; database migrations are under `prisma/migrations/`.
- The five product category labels come from `data/category-options.ts` and the bulk import schema. They are not hard-coded as database enum values.
- Keep this document synchronized when changing `package.json`, `prisma/schema.prisma`, API handlers, auth callbacks, or registration/authorization behavior.
