# API Contracts - Complete Reference

## Standard Response Format

### Success Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
    prevCursor?: string;
    timestamp: string;
    requestId: string;
  };
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
    timestamp: string;
    requestId: string;
  };
}
```

---

## 1. Authentication Module

### POST /api/v1/auth/register
```typescript
// Request
interface RegisterDto {
  email: string;           // Required, valid email
  password: string;        // Required, min 8 chars, 1 uppercase, 1 number, 1 special
  firstName: string;       // Required, 2-100 chars
  lastName: string;        // Required, 2-100 chars
}

// Response 201
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
  expiresIn: number;
}

// Errors: 400 (validation), 409 (email exists)
```

### POST /api/v1/auth/login
```typescript
// Request
interface LoginDto {
  email: string;
  password: string;
  mfaCode?: string;
}

// Response 200
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

// Errors: 400 (validation), 401 (invalid credentials), 423 (account locked)
```

### POST /api/v1/auth/logout
```typescript
// Headers: Authorization: Bearer <token>
// Response 204 No Content
// Errors: 401 (unauthorized)
```

### POST /api/v1/auth/refresh
```typescript
// Request
interface RefreshDto {
  refreshToken: string;
}

// Response 200
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Errors: 401 (invalid/expired refresh token)
```

### POST /api/v1/auth/forgot-password
```typescript
// Request
interface ForgotPasswordDto {
  email: string;
}

// Response 200
interface ForgotPasswordResponse {
  message: string; // "If email exists, reset link has been sent"
}

// Always returns 200 to prevent email enumeration
```

### POST /api/v1/auth/reset-password
```typescript
// Request
interface ResetPasswordDto {
  token: string;
  password: string;
}

// Response 200
interface ResetPasswordResponse {
  message: string;
}

// Errors: 400 (invalid/expired token)
```

### POST /api/v1/auth/verify-email
```typescript
// Request
interface VerifyEmailDto {
  token: string;
}

// Response 200
interface VerifyEmailResponse {
  message: string;
}

// Errors: 400 (invalid/expired token)
```

### POST /api/v1/auth/mfa/enable
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface EnableMfaResponse {
  secret: string;
  qrCode: string; // Base64 QR code image
  backupCodes: string[];
}

// Errors: 401 (unauthorized)
```

### POST /api/v1/auth/mfa/verify
```typescript
// Request
interface VerifyMfaDto {
  code: string;
}

// Response 200
interface VerifyMfaResponse {
  message: string;
}

// Errors: 400 (invalid code)
```

### GET /api/v1/auth/oauth/:provider
```typescript
// Redirects to OAuth provider
// Providers: google, github, facebook, apple
```

### GET /api/v1/auth/oauth/:provider/callback
```typescript
// Query: code, state
// Response: Redirects to frontend with tokens
```

---

## 2. Users Module

### GET /api/v1/users/me
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface UserProfileResponse {
  id: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    displayName?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    gender?: string;
    bio?: string;
    company?: string;
    website?: string;
    locale: string;
    timezone: string;
  };
  createdAt: string;
}

// Errors: 401 (unauthorized)
```

### PATCH /api/v1/users/me
```typescript
// Request
interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  bio?: string;
  company?: string;
  website?: string;
  locale?: string;
  timezone?: string;
}

// Response 200
interface UpdateProfileResponse {
  message: string;
  profile: UserProfileResponse;
}

