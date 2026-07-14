# Bounded Contexts (DDD)

## 1. Context Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           E-COMMERCE PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    AUTH      │  │   CATALOG    │  │   INVENTORY  │  │   PRICING    │   │
│  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │   │
│  │              │  │              │  │              │  │              │   │
│  │ User         │  │ Product      │  │ Stock        │  │ Price        │   │
│  │ Role         │  │ Category     │  │ Warehouse    │  │ Discount     │   │
│  │ Permission   │  │ Brand        │  │ Reservation  │  │ PriceRule    │   │
│  │ Session      │  │ Attribute    │  │ Movement     │  │ Currency     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │                 │             │
│         │    ┌────────────┴─────────────────┴─────────────────┘             │
│         │    │                                                              │
│  ┌──────┴────┴─────────────────────────────────────────────────────────┐   │
│  │                        COMMERCE CONTEXT                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │   CART   │  │  ORDER   │  │ PAYMENT  │  │ SHIPPING │           │   │
│  │  │          │  │          │  │          │  │          │           │   │
│  │  │ Cart     │  │ Order    │  │ Payment  │  │ Shipment │           │   │
│  │  │ CartItem │  │ OrderItem│  │ Refund   │  │ Carrier  │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   REVIEW     │  │   WISHLIST   │  │  PROMOTION   │  │ NOTIFICATION │   │
│  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │   │
│  │              │  │              │  │              │  │              │   │
│  │ Review       │  │ Wishlist     │  │ Coupon       │  │ Notification │   │
│  │ ReviewVote   │  │ WishlistItem │  │ Promotion    │  │ Template     │   │
│  │ ReviewReport │  │              │  │ Campaign     │  │ Preference   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    MEDIA     │  │    SEARCH    │  │     CMS      │  │  ANALYTICS   │   │
│  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │   │
│  │              │  │              │  │              │  │              │   │
│  │ Media        │  │ SearchIndex  │  │ Page         │  │ Event        │   │
│  │ MediaFolder  │  │ Suggestion   │  │ BlogPost     │  │ Report       │   │
│  │ ImageVariant │  │ SearchLog    │  │ Banner       │  │ Metric       │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐                                        │
│  │    AUDIT     │  │    ADMIN     │                                        │
│  │   CONTEXT    │  │   CONTEXT    │                                        │
│  │              │  │              │                                        │
│  │ AuditLog     │  │ AdminUser    │                                        │
│  │ Compliance   │  │ SystemConfig │                                        │
│  └──────────────┘  └──────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bounded Context Definitions

### 2.1 Auth Context
**Responsibility**: User identity, authentication, authorization, session management

| Aspect | Detail |
|--------|--------|
| **Aggregates** | User (root), Role, Permission, Session, OAuthConnection |
| **Invariants** | Email must be unique; Roles must have at least one Permission; Session TTL enforced |
| **Published Language** | UserId (UUID), UserRole enum, PermissionKey |
| **Partnership with** | All contexts (identity is foundational) |
| **Customer/Supplier** | Catalog, Order, Review consume User identity; Auth supplies it |
| **Anti-Corruption Layer** | External OAuth providers (Google, GitHub) normalized to internal User format |

### 2.2 Catalog Context
**Responsibility**: Product information management, categories, brands, attributes

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Product (root), Category (tree), Brand, Attribute, ProductVariant, ProductImage |
| **Invariants** | Product must belong to a Category; SKU must be unique; Price >= 0 |
| **Published Language** | ProductId (UUID), SKU, CategorySlug, Price |
| **Relationships** | Depends on: Media (images), Pricing (prices), Search (indexing), Inventory (stock) |
| **Events Published** | ProductCreated, ProductUpdated, ProductDeleted, CategoryCreated, CategoryUpdated |
| **Events Consumed** | StockUpdated (to update availability), ReviewCreated (to update rating aggregate) |

### 2.3 Inventory Context
**Responsibility**: Stock management, warehouse tracking, stock reservations

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Stock (root), Warehouse, StockMovement, Reservation |
| **Invariants** | Available stock >= 0; Reservation expiry enforced; FIFO stock allocation |
| **Published Language** | ProductId, WarehouseId, Quantity, ReservationId |
| **Relationships** | Depends on: Product (what to stock), Order (what to fulfill) |
| **Events Published** | StockUpdated, StockReserved, StockReleased, StockDepleted, LowStockAlert |
| **Events Consumed** | OrderPlaced (reserve stock), OrderCancelled (release stock), OrderCompleted (commit stock) |

