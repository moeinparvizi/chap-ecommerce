# Endpoint Catalog

## Complete API Endpoint Reference

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| POST | `/auth/register` | No | - | Register new user |
| POST | `/auth/login` | No | - | Login with credentials |
| POST | `/auth/logout` | Yes | - | Logout (invalidate session) |
| POST | `/auth/refresh` | No | - | Refresh access token |
| POST | `/auth/forgot-password` | No | - | Request password reset |
| POST | `/auth/reset-password` | No | - | Reset password with token |
| POST | `/auth/verify-email` | No | - | Verify email with token |
| POST | `/auth/mfa/enable` | Yes | - | Enable MFA |
| POST | `/auth/mfa/verify` | Yes | - | Verify MFA code |
| POST | `/auth/mfa/disable` | Yes | - | Disable MFA |
| GET | `/auth/oauth/:provider` | No | - | Initiate OAuth flow |
| GET | `/auth/oauth/:provider/callback` | No | - | OAuth callback |

### Users (`/api/v1/users`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/users/me` | Yes | - | Get current user profile |
| PATCH | `/users/me` | Yes | - | Update current user profile |
| DELETE | `/users/me` | Yes | - | Deactivate account |
| GET | `/users/me/addresses` | Yes | - | List user addresses |
| POST | `/users/me/addresses` | Yes | - | Create address |
| GET | `/users/me/addresses/:id` | Yes | - | Get address |
| PATCH | `/users/me/addresses/:id` | Yes | - | Update address |
| DELETE | `/users/me/addresses/:id` | Yes | - | Delete address |
| PUT | `/users/me/addresses/:id/default` | Yes | - | Set default address |
| GET | `/users/me/preferences` | Yes | - | Get preferences |
| PATCH | `/users/me/preferences` | Yes | - | Update preferences |

### Products (`/api/v1/products`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/products` | No | - | List products |
| GET | `/products/:id` | No | - | Get product by ID |
| GET | `/products/slug/:slug` | No | - | Get product by slug |
| POST | `/products` | Yes | product:create | Create product |
| PATCH | `/products/:id` | Yes | product:update | Update product |
| DELETE | `/products/:id` | Yes | product:delete | Delete product |
| GET | `/products/:id/variants` | No | - | List variants |
| POST | `/products/:id/variants` | Yes | product:create | Create variant |
| PATCH | `/products/variants/:id` | Yes | product:update | Update variant |
| DELETE | `/products/variants/:id` | Yes | product:delete | Delete variant |
| GET | `/products/:id/images` | No | - | List images |
| POST | `/products/:id/images` | Yes | product:create | Upload image |
| DELETE | `/products/images/:id` | Yes | product:delete | Delete image |

### Categories (`/api/v1/categories`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/categories` | No | - | List categories (tree) |
| GET | `/categories/:id` | No | - | Get category |
| GET | `/categories/slug/:slug` | No | - | Get category by slug |
| POST | `/categories` | Yes | product:create | Create category |
| PATCH | `/categories/:id` | Yes | product:update | Update category |
| DELETE | `/categories/:id` | Yes | product:delete | Delete category |

### Brands (`/api/v1/brands`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/brands` | No | - | List brands |
| GET | `/brands/:id` | No | - | Get brand |
| GET | `/brands/slug/:slug` | No | - | Get brand by slug |
| POST | `/brands` | Yes | product:create | Create brand |
| PATCH | `/brands/:id` | Yes | product:update | Update brand |
| DELETE | `/brands/:id` | Yes | product:delete | Delete brand |

### Inventory (`/api/v1/inventory`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/inventory` | Yes | inventory:read | List inventory |
| GET | `/inventory/:id` | Yes | inventory:read | Get inventory |
| POST | `/inventory` | Yes | inventory:update | Create inventory |
| PATCH | `/inventory/:id` | Yes | inventory:update | Update inventory |
| POST | `/inventory/:id/adjust` | Yes | inventory:adjust | Adjust stock |

