# API Design

## 1. API Design Principles

| Principle | Description |
|-----------|-------------|
| **RESTful** | Resource-oriented, HTTP methods semantics |
| **Versioned** | `/api/v1/...` for backward compatibility |
| **Consistent** | Uniform request/response formats |
| **Typed** | TypeScript DTOs with Zod validation |
| **Paginated** | Cursor-based for feeds, offset-based for lists |
| **Filterable** | Query parameters for filtering |
| **Sortable** | `sortBy` and `sortOrder` parameters |
| **HATEOAS** | Links for resource navigation (future) |

---

## 2. Base URL & Versioning

```
Production:  https://api.ecommerce.com/api/v1
Staging:     https://api-staging.ecommerce.com/api/v1
Development: http://localhost:3000/api/v1
```

---

## 3. Standard Response Format

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Paginated Response
```json
{
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false,
    "nextCursor": "eyJpZCI6...",
    "prevCursor": null,
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "code": "invalid_string"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## 4. HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success |
| `201` | Created |
| `204` | No Content (delete success) |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (no/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (duplicate resource) |
| `422` | Unprocessable Entity (business logic error) |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |

---

## 5. Authentication Endpoints

### Auth Service (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login with email/password | No |
| `POST` | `/auth/logout` | Logout (invalidate session) | Yes |
| `POST` | `/auth/refresh` | Refresh access token | Yes (refresh token) |
| `POST` | `/auth/forgot-password` | Request password reset | No |
| `POST` | `/auth/reset-password` | Reset password with token | No |
| `POST` | `/auth/verify-email` | Verify email with token | No |
| `POST` | `/auth/resend-verification` | Resend verification email | Yes |
| `POST` | `/auth/mfa/enable` | Enable MFA | Yes |
| `POST` | `/auth/mfa/verify` | Verify MFA code | Yes |
| `POST` | `/auth/mfa/disable` | Disable MFA | Yes |
| `GET` | `/auth/oauth/:provider` | Initiate OAuth flow | No |
| `GET` | `/auth/oauth/:provider/callback` | OAuth callback | No |

### Request/Response DTOs

```typescript
// POST /auth/register
interface RegisterDto {
  email: string;        // Required, valid email
  password: string;     // Required, min 8 chars, 1 uppercase, 1 number, 1 special
  firstName: string;    // Required, 2-100 chars
  lastName: string;     // Required, 2-100 chars
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;  // seconds
}

// POST /auth/login
interface LoginDto {
  email: string;
  password: string;
  mfaCode?: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  requiresMfa?: boolean;
}
```

---

## 6. User Endpoints

### User Service (`/api/v1/users`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/users/me` | Get current user profile | Yes | user:read |
| `PATCH` | `/users/me` | Update current user profile | Yes | user:update |
| `DELETE` | `/users/me` | Deactivate account | Yes | user:delete |
| `GET` | `/users/me/addresses` | List user addresses | Yes | user:read |
| `POST` | `/users/me/addresses` | Create address | Yes | user:create |
| `GET` | `/users/me/addresses/:id` | Get address | Yes | user:read |
| `PATCH` | `/users/me/addresses/:id` | Update address | Yes | user:update |
| `DELETE` | `/users/me/addresses/:id` | Delete address | Yes | user:delete |
| `PUT` | `/users/me/addresses/:id/default` | Set default address | Yes | user:update |
| `GET` | `/users/me/preferences` | Get preferences | Yes | user:read |
| `PATCH` | `/users/me/preferences` | Update preferences | Yes | user:update |

### Request/Response DTOs

```typescript
// PATCH /users/me
interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  dateOfBirth?: string;  // ISO 8601 date
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  locale?: string;
  timezone?: string;
}

// POST /users/me/addresses
interface CreateAddressDto {
  label?: string;          // 'home', 'work', 'other'
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;     // ISO 3166-1 alpha-2
  phone?: string;
  isDefault?: boolean;
}

interface AddressResponse {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
}
```

---

## 7. Product Endpoints

