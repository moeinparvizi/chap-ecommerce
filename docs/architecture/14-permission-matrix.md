# Permission Matrix

## 1. Role Definitions

| Role | Description | Hierarchy Level |
|------|-------------|-----------------|
| **Guest** | Unauthenticated visitor | 0 |
| **Customer** | Registered user | 1 |
| **Support** | Customer support staff | 2 |
| **Staff** | Store staff member | 3 |
| **Manager** | Department manager | 4 |
| **Admin** | System administrator | 5 |
| **Super Admin** | Full system access | 6 |

---

## 2. Complete Permission Matrix

### Product Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `product:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `product:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `product:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `product:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `product:publish` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### Category & Brand Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `category:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `category:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `category:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `category:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `brand:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `brand:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `brand:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `brand:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### Order Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `order:create` | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `order:read` | ❌ | Own | All | All | All | All | All |
| `order:update` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `order:cancel` | ❌ | Own (pre-ship) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `order:refund` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `order:export` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `order:delete` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Payment Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `payment:read` | ❌ | Own | All | All | All | All | All |
| `payment:create` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `payment:capture` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `payment:refund` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `payment:methods:read` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `payment:methods:create` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `payment:methods:delete` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### User Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `user:read` | ❌ | Own | Any | Any | Any | Any | Any |
| `user:create` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `user:update` | ❌ | Own | Limited | Limited | Any | Any | Any |
| `user:delete` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `user:manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `user:suspend` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `user:roles:manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Inventory Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `inventory:read` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `inventory:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `inventory:adjust` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `inventory:transfer` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### Review Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `review:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `review:create` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `review:update` | ❌ | Own | ❌ | ❌ | ❌ | ✅ | ✅ |
| `review:delete` | ❌ | Own | ❌ | ❌ | ❌ | ✅ | ✅ |
| `review:moderate` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

### CMS Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `cms:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `cms:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `cms:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `cms:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `cms:publish` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### Media Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `media:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `media:create` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `media:update` | ❌ | Own | Own | Any | Any | Any | Any |
| `media:delete` | ❌ | Own | Own | Any | Any | Any | Any |

### Coupon & Promotion Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `coupon:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `coupon:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `coupon:update` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `coupon:delete` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `coupon:validate` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `promotion:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `promotion:create` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `promotion:update` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `promotion:delete` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Notification Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `notification:read` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `notification:manage` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `notification:send` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `notification:templates:manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Shipping Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `shipping:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `shipping:manage` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `shipping:rates:manage` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `shipping:carriers:manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Analytics Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `analytics:read` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `analytics:export` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| `analytics:realtime` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### Admin Permissions

| Permission | Guest | Customer | Support | Staff | Manager | Admin | Super Admin |
|------------|-------|----------|---------|-------|---------|-------|-------------|
| `admin:read` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `admin:config` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `admin:audit` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `admin:system` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `admin:roles:manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `admin:permissions:manage` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Resource Ownership Rules

| Resource | Owner | Manager | Admin |
|----------|-------|---------|-------|
| **Cart** | ✅ Own | ✅ Any | ✅ Any |
| **Wishlist** | ✅ Own | ❌ | ✅ Any |
| **Address** | ✅ Own | ❌ | ✅ Any |
| **Payment Method** | ✅ Own | ❌ | ✅ Any |
| **Order** | ✅ Own | ✅ Any | ✅ Any |
| **Review** | ✅ Own | ✅ Moderate | ✅ Any |
| **Notification** | ✅ Own | ✅ Any | ✅ Any |

---

## 4. API Endpoint Authorization Map

| Endpoint | Required Permission | Ownership Rule |
|----------|-------------------|----------------|
| `GET /products` | None | - |
| `POST /products` | `product:create` | - |
| `PATCH /products/:id` | `product:update` | - |
| `DELETE /products/:id` | `product:delete` | - |
| `GET /orders` | `order:read` | Customer: own only |
| `POST /orders` | `order:create` | - |
| `PATCH /orders/:id` | `order:update` | Support: any |
| `POST /orders/:id/cancel` | `order:cancel` | Customer: pre-ship only |
| `GET /reviews` | None | - |
| `POST /reviews` | `review:create` | - |
| `DELETE /reviews/:id` | `review:delete` | Customer: own only |
| `PATCH /reviews/:id/moderate` | `review:moderate` | - |
| `GET /admin/users` | `user:read` + `admin:read` | - |
| `PATCH /admin/users/:id` | `user:update` + `admin:read` | - |
| `GET /admin/orders` | `order:read` + `admin:read` | - |
| `GET /admin/config` | `admin:config` | - |
| `PATCH /admin/config` | `admin:config` | - |
