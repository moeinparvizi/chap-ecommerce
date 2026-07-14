# Microservice Design

## 1. Service Architecture Overview

```
                              ┌─────────────────────┐
                              │    CDN (CloudFront)  │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   Load Balancer      │
                              │   (ALB / Nginx)      │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │    API Gateway       │
                              │   (NestJS / Kong)    │
                              └──────────┬──────────┘
                                         │
            ┌────────────────────────────┼────────────────────────────┐
            │                            │                            │
   ┌────────▼────────┐  ┌───────────────▼──────────────┐  ┌─────────▼─────────┐
   │   Web App        │  │      Internal Services        │  │   Admin App       │
   │   (Next.js)      │  │                               │  │   (Next.js)       │
   └─────────────────┘  └──────────────────────────────┘  └───────────────────┘
                                         │
        ┌────────┬────────┬──────────────┼──────────────┬────────┬────────┐
        │        │        │              │              │        │        │
   ┌────▼──┐ ┌───▼───┐ ┌──▼───┐   ┌─────▼─────┐  ┌───▼───┐ ┌──▼──┐ ┌──▼────┐
   │ Auth  │ │User   │ │Product│   │   Order   │  │Payment│ │Ship │ │Search │
   │Service│ │Service│ │Service│   │  Service  │  │Service│ │ping │ │Service│
   └───────┘ └───────┘ └───────┘   └───────────┘  └───────┘ └─────┘ └───────┘
        │        │        │              │              │        │        │
   ┌────▼──┐ ┌───▼───┐ ┌──▼───┐   ┌─────▼─────┐  ┌───▼───┐ ┌──▼──┐ ┌──▼────┐
   │ Redis │ │ PgSQL │ │ PgSQL│   │   PgSQL   │  │ PgSQL │ │PgSQL│ │  ES   │
   └───────┘ └───────┘ └───────┘   └───────────┘  └───────┘ └─────┘ └───────┘
```

---

## 2. Service Definitions

### 2.1 API Gateway

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS (existing foundation) |
| **Responsibilities** | Request routing, rate limiting, authentication verification, request/response transformation, CORS, logging |
| **Database** | None (stateless) |
| **Events** | Consumes: None (entry point) |
| **API** | Routes all external requests to internal services |
| **Dependencies** | All services |
| **Scaling** | Horizontal (stateless, behind load balancer) |

**Route Mapping:**
```
/api/v1/auth/*        → Auth Service
/api/v1/users/*       → User Service
/api/v1/products/*    → Product Service
/api/v1/categories/*  → Product Service
/api/v1/brands/*      → Product Service
/api/v1/cart/*        → Cart Service
/api/v1/orders/*      → Order Service
/api/v1/payments/*    → Payment Service
/api/v1/shipping/*    → Shipping Service
/api/v1/reviews/*     → Review Service
/api/v1/wishlists/*   → Wishlist Service
/api/v1/coupons/*     → Promotion Service
/api/v1/search/*      → Search Service
/api/v1/cms/*         → CMS Service
/api/v1/media/*       → Media Service
/api/v1/notifications/* → Notification Service
/api/v1/admin/*       → Admin Service
/api/v1/analytics/*   → Analytics Service
```

---

### 2.2 Auth Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Registration, login, logout, JWT management, OAuth, password reset, email verification, MFA |
| **Database** | `auth_db` (PostgreSQL) |
| **Events Published** | UserRegistered, UserLogin, UserLogout, PasswordReset, EmailVerified, MfaEnabled |
| **Events Consumed** | None (foundational) |
| **Public APIs** | POST /auth/register, POST /auth/login, POST /auth/logout, POST /auth/refresh, POST /auth/forgot-password, POST /auth/reset-password, POST /auth/verify-email, POST /auth/mfa/enable, POST /auth/mfa/verify |
| **Dependencies** | Notification Service (send verification emails) |
| **Scaling** | Horizontal (stateless JWT) |

---

### 2.3 User Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | User profile management, addresses, preferences, account settings |
| **Database** | `user_db` (PostgreSQL) |
| **Events Published** | UserProfileUpdated, AddressAdded, AddressUpdated, AddressDeleted, UserDeactivated |
| **Events Consumed** | UserRegistered (create profile), UserLogin (update last login) |
| **Public APIs** | GET /users/me, PATCH /users/me, GET /users/addresses, POST /users/addresses, PATCH /users/addresses/:id, DELETE /users/addresses/:id |
| **Dependencies** | Auth Service (identity), Media Service (avatar) |
| **Scaling** | Horizontal + Read Replicas |

