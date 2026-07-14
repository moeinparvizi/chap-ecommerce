# Event Architecture

## 1. Event Bus Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                     Apache Kafka Cluster                         │
├─────────────────────────────────────────────────────────────────┤
│  Topics:                                                        │
│  ├── auth.events              (partitions: 3, replication: 3)   │
│  ├── user.events              (partitions: 3, replication: 3)   │
│  ├── product.events           (partitions: 6, replication: 3)   │
│  ├── inventory.events         (partitions: 3, replication: 3)   │
│  ├── pricing.events           (partitions: 3, replication: 3)   │
│  ├── cart.events              (partitions: 3, replication: 3)   │
│  ├── order.events             (partitions: 6, replication: 3)   │
│  ├── payment.events           (partitions: 6, replication: 3)   │
│  ├── shipping.events          (partitions: 3, replication: 3)   │
│  ├── review.events            (partitions: 3, replication: 3)   │
│  ├── wishlist.events          (partitions: 1, replication: 3)   │
│  ├── notification.events      (partitions: 3, replication: 3)   │
│  ├── promotion.events         (partitions: 3, replication: 3)   │
│  ├── media.events             (partitions: 1, replication: 3)   │
│  ├── search.events            (partitions: 3, replication: 3)   │
│  ├── cms.events               (partitions: 1, replication: 3)   │
│  ├── analytics.events         (partitions: 6, replication: 3)   │
│  └── audit.events             (partitions: 3, replication: 3)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Event Schema (CloudEvents Compatible)

```typescript
interface DomainEvent {
  // CloudEvents v1.0
  specversion: "1.0";
  type: string;                    // e.g., "com.ecommerce.order.OrderCreated"
  source: string;                  // e.g., "order-service"
  id: string;                      // UUID v4
  time: string;                    // ISO 8601
  datacontenttype: "application/json";

  // Custom extensions
  correlationid: string;           // Request/trace ID
  causationid?: string;            // ID of event that caused this event
  aggregateid: string;             // Aggregate root ID
  aggregateversion: number;        // Optimistic concurrency

  data: Record<string, unknown>;   // Event payload
}
```

---

## 3. Complete Event Catalog

### 3.1 Auth Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **UserRegistered** | `com.ecommerce.auth.UserRegistered` | `{ userId, email, firstName, lastName, method: 'email' \| 'oauth', provider? }` | Auth Service | User Service, Notification Service, Analytics Service |
| **UserLogin** | `com.ecommerce.auth.UserLogin` | `{ userId, email, method, ipAddress, userAgent }` | Auth Service | Analytics Service, Audit Service |
| **UserLogout** | `com.ecommerce.auth.UserLogout` | `{ userId, sessionId }` | Auth Service | Analytics Service |
| **PasswordReset** | `com.ecommerce.auth.PasswordReset` | `{ userId, email, resetToken }` | Auth Service | Notification Service |
| **EmailVerified** | `com.ecommerce.auth.EmailVerified` | `{ userId, email }` | Auth Service | User Service, Analytics Service |
| **MfaEnabled** | `com.ecommerce.auth.MfaEnabled` | `{ userId, method }` | Auth Service | Notification Service, Audit Service |

### 3.2 User Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **UserProfileUpdated** | `com.ecommerce.user.UserProfileUpdated` | `{ userId, changes }` | User Service | Analytics Service, Audit Service |
| **AddressAdded** | `com.ecommerce.user.AddressAdded` | `{ userId, addressId, address }` | User Service | Shipping Service |
| **AddressUpdated** | `com.ecommerce.user.AddressUpdated` | `{ userId, addressId, changes }` | User Service | Shipping Service |
| **AddressDeleted** | `com.ecommerce.user.AddressDeleted` | `{ userId, addressId }` | User Service | Shipping Service |
| **UserDeactivated** | `com.ecommerce.user.UserDeactivated` | `{ userId, reason }` | User Service | All services (cleanup) |

