# User Flows & Sequence Diagrams

## 1. User Flow Diagrams

### 1.1 Guest Browsing Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Home   │────▶│ Category│────▶│ Product │────▶│ Product │
│  Page   │     │ Listing │     │ Listing │     │ Detail  │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                       │
                                                       ▼
                                                 ┌─────────┐
                                                 │  Add to  │
                                                 │   Cart   │
                                                 └────┬────┘
                                                       │
                                                       ▼
                                                 ┌─────────┐
                                                 │   Cart   │
                                                 └────┬────┘
                                                       │
                                                       ▼
                                                 ┌─────────┐
                                                 │ Checkout │
                                                 │(Login)   │
                                                 └─────────┘
```

### 1.2 Registration Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Register│────▶│  Email  │────▶│ Verify  │────▶│ Welcome │
│  Form   │     │  Sent   │     │  Email  │     │  Page   │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │                               │
     │                               ▼
     │                         ┌─────────┐
     │                         │ Profile │
     │                         │  Setup  │
     │                         └─────────┘
     │
     └──▶ (Alternative) OAuth Login
           ┌─────────┐     ┌─────────┐
           │ Google/ │────▶│Callback │
           │ GitHub  │     │  Auth   │
           └─────────┘     └────┬────┘
                                 │
                                 ▼
                           ┌─────────┐
                           │Dashboard│
                           └─────────┘
```

### 1.3 Shopping & Checkout Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Product │────▶│  Add to │────▶│  Cart   │────▶│ Checkout│
│ Detail  │     │  Cart   │     │ Review  │     │  Page   │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                       │
         ┌─────────────────────────────────────────────┘
         │
         ▼
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Select  │────▶│ Select  │────▶│ Payment │────▶│ Order   │
│Shipping │     │ Payment │     │ Process │     │Confirmd │
│ Address │     │ Method  │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                       │
                                                       ▼
                                                 ┌─────────┐
                                                 │ Order   │
                                                 │ Confirmation│
                                                 │ Email   │
                                                 └─────────┘
```

### 1.4 Order Lifecycle Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Pending │────▶│Confirmed│────▶│Processing│───▶│ Shipped │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                       │
                                                       ▼
                                                 ┌─────────┐
                                                 │Delivered│
                                                 └────┬────┘
                                                       │
                                                       ▼
                                                 ┌─────────┐
                                                 │ Reviewed│
                                                 └─────────┘

Alternative Paths:
├── Pending ────▶ Cancelled
├── Confirmed ──▶ Cancelled
├── Processing ─▶ Cancelled
└── Delivered ──▶ Returned ──▶ Refunded
```

### 1.5 Admin Management Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Admin  │────▶│Dashboard│────▶│  Order  │────▶│ Update  │
│  Login  │     │  View   │     │ Details │     │ Status  │
└─────────┘     └────┬────┘     └─────────┘     └─────────┘
                      │
                      ├──▶ Product Management
                      │    ┌─────────┐     ┌─────────┐
                      │    │ Product │────▶│  Edit   │
                      │    │ List    │     │ Product │
                      │    └─────────┘     └─────────┘
                      │
                      ├──▶ User Management
                      │    ┌─────────┐     ┌─────────┐
                      │    │  User   │────▶│  Edit   │
                      │    │  List   │     │  User   │
                      │    └─────────┘     └─────────┘
                      │
                      └──▶ Reports
                           ┌─────────┐     ┌─────────┐
                           │ Reports │────▶│ Export  │
                           │  List   │     │  Data   │
                           └─────────┘     └─────────┘
```

---

## 2. Sequence Diagrams

### 2.1 Login Sequence

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Client │  │ Gateway│  │  Auth  │  │  User  │  │ Redis  │
│        │  │        │  │Service │  │Service │  │        │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │
    │ POST /auth/login     │           │           │
    │──────────▶│           │           │           │
    │           │           │           │           │
    │           │ Forward   │           │           │
    │           │──────────▶│           │           │
    │           │           │           │           │
    │           │           │ Validate  │           │
    │           │           │ credentials           │
    │           │           │──────────▶│           │
    │           │           │           │           │
    │           │           │ User data │           │
    │           │           │◀──────────│           │
    │           │           │           │           │
    │           │           │ Check rate limits     │
    │           │           │──────────────────────▶│
    │           │           │           │           │
    │           │           │ Generate JWT          │
    │           │           │──────────▶│           │
    │           │           │           │           │
    │           │           │ Store session         │
    │           │           │──────────────────────▶│
    │           │           │           │           │
    │           │           │ { accessToken,        │
    │           │           │   refreshToken }      │
    │           │           │◀──────────────────────│
    │           │           │           │           │
    │           │ Response  │           │           │
    │           │◀──────────│           │           │
    │           │           │           │           │
    │ Response  │           │           │           │
    │◀──────────│           │           │           │
    │           │           │           │           │
```

