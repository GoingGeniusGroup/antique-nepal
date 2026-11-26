# Caching Architecture

Storefront catalog data is shared across visitors and cached for one hour.
Shopping, account, payment, and administration data remains request-time and
uncached.

## Prisma query audit

| Category | Query location / data | Cache policy |
| --- | --- | --- |
| Cacheable storefront | `lib/get-featured-products.ts`: popular, best-selling, and latest active product cards | `products` tag; distinct fixed keys per featured query; 3600 seconds |
| Cacheable storefront | `actions/products.ts`: active catalog listing, filtered by search, category, stock, sort, page, and page size | `products` tag; key includes every normalized listing argument; 3600 seconds |
| Cacheable storefront | `actions/products.ts`: product detail by ID and related product cards by product/category | `products` tag; detail key includes product ID; related key includes product ID, category ID/slug, and limit; 3600 seconds |
| Cacheable storefront | `app/api/categories/route.ts`: active category list (including product counts) | `categories` tag; fixed active-category key; 3600 seconds |
| Cacheable storefront | `app/api/categories/[slug]/products/route.ts`: active category and its active, filtered product page | `categories` and `products` tags; key includes slug, search, stock filter, sort, page, and page size; 3600 seconds |
| Cacheable storefront | `app/api/products/[id]/variants/route.ts`: active variants displayed on product detail | `products` tag; key includes product ID; 3600 seconds |
| Uncached dynamic / user-specific | Cart APIs and cart reads; checkout and order creation; eSewa verification/simulation; customer profile, addresses, and customer orders | Not cached; data is mutable, transactional, or scoped to the current customer/request |
| Uncached dynamic / user-specific | Review submissions, edits, and deletes; a signed-in visitor's own pending product review | Review reads/writes are not cached; pending-review visibility is resolved per visitor outside the product cache |
| Uncached dynamic / user-specific | `lib/admin-statistics.ts`, admin dashboards, and admin API queries | Not cached; operational and frequently changing reporting/management data |
| Uncached dynamic / user-specific | Authentication, registration, password-reset, wishlist, and profile queries | Not cached; identity- or request-dependent |

Category ordering/display configuration comes from `data/category-options.ts`;
the active category records themselves are fetched from Prisma. The active
storefront category options are Tops (Kurthi Tops), Kurthi Set, Cord Set,
Sweater, and Hand Bags.

## Invalidation

All cached product reads use the `products` tag and all active category reads
use the `categories` tag. Product/category admin Route Handlers use
`revalidateTag(tag, "max")` after successful writes; category writes invalidate
both tags because category metadata and product-category relationships affect
storefront results. Review status changes invalidate `products` because
approved reviews are shown with product details. The product-view Server Action
uses `updateTag("products")` after incrementing its count.

Cart, checkout, payment verification, customer-order, review, and admin
statistics queries are deliberately excluded from `unstable_cache`: their
results are request-, user-, or transaction-specific. No Next.js configuration
change is required.
