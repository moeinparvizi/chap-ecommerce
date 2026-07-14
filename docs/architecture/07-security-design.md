# Security Design

## 1. Authentication Flow

### JWT Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT TOKEN LIFECYCLE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐                │
│  │ Register │────▶│  Login   │────▶│  Access  │                │
│  │          │     │          │     │  Token   │                │
│  └──────────┘     └──────────┘     │ (15 min) │                │
│                                     └────┬─────┘                │
│                                          │                      │
│                                    ┌─────▼─────┐               │
│                                    │  Refresh  │               │
│                                    │  Token    │               │
│                                    │  (7 days) │               │
│                                    └─────┬─────┘               │
│                                          │                      │
│                                    ┌─────▼─────┐               │
│                                    │  New      │               │
│                                    │  Access   │               │
│                                    │  Token    │               │
│                                    └───────────┘               │
│                                                                  │
│  Token Rotation: Refresh token used → Old refresh invalidated   │
│  family detection: Reuse of old refresh = session compromise    │
└─────────────────────────────────────────────────────────────────┘
```

### Token Structure

```typescript
// Access Token (JWT)
interface AccessToken {
  sub: string;        // User ID
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;        // 15 minutes
  iss: string;        // 'ecommerce-api'
  jti: string;        // Unique token ID
}

// Refresh Token (opaque, stored in DB)
interface RefreshToken {
  id: string;         // UUID
  userId: string;
  tokenHash: string;  // SHA-256 hash
  familyId: string;   // Token rotation family
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  ipAddress: string;
  userAgent: string;
}
```

---

## 2. Authorization Strategy (RBAC)

### Role Hierarchy

```
Super Admin
    │
    ├── Admin
    │   ├── Manager
    │   │   └── Staff
    │   └── Support
    │
    └── Customer
        └── Guest
```

### Permission Model

```typescript
// Permission format: {resource}:{action}
type Permission = 
  // Product permissions
  | 'product:create' | 'product:read' | 'product:update' | 'product:delete'
  | 'category:create' | 'category:read' | 'category:update' | 'category:delete'
  | 'brand:create' | 'brand:read' | 'brand:update' | 'brand:delete'
  
  // Order permissions
  | 'order:create' | 'order:read' | 'order:update' | 'order:cancel'
  | 'order:refund' | 'order:export'
  
  // Payment permissions
  | 'payment:create' | 'payment:read' | 'payment:capture' | 'payment:refund'
  
  // User permissions
  | 'user:create' | 'user:read' | 'user:update' | 'user:delete' | 'user:manage'
  
  // Review permissions
  | 'review:create' | 'review:read' | 'review:update' | 'review:delete' | 'review:moderate'
  
  // Inventory permissions
  | 'inventory:read' | 'inventory:update' | 'inventory:adjust'
  
  // CMS permissions
  | 'cms:create' | 'cms:read' | 'cms:update' | 'cms:delete'
  
  // Media permissions
  | 'media:create' | 'media:read' | 'media:update' | 'media:delete'
  
  // Notification permissions
  | 'notification:read' | 'notification:manage'
  
  // Promotion permissions
  | 'coupon:create' | 'coupon:read' | 'coupon:update' | 'coupon:delete'
  | 'promotion:create' | 'promotion:read' | 'promotion:update' | 'promotion:delete'
  
  // Admin permissions
  | 'admin:read' | 'admin:config' | 'admin:audit' | 'admin:analytics'
  
  // Shipping permissions
  | 'shipping:read' | 'shipping:manage'

// Role definitions
const roles = {
  guest: [],  // No permissions, public access only
  
  customer: [
    'order:create', 'order:read', 'order:cancel',
    'payment:create', 'payment:read',
    'review:create', 'review:read', 'review:update', 'review:delete',
    'user:read', 'user:update',
    'media:create',  // Upload avatar, review images
    'notification:read',
    'coupon:read',  // Validate coupons
  ],
  
  support: [
    'order:read', 'order:update',
    'user:read', 'user:update',
    'review:read', 'review:moderate',
    'notification:read', 'notification:manage',
    'admin:read',
  ],
  
  staff: [
    'product:read', 'product:create', 'product:update',
    'category:read', 'category:create', 'category:update',
    'brand:read', 'brand:create', 'brand:update',
    'order:read', 'order:update',
    'inventory:read', 'inventory:update',
    'review:read', 'review:moderate',
    'cms:create', 'cms:read', 'cms:update',
    'media:create', 'media:read', 'media:update', 'media:delete',
    'coupon:create', 'coupon:read', 'coupon:update',
    'promotion:create', 'promotion:read', 'promotion:update',
    'shipping:read', 'shipping:manage',
  ],
  
  manager: [
    'product:read', 'product:create', 'product:update', 'product:delete',
    'category:read', 'category:create', 'category:update', 'category:delete',
    'brand:read', 'brand:create', 'brand:update', 'brand:delete',
    'order:read', 'order:update', 'order:export',
    'payment:read', 'payment:capture',
    'inventory:read', 'inventory:update', 'inventory:adjust',
    'user:read', 'user:update',
    'review:read', 'review:moderate',
    'cms:create', 'cms:read', 'cms:update', 'cms:delete',
    'media:create', 'media:read', 'media:update', 'media:delete',
    'coupon:create', 'coupon:read', 'coupon:update', 'coupon:delete',
    'promotion:create', 'promotion:read', 'promotion:update', 'promotion:delete',
    'shipping:read', 'shipping:manage',
    'notification:read', 'notification:manage',
    'admin:read', 'admin:analytics',
  ],
  
  admin: [
    // All manager permissions plus:
    'user:create', 'user:delete', 'user:manage',
    'payment:refund',
    'admin:config', 'admin:audit', 'admin:analytics',
  ],
  
  super_admin: [
    // All permissions (wildcard)
    '*',
  ],
};
```

---

## 3. Permission Enforcement

### Guard Pattern

```typescript
// NestJS Guard
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;  // No permissions required
    }
    
    const user = context.switchToHttp().getRequest().user;
    
    if (!user || !user.permissions) {
      return false;
    }
    
    // Super admin has all permissions
    if (user.permissions.includes('*')) {
      return true;
    }
    
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
  }
}