### 2.4 Pricing Context
**Responsibility**: Price management, discounts, price rules, currency conversion

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Price (root), Discount, PriceRule, Currency, ExchangeRate |
| **Invariants** | Discount cannot exceed 100%; PriceRules must not conflict; Currency rates must be positive |
| **Published Language** | ProductId, Price, CurrencyCode, DiscountPercentage |
| **Relationships** | Depends on: Product (what to price), Coupon (discount codes) |
| **Events Published** | PriceChanged, DiscountApplied, DiscountRemoved |

### 2.5 Cart Context
**Responsibility**: Shopping cart management, persistence, guest-to-user cart merging

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Cart (root), CartItem |
| **Invariants** | Cart cannot have duplicate products (merge quantities); Quantity >= 1 |
| **Published Language** | CartId (UUID), UserId (nullable for guest), CartItem |
| **Relationships** | Depends on: Product, Pricing, Coupon |
| **Events Published** | CartCreated, CartUpdated, CartItemAdded, CartItemRemoved, CartAbandoned |
| **Events Consumed** | ProductPriceChanged (recalculate cart), StockDepleted (remove unavailable items) |

### 2.6 Order Context
**Responsibility**: Order lifecycle management, status tracking, history

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Order (root), OrderItem, OrderStatus, OrderHistory, OrderNote |
| **Invariants** | Order total must equal sum of items; Status transitions must follow defined flow; Cannot cancel shipped orders |
| **Published Language** | OrderId (UUID), OrderNumber, OrderStatus enum, OrderItem |
| **Relationships** | Depends on: Cart (source), Payment, Shipping, Inventory, Tax, Pricing |
| **Events Published** | OrderCreated, OrderConfirmed, OrderShipped, OrderDelivered, OrderCancelled, OrderRefunded |
| **Events Consumed** | PaymentCompleted (confirm order), ShipmentTrackingUpdated (update status) |

### 2.7 Payment Context
**Responsibility**: Payment processing, refunds, payment method management

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Payment (root), Refund, PaymentMethod, Transaction |
| **Invariants** | Payment amount must match order total; Refund cannot exceed payment; Transaction must be idempotent |
| **Published Language** | PaymentId (UUID), TransactionId, PaymentStatus enum |
| **Relationships** | Depends on: Order (what to pay for) |
| **Events Published** | PaymentInitiated, PaymentCompleted, PaymentFailed, PaymentRefunded |
| **Events Consumed** | OrderCreated (initiate payment), OrderCancelled (process refund) |

### 2.8 Shipping Context
**Responsibility**: Shipping rates, carrier integration, delivery tracking

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Shipment (root), ShippingMethod, Carrier, TrackingInfo, Address |
| **Invariants** | Tracking number must be unique; Shipment must have valid address; Weight > 0 |
| **Published Language** | ShipmentId, TrackingNumber, CarrierCode, ShippingStatus |
| **Relationships** | Depends on: Order (what to ship), Address (where to ship) |
| **Events Published** | ShipmentCreated, ShipmentDispatched, ShipmentInTransit, ShipmentDelivered |
| **Events Consumed** | OrderConfirmed (create shipment), OrderCancelled (return shipment) |

### 2.9 Review Context
**Responsibility**: Product reviews, ratings, moderation

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Review (root), ReviewVote, ReviewReport |
| **Invariants** | One review per user per product; Rating 1-5; Cannot review own products |
| **Published Language** | ReviewId, ProductId, UserId, Rating |
| **Relationships** | Depends on: User, Product, Order (verified purchase) |
| **Events Published** | ReviewCreated, ReviewUpdated, ReviewModerated, ReviewFlagged |
| **Events Consumed** | OrderDelivered (enable review), ProductCreated (initialize rating) |

### 2.10 Wishlist Context
**Responsibility**: Saved products, shareable wishlists

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Wishlist (root), WishlistItem |
| **Invariants** | No duplicate items in same wishlist; Max 100 items per wishlist |
| **Published Language** | WishlistId, UserId, WishlistItem |
| **Relationships** | Depends on: User, Product |
| **Events Published** | WishlistCreated, ItemAdded, ItemRemoved |

### 2.11 Notification Context
**Responsibility**: Multi-channel notification delivery

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Notification (root), NotificationTemplate, NotificationPreference |
| **Invariants** | Notification must have valid template; User preferences must be respected |
| **Published Language** | NotificationId, UserId, Channel (email/SMS/push/in-app), TemplateKey |
| **Relationships** | Depends on: User (recipient), all domains (event sources) |
| **Events Published** | NotificationSent, NotificationDelivered, NotificationRead, NotificationFailed |
| **Events Consumed** | OrderCreated, PaymentCompleted, ShipmentDispatched, ReviewCreated, and all other domain events |