### 3.3 Product Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **ProductCreated** | `com.ecommerce.product.ProductCreated` | `{ productId, name, sku, categoryId, brandId, status }` | Product Service | Search Service, Analytics Service, Inventory Service, Pricing Service |
| **ProductUpdated** | `com.ecommerce.product.ProductUpdated` | `{ productId, changes }` | Product Service | Search Service, Analytics Service |
| **ProductDeleted** | `com.ecommerce.product.ProductDeleted` | `{ productId }` | Product Service | Search Service, Cart Service, Wishlist Service |
| **ProductVariantCreated** | `com.ecommerce.product.ProductVariantCreated` | `{ productId, variantId, sku, attributes }` | Product Service | Inventory Service, Pricing Service, Search Service |
| **CategoryCreated** | `com.ecommerce.product.CategoryCreated` | `{ categoryId, name, slug, parentId }` | Product Service | Search Service |
| **CategoryUpdated** | `com.ecommerce.product.CategoryUpdated` | `{ categoryId, changes }` | Product Service | Search Service |
| **BrandCreated** | `com.ecommerce.product.BrandCreated` | `{ brandId, name, slug }` | Product Service | Search Service |

### 3.4 Inventory Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **StockReserved** | `com.ecommerce.inventory.StockReserved` | `{ reservationId, productId, warehouseId, quantity, orderId }` | Inventory Service | Order Service |
| **StockReleased** | `com.ecommerce.inventory.StockReleased` | `{ reservationId, productId, warehouseId, quantity }` | Inventory Service | Order Service |
| **StockDepleted** | `com.ecommerce.inventory.StockDepleted` | `{ productId, warehouseId }` | Inventory Service | Cart Service, Product Service, Notification Service |
| **LowStockAlert** | `com.ecommerce.inventory.LowStockAlert` | `{ productId, warehouseId, currentQuantity, threshold }` | Inventory Service | Notification Service, Admin Service |
| **StockAdjusted** | `com.ecommerce.inventory.StockAdjusted` | `{ productId, warehouseId, previousQuantity, newQuantity, reason }` | Inventory Service | Analytics Service, Audit Service |

### 3.5 Pricing Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **PriceChanged** | `com.ecommerce.pricing.PriceChanged` | `{ productId, variantId?, oldPrice, newPrice, currency }` | Pricing Service | Cart Service, Search Service, Analytics Service |
| **DiscountApplied** | `com.ecommerce.pricing.DiscountApplied` | `{ discountId, productId, percentage, validUntil }` | Pricing Service | Search Service |
| **ExchangeRateUpdated** | `com.ecommerce.pricing.ExchangeRateUpdated` | `{ fromCurrency, toCurrency, rate, timestamp }` | Pricing Service | Analytics Service |

### 3.6 Cart Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **CartCreated** | `com.ecommerce.cart.CartCreated` | `{ cartId, userId?, sessionId }` | Cart Service | Analytics Service |
| **CartItemAdded** | `com.ecommerce.cart.CartItemAdded` | `{ cartId, productId, variantId?, quantity, price }` | Cart Service | Analytics Service |
| **CartItemRemoved** | `com.ecommerce.cart.CartItemRemoved` | `{ cartId, productId, variantId? }` | Cart Service | Analytics Service |
| **CartUpdated** | `com.ecommerce.cart.CartUpdated` | `{ cartId, total, itemCount }` | Cart Service | Analytics Service |
| **CartAbandoned** | `com.ecommerce.cart.CartAbandoned` | `{ cartId, userId, items, total, abandonedAt }` | Cart Service | Notification Service, Analytics Service |

### 3.7 Order Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **OrderCreated** | `com.ecommerce.order.OrderCreated` | `{ orderId, orderNumber, userId, items, total, currency }` | Order Service | Payment Service, Inventory Service, Notification Service, Analytics Service, Audit Service |
| **OrderConfirmed** | `com.ecommerce.order.OrderConfirmed` | `{ orderId, orderNumber, userId }` | Order Service | Shipping Service, Notification Service, Analytics Service |
| **OrderProcessing** | `com.ecommerce.order.OrderProcessing` | `{ orderId, orderNumber }` | Order Service | Notification Service, Analytics Service |
| **OrderShipped** | `com.ecommerce.order.OrderShipped` | `{ orderId, orderNumber, trackingNumber, carrier }` | Order Service | Notification Service, Analytics Service |
| **OrderDelivered** | `com.ecommerce.order.OrderDelivered` | `{ orderId, orderNumber, deliveredAt }` | Order Service | Review Service, Notification Service, Analytics Service |
| **OrderCancelled** | `com.ecommerce.order.OrderCancelled` | `{ orderId, orderNumber, userId, reason, cancelledAt }` | Order Service | Payment Service, Inventory Service, Notification Service, Analytics Service, Audit Service |
| **OrderReturned** | `com.ecommerce.order.OrderReturned` | `{ orderId, orderNumber, items, reason }` | Order Service | Payment Service, Inventory Service, Notification Service, Analytics Service |