// Usage
@Post('products')
@UseGuards(AuthGuard, PermissionsGuard)
@Permissions('product:create')
async createProduct(@Body() dto: CreateProductDto) {
  // ...
}
```

### Resource Ownership

```typescript
// Ownership check for user resources
@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;
    
    // Super admin and admin can access any resource
    if (user.permissions.includes('*') || user.permissions.includes('admin:config')) {
      return true;
    }
    
    // Check if user owns the resource
    return this.checkOwnership(user.id, resourceId);
  }
}
```

---

## 4. Password Security

### Hashing Strategy

```typescript
// bcrypt with cost factor 12
const HASH_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, HASH_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Password Policy

| Rule | Requirement |
|------|-------------|
| Minimum length | 8 characters |
| Maximum length | 128 characters |
| Uppercase | At least 1 |
| Lowercase | At least 1 |
| Number | At least 1 |
| Special character | At least 1 (@$!%*?&) |
| Common passwords | Block top 100k common passwords |
| Password history | Cannot reuse last 5 passwords |
| Maximum age | 90 days (configurable) |

---

## 5. Rate Limiting

### Implementation

```typescript
// Redis-based rate limiting
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);
    const limit = this.getLimit(request);
    const window = this.getWindow(request);
    
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    
    if (current > limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    
    // Set rate limit headers
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
    response.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + window);
    
    return true;
  }
  
  private getKey(request: Request): string {
    const userId = request.user?.id;
    const ip = request.ip;
    return `ratelimit:${userId || ip}`;
  }
  
  private getLimit(request: Request): number {
    // Different limits for different endpoints
    if (request.path.includes('/auth/')) return 10;
    if (request.path.includes('/search')) return 30;
    return 100;
  }
  
  private getWindow(request: Request): number {
    return 60;  // 1 minute
  }
}
```

---

## 6. CORS Configuration

```typescript
// Strict CORS policy
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://ecommerce.com',
      'https://www.ecommerce.com',
      'https://admin.ecommerce.com',
      'http://localhost:4200',  // Development
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-Idempotency-Key',
  ],
  exposedHeaders: [
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  maxAge: 86400,  // 24 hours preflight cache
};
```

---

## 7. Security Headers

```typescript
// Helmet configuration
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.ecommerce.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
};
```

---

## 8. Input Sanitization

### XSS Prevention

```typescript
// Sanitize user input
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],  // No HTML tags allowed
    ALLOWED_ATTR: [],
  });
}

// For rich text (CMS, reviews)
function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
  });
}
```

### SQL Injection Prevention

```typescript
// Prisma ORM handles parameterization
// Additional validation with Zod
const userIdSchema = z.string().uuid();

// Validate before query
function validateUserId(id: string): string {
  return userIdSchema.parse(id);
}
```

---

## 9. Secrets Management

### Environment Variables

| Secret | Storage | Rotation |
|--------|---------|----------|
| `DATABASE_URL` | Environment variable | 90 days |
| `JWT_SECRET` | Environment variable | 30 days |
| `JWT_REFRESH_SECRET` | Environment variable | 30 days |
| `S3_ACCESS_KEY` | AWS Secrets Manager | 90 days |
| `S3_SECRET_KEY` | AWS Secrets Manager | 90 days |
| `SMTP_PASSWORD` | Environment variable | 90 days |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | On compromise |
| `ELASTICSEARCH_PASSWORD` | Environment variable | 90 days |

### Secrets Rotation Strategy

