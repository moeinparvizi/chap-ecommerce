# Database Design

## 1. Database Strategy

### Database-per-Service Pattern

| Service | Database | Schema | Purpose |
|---------|----------|--------|---------|
| Auth Service | `auth_db` | `auth` | User credentials, sessions, OAuth |
| User Service | `user_db` | `user` | Profiles, addresses, preferences |
| Product Service | `product_db` | `product` | Products, categories, brands, attributes |
| Inventory Service | `inventory_db` | `inventory` | Stock, warehouses, reservations |
| Pricing Service | `pricing_db` | `pricing` | Prices, discounts, currencies |
| Cart Service | `cart_db` | `cart` | Carts (Redis primary, PG backup) |
| Order Service | `order_db` | `order` | Orders, order items, history |
| Payment Service | `payment_db` | `payment` | Payments, refunds, transactions |
| Shipping Service | `shipping_db` | `shipping` | Shipments, carriers, tracking |
| Review Service | `review_db` | `review` | Reviews, votes, reports |
| Wishlist Service | `wishlist_db` | `wishlist` | Wishlists, items |
| Notification Service | `notification_db` | `notification` | Notifications, templates, preferences |
| Promotion Service | `promotion_db` | `promotion` | Coupons, promotions, campaigns |
| Media Service | `media_db` | `media` | Media files, folders, variants |
| CMS Service | `cms_db` | `cms` | Pages, blog posts, banners |
| Admin Service | `admin_db` | `admin` | Admin users, roles, config |
| Audit Service | `audit_db` | `audit` | Audit logs, compliance |

---

## 2. Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | `snake_case`, plural | `users`, `order_items`, `product_variants` |
| Columns | `snake_case` | `created_at`, `user_id`, `is_active` |
| Primary Keys | `id` (UUID v4) | `id UUID PRIMARY KEY` |
| Foreign Keys | `{table_singular}_id` | `user_id`, `product_id`, `order_id` |
| Indexes | `idx_{table}_{columns}` | `idx_users_email`, `idx_orders_user_id` |
| Unique Constraints | `uniq_{table}_{columns}` | `uniq_users_email` |
| Enums | `PascalCase` enum, `snake_case` values | `OrderStatus::pending` |
| Soft Delete | `deleted_at` (nullable timestamp) | `deleted_at TIMESTAMP` |
| Audit Fields | `created_at`, `updated_at` | Always present |
| Boolean Flags | `is_{adjective}` | `is_active`, `is_featured`, `is_verified` |

---

## 3. Base Model (Applied to ALL tables)

```sql
-- Every table includes these columns:
CREATE TABLE example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Index for soft delete
CREATE INDEX idx_example_deleted_at ON example(deleted_at) WHERE deleted_at IS NULL;
```

---

## 4. Complete Schema

### 4.1 Auth Database (`auth_db`)

#### users
```sql
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone VARCHAR(20),
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255),
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    mfa_method VARCHAR(20),  -- 'totp', 'sms', 'email'
    status VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'active', 'suspended', 'deactivated'
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_users_email ON auth.users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON auth.users(status) WHERE deleted_at IS NULL;
```

#### roles
```sql
CREATE TABLE auth.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,  -- System roles cannot be deleted
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_roles_name ON auth.roles(name);
```

#### permissions
```sql
CREATE TABLE auth.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(50) NOT NULL,     -- 'product', 'order', 'user', etc.
    action VARCHAR(50) NOT NULL,       -- 'create', 'read', 'update', 'delete', 'manage'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_permissions_resource_action ON auth.permissions(resource, action);
```

#### role_permissions
```sql
CREATE TABLE auth.role_permissions (
    role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES auth.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);
```

#### user_roles
```sql
CREATE TABLE auth.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);
```

#### sessions
```sql
CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON auth.sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON auth.sessions(expires_at);
```

#### oauth_connections
```sql
CREATE TABLE auth.oauth_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,     -- 'google', 'github', 'facebook'
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_oauth_provider_user ON auth.oauth_connections(provider, provider_user_id);
CREATE INDEX idx_oauth_user_id ON auth.oauth_connections(user_id);
```

#### password_reset_tokens
```sql
CREATE TABLE auth.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_user_id ON auth.password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token_hash ON auth.password_reset_tokens(token_hash);
```

#### email_verification_tokens
```sql
CREATE TABLE auth.email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_verification_user_id ON auth.email_verification_tokens(user_id);
```