// Errors: 400 (validation), 401 (unauthorized)
```

### GET /api/v1/users/me/addresses
```typescript
// Response 200
interface AddressListResponse {
  addresses: Address[];
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
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

### POST /api/v1/users/me/addresses
```typescript
// Request
interface CreateAddressDto {
  type?: 'home' | 'work' | 'other';
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
  isDefault?: boolean;
}

// Response 201
interface CreateAddressResponse {
  address: Address;
}

// Errors: 400 (validation), 401 (unauthorized)
```

### PATCH /api/v1/users/me/addresses/:id
```typescript
// Request: Partial<CreateAddressDto>
// Response 200
interface UpdateAddressResponse {
  address: Address;
}

// Errors: 400 (validation), 404 (not found), 403 (forbidden)
```

### DELETE /api/v1/users/me/addresses/:id
```typescript
// Response 204 No Content
// Errors: 404 (not found), 403 (forbidden)
```

### PUT /api/v1/users/me/addresses/:id/default
```typescript
// Response 200
interface SetDefaultAddressResponse {
  message: string;
}

// Errors: 404 (not found), 403 (forbidden)
```

---

## 3. Products Module

### GET /api/v1/products
```typescript
// Query Parameters
interface ProductListQuery {
  page?: number;           // Default: 1
  limit?: number;          // Default: 20, Max: 100
  sortBy?: string;         // 'created_at', 'price', 'rating', 'name', 'sold_count'
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
  inStock?: boolean;
}

// Response 200
interface ProductListResponse {
  products: Product[];
  meta: PaginationMeta;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  productType: string;
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
  price: {
    amount: number;
    currency: string;
    compareAtPrice?: number;
  };
  stock: {
    quantity: number;
    inStock: boolean;
    lowStock: boolean;
  };
  rating: {
    average: number;
    count: number;
  };
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  images: ProductImage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  isPrimary: boolean;
  sortOrder: number;
}
```

### GET /api/v1/products/:id
```typescript
// Response 200
interface ProductDetailResponse {
  product: Product & {
    variants: ProductVariant[];
    attributes: ProductAttribute[];
    relatedProducts: Product[];
    reviews: Review[];
  };
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
    quantity: number;
    inStock: boolean;
  };
  image?: ProductImage;
  isActive: boolean;
}

interface ProductAttribute {
  id: string;
  name: string;
  type: string;
  value: string;
}

// Errors: 404 (not found)
```

### GET /api/v1/products/slug/:slug
```typescript
// Same as GET /api/v1/products/:id but by slug
```

### POST /api/v1/products
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:create
// Request
interface CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  shortDescription?: string;
  productType?: 'physical' | 'digital' | 'service' | 'subscription';
  categoryId: string;
  brandId?: string;
  status?: 'draft' | 'active';
  isFeatured?: boolean;
  isDigital?: boolean;
  isTaxable?: boolean;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}

