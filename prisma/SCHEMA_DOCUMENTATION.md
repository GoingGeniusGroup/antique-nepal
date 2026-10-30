# Database Schema Documentation

> **Last Updated:** November 6, 2025  
> **Schema Version:** 1.0  
> **Database:** PostgreSQL (via Supabase)  
> **ORM:** Prisma

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Authentication & User Management](#authentication--user-management)
4. [Product Catalog System](#product-catalog-system)
5. [Shopping & Cart System](#shopping--cart-system)
6. [Order Management System](#order-management-system)
7. [Payment System](#payment-system)
8. [Review System](#review-system)
9. [Admin & Activity Tracking](#admin--activity-tracking)
10. [Site Configuration](#site-configuration)
11. [Data Flow Diagrams](#data-flow-diagrams)
12. [Common Queries & Usage Examples](#common-queries--usage-examples)
13. [Future Enhancement Notes](#future-enhancement-notes)

---

## 🎯 Overview

This schema represents a **full-featured e-commerce platform** built for a Next.js application. It includes everything needed to run an online store, from user authentication to product management, shopping carts, orders, payments, and reviews.

### Key Features
- ✅ Multi-role user authentication (Customer & Admin)
- ✅ Hierarchical category system with unlimited nesting
- ✅ Product variants (size, color, weight, dimensions)
- ✅ Advanced inventory management with stock reservations
- ✅ Guest checkout support (sessionId-based carts)
- ✅ Multiple wishlists per user
- ✅ Order tracking with payment integration
- ✅ Product review system with image support
- ✅ Complete activity logging
- ✅ Dynamic footer content management

---

## 🏗️ Database Architecture

### Database Provider
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Why PostgreSQL?**
- Strong relational data integrity
- Excellent support for JSON fields
- High performance for complex queries
- Native support for DECIMAL types (important for pricing)

### ID Strategy
All models use **CUID** (Collision-resistant Unique Identifier) for primary keys:
```prisma
id String @id @default(cuid())
```

**Benefits:**
- URL-safe identifiers
- Sortable by creation time
- No database sequence needed
- Better for distributed systems

---

## 🔐 Authentication & User Management

### 1. User Model
**Location:** Core user table  
**Purpose:** Central hub for all user-related data

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  emailVerified DateTime?
  password      String?
  phone         String?
  image         String?
  role          Role          @default(CUSTOMER)
  isActive      Boolean       @default(true)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  name          String?
  // Relations...
}
```

**Fields Explained:**
- `email`: Unique identifier for login (indexed for fast lookups)
- `emailVerified`: Tracks if user verified their email (important for security)
- `password`: Hashed password (nullable for OAuth users)
- `phone`: Optional contact number
- `role`: Either CUSTOMER or ADMIN (determines access levels)
- `isActive`: Soft delete flag (keeps user data but prevents login)

**Relationships:**
- `accounts[]`: OAuth provider accounts (Google, Facebook, etc.)
- `sessions[]`: Active login sessions
- `orders[]`: Purchase history
- `reviews[]`: Product reviews written by user
- `carts[]`: Shopping carts (can have multiple for abandoned carts)
- `wishlists[]`: Saved product lists
- `addresses[]`: Shipping/billing addresses
- `adminUser`: Extended admin permissions (one-to-one)
- `activityLogs[]`: Audit trail of user actions

**Data Flow Example:**
```
User Registration → Create User → Send Verification Email → 
User Clicks Link → Update emailVerified → Allow Full Access
```

---

### 2. Account Model
**Purpose:** Stores OAuth provider connections (Google, Facebook, GitHub, etc.)

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  // ...
}
```

**Why This Exists:**
- Allows "Sign in with Google/Facebook"
- One user can link multiple providers
- Stores OAuth tokens for API access

**Unique Constraint:**
```prisma
@@unique([provider, providerAccountId])
```
This ensures a user can't link the same Google account twice.

**Data Flow Example:**
```
User clicks "Sign in with Google" → 
Google OAuth redirect → 
Receive tokens → 
Check if Account exists → 
If yes: Login user | If no: Create User + Account → 
Store tokens for API calls
```

---

### 3. Session Model
**Purpose:** Manages active user sessions for authentication

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(...)
}
```

**How It Works:**
1. User logs in → Create Session with unique token
2. Browser stores sessionToken in cookie
3. Each request sends token → Backend validates against Session table
4. If expired → Require re-login

**Security Note:**
- Sessions auto-expire via `expires` field
- Token is unique to prevent session hijacking
- Deleting user cascades to delete all sessions

---

### 4. VerificationToken Model
**Purpose:** Email verification and password reset tokens

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

**Use Cases:**
1. **Email Verification:** 
   - Send token to user's email
   - User clicks link with token
   - Verify token exists and not expired
   - Mark email as verified

2. **Password Reset:**
   - User requests reset
   - Generate token, send email
   - User enters new password with token
   - Validate token and update password

**Important:** Tokens should expire quickly (15-30 minutes) for security.

---

### 5. Role Enum
```prisma
enum Role {
  CUSTOMER
  ADMIN
}
```

**Access Control:**
- **CUSTOMER:** Can browse, purchase, review products
- **ADMIN:** Can manage products, orders, view analytics

**Checking Roles in Code:**
```typescript
if (user.role === 'ADMIN') {
  // Show admin dashboard
}
```

---

### 6. AdminUser Model
**Purpose:** Extended admin-specific data and permissions

```prisma
model AdminUser {
  id          String    @id @default(cuid())
  userId      String    @unique
  permissions Json
  lastLoginAt DateTime?
  // ...
}
```

**Why Separate Model?**
- Not all users are admins (saves space)
- Allows fine-grained permissions via JSON
- Tracks admin-specific activity

**Permissions Example:**
```json
{
  "canManageProducts": true,
  "canManageOrders": true,
  "canManageUsers": false,
  "canViewAnalytics": true
}
```

---

## 📦 Product Catalog System

### 1. Category Model
**Purpose:** Hierarchical product organization (supports unlimited nesting)

```prisma
model Category {
  id           String            @id @default(cuid())
  name         String
  slug         String            @unique
  description  String?
  image        String?
  parentId     String?
  displayOrder Int               @default(0)
  isActive     Boolean           @default(true)
  parent       Category?         @relation("CategoryHierarchy", ...)
  children     Category[]        @relation("CategoryHierarchy")
  products     ProductCategory[]
  // ...
}
```

**Self-Referencing Relationship Explained:**
```
Electronics (parentId: null)
├── Laptops (parentId: Electronics.id)
│   ├── Gaming Laptops (parentId: Laptops.id)
│   └── Business Laptops (parentId: Laptops.id)
└── Phones (parentId: Electronics.id)
    ├── Android (parentId: Phones.id)
    └── iPhone (parentId: Phones.id)
```

**Key Fields:**
- `slug`: URL-friendly identifier (e.g., "gaming-laptops")
- `displayOrder`: Controls sorting on frontend
- `isActive`: Hide categories without deleting them
- `parentId`: Links to parent category (null = root category)

**Querying Category Tree:**
```typescript
// Get all top-level categories with their children
const categories = await prisma.category.findMany({
  where: { parentId: null },
  include: {
    children: {
      include: {
        children: true // Nested children
      }
    }
  }
});
```

---

### 2. Product Model
**Purpose:** Core product information

```prisma
model Product {
  id               String            @id @default(cuid())
  name             String
  slug             String            @unique
  description      String?
  shortDescription String?
  sku              String            @unique
  price            Decimal           @db.Decimal(10, 2)
  isFeatured       Boolean           @default(false)
  metaTitle        String?
  metaDescription  String?
  // ...
}
```

**Important Fields:**
- `sku`: Stock Keeping Unit - unique product identifier
- `price`: Base price (variants can override this)
- `isFeatured`: Show on homepage/promotional sections
- `metaTitle/metaDescription`: SEO optimization

**Why Both `description` and `shortDescription`?**
- `shortDescription`: Quick preview on listing pages
- `description`: Full details on product page

**Data Flow Example:**
```
Admin creates product → 
Add to categories (ProductCategory) → 
Upload images (ProductImage) → 
Create variants (ProductVariant) → 
Set inventory (Inventory) → 
Product visible to customers
```

---

### 3. ProductVariant Model
**Purpose:** Different versions of the same product (color, size, etc.)

```prisma
model ProductVariant {
  id           String         @id @default(cuid())
  productId    String
  sku          String         @unique
  name         String
  price        Decimal?       @db.Decimal(10, 2)
  color        String?
  size         String?
  weight       Decimal?       @db.Decimal(8, 2)
  dimensions   String?
  // ...
}
```

**Real-World Example:**
```
Product: "Classic T-Shirt" (base price: $20)
├── Variant 1: Red, Small (price: null) → Uses base price
├── Variant 2: Red, Large (price: $22) → Override price
├── Variant 3: Blue, Medium (price: null)
└── Variant 4: Black, XL (price: $25)
```

**Why Nullable Price?**
- If null, use Product.price
- If set, override with variant-specific price

**Each Variant Has:**
- Own SKU (for tracking)
- Own inventory count
- Own images (optional)
- Separate cart/order items

---

### 4. ProductImage Model
**Purpose:** Store product and variant images

```prisma
model ProductImage {
  id           String          @id @default(cuid())
  productId    String
  variantId    String?
  url          String
  altText      String?
  displayOrder Int             @default(0)
  isPrimary    Boolean         @default(false)
  // ...
}
```

**Image Association Logic:**
1. **Product-level images** (variantId = null): Shown when no variant selected
2. **Variant-specific images** (variantId set): Shown when variant selected

**Example:**
```
T-Shirt Product:
├── Image 1 (primary, no variant) → Default image
├── Image 2 (no variant) → Gallery image
Red Variant:
├── Image 3 (variantId = red.id) → Shows red shirt
Blue Variant:
├── Image 4 (variantId = blue.id) → Shows blue shirt
```

**Display Order:**
- `isPrimary`: First image shown (thumbnail)
- `displayOrder`: Sort remaining images

---

### 5. ProductCategory Model
**Purpose:** Many-to-many relationship between Products and Categories

```prisma
model ProductCategory {
  productId  String
  categoryId String
  assignedAt DateTime @default(now())
  
  @@id([productId, categoryId])
}
```

**Why This Table Exists:**
- One product can be in multiple categories
- Example: "Gaming Laptop" → Categories: Electronics, Laptops, Gaming

**Composite Primary Key:**
```prisma
@@id([productId, categoryId])
```
Ensures a product can't be added to the same category twice.

---

### 6. Inventory Model
**Purpose:** Track stock levels for each product variant

```prisma
model Inventory {
  id                String         @id @default(cuid())
  productVariantId  String         @unique
  quantity          Int            @default(0)
  reservedQuantity  Int            @default(0)
  location          String?
  lowStockThreshold Int            @default(5)
  lastRestocked     DateTime?
  // ...
}
```

**Critical Concept - Reserved Quantity:**
```
Total Stock: 100 units
Reserved (in active carts): 20 units
Available for sale: 80 units
```

**Flow When User Adds to Cart:**
1. Check: `(quantity - reservedQuantity) >= requestedQuantity`
2. If yes: Add to cart, increase `reservedQuantity`
3. If cart expires/order cancelled: Decrease `reservedQuantity`
4. On successful order: Decrease both `quantity` and `reservedQuantity`

**Low Stock Alert:**
If `(quantity - reservedQuantity) < lowStockThreshold` → Alert admin

---

## 🛒 Shopping & Cart System

### 1. Cart Model
**Purpose:** Store items user wants to purchase

```prisma
model Cart {
  id        String     @id @default(cuid())
  userId    String?
  sessionId String?
  expiresAt DateTime
  items     CartItem[]
  // ...
}
```

**Two Cart Types:**

**A. Logged-in User Cart:**
```prisma
userId: "user_123"
sessionId: null
```

**B. Guest Cart:**
```prisma
userId: null
sessionId: "session_xyz"
```

**Cart Expiration:**
- Prevents abandoned carts from reserving inventory forever
- Guest carts expire quickly (24-48 hours)
- User carts can last longer (30 days)

**Cart Merge Flow:**
```
Guest adds items → Cart created with sessionId →
User logs in → Check if cart exists for userId →
If yes: Merge sessionId cart into userId cart →
Delete sessionId cart
```

---

### 2. CartItem Model
**Purpose:** Individual products in a cart

```prisma
model CartItem {
  id               String         @id @default(cuid())
  cartId           String
  productVariantId String
  quantity         Int
  price            Decimal        @db.Decimal(10, 2)
  // ...
}
```

**Why Store Price?**
- Product price may change after item added to cart
- Storing price ensures cart total doesn't change unexpectedly
- On checkout, recalculate with current price (ask user to confirm if different)

**Cart Total Calculation:**
```typescript
const cartTotal = cartItems.reduce((sum, item) => {
  return sum + (item.price * item.quantity);
}, 0);
```

---

### 3. Wishlist & WishlistItem Models

**Wishlist:**
```prisma
model Wishlist {
  id        String         @id @default(cuid())
  userId    String
  name      String         @default("My Wishlist")
  isDefault Boolean        @default(false)
  items     WishlistItem[]
  // ...
}
```

**Why Multiple Wishlists?**
- Users can organize products (e.g., "Birthday Gifts", "Work Setup")
- One default wishlist for quick "Add to Wishlist" clicks

**WishlistItem:**
```prisma
model WishlistItem {
  id         String   @id @default(cuid())
  wishlistId String
  productId  String
  
  @@unique([wishlistId, productId])
}
```

**Unique Constraint:**
Prevents duplicate products in same wishlist.

**Wishlist vs Cart:**
- Wishlist: Save for later (no inventory reservation)
- Cart: Intent to purchase (reserves inventory)

---

## 📦 Order Management System

### 1. Order Model
**Purpose:** Completed purchase records

```prisma
model Order {
  id                String        @id @default(cuid())
  orderNumber       String        @unique
  userId            String
  status            OrderStatus   @default(PENDING)
  paymentStatus     PaymentStatus @default(PENDING)
  subtotal          Decimal
  shippingCost      Decimal
  tax               Decimal
  total             Decimal
  currency          String        @default("NPR")
  shippingAddressId String
  billingAddressId  String
  trackingNumber    String?
  // ...
}
```

**Order Lifecycle:**
```
PENDING → User completed checkout, payment processing
PROCESSING → Payment confirmed, preparing items
CONFIRMED → Items packed, ready to ship
SHIPPED → Out for delivery (trackingNumber added)
DELIVERED → Customer received items
CANCELLED → Order cancelled (refund initiated)
REFUNDED → Money returned to customer
```

**Price Breakdown:**
```
Subtotal: Sum of all items
+ Shipping Cost
+ Tax
= Total (amount charged)
```

**Why Separate Shipping and Billing Address?**
- Customer may want delivery elsewhere (gift, work address)
- Different address for billing (credit card address)

**Order Number:**
- Unique, human-friendly identifier (e.g., "ORD-2024-00123")
- Used for customer support and tracking

---

### 2. OrderItem Model
**Purpose:** Snapshot of purchased products

```prisma
model OrderItem {
  id               String         @id @default(cuid())
  orderId          String
  productVariantId String
  productName      String
  variantName      String
  sku              String
  quantity         Int
  price            Decimal
  total            Decimal
  // ...
}
```

**Why Duplicate Product Info?**
- Product details may change after order
- Ensures order history remains accurate
- Example: "Blue T-Shirt" renamed to "Azure Tee" → Old orders still show "Blue T-Shirt"

**Data Captured:**
- `productName`: Product name at time of purchase
- `variantName`: Variant details at time of purchase
- `sku`: For warehouse/fulfillment
- `price`: Price paid per unit
- `total`: price × quantity

---

### 3. Address Model
**Purpose:** Store shipping and billing addresses

```prisma
model Address {
  id             String      @id @default(cuid())
  userId         String
  type           AddressType @default(BOTH)
  fullName       String
  phone          String
  addressLine1   String
  addressLine2   String?
  city           String
  state          String
  postalCode     String
  country        String      @default("Nepal")
  isDefault      Boolean     @default(false)
  // ...
}
```

**Address Types:**
```prisma
enum AddressType {
  SHIPPING   // Only for deliveries
  BILLING    // Only for invoices
  BOTH       // Can be used for either
}
```

**Default Address:**
- If `isDefault = true`, auto-select during checkout
- User can have multiple addresses but only one default

**Relations:**
```prisma
billingOrders  Order[] @relation("BillingAddress")
shippingOrders Order[] @relation("ShippingAddress")
```
This allows one address to be used in multiple orders.

---

## 💳 Payment System

### Payment Model
**Purpose:** Track payment transactions

```prisma
model Payment {
  id              String        @id @default(cuid())
  orderId         String
  stripePaymentId String?       @unique
  amount          Decimal
  currency        String        @default("NPR")
  status          PaymentStatus
  paymentMethod   String?
  metadata        Json?
  errorMessage    String?
  // ...
}
```

**Payment Flow:**
```
1. User clicks "Place Order" → Create Order (status: PENDING)
2. Redirect to payment gateway (Stripe, etc.)
3. Create Payment record (status: PENDING)
4. Payment successful → Update Payment (status: PAID)
5. Update Order (paymentStatus: PAID, status: PROCESSING)
6. Payment failed → Update Payment (status: FAILED, errorMessage)
```

**Multiple Payments Per Order:**
- Useful for split payments
- Partial refunds (create new Payment with negative amount)

**Metadata Field:**
```json
{
  "gateway": "stripe",
  "transactionId": "ch_123456",
  "cardBrand": "visa",
  "last4": "4242",
  "receiptUrl": "https://stripe.com/receipt/xyz"
}
```

---

## ⭐ Review System

### 1. Review Model
**Purpose:** Customer product feedback

```prisma
model Review {
  id                 String        @id @default(cuid())
  productId          String
  userId             String
  rating             Int
  title              String?
  comment            String
  isVerifiedPurchase Boolean       @default(false)
  status             ReviewStatus  @default(PENDING)
  helpfulCount       Int           @default(0)
  images             ReviewImage[]
  // ...
}
```

**Review Status Flow:**
```
PENDING → New review submitted, awaiting moderation
APPROVED → Visible to public
REJECTED → Spam/inappropriate, hidden
```

**Verified Purchase Badge:**
- `isVerifiedPurchase = true`: User actually bought this product
- Increases trust in review

**Helpful Count:**
- Other users can mark review as helpful
- Sort reviews by helpfulness

**Review Moderation:**
1. User submits review (status: PENDING)
2. Admin reviews for spam/profanity
3. Admin approves/rejects
4. Only APPROVED reviews shown on product page

---

### 2. ReviewImage Model
**Purpose:** Customer-uploaded photos with reviews

```prisma
model ReviewImage {
  id           String   @id @default(cuid())
  reviewId     String
  url          String
  displayOrder Int      @default(0)
  // ...
}
```

**Why Important:**
- Visual proof increases trust
- Shows real-world product usage
- Helps other customers make decisions

---

## 🔧 Admin & Activity Tracking

### 1. ActivityLog Model
**Purpose:** Audit trail of all system changes

```prisma
model ActivityLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String
  entityType String
  entityId   String
  changes    Json?
  ipAddress  String?
  userAgent  String?
  // ...
}
```

**Use Cases:**
- Security: Track who changed what
- Debugging: Find when/how data was modified
- Compliance: Required for some industries

**Example Log Entry:**
```json
{
  "userId": "user_123",
  "action": "UPDATE",
  "entityType": "Product",
  "entityId": "prod_456",
  "changes": {
    "price": {
      "old": 100.00,
      "new": 89.99
    }
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**When to Log:**
- User login/logout
- Order placement
- Product/price changes
- Admin actions
- Failed login attempts (security)

---

## 🎨 Site Configuration

### 1. SiteSetting Model
**Purpose:** Store site-wide configuration

```prisma
model SiteSetting {
  key       String   @id
  value     Json
  updatedBy String?
  updatedAt DateTime @updatedAt
}
```

**Example Settings:**
```json
// key: "site_info"
{
  "siteName": "MyStore",
  "tagline": "Best Deals Online",
  "logo": "/logo.png",
  "currency": "NPR"
}

// key: "shipping_config"
{
  "freeShippingThreshold": 500,
  "flatRate": 100,
  "expressRate": 200
}

// key: "tax_config"
{
  "taxRate": 0.13,
  "taxLabel": "VAT"
}
```

**Why JSON?**
- Flexible structure (no schema changes needed)
- Easy to add new settings
- Can store complex nested data

---

### 2. Footer Models
**Purpose:** Dynamic footer content management

**FooterBrand:**
```prisma
model FooterBrand {
  id          String   @id @default(cuid())
  name        String
  logo        String
  tagline     String
  description String
  isActive    Boolean  @default(true)
}
```
Stores company info shown in footer.

**FooterSection & FooterLink:**
```prisma
model FooterSection {
  id           String       @id @default(cuid())
  title        String
  displayOrder Int
  links        FooterLink[]
}

model FooterLink {
  id           String        @id @default(cuid())
  sectionId    String
  name         String
  href         String
  displayOrder Int
  section      FooterSection @relation(...)
}
```

**Example Footer Structure:**
```
Company            Support           Legal
├── About Us       ├── Help Center   ├── Privacy Policy
├── Careers        ├── Contact       ├── Terms of Service
└── Press          └── FAQ           └── Refund Policy
```

**FooterSocial:**
```prisma
model FooterSocial {
  id           String   @id @default(cuid())
  name         String
  icon         String
  href         String
  displayOrder Int
}
```
Social media links (Facebook, Instagram, Twitter).

**FooterContact:**
```prisma
model FooterContact {
  id        String   @id @default(cuid())
  email     String
  phone     String
  address   String
  isActive  Boolean
}
```
Contact information.

**FooterNewsletter:**
```prisma
model FooterNewsletter {
  id          String   @id @default(cuid())
  title       String
  description String
  isActive    Boolean
}
```
Newsletter signup section text.

---

### 3. NewsletterSubscriber Model
**Purpose:** Manage email subscribers

```prisma
model NewsletterSubscriber {
  id             String             @id @default(cuid())
  email          String             @unique
  status         SubscriptionStatus @default(SUBSCRIBED)
  subscribedAt   DateTime           @default(now())
  unsubscribedAt DateTime?
}

enum SubscriptionStatus {
  SUBSCRIBED
  UNSUBSCRIBED
  BOUNCED
}
```

**Status Meanings:**
- `SUBSCRIBED`: Active subscriber
- `UNSUBSCRIBED`: User opted out
- `BOUNCED`: Email delivery failed (invalid address)

**Compliance Note:**
Always include unsubscribe link in emails (required by law).

---

## 📊 Data Flow Diagrams

### User Journey: Product Discovery to Order

```
┌─────────────┐
│   Browse    │
│  Products   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Filter    │────▶│   Search    │
│  Category   │     │  Products   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └────────┬──────────┘
                ▼
       ┌─────────────────┐
       │  View Product   │
       │     Details     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Select Variant │
       │  (Size, Color)  │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Add to Cart    │
       │ (or Wishlist)   │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  View Cart      │
       │  Update Qty     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Checkout       │
       │  Select Address │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Payment        │
       │  Processing     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Order Created  │
       │  Confirmation   │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Order Tracking │
       │  & Delivery     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Leave Review   │
       └─────────────────┘
```

---

### Database Relationship Map

```
User
├── Has Many: Orders
├── Has Many: Carts
├── Has Many: Wishlists
├── Has Many: Reviews
├── Has Many: Addresses
├── Has Many: Sessions
├── Has Many: Accounts
├── Has Many: ActivityLogs
└── Has One: AdminUser

Product
├── Has Many: ProductImages
├── Has Many: ProductVariants
├── Has Many: Reviews
├── Has Many: WishlistItems
└── Belongs to Many: Categories (via ProductCategory)

ProductVariant
├── Has Many: CartItems
├── Has Many: OrderItems
├── Has Many: ProductImages
└── Has One: Inventory

Order
├── Has Many: OrderItems
├── Has Many: Payments
├── Belongs to One: User
├── Belongs to One: ShippingAddress
└── Belongs to One: BillingAddress

Category
├── Has Many: Children (sub-categories)
├── Belongs to One: Parent (optional)
└── Belongs to Many: Products (via ProductCategory)
```

---

## 🔍 Common Queries & Usage Examples

### 1. Get Product with All Details

```typescript
const product = await prisma.product.findUnique({
  where: { slug: 'gaming-laptop-x15' },
  include: {
    images: {
      orderBy: { displayOrder: 'asc' }
    },
    variants: {
      where: { isActive: true },
      include: {
        inventory: true,
        images: true
      }
    },
    categories: {
      include: {
        category: true
      }
    },
    reviews: {
      where: { status: 'APPROVED' },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
        images: true
      }
    }
  }
});
```

**What This Returns:**
- Product details
- All product images (sorted)
- Active variants with stock levels
- All categories product belongs to
- Approved reviews with user info

---

### 2. Get User's Cart with Items

```typescript
const cart = await prisma.cart.findFirst({
  where: {
    userId: currentUser.id,
    expiresAt: { gt: new Date() } // Not expired
  },
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            },
            inventory: true
          }
        }
      }
    }
  }
});

// Calculate cart total
const cartTotal = cart?.items.reduce((sum, item) => {
  return sum + (item.price.toNumber() * item.quantity);
}, 0) || 0;
```

---

### 3. Create Order from Cart

```typescript
// 1. Create order
const order = await prisma.order.create({
  data: {
    orderNumber: generateOrderNumber(),
    userId: user.id,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    subtotal: cartTotal,
    shippingCost: shippingCost,
    tax: taxAmount,
    total: cartTotal + shippingCost + taxAmount,
    shippingAddressId: selectedShippingAddress.id,
    billingAddressId: selectedBillingAddress.id,
    items: {
      create: cartItems.map(item => ({
        productVariantId: item.productVariantId,
        productName: item.productVariant.product.name,
        variantName: item.productVariant.name,
        sku: item.productVariant.sku,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }))
    }
  }
});

// 2. Update inventory
for (const item of cartItems) {
  await prisma.inventory.update({
    where: { productVariantId: item.productVariantId },
    data: {
      quantity: { decrement: item.quantity },
      reservedQuantity: { decrement: item.quantity }
    }
  });
}

// 3. Clear cart
await prisma.cartItem.deleteMany({
  where: { cartId: cart.id }
});
```

---

### 4. Get Category Tree

```typescript
const categoryTree = await prisma.category.findMany({
  where: { 
    parentId: null,
    isActive: true
  },
  include: {
    children: {
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    }
  },
  orderBy: { displayOrder: 'asc' }
});
```

**Returns nested structure:**
```javascript
[
  {
    id: '1',
    name: 'Electronics',
    children: [
      {
        id: '2',
        name: 'Laptops',
        children: [
          { id: '3', name: 'Gaming Laptops' },
          { id: '4', name: 'Business Laptops' }
        ]
      }
    ]
  }
]
```

---

### 5. Search Products with Filters

```typescript
const products = await prisma.product.findMany({
  where: {
    AND: [
      { isActive: true },
      {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
      {
        categories: {
          some: {
            categoryId: { in: selectedCategoryIds }
          }
        }
      },
      {
        price: {
          gte: minPrice,
          lte: maxPrice
        }
      }
    ]
  },
  include: {
    images: {
      where: { isPrimary: true },
      take: 1
    },
    variants: {
      include: {
        inventory: true
      }
    }
  },
  orderBy: sortBy === 'price-asc' ? { price: 'asc' } : { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize
});
```

---

### 6. Get User's Order History

```typescript
const orders = await prisma.order.findMany({
  where: { userId: user.id },
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
    },
    shippingAddress: true,
    payments: true
  },
  orderBy: { createdAt: 'desc' }
});
```

---

### 7. Check Product Stock Before Adding to Cart

```typescript
async function canAddToCart(variantId: string, requestedQty: number) {
  const inventory = await prisma.inventory.findUnique({
    where: { productVariantId: variantId }
  });
  
  if (!inventory) {
    return { canAdd: false, reason: 'Product not found' };
  }
  
  const availableQty = inventory.quantity - inventory.reservedQuantity;
  
  if (availableQty < requestedQty) {
    return { 
      canAdd: false, 
      reason: `Only ${availableQty} units available`,
      availableQty 
    };
  }
  
  return { canAdd: true, availableQty };
}
```

---

### 8. Get Product Reviews with Statistics

```typescript
const [reviews, stats] = await Promise.all([
  // Get reviews
  prisma.review.findMany({
    where: {
      productId: productId,
      status: 'APPROVED'
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      },
      images: true
    },
    orderBy: [
      { isVerifiedPurchase: 'desc' },
      { helpfulCount: 'desc' },
      { createdAt: 'desc' }
    ]
  }),
  
  // Get statistics
  prisma.review.aggregate({
    where: {
      productId: productId,
      status: 'APPROVED'
    },
    _avg: { rating: true },
    _count: { rating: true }
  })
]);

const averageRating = stats._avg.rating || 0;
const totalReviews = stats._count.rating;
```

---

## 🚀 Future Enhancement Notes

### Areas for Potential Updates

#### 1. **Coupon/Discount System**
```prisma
model Coupon {
  id            String   @id @default(cuid())
  code          String   @unique
  discountType  String   // PERCENTAGE, FIXED
  discountValue Decimal
  minOrderValue Decimal?
  maxUses       Int?
  usedCount     Int      @default(0)
  expiresAt     DateTime?
  isActive      Boolean  @default(true)
}
```

#### 2. **Product Attributes (Flexible Specifications)**
```prisma
model ProductAttribute {
  id        String @id @default(cuid())
  productId String
  name      String // "RAM", "Storage", "Screen Size"
  value     String // "16GB", "512GB SSD", "15.6 inch"
  product   Product @relation(...)
}
```

#### 3. **Shipping Methods**
```prisma
model ShippingMethod {
  id               String  @id @default(cuid())
  name             String  // "Standard", "Express", "Overnight"
  description      String?
  cost             Decimal
  estimatedDays    Int
  isActive         Boolean @default(true)
}
```

#### 4. **Notifications System**
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  type      String   // ORDER_UPDATE, PRODUCT_BACK_IN_STOCK, PROMOTION
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(...)
}
```

#### 5. **Product Compare Feature**
```prisma
model ProductComparison {
  id        String   @id @default(cuid())
  userId    String
  productId String
  addedAt   DateTime @default(now())
  user      User     @relation(...)
  product   Product  @relation(...)
  
  @@unique([userId, productId])
}
```

#### 6. **Return/Refund Management**
```prisma
model Return {
  id          String       @id @default(cuid())
  orderId     String
  reason      String
  status      ReturnStatus @default(PENDING)
  refundAmount Decimal
  createdAt   DateTime     @default(now())
  order       Order        @relation(...)
}
```

---

### Making Schema Changes

When you need to update the schema in the future:

#### Step 1: Update schema.prisma
```prisma
// Add new field to existing model
model Product {
  // ... existing fields
  weight      Decimal?  @db.Decimal(8, 2)  // NEW FIELD
}
```

#### Step 2: Create Migration
```bash
npx prisma migrate dev --name add_product_weight
```

#### Step 3: Update This Documentation
- Add new field description
- Update relevant data flow sections
- Add new query examples if needed

#### Step 4: Update Frontend/API
- Update TypeScript types
- Modify API endpoints
- Update UI components

---

## 📝 Best Practices

### 1. **Always Use Transactions for Related Operations**
```typescript
await prisma.$transaction(async (tx) => {
  // Create order
  const order = await tx.order.create({...});
  
  // Update inventory
  await tx.inventory.update({...});
  
  // Clear cart
  await tx.cartItem.deleteMany({...});
});
```

### 2. **Index Important Query Fields**
All frequently queried fields should have `@@index`:
```prisma
@@index([email])     // User lookups
@@index([slug])      // Product/Category URLs
@@index([status])    // Order filtering
@@index([createdAt]) // Date-based queries
```

### 3. **Use Soft Deletes**
Instead of deleting records, use `isActive` flags:
```prisma
isActive Boolean @default(true)
```

This preserves data history and relationships.

### 4. **Validate Data Before Database Operations**
```typescript
// Use Zod or similar for validation
const productSchema = z.object({
  name: z.string().min(3).max(200),
  price: z.number().positive(),
  sku: z.string().regex(/^[A-Z0-9-]+$/),
});
```

### 5. **Handle Cascade Deletes Carefully**
```prisma
onDelete: Cascade  // Use when child data is useless without parent
onDelete: Restrict // Use to prevent accidental deletions
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. **Unique Constraint Violation**
```
Error: Unique constraint failed on the fields: (`email`)
```
**Solution:** Check if record with same unique field already exists.

#### 2. **Foreign Key Constraint Failed**
```
Error: Foreign key constraint failed on the field: (`userId`)
```
**Solution:** Ensure referenced record exists before creating relation.

#### 3. **Decimal Precision Issues**
```typescript
// ❌ Wrong
price: 10.50

// ✅ Correct
price: new Decimal(10.50)
```

#### 4. **Date Comparison**
```typescript
// ❌ Wrong
where: { expiresAt: { gt: Date.now() } }

// ✅ Correct
where: { expiresAt: { gt: new Date() } }
```

---

## 📚 Additional Resources

### Prisma Documentation
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Related Technologies
- Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
- Supabase: [https://supabase.com/docs](https://supabase.com/docs)
- PostgreSQL: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

---

## 📄 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 6, 2025 | Initial schema documentation | [Your Name] |

---

## 📧 Questions or Feedback?

If you have questions about this schema or suggestions for improvements:

1. **Check this documentation first** - Most common questions are answered here
2. **Ask in team chat** - Your colleagues may have encountered similar issues
3. **Update this document** - If you find a solution, document it here for others

---

**Remember:** This documentation is a living document. Keep it updated as the schema evolves!
