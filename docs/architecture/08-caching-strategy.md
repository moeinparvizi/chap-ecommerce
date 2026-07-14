# Caching Strategy

## 1. Redis Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Redis Cluster                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Cache Layers                          │   │
│  │                                                          │   │
│  │  L1: Application Cache (in-process, 10s TTL)           │   │
│  │  L2: Redis Cache (shared, configurable TTL)            │   │
│  │  L3: Database (persistent)                              │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Redis Namespaces                       │   │
│  │                                                          │   │
│  │  session:*          → User sessions                     │   │
│  │  cart:*             → Shopping carts                     │   │
│  │  product:*          → Product cache                      │   │
│  │  search:*           → Search suggestions                 │   │
│  │  rate:*             → Rate limiting                      │   │
│  │  inventory:*        → Stock reservations                 │   │
│  │  price:*            → Price cache                        │   │
│  │  cms:*              → CMS content cache                  │   │
│  │  analytics:*        → Analytics aggregates               │   │
│  │  lock:*             → Distributed locks                  │   │
│  │  queue:*            → Job queues                         │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. What to Cache

### High Priority (Cache Immediately)

| Data | TTL | Invalidation | Reason |
|------|-----|--------------|--------|
| **Product details** | 5 min | On product update | High read, low write |
| **Product listings** | 2 min | On product change | High traffic |
| **Category tree** | 15 min | On category change | Rarely changes |
| **Brand list** | 15 min | On brand change | Rarely changes |
| **Price data** | 5 min | On price change | High read |
| **Search suggestions** | 10 min | On product change | High traffic |
| **Exchange rates** | 1 hour | On rate update | Changes infrequently |
| **CMS pages** | 10 min | On page update | Read-heavy |
| **Banners** | 5 min | On banner change | High traffic |
| **Shipping rates** | 30 min | On rate change | Rarely changes |

### Medium Priority (Cache on Access)

| Data | TTL | Invalidation | Reason |
|------|-----|--------------|--------|
| **User profiles** | 5 min | On profile update | Medium read |
| **User addresses** | 5 min | On address change | Medium read |
| **Shopping cart** | Session | On cart change | User-specific |
| **Payment methods** | 5 min | On method change | User-specific |
| **Wishlist** | 5 min | On item change | User-specific |

### Low Priority (Don't Cache)

| Data | Reason |
|------|--------|
| **Order history** | Always fresh data |
| **Payment status** | Always fresh data |
| **Inventory counts** | Real-time accuracy critical |
| **Audit logs** | Write-heavy, immutable |
| **Notifications** | Always fresh data |

---

## 3. Cache Patterns

### Cache-Aside (Lazy Loading)