---

### 2.4 Product Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Product CRUD, categories, brands, attributes, variants, product images |
| **Database** | `product_db` (PostgreSQL) |
| **Events Published** | ProductCreated, ProductUpdated, ProductDeleted, ProductVariantCreated, CategoryCreated, CategoryUpdated, BrandCreated |
| **Events Consumed** | MediaUploaded (attach images), StockUpdated (update availability) |
| **Public APIs** | Full CRUD for products, categories, brands, attributes |
| **Dependencies** | Media Service (images), Inventory Service (stock status), Pricing Service (prices), Search Service (indexing) |
| **Scaling** | Horizontal + Read Replicas + Redis Cache |

---

### 2.5 Inventory Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Stock tracking, warehouse management, reservations, stock movements |
| **Database** | `inventory_db` (PostgreSQL) |
| **Events Published** | StockReserved, StockReleased, StockDepleted, LowStockAlert, StockAdjusted |
| **Events Consumed** | OrderPlaced (reserve), OrderCancelled (release), OrderCompleted (commit) |
| **Public APIs** | GET /inventory/:productId, POST /inventory/reserve, DELETE /inventory/reserve/:id, POST /inventory/adjust |
| **Dependencies** | Product Service (product info), Order Service (order events) |
| **Scaling** | Horizontal (optimistic locking for concurrency) |

---

### 2.6 Pricing Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Price management, discount calculations, currency conversion, price history |
| **Database** | `pricing_db` (PostgreSQL) |
| **Events Published** | PriceChanged, DiscountApplied, DiscountRemoved, ExchangeRateUpdated |
| **Events Consumed** | None (standalone calculation service) |
| **Public APIs** | GET /pricing/:productId, POST /pricing/calculate, GET /pricing/currencies, POST /pricing/convert |
| **Dependencies** | Product Service (product info) |
| **Scaling** | Horizontal + Redis Cache (prices change infrequently) |

---

### 2.7 Cart Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Cart CRUD, item management, cart calculations, guest cart merging |
| **Database** | Redis (primary), PostgreSQL (persistence) |
| **Events Published** | CartCreated, CartUpdated, CartItemAdded, CartItemRemoved, CartAbandoned |
| **Events Consumed** | ProductPriceChanged, StockDepleted, CouponApplied |
| **Public APIs** | GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id, POST /cart/coupon, DELETE /cart/coupon |
| **Dependencies** | Product Service (product info), Pricing Service (prices), Promotion Service (coupons), Inventory Service (stock check) |
| **Scaling** | Horizontal (Redis for fast access) |

---

### 2.8 Order Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Order creation, status management, history, cancellation, returns |
| **Database** | `order_db` (PostgreSQL) |
| **Events Published** | OrderCreated, OrderConfirmed, OrderProcessing, OrderShipped, OrderDelivered, OrderCancelled, OrderReturned, OrderRefunded |
| **Events Consumed** | CartCheckedOut, PaymentCompleted, ShipmentTrackingUpdated, StockReserved |
| **Public APIs** | POST /orders, GET /orders, GET /orders/:id, PATCH /orders/:id/cancel, GET /orders/:id/track |
| **Dependencies** | Cart Service, Payment Service, Shipping Service, Inventory Service, Pricing Service, Tax Service |
| **Scaling** | Horizontal + Read Replicas + Table Partitioning |

---

### 2.9 Payment Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Payment processing, refunds, payment method management, webhook handling |
| **Database** | `payment_db` (PostgreSQL) |
| **Events Published** | PaymentInitiated, PaymentCompleted, PaymentFailed, PaymentRefunded, PaymentDisputed |
| **Events Consumed** | OrderCreated (initiate), OrderCancelled (refund), OrderReturned (partial refund) |
| **Public APIs** | POST /payments, GET /payments/:id, POST /payments/:id/refund, POST /payments/webhook |
| **Dependencies** | Order Service (order info), User Service (payment methods) |
| **Scaling** | Horizontal (idempotent operations) |

---