### Product Service (`/api/v1/products`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/products` | List products (paginated, filterable) | No | - |
| `GET` | `/products/:id` | Get product by ID | No | - |
| `GET` | `/products/slug/:slug` | Get product by slug | No | - |
| `POST` | `/products` | Create product | Yes | product:create |
| `PATCH` | `/products/:id` | Update product | Yes | product:update |
| `DELETE` | `/products/:id` | Delete product | Yes | product:delete |
| `GET` | `/products/:id/variants` | List variants | No | - |
| `POST` | `/products/:id/variants` | Create variant | Yes | product:create |
| `PATCH` | `/products/variants/:id` | Update variant | Yes | product:update |
| `DELETE` | `/products/variants/:id` | Delete variant | Yes | product:delete |
| `GET` | `/products/:id/images` | List images | No | - |
| `POST` | `/products/:id/images` | Upload image | Yes | product:create |
| `DELETE` | `/products/images/:id` | Delete image | Yes | product:delete |

### Query Parameters

```typescript
interface ProductListQuery {
  page?: number;           // Default: 1
  limit?: number;          // Default: 20, Max: 100
  sortBy?: string;         // 'created_at', 'price', 'rating', 'name'
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  status?: 'active' | 'draft' | 'archived';
  search?: string;
  tags?: string[];
  isFeatured?: boolean;
}
```

### Response DTOs

```typescript
interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  status: string;
  isFeatured: boolean;
  isDigital: boolean;
  weight?: number;
  weightUnit?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  price: {
    amount: number;
    currency: string;
    compareAtPrice?: number;
  };
  rating: {
    average: number;
    count: number;
  };
  reviewCount: number;
  viewCount: number;
  tags: string[];
  attributes: Record<string, unknown>;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: {
    amount: number;
    currency: string;
    compareAtPrice?: number;
  };
  stock: {
    available: number;
    inStock: boolean;
  };
  image?: ProductImage;
  isActive: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  width: number;
  height: number;
  isPrimary: boolean;
  sortOrder: number;
}
```

---

## 8. Category & Brand Endpoints

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/categories` | List categories (tree) | No | - |
| `GET` | `/categories/:id` | Get category | No | - |
| `GET` | `/categories/slug/:slug` | Get category by slug | No | - |
| `POST` | `/categories` | Create category | Yes | product:create |
| `PATCH` | `/categories/:id` | Update category | Yes | product:update |
| `DELETE` | `/categories/:id` | Delete category | Yes | product:delete |
| `GET` | `/brands` | List brands | No | - |
| `GET` | `/brands/:id` | Get brand | No | - |
| `GET` | `/brands/slug/:slug` | Get brand by slug | No | - |
| `POST` | `/brands` | Create brand | Yes | product:create |
| `PATCH` | `/brands/:id` | Update brand | Yes | product:update |
| `DELETE` | `/brands/:id` | Delete brand | Yes | product:delete |

---

## 9. Cart Endpoints

### Cart Service (`/api/v1/cart`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart` | Get current cart | Yes/Guest |
| `POST` | `/cart/items` | Add item to cart | Yes/Guest |
| `PATCH` | `/cart/items/:id` | Update cart item quantity | Yes/Guest |
| `DELETE` | `/cart/items/:id` | Remove item from cart | Yes/Guest |
| `POST` | `/cart/coupon` | Apply coupon code | Yes/Guest |
| `DELETE` | `/cart/coupon` | Remove coupon | Yes/Guest |
| `POST` | `/cart/merge` | Merge guest cart to user cart | Yes |
| `DELETE` | `/cart` | Clear cart | Yes/Guest |

### Request/Response DTOs

```typescript
interface AddToCartDto {
  productId: string;
  variantId?: string;
  quantity: number;  // Min: 1, Max: 99
}

interface CartResponse {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  couponCode?: string;
  currency: string;
  expiresAt?: string;
}

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
  };
  variant?: {
    id: string;
    name: string;
    attributes: Record<string, string>;
  };
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  inStock: boolean;
  maxQuantity: number;
}
```

---

## 10. Order Endpoints

### Order Service (`/api/v1/orders`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/orders` | List user orders | Yes | order:read |
| `GET` | `/orders/:id` | Get order details | Yes | order:read |
| `POST` | `/orders` | Create order from cart | Yes | order:create |
| `POST` | `/orders/:id/cancel` | Cancel order | Yes | order:cancel |
| `GET` | `/orders/:id/track` | Track order | Yes | order:read |
| `GET` | `/orders/:id/invoice` | Get invoice | Yes | order:read |

### Request/Response DTOs