### Orders (`/api/v1/orders`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/orders` | Yes | order:read | List orders |
| GET | `/orders/:id` | Yes | order:read | Get order |
| POST | `/orders` | Yes | order:create | Create order |
| POST | `/orders/:id/cancel` | Yes | order:cancel | Cancel order |
| GET | `/orders/:id/track` | Yes | order:read | Track order |

### Cart (`/api/v1/cart`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/cart` | Yes/Guest | - | Get cart |
| POST | `/cart/items` | Yes/Guest | - | Add item to cart |
| PATCH | `/cart/items/:id` | Yes/Guest | - | Update cart item |
| DELETE | `/cart/items/:id` | Yes/Guest | - | Remove cart item |
| POST | `/cart/coupon` | Yes/Guest | - | Apply coupon |
| DELETE | `/cart/coupon` | Yes/Guest | - | Remove coupon |
| DELETE | `/cart` | Yes/Guest | - | Clear cart |

### Wishlist (`/api/v1/wishlists`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/wishlists` | Yes | - | List wishlists |
| GET | `/wishlists/:id` | Yes | - | Get wishlist |
| POST | `/wishlists` | Yes | - | Create wishlist |
| PATCH | `/wishlists/:id` | Yes | - | Update wishlist |
| DELETE | `/wishlists/:id` | Yes | - | Delete wishlist |
| POST | `/wishlists/:id/items` | Yes | - | Add item |
| DELETE | `/wishlists/:id/items/:itemId` | Yes | - | Remove item |
| GET | `/wishlists/shared/:token` | No | - | View shared wishlist |

### Reviews (`/api/v1/reviews`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/reviews/product/:productId` | No | - | List product reviews |
| GET | `/reviews/:id` | No | - | Get review |
| POST | `/reviews` | Yes | review:create | Create review |
| PATCH | `/reviews/:id` | Yes | review:update | Update review |
| DELETE | `/reviews/:id` | Yes | review:delete | Delete review |
| POST | `/reviews/:id/vote` | Yes | review:read | Vote on review |
| POST | `/reviews/:id/report` | Yes | review:read | Report review |

### Comments (`/api/v1/comments`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/comments` | No | - | List comments |
| POST | `/comments` | Yes | - | Create comment |
| PATCH | `/comments/:id` | Yes | - | Update comment |
| DELETE | `/comments/:id` | Yes | - | Delete comment |
| POST | `/comments/:id/like` | Yes | - | Like comment |

### Coupons (`/api/v1/coupons`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| POST | `/coupons/validate` | No | - | Validate coupon |
| POST | `/coupons` | Yes | coupon:create | Create coupon |
| GET | `/coupons` | Yes | coupon:read | List coupons |
| PATCH | `/coupons/:id` | Yes | coupon:update | Update coupon |
| DELETE | `/coupons/:id` | Yes | coupon:delete | Delete coupon |

### Payments (`/api/v1/payments`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| POST | `/payments` | Yes | payment:create | Initiate payment |
| GET | `/payments/:id` | Yes | payment:read | Get payment |
| POST | `/payments/:id/refund` | Yes | payment:refund | Request refund |
| GET | `/payments/methods` | Yes | payment:read | List payment methods |
| POST | `/payments/methods` | Yes | payment:create | Save payment method |
| DELETE | `/payments/methods/:id` | Yes | payment:delete | Delete payment method |
| POST | `/payments/webhook` | No | - | Payment webhook |

### Shipping (`/api/v1/shipping`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/shipping/rates` | No | - | Get shipping rates |
| POST | `/shipments` | Yes | shipping:manage | Create shipment |
| GET | `/shipments/:id` | Yes | shipping:read | Get shipment |
| PATCH | `/shipments/:id` | Yes | shipping:manage | Update shipment |

### Media (`/api/v1/media`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| POST | `/media/upload` | Yes | media:create | Upload file |
| GET | `/media/:id` | Yes | media:read | Get media |
| DELETE | `/media/:id` | Yes | media:delete | Delete media |
| GET | `/media/folders` | Yes | media:read | List folders |
| POST | `/media/folders` | Yes | media:create | Create folder |