### 3.8 Payment Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **PaymentInitiated** | `com.ecommerce.payment.PaymentInitiated` | `{ paymentId, orderId, amount, currency, method }` | Payment Service | Order Service, Analytics Service |
| **PaymentCompleted** | `com.ecommerce.payment.PaymentCompleted` | `{ paymentId, orderId, amount, currency, transactionId }` | Payment Service | Order Service, Notification Service, Analytics Service, Audit Service |
| **PaymentFailed** | `com.ecommerce.payment.PaymentFailed` | `{ paymentId, orderId, reason, errorCode }` | Payment Service | Order Service, Notification Service, Analytics Service |
| **PaymentRefunded** | `com.ecommerce.payment.PaymentRefunded` | `{ paymentId, orderId, refundId, amount, reason }` | Payment Service | Order Service, Notification Service, Analytics Service, Audit Service |

### 3.9 Shipping Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **ShipmentCreated** | `com.ecommerce.shipping.ShipmentCreated` | `{ shipmentId, orderId, carrier, estimatedDelivery }` | Shipping Service | Order Service, Notification Service |
| **ShipmentDispatched** | `com.ecommerce.shipping.ShipmentDispatched` | `{ shipmentId, orderId, trackingNumber }` | Shipping Service | Order Service, Notification Service |
| **ShipmentInTransit** | `com.ecommerce.shipping.ShipmentInTransit` | `{ shipmentId, orderId, location, status }` | Shipping Service | Order Service, Notification Service |
| **ShipmentDelivered** | `com.ecommerce.shipping.ShipmentDelivered` | `{ shipmentId, orderId, deliveredAt, signedBy }` | Shipping Service | Order Service, Review Service, Notification Service |
| **ShipmentException** | `com.ecommerce.shipping.ShipmentException` | `{ shipmentId, orderId, exceptionType, description }` | Shipping Service | Order Service, Notification Service |

### 3.10 Review Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **ReviewCreated** | `com.ecommerce.review.ReviewCreated` | `{ reviewId, productId, userId, rating, title }` | Review Service | Product Service, Notification Service, Analytics Service |
| **ReviewUpdated** | `com.ecommerce.review.ReviewUpdated` | `{ reviewId, productId, changes }` | Review Service | Product Service, Analytics Service |
| **ReviewDeleted** | `com.ecommerce.review.ReviewDeleted` | `{ reviewId, productId }` | Review Service | Product Service, Analytics Service |
| **ReviewModerated** | `com.ecommerce.review.ReviewModerated` | `{ reviewId, status, moderatorId, reason }` | Review Service | Notification Service, Analytics Service |
| **ReviewFlagged** | `com.ecommerce.review.ReviewFlagged` | `{ reviewId, reason, reportedBy }` | Review Service | Notification Service, Admin Service |

### 3.11 Wishlist Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **WishlistCreated** | `com.ecommerce.wishlist.WishlistCreated` | `{ wishlistId, userId, name }` | Wishlist Service | Analytics Service |
| **WishlistItemAdded** | `com.ecommerce.wishlist.WishlistItemAdded` | `{ wishlistId, productId }` | Wishlist Service | Analytics Service |
| **WishlistItemRemoved** | `com.ecommerce.wishlist.WishlistItemRemoved` | `{ wishlistId, productId }` | Wishlist Service | Analytics Service |

### 3.12 Notification Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **NotificationSent** | `com.ecommerce.notification.NotificationSent` | `{ notificationId, userId, channel, templateKey }` | Notification Service | Analytics Service |
| **NotificationDelivered** | `com.ecommerce.notification.NotificationDelivered` | `{ notificationId, userId, channel }` | Notification Service | Analytics Service |
| **NotificationRead** | `com.ecommerce.notification.NotificationRead` | `{ notificationId, userId }` | Notification Service | Analytics Service |

### 3.13 Promotion Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **CouponApplied** | `com.ecommerce.promotion.CouponApplied` | `{ couponCode, orderId, discountAmount, userId }` | Promotion Service | Order Service, Analytics Service |
| **CouponUsed** | `com.ecommerce.promotion.CouponUsed` | `{ couponCode, orderId, usageCount }` | Promotion Service | Analytics Service |
| **PromotionStarted** | `com.ecommerce.promotion.PromotionStarted` | `{ promotionId, name, type, startDate }` | Promotion Service | Notification Service, Analytics Service |
| **PromotionEnded** | `com.ecommerce.promotion.PromotionEnded` | `{ promotionId, name, endDate }` | Promotion Service | Notification Service, Analytics Service |