### 2.12 Promotion Context
**Responsibility**: Discount codes, promotions, campaigns

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Coupon (root), Promotion, Campaign, PromotionRule |
| **Invariants** | Coupon usage cannot exceed limit; Promotion dates must not overlap; Discount amount >= 0 |
| **Published Language** | CouponCode, PromotionId, CampaignId, DiscountType |
| **Relationships** | Depends on: Order (apply discounts), Product (product-specific promos), User (targeted promos) |
| **Events Published** | CouponApplied, CouponUsed, PromotionStarted, PromotionEnded |

### 2.13 Media Context
**Responsibility**: File uploads, image processing, CDN management

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Media (root), MediaFolder, ImageVariant |
| **Invariants** | File size within limits; Image dimensions validated; Folder hierarchy max depth 5 |
| **Published Language** | MediaId, MediaUrl, MediaType, ImageVariant |
| **Relationships** | Depends on: S3 storage, CDN |
| **Events Published** | MediaUploaded, MediaDeleted, ImageProcessed |
| **Events Consumed** | ProductCreated (upload images), UserRegistered (upload avatar) |

### 2.14 Search Context
**Responsibility**: Full-text search, autocomplete, faceted filtering

| Aspect | Detail |
|--------|--------|
| **Aggregates** | SearchIndex, SearchSuggestion, SearchLog, SearchFacet |
| **Invariants** | Index must be consistent with source; Suggestions ranked by relevance |
| **Published Language** | SearchQuery, SearchResults, FacetValue |
| **Relationships** | Depends on: Product, Category, Brand, CMS |
| **Events Published** | SearchPerformed, AutocompleteRequested |
| **Events Consumed** | ProductCreated/Updated/Deleted (reindex), CategoryUpdated (reindex) |

### 2.15 CMS Context
**Responsibility**: Content pages, blog, banners, SEO metadata

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Page (root), BlogPost, Banner, SeoMetadata |
| **Invariants** | Slug must be unique per locale; Publish date <= expiry date |
| **Published Language** | PageSlug, PostSlug, BannerSlot |
| **Relationships** | Depends on: Media (content images), Search (indexing) |
| **Events Published** | PagePublished, BlogPostPublished, BannerUpdated |

### 2.16 Analytics Context
**Responsibility**: Event tracking, reporting, dashboards

| Aspect | Detail |
|--------|--------|
| **Aggregates** | Event, Report, Dashboard, Metric |
| **Invariants** | Events immutable; Reports generated on schedule |
| **Published Language** | EventType, MetricKey, ReportType |
| **Relationships** | Depends on: All domains (event consumers) |
| **Events Published** | ReportGenerated, AlertTriggered |
| **Events Consumed** | All domain events (for analytics processing) |

### 2.17 Audit Context
**Responsibility**: Audit trail, compliance logging

| Aspect | Detail |
|--------|--------|
| **Aggregates** | AuditLog, ComplianceRecord |
| **Invariants** | Audit logs immutable; Retention policy enforced |
| **Published Language** | AuditEntry, EntityType, Action |
| **Relationships** | Depends on: All domains (audit producers) |
| **Events Published** | AuditRecorded, ComplianceAlert |
| **Events Consumed** | All domain state changes (for audit trail) |

### 2.18 Admin Context
**Responsibility**: Backoffice management, system configuration

| Aspect | Detail |
|--------|--------|
| **Aggregates** | AdminUser, AdminRole, SystemConfig |
| **Invariants** | Admin roles must have explicit permissions; Config changes audited |
| **Published Language** | AdminUserId, AdminRole, ConfigKey |
| **Relationships** | Depends on: Auth (identity), Audit (logging) |
| **Events Published** | AdminAction, ConfigChanged |

---

## 3. Context Integration Patterns

### Synchronous Communication
- **REST APIs**: Public APIs exposed via API Gateway
- **gRPC**: Internal service-to-service calls (high performance)
- **GraphQL**: Client-facing API for flexible queries (future consideration)

### Asynchronous Communication
- **Event Bus (Kafka)**: Domain events for decoupled communication
- **Message Queue (RabbitMQ)**: Task queues for background jobs (emails, reports)
- **Event Sourcing**: Order and Payment domains maintain full event history

### Data Sharing Patterns
| Pattern | Use Case |
|---------|----------|
| **Database per Service** | Each context owns its database |
| **API Composition** | Gateway aggregates data from multiple services |
| **CQRS** | Separate read/write models for Search, Analytics |
| **Event Sourcing** | Order and Payment audit trails |
| **Saga Pattern** | Distributed transactions (checkout, payment) |