```typescript
interface CreateOrderDto {
  shippingAddressId?: string;
  shippingAddress?: CreateAddressDto;
  billingAddressId?: string;
  billingAddress?: CreateAddressDto;
  shippingMethodId: string;
  paymentMethodId: string;
  notes?: string;
  couponCode?: string;
}

interface OrderResponse {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: AddressResponse;
  billingAddress: AddressResponse;
  shippingMethod: {
    id: string;
    name: string;
    carrier: string;
  };
  payment: {
    id: string;
    status: string;
    method: string;
  };
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  notes?: string;
  tracking?: {
    number: string;
    carrier: string;
    url: string;
  };
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';
```

---

## 11. Payment Endpoints

### Payment Service (`/api/v1/payments`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `POST` | `/payments` | Initiate payment | Yes | payment:create |
| `GET` | `/payments/:id` | Get payment status | Yes | payment:read |
| `POST` | `/payments/:id/capture` | Capture payment | Yes | payment:capture |
| `POST` | `/payments/:id/refund` | Request refund | Yes | payment:refund |
| `GET` | `/payments/methods` | List saved payment methods | Yes | payment:read |
| `POST` | `/payments/methods` | Save payment method | Yes | payment:create |
| `DELETE` | `/payments/methods/:id` | Delete payment method | Yes | payment:delete |
| `POST` | `/payments/webhook` | Payment provider webhook | No (signed) | - |

---

## 12. Review Endpoints

### Review Service (`/api/v1/reviews`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/reviews/product/:productId` | List product reviews | No | - |
| `GET` | `/reviews/:id` | Get review | No | - |
| `POST` | `/reviews` | Create review | Yes | review:create |
| `PATCH` | `/reviews/:id` | Update review | Yes | review:update |
| `DELETE` | `/reviews/:id` | Delete review | Yes | review:delete |
| `POST` | `/reviews/:id/vote` | Vote on review | Yes | review:read |
| `POST` | `/reviews/:id/report` | Report review | Yes | review:read |

### Query Parameters

```typescript
interface ReviewListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
  rating?: number;
  verified?: boolean;
}
```

---

## 13. Wishlist Endpoints

### Wishlist Service (`/api/v1/wishlists`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/wishlists` | List user wishlists | Yes |
| `GET` | `/wishlists/:id` | Get wishlist | Yes |
| `POST` | `/wishlists` | Create wishlist | Yes |
| `PATCH` | `/wishlists/:id` | Update wishlist | Yes |
| `DELETE` | `/wishlists/:id` | Delete wishlist | Yes |
| `POST` | `/wishlists/:id/items` | Add item | Yes |
| `DELETE` | `/wishlists/:id/items/:itemId` | Remove item | Yes |
| `GET` | `/wishlists/shared/:token` | View shared wishlist | No |

---

## 14. Search Endpoints

### Search Service (`/api/v1/search`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/search` | Search products | No |
| `GET` | `/search/autocomplete` | Autocomplete suggestions | No |
| `GET` | `/search/facets` | Get available facets | No |

### Query Parameters

```typescript
interface SearchQuery {
  q: string;                // Search term
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  brand?: string[];
  price?: string;           // '0-50', '50-100', '100-'
  rating?: number;
  inStock?: boolean;
  facets?: Record<string, string[]>;
}
```

---

## 15. Media Endpoints

### Media Service (`/api/v1/media`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `POST` | `/media/upload` | Upload file | Yes | media:create |
| `POST` | `/media/upload/multiple` | Upload multiple files | Yes | media:create |
| `GET` | `/media/:id` | Get media info | Yes | media:read |
| `DELETE` | `/media/:id` | Delete media | Yes | media:delete |
| `GET` | `/media/folders` | List folders | Yes | media:read |
| `POST` | `/media/folders` | Create folder | Yes | media:create |
| `PUT` | `/media/:id/move` | Move to folder | Yes | media:update |

### Upload Response

```typescript
interface MediaUploadResponse {
  id: string;
  url: string;
  cdnUrl: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  variants: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
  };
}
```

---

## 16. CMS Endpoints