### 3.14 Media Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **MediaUploaded** | `com.ecommerce.media.MediaUploaded` | `{ mediaId, url, type, size, entityType?, entityId? }` | Media Service | Product Service, User Service, CMS Service |
| **ImageProcessed** | `com.ecommerce.media.ImageProcessed` | `{ mediaId, variants: [{ url, width, height, format }] }` | Media Service | Product Service, Search Service |

### 3.15 Search Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **SearchPerformed** | `com.ecommerce.search.SearchPerformed` | `{ query, userId?, resultsCount, filters }` | Search Service | Analytics Service |
| **AutocompleteRequested** | `com.ecommerce.search.AutocompleteRequested` | `{ query, userId? }` | Search Service | Analytics Service |

### 3.16 CMS Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **PagePublished** | `com.ecommerce.cms.PagePublished` | `{ pageId, slug, title }` | CMS Service | Search Service, Analytics Service |
| **BlogPostPublished** | `com.ecommerce.cms.BlogPostPublished` | `{ postId, slug, title, authorId }` | CMS Service | Search Service, Notification Service, Analytics Service |
| **BannerUpdated** | `com.ecommerce.cms.BannerUpdated` | `{ bannerId, slot, status }` | CMS Service | Analytics Service |

### 3.17 Analytics Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **ReportGenerated** | `com.ecommerce.analytics.ReportGenerated` | `{ reportId, type, period, fileUrl }` | Analytics Service | Notification Service, Admin Service |
| **AlertTriggered** | `com.ecommerce.analytics.AlertTriggered` | `{ alertId, type, severity, message }` | Analytics Service | Notification Service, Admin Service |

### 3.18 Audit Events

| Event | Type | Payload | Published By | Consumed By |
|-------|------|---------|--------------|-------------|
| **AuditRecorded** | `com.ecommerce.audit.AuditRecorded` | `{ auditId, entityType, entityId, action, userId, changes }` | Audit Service | Analytics Service |

---

## 4. Event Flow Patterns

### 4.1 Order Creation Flow (Saga)
```
┌────────┐     ┌────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐
│  Cart  │────▶│ Order  │────▶│ Inventory│────▶│ Payment │────▶│Shipping │
│Service │     │Service │     │ Service  │     │ Service │     │ Service │
└────────┘     └────────┘     └──────────┘     └─────────┘     └─────────┘
     │              │               │                │               │
     ▼              ▼               ▼                ▼               ▼
  CartCheckedOut  OrderCreated  StockReserved   PaymentInitiated  ShipmentCreated
                  OrderConfirmed               PaymentCompleted  ShipmentDispatched
                                               PaymentFailed     ShipmentDelivered
                                              (OrderCancelled)   (OrderDelivered)
```

### 4.2 Compensation Flow (Saga Rollback)
```
PaymentFailed
    │
    ├──▶ ReleaseStock (Inventory Service)
    │       └──▶ StockReleased event
    │
    ├──▶ CancelOrder (Order Service)
    │       └──▶ OrderCancelled event
    │
    └──▶ NotifyUser (Notification Service)
            └──▶ NotificationSent event
```

### 4.3 Event Sourcing (Order Domain)
```
Order Aggregate
    │
    ├──▶ OrderCreatedEvent (v1)
    ├──▶ ItemAddedEvent (v2)
    ├──▶ ItemAddedEvent (v3)
    ├──▶ PaymentCompletedEvent (v4)
    ├──▶ OrderConfirmedEvent (v5)
    ├──▶ ShipmentCreatedEvent (v6)
    └──▶ OrderDeliveredEvent (v7)

Current State = Replay(OrderCreated + ItemAdded + ItemAdded + PaymentCompleted + ...)
```

---

## 5. Event Processing Guarantees

| Guarantee | Strategy |
|-----------|----------|
| **At-least-once delivery** | Kafka consumer groups with manual ack |
| **Idempotent processing** | Event ID + deduplication table per consumer |
| **Ordering** | Partition by aggregate ID |
| **Dead letter queue** | Failed events routed to DLQ after 3 retries |
| **Event retention** | 7 days for hot topics, 30 days for audit topics |
| **Schema evolution** | Avro schema registry with backward compatibility |