```typescript
// Automated rotation via cron job
async function rotateJwtSecret() {
  const newSecret = crypto.randomBytes(64).toString('hex');
  
  // Update in secrets manager
  await secretsManager.updateSecret('JWT_SECRET', newSecret);
  
  // Invalidate all existing tokens
  await redis.set('jwt:secret:version', Date.now());
  
  // Log rotation event
  await auditService.log({
    action: 'secret_rotated',
    resource: 'JWT_SECRET',
  });
}
```

---

## 10. Encryption

### Data at Rest

| Data Type | Encryption | Method |
|-----------|------------|--------|
| Passwords | bcrypt (cost 12) | Hash only |
| PII (email, phone) | AES-256-GCM | Application-level |
| Payment tokens | Provider encryption | Stripe/PayPal |
| API keys | AES-256-GCM | Application-level |
| Session tokens | SHA-256 hash | Hash only |

### Data in Transit

| Connection | Protocol | Certificate |
|------------|----------|-------------|
| Client → API | TLS 1.3 | Let's Encrypt / AWS ACM |
| API → Database | TLS 1.2+ | Database SSL |
| API → Redis | TLS 1.2+ | Redis SSL |
| API → Elasticsearch | TLS 1.2+ | Elasticsearch SSL |
| API → S3 | TLS 1.2+ | AWS S3 |

---

## 11. Audit Logging

### What to Audit

| Event | Details |
|-------|---------|
| Authentication | Login, logout, failed login, password reset |
| Authorization | Permission denied, role changes |
| Data changes | Create, update, delete on all entities |
| Financial | Payment, refund, coupon usage |
| Admin actions | Config changes, user management |
| Security | Rate limit hits, suspicious activity |

### Audit Log Structure

```typescript
interface AuditLog {
  id: string;
  entityType: string;      // 'user', 'product', 'order', etc.
  entityId: string;
  action: string;          // 'create', 'update', 'delete', 'login'
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata?: Record<string, unknown>;
  timestamp: Date;
}
```

---

## 12. Session Management

### Session Store (Redis)

```typescript
interface Session {
  id: string;
  userId: string;
  accessTokenJti: string;
  refreshTokenId: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: Date;
  expiresAt: Date;
}

// Redis keys
session:{sessionId}        → Session data (TTL: 7 days)
session:user:{userId}      → Set of session IDs
session:token:{tokenHash}  → Session ID lookup
```

### Session Invalidation

```typescript
// Invalidate all sessions for user (e.g., password change)
async function invalidateAllSessions(userId: string): Promise<void> {
  const sessions = await redis.smembers(`session:user:${userId}`);
  
  for (const sessionId of sessions) {
    await redis.del(`session:${sessionId}`);
  }
  
  await redis.del(`session:user:${userId}`);
}

// Invalidate specific session (logout)
async function invalidateSession(sessionId: string): Promise<void> {
  const session = await redis.get(`session:${sessionId}`);
  if (session) {
    await redis.del(`session:${sessionId}`);
    await redis.srem(`session:user:${session.userId}`, sessionId);
  }
}
```

---

## 13. CSRF Protection

```typescript
// Double-submit cookie pattern
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Skip for API-only endpoints (Authorization header required)
    if (request.headers.authorization) {
      return true;
    }
    
    const csrfToken = request.headers['x-csrf-token'];
    const cookieToken = request.cookies['csrf-token'];
    
    if (!csrfToken || !cookieToken) {
      return false;
    }
    
    return csrfToken === cookieToken;
  }
}
```

---

## 14. API Key Authentication (Service-to-Service)

```typescript
// Internal service communication
interface ApiKey {
  id: string;
  name: string;
  keyHash: string;
  permissions: string[];
  rateLimit: number;
  expiresAt?: Date;
  createdAt: Date;
}

// Validation
async function validateApiKey(key: string): Promise<ApiKey | null> {
  const keyHash = await sha256(key);
  
  const apiKey = await db.apiKeys.findOne({
    where: { keyHash, isActive: true },
  });
  
  if (!apiKey) return null;
  
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return null;
  }
  
  return apiKey;
}
```

---

## 15. Security Monitoring

### Alert Rules

| Alert | Condition | Severity |
|-------|-----------|----------|
| Brute force | > 10 failed logins in 5 minutes | High |
| Credential stuffing | > 100 failed logins from same IP | Critical |
| Privilege escalation | Role change to admin | High |
| Data exfiltration | > 1000 records exported in 1 hour | Critical |
| Suspicious activity | Login from new country | Medium |
| Rate limit abuse | > 500 rate limit hits in 1 hour | Medium |
| API key leak | API key in public repo | Critical |

### Security Headers Monitoring

```typescript
// Monitor security headers
async function checkSecurityHeaders(): Promise<void> {
  const response = await fetch('https://api.ecommerce.com/health');
  
  const requiredHeaders = [
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'content-security-policy',
  ];
  
  for (const header of requiredHeaders) {
    if (!response.headers.get(header)) {
      await alertSecurityTeam(`Missing security header: ${header}`);
    }
  }
}
```
