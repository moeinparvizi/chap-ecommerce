# Validation Rules

## 1. Common Validation Rules

### UUID
```typescript
const uuidSchema = z.string().uuid();
```

### Email
```typescript
const emailSchema = z.string().email().max(255);
```

### Password
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
```

### Phone
```typescript
const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .max(20);
```

### URL
```typescript
const urlSchema = z.string().url().max(500);
```

### Slug
```typescript
const slugSchema = z.string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
  .max(220);
```

### Pagination
```typescript
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
```

---

## 2. Field-Specific Validation Rules

### Users
| Field | Type | Required | Min | Max | Pattern | Unique |
|-------|------|----------|-----|-----|---------|--------|
| email | string | Yes | 5 | 255 | email format | Yes |
| password | string | Yes | 8 | 128 | complex | - |
| firstName | string | Yes | 2 | 100 | - | - |
| lastName | string | Yes | 2 | 100 | - | - |
| phone | string | No | 10 | 20 | phone format | Yes |
| mfaCode | string | Yes | 6 | 6 | digits only | - |

### Products
| Field | Type | Required | Min | Max | Pattern | Unique |
|-------|------|----------|-----|-----|---------|--------|
| sku | string | Yes | 1 | 100 | alphanumeric | Yes |
| name | string | Yes | 1 | 500 | - | No |
| slug | string | Auto | - | 520 | slug format | Yes |
| description | string | No | - | unlimited | - | No |
| shortDescription | string | No | - | 500 | - | No |
| categoryId | uuid | Yes | - | - | - | - |
| brandId | uuid | No | - | - | - | - |
| weight | number | No | 0 | 99999.999 | - | - |
| metaTitle | string | No | - | 200 | - | - |
| metaDescription | string | No | - | 500 | - | - |
| tags | array | No | - | 20 items | - | - |

### Categories
| Field | Type | Required | Min | Max | Pattern | Unique |
|-------|------|----------|-----|-----|---------|--------|
| name | string | Yes | 1 | 200 | - | No |
| slug | string | Auto | - | 220 | slug format | Yes |
| parentId | uuid | No | - | - | - | - |
| description | string | No | - | unlimited | - | No |
| metaTitle | string | No | - | 200 | - | - |
| metaDescription | string | No | - | 500 | - | - |

### Orders
| Field | Type | Required | Min | Max | Pattern | Unique |
|-------|------|----------|-----|-----|---------|--------|
| orderNumber | string | Auto | - | 50 | - | Yes |
| userId | uuid | Yes | - | - | - | - |
| currency | string | Yes | 3 | 3 | ISO 4217 | - |
| subtotal | number | Yes | 0 | 99999999.99 | - | - |
| total | number | Yes | 0 | 99999999.99 | - | - |
| notes | string | No | - | 500 | - | - |

### Coupons
| Field | Type | Required | Min | Max | Pattern | Unique |
|-------|------|----------|-----|-----|---------|--------|
| code | string | Yes | 3 | 50 | alphanumeric | Yes |
| type | string | Yes | - | 20 | enum | - |
| value | number | Yes | 0 | 99999999.99 | - | - |
| minOrderAmount | number | No | 0 | 99999999.99 | - | - |
| maxUses | number | No | 1 | 999999 | - | - |

### Reviews
| Field | Type | Required | Min | Max | Pattern | Unique |
|-------|------|----------|-----|-----|---------|--------|
| productId | uuid | Yes | - | - | - | - |
| rating | number | Yes | 1 | 5 | integer | - |
| title | string | No | - | 200 | - | - |
| body | string | No | - | 5000 | - | - |
| pros | string | No | - | 2000 | - | - |
| cons | string | No | - | 2000 | - | - |

---

## 3. Business Rule Validations

### Order Rules
```typescript
// Cannot cancel order after shipping
if (order.status === 'shipped' || order.status === 'delivered') {
  throw new Error('Cannot cancel order that has been shipped');
}

// Order total must equal sum of items
const itemTotal = order.items.reduce((sum, item) => sum + item.total, 0);
if (Math.abs(order.total - itemTotal) > 0.01) {
  throw new Error('Order total does not match item total');
}
```

### Stock Rules
```typescript
// Cannot reserve more than available stock
if (quantity > inventory.availableQuantity) {
  throw new Error('Insufficient stock');
}

// Reserved quantity cannot exceed total quantity
if (reservedQuantity > quantity) {
  throw new Error('Reserved quantity exceeds total quantity');
}
```

### Coupon Rules
```typescript
// Coupon usage limit
if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
  throw new Error('Coupon usage limit reached');
}

// User usage limit
const userUsageCount = await getCouponUsageCount(coupon.id, userId);
if (coupon.maxUsesPerUser && userUsageCount >= coupon.maxUsesPerUser) {
  throw new Error('User coupon usage limit reached');
}

// Coupon date range
if (coupon.startsAt && new Date() < coupon.startsAt) {
  throw new Error('Coupon is not yet active');
}
if (coupon.endsAt && new Date() > coupon.endsAt) {
  throw new Error('Coupon has expired');
}

// Minimum order amount
if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
  throw new Error('Order does not meet minimum amount');
}
```

### Review Rules
```typescript
// One review per user per product
const existingReview = await getReviewByUserAndProduct(userId, productId);
if (existingReview) {
  throw new Error('You have already reviewed this product');
}

// Cannot review own products
const product = await getProduct(productId);
if (product.sellerId === userId) {
  throw new Error('Cannot review your own product');
}

// Must have purchased product (optional)
if (requirePurchase) {
  const hasPurchased = await hasUserPurchasedProduct(userId, productId);
  if (!hasPurchased) {
    throw new Error('You must purchase this product to review it');
  }
}
```

### Wishlist Rules
```typescript
// Max items per wishlist
if (wishlist.itemCount >= 100) {
  throw new Error('Wishlist has reached maximum items');
}

// No duplicate items
const existingItem = await getWishlistItem(wishlistId, productId, variantId);
if (existingItem) {
  throw new Error('Item already in wishlist');
}
```

---

## 4. Custom Validators

### Strong Password
```typescript
const strongPasswordValidator = (value: string) => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /[0-9]/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
  const hasMinLength = value.length >= 8;
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && hasMinLength;
};
```

### Valid SKU
```typescript
const skuValidator = (value: string) => {
  return /^[A-Z0-9]{3,100}$/.test(value);
};
```

### Valid Phone (International)
```typescript
const internationalPhoneValidator = (value: string) => {
  return /^\+[1-9]\d{1,14}$/.test(value);
};
```

### Valid Color Code
```typescript
const colorCodeValidator = (value: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
};
```

### File Size Validator
```typescript
const maxFileSize = (maxSizeInMB: number) => (file: File) => {
  return file.size <= maxSizeInMB * 1024 * 1024;
};
```

### File Type Validator
```typescript
const allowedFileTypes = (...types: string[]) => (file: File) => {
  return types.includes(file.type);
};
```