// Response 201
interface CreateProductResponse {
  product: Product;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (SKU exists)
```

### PATCH /api/v1/products/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:update
// Request: Partial<CreateProductDto>
// Response 200
interface UpdateProductResponse {
  product: Product;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/products/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:delete
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

---

## 4. Categories Module

### GET /api/v1/categories
```typescript
// Query Parameters
interface CategoryListQuery {
  includeChildren?: boolean;
  includeProductCount?: boolean;
}

// Response 200
interface CategoryListResponse {
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  children?: Category[];
}
```

### GET /api/v1/categories/:id
```typescript
// Response 200
interface CategoryDetailResponse {
  category: Category & {
    breadcrumbs: Breadcrumb[];
    products?: Product[];
  };
}

// Errors: 404 (not found)
```

### GET /api/v1/categories/slug/:slug
```typescript
// Same as GET /api/v1/categories/:id but by slug
```

### POST /api/v1/categories
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:create
// Request
interface CreateCategoryDto {
  parentId?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Response 201
interface CreateCategoryResponse {
  category: Category;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (slug exists)
```

### PATCH /api/v1/categories/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:update
// Request: Partial<CreateCategoryDto>
// Response 200
interface UpdateCategoryResponse {
  category: Category;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/categories/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:delete
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (has products)
```

---

## 5. Brands Module

### GET /api/v1/brands
```typescript
// Response 200
interface BrandListResponse {
  brands: Brand[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
}
```

### GET /api/v1/brands/:id
```typescript
// Response 200
interface BrandDetailResponse {
  brand: Brand & {
    products?: Product[];
  };
}

// Errors: 404 (not found)
```

### POST /api/v1/brands
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:create
// Request
interface CreateBrandDto {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Response 201
interface CreateBrandResponse {
  brand: Brand;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (slug exists)
```

### PATCH /api/v1/brands/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:update
// Request: Partial<CreateBrandDto>
// Response 200
interface UpdateBrandResponse {
  brand: Brand;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/brands/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:delete
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (has products)
```

---

## 6. Inventory Module

### GET /api/v1/inventory
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: inventory:read
// Query Parameters
interface InventoryListQuery {
  page?: number;
  limit?: number;
  productId?: string;
  warehouseId?: string;
  lowStock?: boolean;
}

// Response 200
interface InventoryListResponse {
  inventory: InventoryItem[];
  meta: PaginationMeta;
}

interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
  };
  warehouse: {
    id: string;
    name: string;
    code: string;
  };
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  createdAt: string;
  updatedAt: string;
}
```

### GET /api/v1/inventory/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: inventory:read
// Response 200
interface InventoryDetailResponse {
  inventory: InventoryItem & {
    movements: StockMovement[];
  };
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/inventory
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: inventory:update
// Request
interface CreateInventoryDto {
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantity: number;
  lowStockThreshold?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
}

// Response 201
interface CreateInventoryResponse {
  inventory: InventoryItem;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (duplicate)
```

### PATCH /api/v1/inventory/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: inventory:update
// Request
interface UpdateInventoryDto {
  quantity?: number;
  lowStockThreshold?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
}

// Response 200
interface UpdateInventoryResponse {
  inventory: InventoryItem;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/inventory/:id/adjust
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: inventory:adjust
// Request
interface AdjustInventoryDto {
  quantity: number; // Positive to add, negative to subtract
  reason: string;
}

// Response 200
interface AdjustInventoryResponse {
  inventory: InventoryItem;
  movement: StockMovement;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 422 (insufficient stock)
```

---

## 7. Orders Module

### GET /api/v1/orders
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:read
// Query Parameters
interface OrderListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

// Response 200
interface OrderListResponse {
  orders: Order[];
  meta: PaginationMeta;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
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

interface OrderItem {
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
  discountAmount: number;
  taxAmount: number;
  total: number;
  options?: Record<string, unknown>;
}

interface OrderStatusHistory {
  status: OrderStatus;
  note?: string;
  performedBy?: string;
  createdAt: string;
}

type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  | 'on_hold'
  | 'failed';
```

### GET /api/v1/orders/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:read
// Response 200
interface OrderDetailResponse {
  order: Order;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/orders
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:create
// Request
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

// Response 201
interface CreateOrderResponse {
  order: Order;
  payment: {
    id: string;
    clientSecret: string; // For Stripe
    redirectUrl?: string; // For PayPal
  };
}

// Errors: 400 (validation), 401 (unauthorized), 422 (cart empty, insufficient stock)
```

### POST /api/v1/orders/:id/cancel
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:cancel
// Request
interface CancelOrderDto {
  reason: string;
}

// Response 200
interface CancelOrderResponse {
  order: Order;
}

// Errors: 400 (cannot cancel), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/orders/:id/track
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:read
// Response 200
interface TrackOrderResponse {
  tracking: {
    number: string;
    carrier: string;
    url: string;
    status: string;
    estimatedDelivery?: string;
    events: TrackingEvent[];
  };
}

interface TrackingEvent {
  status: string;
  location?: string;
  description: string;
  timestamp: string;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

---

## 8. Cart Module

### GET /api/v1/cart
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Response 200
interface CartResponse {
  cart: Cart;
}

interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  couponCode?: string;
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

### POST /api/v1/cart/items
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Request
interface AddToCartDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

// Response 201
interface AddToCartResponse {
  cart: Cart;
  message: string;
}

// Errors: 400 (validation), 422 (out of stock)
```

### PATCH /api/v1/cart/items/:id
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Request
interface UpdateCartItemDto {
  quantity: number;
}

// Response 200
interface UpdateCartItemResponse {
  cart: Cart;
}

// Errors: 400 (validation), 404 (not found), 422 (out of stock)
```

### DELETE /api/v1/cart/items/:id
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Response 200
interface RemoveCartItemResponse {
  cart: Cart;
  message: string;
}

// Errors: 404 (not found)
```

### POST /api/v1/cart/coupon
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Request
interface ApplyCouponDto {
  code: string;
}

// Response 200
interface ApplyCouponResponse {
  cart: Cart;
  discount: {
    code: string;
    type: string;
    value: number;
    amount: number;
  };
  message: string;
}

// Errors: 400 (invalid coupon), 422 (coupon not applicable)
```

### DELETE /api/v1/cart/coupon
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Response 200
interface RemoveCouponResponse {
  cart: Cart;
  message: string;
}
```

### DELETE /api/v1/cart
```typescript
// Headers: Authorization: Bearer <token> OR X-Session-Id
// Response 200
interface ClearCartResponse {
  message: string;
}
```

---

## 9. Wishlist Module

### GET /api/v1/wishlists
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface WishlistListResponse {
  wishlists: Wishlist[];
}

interface Wishlist {
  id: string;
  name: string;
  isPublic: boolean;
  shareToken?: string;
  itemCount: number;
  items: WishlistItem[];
  createdAt: string;
}

interface WishlistItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  note?: string;
  priority: number;
  createdAt: string;
}
```

### GET /api/v1/wishlists/:id
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface WishlistDetailResponse {
  wishlist: Wishlist;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/wishlists
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface CreateWishlistDto {
  name?: string;
  isPublic?: boolean;
}

// Response 201
interface CreateWishlistResponse {
  wishlist: Wishlist;
}

// Errors: 400 (validation), 401 (unauthorized)
```

### PATCH /api/v1/wishlists/:id
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface UpdateWishlistDto {
  name?: string;
  isPublic?: boolean;
}

// Response 200
interface UpdateWishlistResponse {
  wishlist: Wishlist;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/wishlists/:id
```typescript
// Headers: Authorization: Bearer <token>
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/wishlists/:id/items
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface AddWishlistItemDto {
  productId: string;
  variantId?: string;
  note?: string;
  priority?: number;
}

// Response 201
interface AddWishlistItemResponse {
  wishlist: Wishlist;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (already exists)
```

### DELETE /api/v1/wishlists/:id/items/:itemId
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface RemoveWishlistItemResponse {
  wishlist: Wishlist;
  message: string;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/wishlists/shared/:token
```typescript
// Response 200
interface SharedWishlistResponse {
  wishlist: Wishlist;
}

// Errors: 404 (not found or not public)
```

---

## 10. Reviews Module

### GET /api/v1/reviews/product/:productId
```typescript
// Query Parameters
interface ReviewListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
  rating?: number;
  verified?: boolean;
}

// Response 200
interface ReviewListResponse {
  reviews: Review[];
  meta: PaginationMeta;
  stats: {
    average: number;
    total: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

interface Review {
  id: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  rating: number;
  title?: string;
  body?: string;
  pros?: string;
  cons?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  images: ReviewImage[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewImage {
  id: string;
  url: string;
  alt?: string;
}
```

### POST /api/v1/reviews
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: review:create
// Request
interface CreateReviewDto {
  productId: string;
  orderId?: string;
  orderItemId?: string;
  rating: number;
  title?: string;
  body?: string;
  pros?: string;
  cons?: string;
}

// Response 201
interface CreateReviewResponse {
  review: Review;
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized), 409 (already reviewed)
```

### PATCH /api/v1/reviews/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: review:update (own review)
// Request
interface UpdateReviewDto {
  rating?: number;
  title?: string;
  body?: string;
  pros?: string;
  cons?: string;
}

// Response 200
interface UpdateReviewResponse {
  review: Review;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/reviews/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: review:delete (own review)
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/reviews/:id/vote
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface VoteReviewDto {
  isHelpful: boolean;
}

// Response 200
interface VoteReviewResponse {
  review: Review;
  message: string;
}

// Errors: 401 (unauthorized), 404 (not found), 409 (already voted)
```

### POST /api/v1/reviews/:id/report
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface ReportReviewDto {
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'other';
  description?: string;
}

// Response 201
interface ReportReviewResponse {
  message: string;
}

// Errors: 401 (unauthorized), 404 (not found), 409 (already reported)
```

---

## 11. Comments Module

### GET /api/v1/comments
```typescript
// Query Parameters
interface CommentListQuery {
  entityType: string;
  entityId: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

// Response 200
interface CommentListResponse {
  comments: Comment[];
  meta: PaginationMeta;
}

interface Comment {
  id: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  body: string;
  isEdited: boolean;
  likeCount: number;
  replyCount: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}
```

### POST /api/v1/comments
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface CreateCommentDto {
  entityType: string;
  entityId: string;
  body: string;
  parentId?: string;
}

// Response 201
interface CreateCommentResponse {
  comment: Comment;
}

// Errors: 400 (validation), 401 (unauthorized)
```

### PATCH /api/v1/comments/:id
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface UpdateCommentDto {
  body: string;
}

// Response 200
interface UpdateCommentResponse {
  comment: Comment;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/comments/:id
```typescript
// Headers: Authorization: Bearer <token>
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/comments/:id/like
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface LikeCommentResponse {
  comment: Comment;
  message: string;
}

// Errors: 401 (unauthorized), 404 (not found), 409 (already liked)
```

---

## 12. Coupons Module

### POST /api/v1/coupons/validate
```typescript
// Request
interface ValidateCouponDto {
  code: string;
  cartTotal: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

// Response 200
interface ValidateCouponResponse {
  valid: boolean;
  coupon?: {
    code: string;
    type: string;
    value: number;
    description: string;
  };
  discount?: {
    amount: number;
    type: string;
  };
  message: string;
}

// Errors: 400 (invalid code)
```

### POST /api/v1/coupons
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: coupon:create
// Request
interface CreateCouponDto {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  minQuantity?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  productIds?: string[];
  categoryIds?: string[];
  excludeProductIds?: string[];
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
}

// Response 201
interface CreateCouponResponse {
  coupon: Coupon;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (code exists)
```

### GET /api/v1/coupons
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: coupon:read
// Query Parameters
interface CouponListQuery {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'expired';
}

// Response 200
interface CouponListResponse {
  coupons: Coupon[];
  meta: PaginationMeta;
}

interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: string;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  createdAt: string;
}
```

### PATCH /api/v1/coupons/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: coupon:update
// Request: Partial<CreateCouponDto>
// Response 200
interface UpdateCouponResponse {
  coupon: Coupon;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/coupons/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: coupon:delete
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

---

## 13. Payments Module

### POST /api/v1/payments
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: payment:create
// Request
interface CreatePaymentDto {
  orderId: string;
  method: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer';
  paymentMethodId?: string; // Saved payment method
  returnUrls?: {
    success: string;
    cancel: string;
  };
}

// Response 201
interface CreatePaymentResponse {
  payment: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  clientSecret?: string; // For Stripe
  redirectUrl?: string; // For PayPal
}

// Errors: 400 (validation), 401 (unauthorized), 422 (order already paid)
```

### GET /api/v1/payments/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: payment:read
// Response 200
interface PaymentDetailResponse {
  payment: Payment & {
    transactions: PaymentTransaction[];
  };
}

interface Payment {
  id: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  provider: string;
  paidAt?: string;
  createdAt: string;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/payments/:id/refund
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: payment:refund
// Request
interface RefundPaymentDto {
  amount?: number; // Partial refund
  reason: string;
}

// Response 200
interface RefundPaymentResponse {
  refund: Refund;
  message: string;
}

interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  reason?: string;
  createdAt: string;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 422 (exceeds payment amount)
```

### GET /api/v1/payments/methods
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface PaymentMethodsResponse {
  methods: PaymentMethod[];
}

interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  lastFour: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}
```

### POST /api/v1/payments/methods
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface CreatePaymentMethodDto {
  type: string;
  token: string; // Payment provider token
  isDefault?: boolean;
}

// Response 201
interface CreatePaymentMethodResponse {
  method: PaymentMethod;
}

// Errors: 400 (validation), 401 (unauthorized)
```

### DELETE /api/v1/payments/methods/:id
```typescript
// Headers: Authorization: Bearer <token>
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### POST /api/v1/payments/webhook
```typescript
// No auth (verified by signature)
// Request: Webhook payload from payment provider
// Response 200 OK
```

---

## 14. Shipping Module

### GET /api/v1/shipping/rates
```typescript
// Query Parameters
interface ShippingRatesQuery {
  countryCode: string;
  state?: string;
  postalCode?: string;
  weight?: number;
}

// Response 200
interface ShippingRatesResponse {
  rates: ShippingRate[];
}

interface ShippingRate {
  id: string;
  carrier: {
    id: string;
    name: string;
    code: string;
  };
  method: {
    id: string;
    name: string;
    code: string;
  };
  rate: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  description?: string;
}
```

### POST /api/v1/shipments
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: shipping:manage
// Request
interface CreateShipmentDto {
  orderId: string;
  shippingMethodId: string;
  weight?: number;
  weightUnit?: string;
  fromAddress: AddressDto;
  signatureRequired?: boolean;
}

// Response 201
interface CreateShipmentResponse {
  shipment: Shipment;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden)
```

### GET /api/v1/shipments/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: shipping:read
// Response 200
interface ShipmentDetailResponse {
  shipment: Shipment & {
    tracking: TrackingInfo;
  };
}

interface Shipment {
  id: string;
  orderId: string;
  status: string;
  trackingNumber?: string;
  carrier: {
    id: string;
    name: string;
    code: string;
  };
  method: {
    id: string;
    name: string;
  };
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### PATCH /api/v1/shipments/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: shipping:manage
// Request
interface UpdateShipmentDto {
  status?: string;
  trackingNumber?: string;
  actualDelivery?: string;
  signedBy?: string;
}

// Response 200
interface UpdateShipmentResponse {
  shipment: Shipment;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

---

## 15. Media Module

### POST /api/v1/media/upload
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: media:create
// Request: multipart/form-data
interface MediaUploadDto {
  file: File;
  folderId?: string;
  alt?: string;
  title?: string;
}

// Response 201
interface MediaUploadResponse {
  media: Media;
}

interface Media {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  url: string;
  cdnUrl?: string;
  type: string;
  width?: number;
  height?: number;
  variants: ImageVariant[];
  createdAt: string;
}

// Errors: 400 (validation), 401 (unauthorized), 413 (file too large), 415 (unsupported type)
```

### GET /api/v1/media/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: media:read
// Response 200
interface MediaDetailResponse {
  media: Media;
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### DELETE /api/v1/media/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: media:delete
// Response 204 No Content
// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/media/folders
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: media:read
// Response 200
interface MediaFoldersResponse {
  folders: MediaFolder[];
}

interface MediaFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  createdAt: string;
}
```

### POST /api/v1/media/folders
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: media:create
// Request
interface CreateMediaFolderDto {
  name: string;
  parentId?: string;
}

// Response 201
interface CreateMediaFolderResponse {
  folder: MediaFolder;
}

// Errors: 400 (validation), 401 (unauthorized)
```

---

## 16. CMS Module

### GET /api/v1/cms/pages/:slug
```typescript
// Response 200
interface PageDetailResponse {
  page: Page;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  template: string;
  status: string;
  publishedAt?: string;
  viewCount: number;
}

// Errors: 404 (not found)
```

### POST /api/v1/cms/pages
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: cms:create
// Request
interface CreatePageDto {
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  template?: string;
  status?: 'draft' | 'published';
}

// Response 201
interface CreatePageResponse {
  page: Page;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (slug exists)
```

### GET /api/v1/cms/blog
```typescript
// Query Parameters
interface BlogListQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}

// Response 200
interface BlogListResponse {
  posts: BlogPost[];
  meta: PaginationMeta;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImageUrl?: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  category?: string;
  tags: string[];
  status: string;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}
```

### GET /api/v1/cms/blog/:slug
```typescript
// Response 200
interface BlogDetailResponse {
  post: BlogPost & {
    content: string;
  };
}

// Errors: 404 (not found)
```

### POST /api/v1/cms/blog
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: cms:create
// Request
interface CreateBlogPostDto {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'draft' | 'published';
}

// Response 201
interface CreateBlogPostResponse {
  post: BlogPost;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 409 (slug exists)
```

### GET /api/v1/cms/banners/:slot
```typescript
// Response 200
interface BannerListResponse {
  banners: Banner[];
}

interface Banner {
  id: string;
  title: string;
  slot: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  altText?: string;
}
```

---

## 17. Notifications Module

### GET /api/v1/notifications
```typescript
// Headers: Authorization: Bearer <token>
// Query Parameters
interface NotificationListQuery {
  page?: number;
  limit?: number;
  status?: 'unread' | 'read' | 'all';
}

// Response 200
interface NotificationListResponse {
  notifications: Notification[];
  meta: PaginationMeta;
  unreadCount: number;
}

interface Notification {
  id: string;
  channel: string;
  templateKey: string;
  subject?: string;
  body: string;
  data?: Record<string, unknown>;
  status: string;
  readAt?: string;
  createdAt: string;
}
```

### GET /api/v1/notifications/unread-count
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface UnreadCountResponse {
  count: number;
}
```

### PATCH /api/v1/notifications/:id/read
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface MarkAsReadResponse {
  notification: Notification;
  message: string;
}

// Errors: 404 (not found)
```

### POST /api/v1/notifications/read-all
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface MarkAllAsReadResponse {
  count: number;
  message: string;
}
```

### DELETE /api/v1/notifications/:id
```typescript
// Headers: Authorization: Bearer <token>
// Response 204 No Content
// Errors: 404 (not found)
```

### GET /api/v1/notifications/preferences
```typescript
// Headers: Authorization: Bearer <token>
// Response 200
interface NotificationPreferencesResponse {
  preferences: NotificationPreference[];
}

interface NotificationPreference {
  eventType: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
}
```

### PATCH /api/v1/notifications/preferences
```typescript
// Headers: Authorization: Bearer <token>
// Request
interface UpdateNotificationPreferencesDto {
  preferences: Array<{
    eventType: string;
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    inAppEnabled?: boolean;
  }>;
}

// Response 200
interface UpdateNotificationPreferencesResponse {
  preferences: NotificationPreference[];
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized)
```

---

## 18. Analytics Module

### GET /api/v1/analytics/dashboard
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: admin:analytics
// Query Parameters
interface DashboardQuery {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

// Response 200
interface DashboardResponse {
  stats: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
  };
  revenueChart: Array<{
    date: string;
    amount: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    soldCount: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### GET /api/v1/analytics/reports
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: admin:analytics
// Query Parameters
interface ReportQuery {
  type: 'sales' | 'products' | 'customers' | 'inventory';
  period?: string;
  format?: 'json' | 'csv';
}

// Response 200
interface ReportResponse {
  report: {
    id: string;
    type: string;
    data: unknown;
    generatedAt: string;
  };
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### POST /api/v1/analytics/events
```typescript
// Request
interface TrackEventDto {
  eventType: string;
  entityType?: string;
  entityId?: string;
  properties?: Record<string, unknown>;
}

// Response 201
interface TrackEventResponse {
  eventId: string;
}

// Errors: 400 (validation)
```

---

## 19. Admin Module

### GET /api/v1/admin/users
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: user:read + admin:read
// Query Parameters
interface AdminUserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}

// Response 200
interface AdminUserListResponse {
  users: AdminUser[];
  meta: PaginationMeta;
}

interface AdminUser {
  id: string;
  email: string;
  phone?: string;
  status: string;
  emailVerified: boolean;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatarUrl?: string;
  };
  roles: string[];
  lastLoginAt?: string;
  createdAt: string;
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### GET /api/v1/admin/users/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: user:read + admin:read
// Response 200
interface AdminUserDetailResponse {
  user: AdminUser & {
    addresses: Address[];
    orders: Order[];
    reviews: Review[];
    activity: ActivityLog[];
  };
}

// Errors: 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### PATCH /api/v1/admin/users/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: user:update + admin:read
// Request
interface AdminUpdateUserDto {
  status?: string;
  roles?: string[];
}

// Response 200
interface AdminUpdateUserResponse {
  user: AdminUser;
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/admin/orders
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:read + admin:read
// Query Parameters
interface AdminOrderListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Response 200
interface AdminOrderListResponse {
  orders: Order[];
  meta: PaginationMeta;
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### PATCH /api/v1/admin/orders/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: order:update + admin:read
// Request
interface AdminUpdateOrderDto {
  status?: string;
  internalNotes?: string;
}

// Response 200
interface AdminUpdateOrderResponse {
  order: Order;
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/admin/products
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:read + admin:read
// Query Parameters
interface AdminProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  brandId?: string;
}

// Response 200
interface AdminProductListResponse {
  products: Product[];
  meta: PaginationMeta;
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### PATCH /api/v1/admin/products/:id
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: product:update + admin:read
// Request
interface AdminUpdateProductDto {
  status?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

// Response 200
interface AdminUpdateProductResponse {
  product: Product;
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/admin/reviews
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: review:read + admin:read
// Query Parameters
interface AdminReviewListQuery {
  page?: number;
  limit?: number;
  status?: string;
  rating?: number;
  productId?: string;
}

// Response 200
interface AdminReviewListResponse {
  reviews: Review[];
  meta: PaginationMeta;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    flagged: number;
  };
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### PATCH /api/v1/admin/reviews/:id/moderate
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: review:moderate
// Request
interface ModerateReviewDto {
  status: 'approved' | 'rejected';
  reason?: string;
}

// Response 200
interface ModerateReviewResponse {
  review: Review;
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found)
```

### GET /api/v1/admin/audit-logs
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: admin:audit
// Query Parameters
interface AuditLogListQuery {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

// Response 200
interface AuditLogListResponse {
  logs: AuditLog[];
  meta: PaginationMeta;
}

interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  changes?: Record<string, unknown>;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  createdAt: string;
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### GET /api/v1/admin/config
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: admin:config
// Response 200
interface AdminConfigResponse {
  settings: Setting[];
}

interface Setting {
  id: string;
  groupName: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  isPublic: boolean;
}

// Errors: 401 (unauthorized), 403 (forbidden)
```

### PATCH /api/v1/admin/config
```typescript
// Headers: Authorization: Bearer <token>
// Permissions: admin:config
// Request
interface UpdateConfigDto {
  settings: Array<{
    groupName: string;
    key: string;
    value: string;
  }>;
}

// Response 200
interface UpdateConfigResponse {
  settings: Setting[];
  message: string;
}

// Errors: 400 (validation), 401 (unauthorized), 403 (forbidden)
```

---

## 20. Search Module

### GET /api/v1/search
```typescript
// Query Parameters
interface SearchQuery {
  q: string;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  brand?: string[];
  price?: string;           // '0-50', '50-100', '100-'
  rating?: number;
  inStock?: boolean;
}

// Response 200
interface SearchResponse {
  results: Product[];
  meta: PaginationMeta;
  facets: {
    categories: Facet[];
    brands: Facet[];
    priceRanges: Facet[];
    ratings: Facet[];
  };
  suggestions: string[];
}

interface Facet {
  value: string;
  label: string;
  count: number;
}
```

### GET /api/v1/search/autocomplete
```typescript
// Query Parameters
interface AutocompleteQuery {
  q: string;
  limit?: number;
}

// Response 200
interface AutocompleteResponse {
  products: string[];
  categories: string[];
  brands: string[];
}
```