---

### 4.2 User Database (`user_db`)

#### profiles
```sql
CREATE TABLE user.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,  -- References auth.users(id) via API, not FK
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),  -- 'male', 'female', 'other', 'prefer_not_to_say'
    bio TEXT,
    phone VARCHAR(20),
    locale VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_profiles_user_id ON user.profiles(user_id);
```

#### addresses
```sql
CREATE TABLE user.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    label VARCHAR(50),              -- 'home', 'work', 'other'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(200),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL,  -- ISO 3166-1 alpha-2
    phone VARCHAR(20),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_addresses_user_id ON user.addresses(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_addresses_country_code ON user.addresses(country_code);
```

#### user_preferences
```sql
CREATE TABLE user.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    sms_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_emails BOOLEAN NOT NULL DEFAULT TRUE,
    currency VARCHAR(3) DEFAULT 'USD',
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(20) DEFAULT 'system',  -- 'light', 'dark', 'system'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 4.3 Product Database (`product_db`)

#### categories
```sql
CREATE TABLE product.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES product.categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    description TEXT,
    image_url TEXT,
    icon VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    level INTEGER NOT NULL DEFAULT 0,        -- Tree depth
    path VARCHAR(500) NOT NULL,              -- Materialized path: /parent/child/grandchild
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_categories_slug ON product.categories(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_parent_id ON product.categories(parent_id);
CREATE INDEX idx_categories_path ON product.categories USING gin(path gin_trgm_ops);
```

#### brands
```sql
CREATE TABLE product.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_brands_slug ON product.brands(slug) WHERE deleted_at IS NULL;
```

#### products
```sql
CREATE TABLE product.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(520) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id UUID NOT NULL REFERENCES product.categories(id),
    brand_id UUID REFERENCES product.brands(id),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',  -- 'draft', 'active', 'archived', 'discontinued'
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_digital BOOLEAN NOT NULL DEFAULT FALSE,
    weight DECIMAL(10, 3),
    weight_unit VARCHAR(5) DEFAULT 'kg',
    length DECIMAL(10, 2),
    width DECIMAL(10, 2),
    height DECIMAL(10, 2),
    dimension_unit VARCHAR(5) DEFAULT 'cm',
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    tags TEXT[],
    attributes JSONB DEFAULT '{}',
    rating_average DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_products_sku ON product.products(sku) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uniq_products_slug ON product.products(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category_id ON product.products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_brand_id ON product.products(brand_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status ON product.products(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_is_featured ON product.products(is_featured) WHERE is_featured = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_products_rating ON product.products(rating_average DESC) WHERE deleted_at IS NULL;
```

#### product_variants
```sql
CREATE TABLE product.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}',  -- {"color": "red", "size": "L"}
    price DECIMAL(12, 2) NOT NULL,
    compare_at_price DECIMAL(12, 2),
    cost_price DECIMAL(12, 2),
    barcode VARCHAR(100),
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_variants_sku ON product.product_variants(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_variants_product_id ON product.product_variants(product_id) WHERE deleted_at IS NULL;
```

#### product_images
```sql
CREATE TABLE product.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product.product_variants(id) ON DELETE SET NULL,
    media_id UUID NOT NULL,  -- References media_db.media(id)
    alt_text VARCHAR(255),
    title VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product.product_images(product_id);
CREATE INDEX idx_product_images_variant_id ON product.product_images(variant_id);
```

#### product_categories (many-to-many)
```sql
CREATE TABLE product.product_categories (
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES product.categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (product_id, category_id)
);
```

#### attributes
```sql
CREATE TABLE product.attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- 'text', 'number', 'select', 'multi_select', 'boolean'
    options JSONB,              -- For select/multi_select: ["Red", "Blue", "Green"]
    is_filterable BOOLEAN NOT NULL DEFAULT FALSE,
    is_variant BOOLEAN NOT NULL DEFAULT FALSE,  -- Creates variants
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_attributes_slug ON product.attributes(slug);
```

#### product_attribute_values
```sql
CREATE TABLE product.product_attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES product.attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_attribute_values_product_id ON product.product_attribute_values(product_id);
CREATE INDEX idx_product_attribute_values_attribute_id ON product.product_attribute_values(attribute_id);
```

---

### 4.4 Inventory Database (`inventory_db`)

#### warehouses
```sql
CREATE TABLE inventory.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    priority INTEGER NOT NULL DEFAULT 0,  -- For fulfillment priority
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### stock
```sql
CREATE TABLE inventory.stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    variant_id UUID,
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    out_of_stock_threshold INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER,
    reorder_quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_stock_quantity_positive CHECK (quantity >= 0),
    CONSTRAINT chk_stock_reserved_positive CHECK (reserved_quantity >= 0),
    CONSTRAINT chk_stock_reserved_lte_quantity CHECK (reserved_quantity <= quantity)
);

CREATE UNIQUE INDEX uniq_stock_product_variant_warehouse ON inventory.stock(product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'), warehouse_id);
CREATE INDEX idx_stock_product_id ON inventory.stock(product_id);
CREATE INDEX idx_stock_warehouse_id ON inventory.stock(warehouse_id);
CREATE INDEX idx_stock_low_stock ON inventory.stock(available_quantity) WHERE available_quantity <= low_stock_threshold;
```

#### stock_movements
```sql
CREATE TABLE inventory.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID NOT NULL REFERENCES inventory.stock(id),
    type VARCHAR(30) NOT NULL,  -- 'inbound', 'outbound', 'reservation', 'release', 'adjustment', 'transfer'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50),  -- 'order', 'reservation', 'adjustment', 'transfer'
    reference_id UUID,
    reason TEXT,
    performed_by UUID,  -- User ID
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_stock_id ON inventory.stock_movements(stock_id);
CREATE INDEX idx_stock_movements_reference ON inventory.stock_movements(reference_type, reference_id);
CREATE INDEX idx_stock_movements_created_at ON inventory.stock_movements(created_at);
```

#### reservations
```sql
CREATE TABLE inventory.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    variant_id UUID,
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id),
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'active', 'fulfilled', 'released', 'expired'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_order_id ON inventory.reservations(order_id);
CREATE INDEX idx_reservations_product_id ON inventory.reservations(product_id);
CREATE INDEX idx_reservations_status ON inventory.reservations(status);
CREATE INDEX idx_reservations_expires_at ON inventory.reservations(expires_at) WHERE status = 'active';
```

---

### 4.5 Pricing Database (`pricing_db`)

#### currencies
```sql
CREATE TABLE pricing.currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(3) NOT NULL UNIQUE,  -- ISO 4217
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimal_places INTEGER NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### exchange_rates
```sql
CREATE TABLE pricing.exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(3) NOT NULL REFERENCES pricing.currencies(code),
    to_currency VARCHAR(3) NOT NULL REFERENCES pricing.currencies(code),
    rate DECIMAL(20, 10) NOT NULL,
    source VARCHAR(50) NOT NULL,
    effective_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exchange_rates_currencies ON pricing.exchange_rates(from_currency, to_currency);
CREATE INDEX idx_exchange_rates_effective_at ON pricing.exchange_rates(effective_at);
```

#### prices
```sql
CREATE TABLE pricing.prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    variant_id UUID,
    currency VARCHAR(3) NOT NULL REFERENCES pricing.currencies(code),
    price DECIMAL(12, 2) NOT NULL,
    compare_at_price DECIMAL(12, 2),
    cost_price DECIMAL(12, 2),
    min_quantity INTEGER NOT NULL DEFAULT 1,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prices_product_id ON pricing.prices(product_id);
CREATE INDEX idx_prices_currency ON pricing.prices(currency);
CREATE INDEX idx_prices_active ON pricing.prices(is_active, starts_at, ends_at);
```

#### discounts
```sql
CREATE TABLE pricing.discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,  -- 'percentage', 'fixed_amount', 'buy_x_get_y', 'free_shipping'
    value DECIMAL(12, 2) NOT NULL,
    max_uses INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    min_order_amount DECIMAL(12, 2),
    min_quantity INTEGER,
    product_ids UUID[],
    category_ids UUID[],
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 4.6 Cart Database (`cart_db`)

#### carts
```sql
CREATE TABLE cart.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    session_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',  -- 'active', 'abandoned', 'converted'
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    coupon_code VARCHAR(50),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    abandoned_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_carts_user_id ON cart.carts(user_id);
CREATE INDEX idx_carts_session_id ON cart.carts(session_id);
CREATE INDEX idx_carts_status ON cart.carts(status);
CREATE INDEX idx_carts_abandoned_at ON cart.carts(abandoned_at) WHERE status = 'active';
```

#### cart_items
```sql
CREATE TABLE cart.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES cart.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    variant_id UUID,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(12, 2) NOT NULL,
    compare_at_price DECIMAL(12, 2),
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    options JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_cart_item_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_cart_id ON cart.cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart.cart_items(product_id);
CREATE UNIQUE INDEX uniq_cart_items_product ON cart.cart_items(cart_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'));
```

---

### 4.7 Order Database (`order_db`)

#### orders
```sql
CREATE TABLE "order".orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    -- Status: pending, confirmed, processing, shipped, delivered, cancelled, returned, refunded
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    internal_notes TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    placed_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancel_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_orders_number ON "order".orders(order_number);
CREATE INDEX idx_orders_user_id ON "order".orders(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_status ON "order".orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created_at ON "order".orders(created_at DESC) WHERE deleted_at IS NULL;
-- Partition by month for large scale
-- CREATE TABLE "order".orders_y2024m01 PARTITION OF "order".orders FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

#### order_items
```sql
CREATE TABLE "order".order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES "order".orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    variant_id UUID,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    image_url TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    options JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_order_item_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order_id ON "order".order_items(order_id);
CREATE INDEX idx_order_items_product_id ON "order".order_items(product_id);
```

#### order_status_history
```sql
CREATE TABLE "order".order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES "order".orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    note TEXT,
    performed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON "order".order_status_history(order_id);
CREATE INDEX idx_order_status_history_created_at ON "order".order_status_history(created_at);
```

#### order_addresses
```sql
CREATE TABLE "order".order_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES "order".orders(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,  -- 'shipping', 'billing'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(200),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_addresses_order_id ON "order".order_addresses(order_id);
```

---

### 4.8 Payment Database (`payment_db`)

#### payments
```sql
CREATE TABLE payment.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: pending, processing, completed, failed, cancelled, refunded, partially_refunded
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    method VARCHAR(50) NOT NULL,  -- 'credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'
    provider VARCHAR(50) NOT NULL,  -- 'stripe', 'paypal', 'razorpay'
    provider_transaction_id VARCHAR(255),
    provider_metadata JSONB DEFAULT '{}',
    failure_reason TEXT,
    failure_code VARCHAR(50),
    idempotency_key VARCHAR(255) UNIQUE,
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payment.payments(order_id);
CREATE INDEX idx_payments_user_id ON payment.payments(user_id);
CREATE INDEX idx_payments_status ON payment.payments(status);
CREATE INDEX idx_payments_provider_transaction_id ON payment.payments(provider_transaction_id);
```

#### refunds
```sql
CREATE TABLE payment.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payment.payments(id),
    order_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: pending, processing, completed, failed
    provider_refund_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refunds_payment_id ON payment.refunds(payment_id);
CREATE INDEX idx_refunds_order_id ON payment.refunds(order_id);
```

#### payment_methods
```sql
CREATE TABLE payment.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'credit_card', 'debit_card', 'paypal', 'bank_account'
    provider VARCHAR(50) NOT NULL,
    provider_payment_method_id VARCHAR(255) NOT NULL,
    last_four VARCHAR(4),
    brand VARCHAR(50),  -- 'visa', 'mastercard', 'amex'
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    billing_address JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_payment_methods_user_id ON payment.payment_methods(user_id) WHERE deleted_at IS NULL;
```

#### transactions
```sql
CREATE TABLE payment.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payment.payments(id),
    type VARCHAR(20) NOT NULL,  -- 'charge', 'refund', 'void', 'capture'
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_transaction_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_payment_id ON payment.transactions(payment_id);
```

---

### 4.9 Shipping Database (`shipping_db`)

#### carriers
```sql
CREATE TABLE shipping.carriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    api_url TEXT,
    api_key_encrypted TEXT,
    tracking_url_template TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### shipping_methods
```sql
CREATE TABLE shipping.shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_id UUID NOT NULL REFERENCES shipping.carriers(id),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    estimated_days_min INTEGER,
    estimated_days_max INTEGER,
    base_rate DECIMAL(12, 2) NOT NULL,
    per_kg_rate DECIMAL(12, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_methods_carrier_id ON shipping.shipping_methods(carrier_id);
```

#### shipments
```sql
CREATE TABLE shipping.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    shipping_method_id UUID NOT NULL REFERENCES shipping.shipping_methods(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: pending, label_created, dispatched, in_transit, out_for_delivery, delivered, exception, returned
    tracking_number VARCHAR(255),
    carrier_id UUID NOT NULL REFERENCES shipping.carriers(id),
    weight DECIMAL(10, 3),
    weight_unit VARCHAR(5) DEFAULT 'kg',
    shipping_cost DECIMAL(12, 2),
    from_address JSONB NOT NULL,
    to_address JSONB NOT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    signature_required BOOLEAN NOT NULL DEFAULT FALSE,
    signed_by VARCHAR(200),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipments_order_id ON shipping.shipments(order_id);
CREATE INDEX idx_shipments_tracking_number ON shipping.shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipping.shipments(status);
```

#### shipping_rates
```sql
CREATE TABLE shipping.shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_method_id UUID NOT NULL REFERENCES shipping.shipping_methods(id),
    country_code CHAR(2),
    state VARCHAR(100),
    postal_code_from VARCHAR(20),
    postal_code_to VARCHAR(20),
    min_weight DECIMAL(10, 3),
    max_weight DECIMAL(10, 3),
    rate DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 4.10 Review Database (`review_db`)

#### reviews
```sql
CREATE TABLE review.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    order_id UUID,  -- Verified purchase
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    body TEXT,
    pros TEXT,
    cons TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: pending, approved, rejected, flagged
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    report_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_reviews_product_id ON review.reviews(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_reviews_user_id ON review.reviews(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_reviews_status ON review.reviews(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_reviews_rating ON review.reviews(rating) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uniq_reviews_user_product ON review.reviews(user_id, product_id) WHERE deleted_at IS NULL;
```

#### review_votes
```sql
CREATE TABLE review.review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES review.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);
```

#### review_reports
```sql
CREATE TABLE review.review_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES review.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    reason VARCHAR(50) NOT NULL,  -- 'spam', 'inappropriate', 'fake', 'other'
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);
```

---

### 4.11 Wishlist Database (`wishlist_db`)

#### wishlists
```sql
CREATE TABLE wishlist.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL DEFAULT 'My Wishlist',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    item_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_wishlists_user_id ON wishlist.wishlists(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlists_share_token ON wishlist.wishlists(share_token) WHERE share_token IS NOT NULL;
```

#### wishlist_items
```sql
CREATE TABLE wishlist.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID NOT NULL REFERENCES wishlist.wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    variant_id UUID,
    note TEXT,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(wishlist_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'))
);
```

---

### 4.12 Notification Database (`notification_db`)

#### notifications
```sql
CREATE TABLE notification.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    channel VARCHAR(20) NOT NULL,  -- 'email', 'sms', 'push', 'in_app'
    template_key VARCHAR(100) NOT NULL,
    subject VARCHAR(500),
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: pending, sent, delivered, read, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notification.notifications(user_id);
CREATE INDEX idx_notifications_status ON notification.notifications(status);
CREATE INDEX idx_notifications_created_at ON notification.notifications(created_at DESC);
```

#### notification_templates
```sql
CREATE TABLE notification.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    subject_template TEXT,  -- Handlebars/MJML template
    body_template TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### notification_preferences
```sql
CREATE TABLE notification.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,  -- 'order.shipped', 'payment.completed', etc.
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, event_type)
);
```

---

### 4.13 Promotion Database (`promotion_db`)

#### coupons
```sql
CREATE TABLE promotion.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(20) NOT NULL,  -- 'percentage', 'fixed_amount', 'free_shipping'
    value DECIMAL(12, 2) NOT NULL,
    min_order_amount DECIMAL(12, 2),
    min_quantity INTEGER,
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    product_ids UUID[],
    category_ids UUID[],
    exclude_product_ids UUID[],
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON promotion.coupons(code);
CREATE INDEX idx_coupons_active ON promotion.coupons(is_active, starts_at, ends_at);
```

#### coupon_usages
```sql
CREATE TABLE promotion.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES promotion.coupons(id),
    user_id UUID NOT NULL,
    order_id UUID NOT NULL,
    discount_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_usages_coupon_id ON promotion.coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_user_id ON promotion.coupon_usages(user_id);
```

#### promotions
```sql
CREATE TABLE promotion.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(30) NOT NULL,  -- 'flash_sale', 'seasonal', 'clearance', 'bundle', 'bogo'
    rules JSONB NOT NULL DEFAULT '{}',
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

### 4.14 Media Database (`media_db`)

#### media
```sql
CREATE TABLE media.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    url TEXT NOT NULL,
    cdn_url TEXT,
    width INTEGER,
    height INTEGER,
    duration DECIMAL(10, 2),  -- For videos
    alt TEXT,
    title VARCHAR(255),
    folder_id UUID,
    uploaded_by UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_media_folder_id ON media.media(folder_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_mime_type ON media.media(mime_type) WHERE deleted_at IS NULL;
```

#### media_folders
```sql
CREATE TABLE media.media_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES media.media_folders(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_folders_parent_id ON media.media_folders(parent_id);
```

#### image_variants
```sql
CREATE TABLE media.image_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL REFERENCES media.media(id) ON DELETE CASCADE,
    variant VARCHAR(50) NOT NULL,  -- 'thumbnail', 'small', 'medium', 'large', 'original'
    url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_image_variants_media_id ON media.image_variants(media_id);
```

---

### 4.15 CMS Database (`cms_db`)

#### pages
```sql
CREATE TABLE cms.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(520) NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    og_title VARCHAR(200),
    og_description VARCHAR(500),
    og_image_url TEXT,
    template VARCHAR(100) DEFAULT 'default',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    -- Status: draft, published, archived
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    author_id UUID,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_pages_slug ON cms.pages(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_pages_status ON cms.pages(status) WHERE deleted_at IS NULL;
```

#### blog_posts
```sql
CREATE TABLE cms.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(520) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE UNIQUE INDEX uniq_blog_posts_slug ON cms.blog_posts(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_blog_posts_author_id ON cms.blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON cms.blog_posts(status) WHERE deleted_at IS NULL;
```

#### banners
```sql
CREATE TABLE cms.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slot VARCHAR(100) NOT NULL,  -- 'home_hero', 'category_top', 'checkout_top'
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    link_url TEXT,
    alt_text VARCHAR(255),
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banners_slot ON cms.banners(slot);
CREATE INDEX idx_banners_active ON cms.banners(is_active, starts_at, ends_at);
```

---

### 4.16 Audit Database (`audit_db`)

#### audit_logs
```sql
CREATE TABLE audit.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,  -- 'create', 'update', 'delete', 'login', 'export'
    user_id UUID,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    changes JSONB,  -- {"field": {"old": "x", "new": "y"}}
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit.audit_logs(created_at DESC);
-- Partition by month for performance
```

#### compliance_records
```sql
CREATE TABLE audit.compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,  -- 'gdpr_request', 'data_export', 'data_deletion'
    user_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    performed_by UUID,
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);
```

---

### 4.17 Admin Database (`admin_db`)

#### admin_users
```sql
CREATE TABLE admin.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,  -- References auth.users(id)
    admin_role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### system_configs
```sql
CREATE TABLE admin.system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(200) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,  -- Can be accessed by frontend
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

## 5. Indexing Strategy

### Common Index Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| **B-Tree** | `CREATE INDEX idx ON table(column)` | Equality, range queries |
| **GIN** | `CREATE INDEX idx ON table USING gin(jsonb_column)` | JSONB queries |
| **GiST** | `CREATE INDEX idx ON table USING gist(column)` | Full-text search, geospatial |
| **Partial** | `CREATE INDEX idx ON table(col) WHERE condition` | Filtered queries |
| **Composite** | `CREATE INDEX idx ON table(col1, col2)` | Multi-column queries |
| **Expression** | `CREATE INDEX idx ON table(LOWER(email))` | Functional queries |

### Performance Guidelines

1. **Always index foreign keys** — JOIN performance
2. **Index filtered queries** — `WHERE deleted_at IS NULL` pattern
3. **Composite index order** — Most selective first
4. **Cover indexes** — Include columns needed for SELECT
5. **Avoid over-indexing** — Each index slows writes
6. **Monitor slow queries** — `pg_stat_statements`

---

## 6. Migration Strategy

### Prisma Migrations

```bash
# Create migration
pnpm db:migrate -- --name add_products_table

# Apply migrations
pnpm db:migrate

# Reset database (dev only)
pnpm db:push --force-reset

# Generate client
pnpm db:generate
```

### Migration Rules

1. **Never drop columns in production** — Use soft delete
2. **Always add columns as nullable** — Or with default values
3. **Test migrations on staging first** — Before production
4. **Keep migrations small** — One logical change per migration
5. **Version control all migrations** — Committed to git
6. **Backward compatible** — Old code must work with new schema