### 2.10 Shipping Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Shipping rate calculation, carrier integration, tracking, delivery management |
| **Database** | `shipping_db` (PostgreSQL) |
| **Events Published** | ShipmentCreated, ShipmentDispatched, ShipmentInTransit, ShipmentDelivered, ShipmentException |
| **Events Consumed** | OrderConfirmed (create shipment), OrderCancelled (return) |
| **Public APIs** | GET /shipping/rates, POST /shipments, GET /shipments/:id/track, PATCH /shipments/:id |
| **Dependencies** | Order Service, Address Service, Carrier APIs (external) |
| **Scaling** | Horizontal |

---

### 2.11 Review Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Review CRUD, voting, reporting, moderation, rating aggregation |
| **Database** | `review_db` (PostgreSQL) |
| **Events Published** | ReviewCreated, ReviewUpdated, ReviewDeleted, ReviewModerated, ReviewFlagged |
| **Events Consumed** | OrderDelivered (enable review), ProductCreated (init rating) |
| **Public APIs** | GET /reviews/product/:id, POST /reviews, PATCH /reviews/:id, DELETE /reviews/:id, POST /reviews/:id/vote, POST /reviews/:id/report |
| **Dependencies** | User Service, Product Service, Order Service (verified purchase) |
| **Scaling** | Horizontal + Read Replicas |

---

### 2.12 Wishlist Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Wishlist management, sharing |
| **Database** | `wishlist_db` (PostgreSQL) |
| **Events Published** | WishlistCreated, ItemAdded, ItemRemoved, WishlistShared |
| **Events Consumed** | None |
| **Public APIs** | GET /wishlists, POST /wishlists, POST /wishlists/:id/items, DELETE /wishlists/:id/items/:itemId, POST /wishlists/:id/share |
| **Dependencies** | User Service, Product Service |
| **Scaling** | Horizontal |

---

### 2.13 Notification Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS + Bull (Redis queue) |
| **Responsibilities** | Multi-channel notification delivery (email, SMS, push, in-app), template management, preference management |
| **Database** | `notification_db` (PostgreSQL) |
| **Events Published** | NotificationSent, NotificationDelivered, NotificationRead, NotificationFailed |
| **Events Consumed** | All domain events (order, payment, shipping, review, etc.) |
| **Public APIs** | GET /notifications, PATCH /notifications/:id/read, GET /notifications/preferences, PATCH /notifications/preferences |
| **Dependencies** | User Service (preferences), Email Provider (SMTP/SendGrid), SMS Provider, Push Provider |
| **Scaling** | Horizontal + Queue Workers |

---

### 2.14 Promotion Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Coupon management, promotion campaigns, discount validation, usage tracking |
| **Database** | `promotion_db` (PostgreSQL) |
| **Events Published** | CouponApplied, CouponUsed, PromotionStarted, PromotionEnded, PromotionExceeded |
| **Events Consumed** | OrderCreated (track usage), OrderCancelled (revert usage) |
| **Public APIs** | POST /coupons/validate, POST /coupons/apply, GET /promotions, GET /promotions/active |
| **Dependencies** | Order Service, Product Service, User Service |
| **Scaling** | Horizontal + Redis Cache |

---

### 2.15 Media Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | File upload, image processing, CDN management, media organization |
| **Database** | `media_db` (PostgreSQL) |
| **Events Published** | MediaUploaded, MediaDeleted, ImageProcessed |
| **Events Consumed** | None |
| **Public APIs** | POST /media/upload, GET /media/:id, DELETE /media/:id, POST /media/folders, GET /media/folders |
| **Dependencies** | S3 (storage), Sharp (image processing) |
| **Scaling** | Horizontal + S3 for storage |

---

### 2.16 Search Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS + Elasticsearch |
| **Responsibilities** | Index management, search queries, autocomplete, faceted search, analytics |
| **Database** | Elasticsearch indices |
| **Events Published** | SearchPerformed, AutocompleteRequested |
| **Events Consumed** | ProductCreated/Updated/Deleted, CategoryCreated/Updated, BrandCreated |
| **Public APIs** | GET /search, GET /search/autocomplete, GET /search/facets |
| **Dependencies** | Product Service, Category Service, Brand Service |
| **Scaling** | Horizontal (Elasticsearch cluster) |

---