### CMS (`/api/v1/cms`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/cms/pages/:slug` | No | - | Get page |
| POST | `/cms/pages` | Yes | cms:create | Create page |
| PATCH | `/cms/pages/:id` | Yes | cms:update | Update page |
| DELETE | `/cms/pages/:id` | Yes | cms:delete | Delete page |
| GET | `/cms/blog` | No | - | List blog posts |
| GET | `/cms/blog/:slug` | No | - | Get blog post |
| POST | `/cms/blog` | Yes | cms:create | Create blog post |
| PATCH | `/cms/blog/:id` | Yes | cms:update | Update blog post |
| DELETE | `/cms/blog/:id` | Yes | cms:delete | Delete blog post |
| GET | `/cms/banners/:slot` | No | - | Get banners |

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/notifications` | Yes | - | List notifications |
| GET | `/notifications/unread-count` | Yes | - | Get unread count |
| PATCH | `/notifications/:id/read` | Yes | - | Mark as read |
| POST | `/notifications/read-all` | Yes | - | Mark all as read |
| DELETE | `/notifications/:id` | Yes | - | Delete notification |
| GET | `/notifications/preferences` | Yes | - | Get preferences |
| PATCH | `/notifications/preferences` | Yes | - | Update preferences |

### Search (`/api/v1/search`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/search` | No | - | Search products |
| GET | `/search/autocomplete` | No | - | Autocomplete |

### Admin (`/api/v1/admin`)

| Method | Endpoint | Auth | Permissions | Description |
|--------|----------|------|-------------|-------------|
| GET | `/admin/users` | Yes | user:read + admin:read | List users |
| GET | `/admin/users/:id` | Yes | user:read + admin:read | Get user |
| PATCH | `/admin/users/:id` | Yes | user:update + admin:read | Update user |
| GET | `/admin/orders` | Yes | order:read + admin:read | List orders |
| GET | `/admin/orders/:id` | Yes | order:read + admin:read | Get order |
| PATCH | `/admin/orders/:id` | Yes | order:update + admin:read | Update order |
| GET | `/admin/products` | Yes | product:read + admin:read | List products |
| PATCH | `/admin/products/:id` | Yes | product:update + admin:read | Update product |
| GET | `/admin/reviews` | Yes | review:read + admin:read | List reviews |
| PATCH | `/admin/reviews/:id/moderate` | Yes | review:moderate | Moderate review |
| GET | `/admin/audit-logs` | Yes | admin:audit | List audit logs |
| GET | `/admin/config` | Yes | admin:config | Get config |
| PATCH | `/admin/config` | Yes | admin:config | Update config |
| GET | `/admin/analytics/dashboard` | Yes | admin:analytics | Get dashboard |
| GET | `/admin/analytics/reports` | Yes | admin:analytics | Get reports |

---

## Endpoint Statistics

| Module | Endpoints | Auth Required | Public |
|--------|-----------|---------------|--------|
| Authentication | 12 | 5 | 7 |
| Users | 11 | 11 | 0 |
| Products | 13 | 5 | 8 |
| Categories | 6 | 3 | 3 |
| Brands | 6 | 3 | 3 |
| Inventory | 5 | 5 | 0 |
| Orders | 5 | 5 | 0 |
| Cart | 7 | 0 | 7 |
| Wishlist | 8 | 7 | 1 |
| Reviews | 7 | 4 | 3 |
| Comments | 5 | 4 | 1 |
| Coupons | 5 | 3 | 2 |
| Payments | 7 | 5 | 2 |
| Shipping | 4 | 3 | 1 |
| Media | 5 | 5 | 0 |
| CMS | 10 | 6 | 4 |
| Notifications | 7 | 7 | 0 |
| Search | 2 | 0 | 2 |
| Admin | 15 | 15 | 0 |
| **Total** | **135** | **96** | **39** |