### 2.2 Purchase (Checkout) Sequence

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Client │  │ Gateway│  │  Cart  │  │ Order  │  │Payment │  │Shipping│
│        │  │        │  │Service │  │Service │  │Service │  │Service │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │           │
    │ POST /orders          │           │           │           │
    │──────────▶│           │           │           │           │
    │           │           │           │           │           │
    │           │ Forward   │           │           │           │
    │           │──────────▶│           │           │           │
    │           │           │           │           │           │
    │           │           │ Get cart  │           │           │
    │           │           │──────────▶│           │           │
    │           │           │           │           │           │
    │           │           │ Cart data │           │           │
    │           │           │◀──────────│           │           │
    │           │           │           │           │           │
    │           │           │ Create order           │           │
    │           │           │──────────▶│           │           │
    │           │           │           │           │           │
    │           │           │           │ Reserve stock           │
    │           │           │           │──────────────────────▶│
    │           │           │           │           │           │
    │           │           │           │ Stock reserved          │
    │           │           │           │◀──────────────────────│
    │           │           │           │           │           │
    │           │           │           │ Initiate payment        │
    │           │           │           │──────────▶│           │
    │           │           │           │           │           │
    │           │           │           │ Payment URL            │
    │           │           │           │◀──────────│           │
    │           │           │           │           │           │
    │           │           │ Order created          │           │
    │           │           │◀──────────│           │           │
    │           │           │           │           │           │
    │           │ Response  │           │           │           │
    │           │◀──────────│           │           │           │
    │           │           │           │           │           │
    │ Response  │           │           │           │           │
    │◀──────────│           │           │           │           │
    │           │           │           │           │           │
```

### 2.3 Payment Webhook Sequence

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│Payment │  │Gateway │  │Payment │  │ Order  │  │Inventory│  │Notific.│
│Provider│  │        │  │Service │  │Service │  │Service │  │Service │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │           │
    │ Webhook (payment.completed)      │           │           │
    │──────────▶│           │           │           │           │
    │           │           │           │           │           │
    │           │ Forward   │           │           │           │
    │           │──────────▶│           │           │           │
    │           │           │           │           │           │
    │           │           │ Verify webhook         │           │
    │           │           │ (signature)│           │           │
    │           │           │           │           │           │
    │           │           │ Update payment status  │           │
    │           │           │──────────▶│           │           │
    │           │           │           │           │           │
    │           │           │           │ Confirm order           │
    │           │           │           │──────────▶│           │
    │           │           │           │           │           │
    │           │           │           │ Commit stock            │
    │           │           │           │──────────▶│           │
    │           │           │           │           │           │
    │           │           │           │ Send confirmation       │
    │           │           │           │──────────────────────▶│
    │           │           │           │           │           │
    │           │           │ 200 OK    │           │           │
    │           │◀──────────│           │           │           │
    │           │           │           │           │           │
    │           │ 200 OK    │           │           │           │
    │◀──────────│           │           │           │           │
    │           │           │           │           │           │
```

### 2.4 Review Creation Sequence

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Client │  │ Gateway│  │ Review │  │ Order  │  │Product │
│        │  │        │  │Service │  │Service │  │Service │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │
    │ POST /reviews         │           │           │
    │──────────▶│           │           │           │
    │           │           │           │           │
    │           │ Forward   │           │           │
    │           │──────────▶│           │           │
    │           │           │           │           │
    │           │           │ Verify purchase        │
    │           │           │──────────▶│           │
    │           │           │           │           │
    │           │           │ Purchase verified      │
    │           │           │◀──────────│           │
    │           │           │           │           │
    │           │           │ Check existing review  │
    │           │           │ (one per user/product) │
    │           │           │           │           │
    │           │           │ Create review          │
    │           │           │──────────▶│           │
    │           │           │           │           │
    │           │           │           │ Update product rating   │
    │           │           │           │──────────▶│
    │           │           │           │           │
    │           │           │ Review created         │
    │           │           │◀──────────│           │
    │           │           │           │           │
    │           │ Response  │           │           │
    │           │◀──────────│           │           │
    │           │           │           │           │
    │ Response  │           │           │           │
    │◀──────────│           │           │           │
    │           │           │           │           │