```typescript
async function getProduct(productId: string): Promise<Product> {
  const cacheKey = `product:${productId}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Cache miss - load from database
  const product = await db.product.findUnique({ where: { id: productId } });
  
  // Populate cache
  if (product) {
    await redis.setex(cacheKey, 300, JSON.stringify(product));  // 5 min TTL
  }
  
  return product;
}
```

### Write-Through

```typescript
async function updateProduct(productId: string, data: UpdateProductDto): Promise<Product> {
  // Update database
  const product = await db.product.update({ where: { id: productId }, data });
  
  // Update cache immediately
  const cacheKey = `product:${productId}`;
  await redis.setex(cacheKey, 300, JSON.stringify(product));
  
  // Invalidate related caches
  await redis.del(`products:list:*`);
  await redis.del(`search:index:${productId}`);
  
  return product;
}
```

### Write-Behind (Write-Back)

```typescript
// For analytics events - write to cache, batch write to DB
async function trackEvent(event: AnalyticsEvent): Promise<void> {
  const queueKey = `analytics:queue:${event.type}`;
  
  // Add to Redis list
  await redis.rpush(queueKey, JSON.stringify(event));
  
  // If queue size > threshold, flush to DB
  const queueSize = await redis.llen(queueKey);
  if (queueSize >= 100) {
    await flushAnalyticsQueue(queueKey);
  }
}
```

### Cache Invalidation

```typescript
// Event-driven invalidation
@OnEvent('product.updated')
async handleProductUpdated(event: ProductUpdatedEvent) {
  const { productId } = event.data;
  
  // Invalidate product cache
  await redis.del(`product:${productId}`);
  
  // Invalidate product lists
  const listKeys = await redis.keys('products:list:*');
  if (listKeys.length > 0) {
    await redis.del(...listKeys);
  }
  
  // Invalidate search index
  await searchService.reindexProduct(productId);
  
  // Invalidate related product caches
  const product = await db.product.findUnique({ where: { id: productId } });
  await redis.del(`category:${product.categoryId}:products`);
  await redis.del(`brand:${product.brandId}:products`);
}
```

---

## 4. Cache Invalidation Strategies

### Time-Based (TTL)

```typescript
const cacheTTL = {
  // Product data
  PRODUCT_DETAIL: 300,        // 5 minutes
  PRODUCT_LIST: 120,          // 2 minutes
  PRODUCT_SEARCH: 120,        // 2 minutes
  
  // Catalog data
  CATEGORY_TREE: 900,         // 15 minutes
  BRAND_LIST: 900,            // 15 minutes
  
  // Price data
  PRICE: 300,                 // 5 minutes
  EXCHANGE_RATE: 3600,        // 1 hour
  
  // User data
  USER_PROFILE: 300,          // 5 minutes
  USER_ADDRESSES: 300,        // 5 minutes
  
  // Cart data
  CART: 86400,                // 24 hours (session-based)
  
  // Search data
  SEARCH_SUGGESTIONS: 600,    // 10 minutes
  AUTOCOMPLETE: 600,          // 10 minutes
  
  // CMS data
  CMS_PAGE: 600,              // 10 minutes
  BLOG_POST: 600,             // 10 minutes
  BANNER: 300,                // 5 minutes
  
  // Rate limiting
  RATE_LIMIT: 60,             // 1 minute
};
```

### Event-Based

```typescript
// Invalidate on domain events
const invalidationMap = {
  'product.created': ['products:list:*', 'category:*:products'],
  'product.updated': ['product:*', 'products:list:*', 'search:*'],
  'product.deleted': ['product:*', 'products:list:*', 'search:*'],
  'category.updated': ['category:*', 'category:*:products'],
  'price.changed': ['price:*', 'product:*'],
  'stock.updated': ['inventory:*', 'product:*:stock'],
  'cms.page.updated': ['cms:page:*'],
  'banner.updated': ['banner:*'],
};
```

### Manual Invalidation

```typescript
// Admin endpoint to clear cache
@Post('admin/cache/clear')
@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('admin:config')
async clearCache(@Body() dto: ClearCacheDto) {
  if (dto.pattern) {
    const keys = await redis.keys(dto.pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return { cleared: keys.length };
  }
  
  if (dto.namespace) {
    const keys = await redis.keys(`${dto.namespace}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return { cleared: keys.length };
  }
  
  // Clear all cache
  await redis.flushdb();
  return { cleared: 'all' };
}
```

---

## 5. Session Strategy

### Session Storage

```typescript
interface SessionData {
  id: string;
  userId: string;
  roles: string[];
  permissions: string[];
  accessTokenJti: string;
  refreshTokenId: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: Date;
  createdAt: Date;
}

// Redis storage
session:{sessionId}           → SessionData (TTL: 7 days)
session:user:{userId}         → Set<sessionId> (for multi-device)
session:refresh:{refreshId}   → sessionId (for refresh token lookup)
```

### Session Management

```typescript
// Create session
async function createSession(userId: string, req: Request): Promise<Session> {
  const session: Session = {
    id: uuid(),
    userId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    lastActiveAt: new Date(),
    createdAt: new Date(),
  };
  
  // Store in Redis
  await redis.setex(`session:${session.id}`, 86400 * 7, JSON.stringify(session));
  
  // Add to user's session set
  await redis.sadd(`session:user:${userId}`, session.id);
  
  return session;
}

// Update session activity
async function touchSession(sessionId: string): Promise<void> {
  const session = await redis.get(`session:${sessionId}`);
  if (session) {
    const data = JSON.parse(session);
    data.lastActiveAt = new Date();
    await redis.setex(`session:${sessionId}`, 86400 * 7, JSON.stringify(data));
  }
}

// Get user sessions
async function getUserSessions(userId: string): Promise<Session[]> {
  const sessionIds = await redis.smembers(`session:user:${userId}`);
  const sessions: Session[] = [];
  
  for (const sessionId of sessionIds) {
    const session = await redis.get(`session:${sessionId}`);
    if (session) {
      sessions.push(JSON.parse(session));
    } else {
      // Clean up stale reference
      await redis.srem(`session:user:${userId}`, sessionId);
    }
  }
  
  return sessions;
}
```

---

## 6. Distributed Locking

```typescript
// Redis-based distributed lock
async function acquireLock(
  resource: string,
  ttl: number = 10000,
): Promise<string | null> {
  const lockId = uuid();
  const lockKey = `lock:${resource}`;
  
  const acquired = await redis.set(lockKey, lockId, 'PX', ttl, 'NX');
  
  return acquired ? lockId : null;
}

async function releaseLock(resource: string, lockId: string): Promise<boolean> {
  const lockKey = `lock:${resource}`;
  
  // Lua script for atomic check-and-delete
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  
  const result = await redis.eval(script, 1, lockKey, lockId);
  return result === 1;
}

// Usage for stock reservation
async function reserveStock(productId: string, quantity: number): Promise<boolean> {
  const lockId = await acquireLock(`stock:${productId}`);
  
  if (!lockId) {
    throw new Error('Could not acquire stock lock');
  }
  
  try {
    const stock = await db.stock.findUnique({ where: { productId } });
    
    if (stock.available < quantity) {
      return false;
    }
    
    await db.stock.update({
      where: { productId },
      data: { reservedQuantity: { increment: quantity } },
    });
    
    return true;
  } finally {
    await releaseLock(`stock:${productId}`, lockId);
  }
}
```

---

## 7. Cache Monitoring

### Metrics

```typescript
// Cache hit/miss ratio
const cacheMetrics = {
  hits: 0,
  misses: 0,
  hitRatio: 0,
};

function recordCacheHit(): void {
  cacheMetrics.hits++;
  updateHitRatio();
}

function recordCacheMiss(): void {
  cacheMetrics.misses++;
  updateHitRatio();
}

function updateHitRatio(): void {
  const total = cacheMetrics.hits + cacheMetrics.misses;
  cacheMetrics.hitRatio = total > 0 ? cacheMetrics.hits / total : 0;
}

// Redis memory usage
async function getRedisMemoryUsage(): Promise<{
  usedMemory: number;
  usedMemoryPeak: number;
  memFragmentationRatio: number;
}> {
  const info = await redis.info('memory');
  return {
    usedMemory: parseInt(info.match(/used_memory:(\d+)/)?.[1] || '0'),
    usedMemoryPeak: parseInt(info.match(/used_memory_peak:(\d+)/)?.[1] || '0'),
    memFragmentationRatio: parseFloat(info.match(/mem_fragmentation_ratio:([\d.]+)/)?.[1] || '1'),
  };
}
```