### CMS Service (`/api/v1/cms`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/cms/pages/:slug` | Get page by slug | No | - |
| `GET` | `/cms/blog` | List blog posts | No | - |
| `GET` | `/cms/blog/:slug` | Get blog post | No | - |
| `GET` | `/cms/banners/:slot` | Get banners for slot | No | - |
| `POST` | `/cms/pages` | Create page | Yes | cms:create |
| `PATCH` | `/cms/pages/:id` | Update page | Yes | cms:update |
| `DELETE` | `/cms/pages/:id` | Delete page | Yes | cms:delete |
| `POST` | `/cms/blog` | Create blog post | Yes | cms:create |
| `PATCH` | `/cms/blog/:id` | Update blog post | Yes | cms:update |
| `DELETE` | `/cms/blog/:id` | Delete blog post | Yes | cms:delete |

---

## 17. Notification Endpoints

### Notification Service (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/notifications` | List user notifications | Yes |
| `GET` | `/notifications/unread-count` | Get unread count | Yes |
| `PATCH` | `/notifications/:id/read` | Mark as read | Yes |
| `POST` | `/notifications/read-all` | Mark all as read | Yes |
| `DELETE` | `/notifications/:id` | Delete notification | Yes |
| `GET` | `/notifications/preferences` | Get preferences | Yes |
| `PATCH` | `/notifications/preferences` | Update preferences | Yes |

---

## 18. Admin Endpoints

### Admin Service (`/api/v1/admin`)

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| `GET` | `/admin/dashboard` | Dashboard stats | Yes | admin:read |
| `GET` | `/admin/users` | List all users | Yes | user:read |
| `GET` | `/admin/users/:id` | Get user details | Yes | user:read |
| `PATCH` | `/admin/users/:id` | Update user | Yes | user:update |
| `PATCH` | `/admin/users/:id/status` | Change user status | Yes | user:manage |
| `GET` | `/admin/orders` | List all orders | Yes | order:read |
| `GET` | `/admin/orders/:id` | Get order details | Yes | order:read |
| `PATCH` | `/admin/orders/:id` | Update order | Yes | order:update |
| `GET` | `/admin/products` | List all products | Yes | product:read |
| `POST` | `/admin/products` | Create product | Yes | product:create |
| `PATCH` | `/admin/products/:id` | Update product | Yes | product:update |
| `DELETE` | `/admin/products/:id` | Delete product | Yes | product:delete |
| `GET` | `/admin/reviews` | List all reviews | Yes | review:read |
| `PATCH` | `/admin/reviews/:id/moderate` | Moderate review | Yes | review:moderate |
| `GET` | `/admin/audit-logs` | List audit logs | Yes | admin:audit |
| `GET` | `/admin/analytics/:report` | Get analytics report | Yes | admin:analytics |
| `GET` | `/admin/config` | Get system config | Yes | admin:config |
| `PATCH` | `/admin/config` | Update system config | Yes | admin:config |

---

## 19. Validation Strategy

### Zod Schemas

```typescript
import { z } from 'zod';

// Common schemas
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const uuidSchema = z.string().uuid();

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  'Password must contain uppercase, lowercase, number, and special character'
);

// Product schemas
const createProductSchema = z.object({
  sku: z.string().min(1).max(100),
  name: z.string().min(1).max(500),
  description: z.string().optional(),
  categoryId: uuidSchema,
  brandId: uuidSchema.optional(),
  status: z.enum(['draft', 'active']).default('draft'),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  weight: z.number().positive().optional(),
  tags: z.array(z.string()).max(20).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
});

// Order schemas
const createOrderSchema = z.object({
  shippingAddressId: uuidSchema.optional(),
  shippingAddress: createAddressSchema.optional(),
  billingAddressId: uuidSchema.optional(),
  billingAddress: createAddressSchema.optional(),
  shippingMethodId: uuidSchema,
  paymentMethodId: uuidSchema,
  notes: z.string().max(500).optional(),
  couponCode: z.string().max(50).optional(),
}).refine(
  (data) => data.shippingAddressId || data.shippingAddress,
  { message: 'Either shippingAddressId or shippingAddress is required' }
);
```

---

## 20. Rate Limiting

| Endpoint Category | Rate Limit | Window |
|-------------------|------------|--------|
| **General API** | 100 requests | 1 minute |
| **Auth endpoints** | 10 requests | 1 minute |
| **Search** | 30 requests | 1 minute |
| **File upload** | 20 requests | 1 minute |
| **Admin API** | 200 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705312200
Retry-After: 60  (only when rate limited)
```