```

### 2.5 Notification Flow Sequence

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Domain │  │  Event │  │Notific.│  │  Email │  │  Push  │
│ Service│  │  Bus   │  │Service │  │Provider│  │Provider│
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │
    │ Publish event          │           │           │
    │ (OrderShipped)        │           │           │
    │──────────▶│           │           │           │
    │           │           │           │           │
    │           │ Consume event          │           │
    │           │──────────▶│           │           │
    │           │           │           │           │
    │           │           │ Get user preferences   │
    │           │           │──────────▶│           │
    │           │           │           │           │
    │           │           │ Render template        │
    │           │           │ (order.shipped)        │
    │           │           │           │           │
    │           │           │ Send email │           │
    │           │           │──────────▶│           │
    │           │           │           │           │
    │           │           │ Send push  │           │
    │           │           │──────────────────────▶│
    │           │           │           │           │
    │           │           │ Store in-app notification
    │           │           │ (DB)      │           │
    │           │           │           │           │
    │           │           │ Log analytics event    │
    │           │           │──────────▶│           │
    │           │           │           │           │
```

---

## 3. Error Recovery Flows

### 3.1 Payment Failure Recovery

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Payment │────▶│  Retry  │────▶│  Use    │────▶│ Contact │
│ Failed  │     │ Payment │     │Different│     │ Support │
└─────────┘     └────┬────┘     │ Method  │     └─────────┘
                      │          └─────────┘
                      │ (3 retries)
                      ▼
                ┌─────────┐
                │  Order  │
                │Cancelled│
                └─────────┘
```

### 3.2 Stock Unavailable Recovery

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Checkout│────▶│  Stock  │────▶│  Wait   │────▶│  Notify │
│  Page   │     │Unavailable    │  Restock│     │  When   │
└─────────┘     └─────────┘     └─────────┘     │Available│
                                                 └─────────┘
```

---

## 4. State Machines

### 4.1 Order Status State Machine

```typescript
const orderStateMachine = {
  pending: {
    transitions: ['confirmed', 'cancelled'],
    guards: {
      confirmed: (order) => order.paymentStatus === 'completed',
      cancelled: (order) => !order.shippedAt,
    },
  },
  confirmed: {
    transitions: ['processing', 'cancelled'],
    guards: {
      processing: (order) => order.stockReserved,
      cancelled: (order) => !order.shippedAt,
    },
  },
  processing: {
    transitions: ['shipped', 'cancelled'],
    guards: {
      shipped: (order) => order.trackingNumber,
      cancelled: (order) => !order.shippedAt,
    },
  },
  shipped: {
    transitions: ['delivered', 'returned'],
    guards: {
      delivered: (order) => order.deliveredAt,
      returned: (order) => order.returnRequested,
    },
  },
  delivered: {
    transitions: ['returned', 'completed'],
    guards: {
      returned: (order) => order.returnRequested,
      completed: (order) => order.reviewedAt || daysSinceDelivery(order) > 30,
    },
  },
  cancelled: {
    transitions: ['refunded'],
    guards: {
      refunded: (order) => order.refundAmount > 0,
    },
  },
  returned: {
    transitions: ['refunded'],
    guards: {
      refunded: (order) => order.refundAmount > 0,
    },
  },
  refunded: {
    transitions: [],
  },
  completed: {
    transitions: [],
  },
};
```

### 4.2 Payment Status State Machine

```typescript
const paymentStateMachine = {
  pending: {
    transitions: ['processing', 'failed', 'cancelled'],
  },
  processing: {
    transitions: ['completed', 'failed'],
  },
  completed: {
    transitions: ['refunded', 'partially_refunded'],
  },
  failed: {
    transitions: ['pending'],  // Retry
  },
  refunded: {
    transitions: [],
  },
  partially_refunded: {
    transitions: ['refunded'],
  },
  cancelled: {
    transitions: [],
  },
};
```