### 2.17 CMS Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Content pages, blog posts, banners, SEO metadata, content scheduling |
| **Database** | `cms_db` (PostgreSQL) |
| **Events Published** | PagePublished, PageUnpublished, BlogPostPublished, BannerUpdated |
| **Events Consumed** | None |
| **Public APIs** | GET /cms/pages/:slug, GET /cms/blog, GET /cms/banners/:slot |
| **Dependencies** | Media Service (content images), Search Service (indexing) |
| **Scaling** | Horizontal + Redis Cache + CDN |

---

### 2.18 Analytics Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS + ClickHouse (analytics DB) |
| **Responsibilities** | Event tracking, report generation, dashboards, real-time metrics |
| **Database** | ClickHouse (analytics), PostgreSQL (config) |
| **Events Published** | ReportGenerated, AlertTriggered |
| **Events Consumed** | All domain events |
| **Public APIs** | GET /analytics/dashboard, GET /analytics/reports, POST /analytics/events |
| **Dependencies** | All services (event consumption) |
| **Scaling** | Horizontal + ClickHouse for analytics |

---

### 2.19 Audit Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Audit trail, compliance logging, access logs |
| **Database** | `audit_db` (PostgreSQL) |
| **Events Published** | AuditRecorded, ComplianceAlert |
| **Events Consumed** | All domain state changes |
| **Public APIs** | GET /audit/logs, GET /audit/logs/:entityType/:entityId |
| **Dependencies** | All services |
| **Scaling** | Horizontal + Table Partitioning + Archival |

---

### 2.20 Admin Service

| Aspect | Detail |
|--------|--------|
| **Technology** | NestJS |
| **Responsibilities** | Admin user management, system configuration, dashboard aggregation |
| **Database** | `admin_db` (PostgreSQL) |
| **Events Published** | AdminAction, ConfigChanged |
| **Events Consumed** | All domain events (for admin dashboard) |
| **Public APIs** | CRUD for admin users, roles, system config, dashboard aggregation |
| **Dependencies** | Auth Service, all services (for dashboard) |
| **Scaling** | Horizontal |

---

## 3. Service Communication Matrix

| From \ To | Auth | User | Product | Inventory | Pricing | Cart | Order | Payment | Shipping | Review | Wishlist | Notification | Promotion | Media | Search | CMS | Analytics | Audit | Admin |
|-----------|------|------|---------|-----------|---------|------|-------|---------|----------|--------|----------|-------------|-----------|-------|--------|-----|-----------|-------|-------|
| **Auth** | - | P | - | - | - | - | - | - | - | - | - | P | - | - | - | - | P | P | - |
| **User** | S | - | - | - | - | - | - | - | - | S | S | P | - | S | - | - | P | P | - |
| **Product** | - | S | - | S | S | S | S | - | - | S | S | P | - | S | P | - | P | P | - |
| **Inventory** | - | - | S | - | - | S | S | - | - | - | - | P | - | - | - | - | P | P | - |
| **Pricing** | - | - | S | - | - | S | S | - | - | - | - | - | S | - | - | - | P | P | - |
| **Cart** | - | S | S | S | S | - | P | - | - | - | - | P | S | - | - | - | P | P | - |
| **Order** | - | S | S | S | S | S | - | P | P | S | - | P | S | - | - | - | P | P | - |
| **Payment** | - | S | - | - | - | - | S | - | - | - | - | P | - | - | - | - | P | P | - |
| **Shipping** | - | S | - | - | - | - | S | - | - | - | - | P | - | - | - | - | P | P | - |
| **Review** | - | S | S | - | - | - | S | - | - | - | - | P | - | - | - | - | P | P | - |
| **Wishlist** | - | S | S | - | - | - | - | - | - | - | - | - | - | - | - | - | P | P | - |
| **Notification** | - | S | - | - | - | - | S | S | S | S | - | - | - | - | - | - | P | P | - |
| **Promotion** | - | S | S | - | - | S | S | - | - | - | - | - | - | - | - | - | P | P | - |
| **Media** | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | P | P | - |
| **Search** | - | - | S | - | - | - | - | - | - | S | - | - | - | - | - | S | P | P | - |
| **CMS** | - | - | - | - | - | - | - | - | - | - | - | - | - | S | S | - | P | P | - |
| **Analytics** | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | P | - |
| **Audit** | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| **Admin** | S | S | S | S | S | - | S | S | S | S | - | P | S | S | S | S | P | P | - |

**Legend**: P = Publishes events, S = Subscribes to events
