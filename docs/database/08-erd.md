# Entity Relationship Diagram

## Complete ER Diagram (Mermaid)

```mermaid
erDiagram
    %% ============================================================================
    %% USER & AUTH MODULE
    %% ============================================================================
    
    users {
        uuid id PK
        varchar email UK
        boolean email_verified
        varchar phone
        boolean phone_verified
        varchar password_hash
        enum status
        boolean mfa_enabled
        varchar mfa_secret
        enum mfa_method
        int failed_login_attempts
        timestamptz locked_until
        timestamptz last_login_at
        inet last_login_ip
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    oauth_connections {
        uuid id PK
        uuid user_id FK
        enum provider
        varchar provider_user_id
        varchar provider_email
        text access_token
        text refresh_token
        timestamptz token_expires_at
        jsonb provider_data
        timestamptz created_at
        timestamptz updated_at
    }
    
    roles {
        uuid id PK
        varchar name UK
        text description
        boolean is_system
        timestamptz created_at
        timestamptz updated_at
    }
    
    permissions {
        uuid id PK
        varchar resource
        varchar action
        text description
        timestamptz created_at
    }
    
    role_permissions {
        uuid role_id FK
        uuid permission_id FK
        timestamptz created_at
    }
    
    user_roles {
        uuid user_id FK
        uuid role_id FK
        timestamptz created_at
    }
    
    sessions {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        varchar refresh_token_hash
        inet ip_address
        text user_agent
        jsonb device_info
        enum status
        timestamptz last_activity_at
        timestamptz expires_at
        timestamptz created_at
    }
    
    refresh_tokens {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        uuid family_id
        inet ip_address
        text user_agent
        timestamptz expires_at
        timestamptz revoked_at
        timestamptz created_at
    }
    
    password_reset_tokens {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        timestamptz expires_at
        timestamptz used_at
        timestamptz created_at
    }
    
    email_verification_tokens {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        varchar email
        timestamptz expires_at
        timestamptz verified_at
        timestamptz created_at
    }
    
    %% ============================================================================
    %% USER PROFILE MODULE
    %% ============================================================================
    
    user_profiles {
        uuid id PK
        uuid user_id FK UK
        varchar first_name
        varchar last_name
        varchar display_name
        text avatar_url
        text cover_url
        date date_of_birth
        enum gender
        text bio
        varchar company
        varchar website
        varchar locale
        varchar timezone
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    addresses {
        uuid id PK
        uuid user_id FK
        enum type
        varchar label
        varchar first_name
        varchar last_name
        varchar company
        varchar address_line_1
        varchar address_line_2
        varchar city
        varchar state
        varchar postal_code
        char country_code
        varchar phone
        boolean is_default
        decimal latitude
        decimal longitude
        text delivery_instructions
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    user_preferences {
        uuid id PK
        uuid user_id FK UK
        boolean email_notifications
        boolean sms_notifications
        boolean push_notifications
        boolean marketing_emails
        boolean order_updates
        boolean newsletter_subscribed
        varchar currency
        varchar language
        enum theme
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% CATALOG MODULE
    %% ============================================================================
    
    categories {
        uuid id PK
        uuid parent_id FK
        varchar name
        varchar slug UK
        text description
        text image_url
        varchar icon
        text banner_url
        varchar meta_title
        varchar meta_description
        int sort_order
        boolean is_active
        boolean is_featured
        int level
        varchar path
        int product_count
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    brands {
        uuid id PK
        varchar name
        varchar slug UK
        text description
        text logo_url
        text banner_url
        varchar website_url
        boolean is_active
        boolean is_featured
        int sort_order
        varchar meta_title
        varchar meta_description
        int product_count
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    attributes {
        uuid id PK
        varchar name
        varchar slug UK
        enum type
        jsonb options
        boolean is_filterable
        boolean is_variant
        boolean is_required
        int sort_order
        timestamptz created_at
        timestamptz updated_at
    }
    
    products {
        uuid id PK
        varchar sku UK
        varchar name
        varchar slug UK
        text description
        varchar short_description
        enum product_type
        uuid category_id FK
        uuid brand_id FK
        enum status
        boolean is_featured
        boolean is_digital
        boolean is_taxable
        decimal weight
        varchar weight_unit
        decimal length
        decimal width
        decimal height
        varchar dimension_unit
        varchar meta_title
        varchar meta_description
        text[] tags
        jsonb attributes
        jsonb pricing
        int stock_quantity
        int low_stock_threshold
        decimal rating_average
        int rating_count
        int review_count
        int view_count
        int sold_count
        int sort_order
        timestamptz published_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    product_categories {
        uuid product_id FK
        uuid category_id FK
        boolean is_primary
        int sort_order
        timestamptz created_at
    }
    
    product_variants {
        uuid id PK
        uuid product_id FK
        varchar sku UK
        varchar name
        jsonb attributes
        decimal price
        decimal compare_at_price
        decimal cost_price
        varchar barcode
        text image_url
        decimal weight
        int stock_quantity
        int low_stock_threshold
        enum status
        int sort_order
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    product_attribute_values {
        uuid id PK
        uuid product_id FK
        uuid attribute_id FK
        text value
        timestamptz created_at
    }
    
    product_images {
        uuid id PK
        uuid product_id FK
        uuid variant_id FK
        uuid media_id
        varchar alt_text
        varchar title
        int sort_order
        boolean is_primary
        timestamptz created_at
        timestamptz updated_at
    }
    
    product_videos {
        uuid id PK
        uuid product_id FK
        uuid media_id
        varchar title
        text description
        decimal duration
        int sort_order
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% INVENTORY MODULE
    %% ============================================================================
    
    warehouses {
        uuid id PK
        varchar name
        varchar code UK
        text description
        varchar address_line_1
        varchar address_line_2
        varchar city
        varchar state
        varchar postal_code
        char country_code
        varchar phone
        varchar email
        boolean is_active
        boolean is_default
        int priority
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }
    
    inventory {
        uuid id PK
        uuid product_id
        uuid variant_id
        uuid warehouse_id FK
        int quantity
        int reserved_quantity
        int available_quantity
        int low_stock_threshold
        int reorder_point
        int reorder_quantity
        timestamptz created_at
        timestamptz updated_at
    }
    
    stock_movements {
        uuid id PK
        uuid inventory_id FK
        varchar type
        int quantity
        varchar reference_type
        uuid reference_id
        text reason
        uuid performed_by
        timestamptz created_at
    }
    
    stock_reservations {
        uuid id PK
        uuid order_id
        uuid product_id
        uuid variant_id
        uuid warehouse_id FK
        int quantity
        varchar status
        timestamptz expires_at
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% PRICING MODULE
    %% ============================================================================
    
    currencies {
        uuid id PK
        varchar code UK
        varchar name
        varchar symbol
        int decimal_places
        boolean is_active
        boolean is_default
        decimal exchange_rate
        timestamptz created_at
    }
    
    exchange_rates {
        uuid id PK
        varchar from_currency FK
        varchar to_currency FK
        decimal rate
        varchar source
        timestamptz effective_at
        timestamptz created_at
    }
    
    prices {
        uuid id PK
        uuid product_id
        uuid variant_id
        varchar currency FK
        decimal price
        decimal compare_at_price
        decimal cost_price
        int min_quantity
        timestamptz starts_at
        timestamptz ends_at
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    discounts {
        uuid id PK
        varchar name
        text description
        varchar type
        decimal value
        int max_uses
        int used_count
        decimal min_order_amount
        int min_quantity
        uuid[] product_ids
        uuid[] category_ids
        timestamptz starts_at
        timestamptz ends_at
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% CART MODULE
    %% ============================================================================
    
    carts {
        uuid id PK
        uuid user_id
        varchar session_id
        varchar status
        varchar currency
        decimal subtotal
        decimal discount_amount
        decimal tax_amount
        decimal shipping_amount
        decimal total
        varchar coupon_code
        text notes
        jsonb metadata
        timestamptz expires_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz abandoned_at
    }
    
    cart_items {
        uuid id PK
        uuid cart_id FK
        uuid product_id
        uuid variant_id
        int quantity
        decimal price
        decimal compare_at_price
        decimal discount_amount
        decimal tax_amount
        decimal total
        jsonb options
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% ORDER MODULE
    %% ============================================================================
    
    orders {
        uuid id PK
        varchar order_number UK
        uuid user_id
        enum status
        varchar currency FK
        decimal subtotal
        decimal discount_amount
        decimal tax_amount
        decimal shipping_amount
        decimal total
        text notes
        text internal_notes
        inet ip_address
        text user_agent
        jsonb metadata
        timestamptz placed_at
        timestamptz confirmed_at
        timestamptz shipped_at
        timestamptz delivered_at
        timestamptz cancelled_at
        text cancel_reason
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id
        uuid variant_id
        varchar sku
        varchar name
        text image_url
        int quantity
        decimal unit_price
        decimal discount_amount
        decimal tax_amount
        decimal total
        jsonb options
        timestamptz created_at
    }
    
    order_status_history {
        uuid id PK
        uuid order_id FK
        enum status
        text note
        uuid performed_by
        timestamptz created_at
    }
    
    order_addresses {
        uuid id PK
        uuid order_id FK
        varchar type
        varchar first_name
        varchar last_name
        varchar company
        varchar address_line_1
        varchar address_line_2
        varchar city
        varchar state
        varchar postal_code
        char country_code
        varchar phone
        timestamptz created_at
    }
    
    %% ============================================================================
    %% PAYMENT MODULE
    %% ============================================================================
    
    payments {
        uuid id PK
        uuid order_id
        uuid user_id
        enum status
        decimal amount
        varchar currency FK
        enum method
        varchar provider
        varchar provider_transaction_id
        jsonb provider_metadata
        text failure_reason
        varchar failure_code
        varchar idempotency_key UK
        jsonb metadata
        timestamptz paid_at
        timestamptz failed_at
        timestamptz created_at
        timestamptz updated_at
    }
    
    refunds {
        uuid id PK
        uuid payment_id FK
        uuid order_id FK
        decimal amount
        text reason
        enum status
        varchar provider_refund_id
        jsonb metadata
        timestamptz processed_at
        timestamptz created_at
        timestamptz updated_at
    }
    
    payment_methods {
        uuid id PK
        uuid user_id
        enum type
        varchar provider
        varchar provider_payment_method_id
        varchar last_four
        varchar brand
        int exp_month
        int exp_year
        boolean is_default
        jsonb billing_address
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    payment_transactions {
        uuid id PK
        uuid payment_id FK
        varchar type
        decimal amount
        varchar currency
        varchar status
        varchar provider
        varchar provider_transaction_id
        jsonb metadata
        timestamptz created_at
    }
    
    %% ============================================================================
    %% SHIPPING MODULE
    %% ============================================================================
    
    carriers {
        uuid id PK
        varchar name
        varchar code UK
        text api_url
        text api_key_encrypted
        text tracking_url_template
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    shipping_methods {
        uuid id PK
        uuid carrier_id FK
        varchar name
        varchar code
        text description
        int estimated_days_min
        int estimated_days_max
        decimal base_rate
        decimal per_kg_rate
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    shipments {
        uuid id PK
        uuid order_id
        uuid shipping_method_id FK
        enum status
        varchar tracking_number
        uuid carrier_id FK
        decimal weight
        varchar weight_unit
        decimal shipping_cost
        jsonb from_address
        jsonb to_address
        timestamptz estimated_delivery
        timestamptz actual_delivery
        boolean signature_required
        varchar signed_by
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }
    
    shipping_rates {
        uuid id PK
        uuid shipping_method_id FK
        char country_code
        varchar state
        varchar postal_code_from
        varchar postal_code_to
        decimal min_weight
        decimal max_weight
        decimal rate
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% COUPON & PROMOTION MODULE
    %% ============================================================================
    
    coupons {
        uuid id PK
        varchar code UK
        text description
        varchar type
        decimal value
        decimal min_order_amount
        int min_quantity
        int max_uses
        int max_uses_per_user
        int used_count
        uuid[] product_ids
        uuid[] category_ids
        uuid[] exclude_product_ids
        timestamptz starts_at
        timestamptz ends_at
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    coupon_usages {
        uuid id PK
        uuid coupon_id FK
        uuid user_id FK
        uuid order_id FK
        decimal discount_amount
        timestamptz created_at
    }
    
    promotions {
        uuid id PK
        varchar name
        text description
        varchar type
        jsonb rules
        timestamptz starts_at
        timestamptz ends_at
        boolean is_active
        int priority
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% REVIEW MODULE
    %% ============================================================================
    
    reviews {
        uuid id PK
        uuid product_id
        uuid user_id FK
        uuid order_id
        uuid order_item_id
        smallint rating
        varchar title
        text body
        text pros
        text cons
        enum status
        boolean is_verified_purchase
        int helpful_count
        int unhelpful_count
        int report_count
        jsonb metadata
        timestamptz approved_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    review_images {
        uuid id PK
        uuid review_id FK
        uuid media_id
        varchar alt_text
        int sort_order
        timestamptz created_at
    }
    
    review_votes {
        uuid id PK
        uuid review_id FK
        uuid user_id FK
        boolean is_helpful
        timestamptz created_at
    }
    
    review_reports {
        uuid id PK
        uuid review_id FK
        uuid user_id FK
        enum reason
        text description
        varchar status
        uuid reviewed_by
        timestamptz created_at
        timestamptz reviewed_at
    }
    
    %% ============================================================================
    %% COMMENT MODULE
    %% ============================================================================
    
    comments {
        uuid id PK
        varchar entity_type
        uuid entity_id
        uuid user_id FK
        uuid parent_id FK
        text body
        boolean is_edited
        int like_count
        int reply_count
        varchar status
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    comment_likes {
        uuid id PK
        uuid comment_id FK
        uuid user_id FK
        timestamptz created_at
    }
    
    %% ============================================================================
    %% WISHLIST MODULE
    %% ============================================================================
    
    wishlists {
        uuid id PK
        uuid user_id FK
        varchar name
        boolean is_public
        varchar share_token UK
        int item_count
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    wishlist_items {
        uuid id PK
        uuid wishlist_id FK
        uuid product_id
        uuid variant_id
        text note
        int priority
        timestamptz created_at
    }
    
    %% ============================================================================
    %% NOTIFICATION MODULE
    %% ============================================================================
    
    notifications {
        uuid id PK
        uuid user_id FK
        enum channel
        varchar template_key
        varchar subject
        text body
        jsonb data
        enum status
        timestamptz sent_at
        timestamptz delivered_at
        timestamptz read_at
        timestamptz failed_at
        text failure_reason
        jsonb metadata
        timestamptz created_at
    }
    
    notification_templates {
        uuid id PK
        varchar key UK
        varchar name
        enum channel
        text subject_template
        text body_template
        jsonb variables
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    notification_preferences {
        uuid id PK
        uuid user_id FK
        varchar event_type
        boolean email_enabled
        boolean sms_enabled
        boolean push_enabled
        boolean in_app_enabled
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% MEDIA MODULE
    %% ============================================================================
    
    media {
        uuid id PK
        varchar filename
        varchar original_filename
        varchar mime_type
        int file_size
        text url
        text cdn_url
        enum type
        int width
        int height
        decimal duration
        text alt
        varchar title
        uuid folder_id FK
        uuid uploaded_by
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    media_folders {
        uuid id PK
        uuid parent_id FK
        varchar name
        varchar path
        timestamptz created_at
        timestamptz updated_at
    }
    
    image_variants {
        uuid id PK
        uuid media_id FK
        varchar variant
        text url
        int width
        int height
        int file_size
        timestamptz created_at
    }
    
    %% ============================================================================
    %% CMS MODULE
    %% ============================================================================
    
    pages {
        uuid id PK
        varchar title
        varchar slug UK
        text content
        text excerpt
        text featured_image_url
        varchar meta_title
        varchar meta_description
        varchar og_title
        varchar og_description
        text og_image_url
        varchar template
        enum status
        timestamptz published_at
        timestamptz expires_at
        uuid author_id
        int sort_order
        int view_count
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    blog_posts {
        uuid id PK
        varchar title
        varchar slug UK
        text content
        text excerpt
        text featured_image_url
        uuid author_id FK
        varchar category
        text[] tags
        varchar meta_title
        varchar meta_description
        enum status
        timestamptz published_at
        int view_count
        int like_count
        int comment_count
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    
    banners {
        uuid id PK
        varchar title
        enum slot
        text image_url
        text mobile_image_url
        text link_url
        varchar alt_text
        timestamptz starts_at
        timestamptz ends_at
        int sort_order
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% TAG MODULE
    %% ============================================================================
    
    tags {
        uuid id PK
        varchar name UK
        varchar slug UK
        text description
        int usage_count
        timestamptz created_at
        timestamptz updated_at
    }
    
    entity_tags {
        uuid id PK
        varchar entity_type
        uuid entity_id
        uuid tag_id FK
        timestamptz created_at
    }
    
    %% ============================================================================
    %% LOCALIZATION MODULE
    %% ============================================================================
    
    languages {
        uuid id PK
        varchar code UK
        varchar name
        varchar native_name
        boolean is_default
        boolean is_active
        varchar direction
        timestamptz created_at
    }
    
    translations {
        uuid id PK
        varchar language_code FK
        varchar key
        text value
        varchar context
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% SEO MODULE
    %% ============================================================================
    
    seo_metadata {
        uuid id PK
        varchar entity_type
        uuid entity_id
        varchar meta_title
        varchar meta_description
        varchar og_title
        varchar og_description
        text og_image_url
        varchar twitter_title
        varchar twitter_description
        text twitter_image_url
        text canonical_url
        varchar robots
        jsonb schema_markup
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% AUDIT & LOGGING MODULE
    %% ============================================================================
    
    audit_logs {
        uuid id PK
        varchar entity_type
        uuid entity_id
        enum action
        uuid user_id
        varchar user_email
        inet ip_address
        text user_agent
        jsonb changes
        jsonb old_values
        jsonb new_values
        jsonb metadata
        timestamptz created_at
    }
    
    activity_logs {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        text description
        inet ip_address
        text user_agent
        jsonb metadata
        timestamptz created_at
    }
    
    %% ============================================================================
    %% SETTINGS MODULE
    %% ============================================================================
    
    settings {
        uuid id PK
        varchar group_name
        varchar key
        text value
        enum type
        text description
        boolean is_public
        timestamptz created_at
        timestamptz updated_at
    }
    
    theme_settings {
        uuid id PK
        varchar name
        enum mode
        varchar primary_color
        varchar secondary_color
        varchar accent_color
        varchar background_color
        varchar text_color
        varchar font_family
        text logo_url
        text favicon_url
        boolean is_active
        text custom_css
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }
    
    %% ============================================================================
    %% ANALYTICS MODULE
    %% ============================================================================
    
    analytics_events {
        uuid id PK
        varchar event_type
        uuid user_id FK
        varchar session_id
        varchar entity_type
        uuid entity_id
        jsonb properties
        inet ip_address
        text user_agent
        text referrer
        char country_code
        varchar device_type
        varchar browser
        varchar os
        timestamptz created_at
    }
    
    %% ============================================================================
    %% DEVICE HISTORY MODULE
    %% ============================================================================
    
    device_history {
        uuid id PK
        uuid user_id FK
        varchar device_name
        varchar device_type
        varchar browser
        varchar os
        inet ip_address
        timestamptz last_active_at
        timestamptz created_at
    }
    
    %% ============================================================================
    %% RELATIONSHIPS
    %% ============================================================================
    
    %% User & Auth
    users ||--o{ oauth_connections : "has"
    users ||--o{ sessions : "has"
    users ||--o{ refresh_tokens : "has"
    users ||--o{ password_reset_tokens : "has"
    users ||--o{ email_verification_tokens : "has"
    users ||--o{ user_roles : "has"
    users ||--|| user_profiles : "has"
    users ||--o{ addresses : "has"
    users ||--|| user_preferences : "has"
    
    roles ||--o{ role_permissions : "has"
    roles ||--o{ user_roles : "has"
    permissions ||--o{ role_permissions : "has"
    
    %% Catalog
    categories ||--o{ categories : "parent"
    categories ||--o{ products : "has"
    categories ||--o{ product_categories : "has"
    brands ||--o{ products : "has"
    attributes ||--o{ product_attribute_values : "has"
    
    products ||--o{ product_variants : "has"
    products ||--o{ product_images : "has"
    products ||--o{ product_videos : "has"
    products ||--o{ product_attribute_values : "has"
    products ||--o{ product_categories : "has"
    products ||--o{ prices : "has"
    
    %% Inventory
    warehouses ||--o{ inventory : "has"
    warehouses ||--o{ stock_movements : "has"
    warehouses ||--o{ stock_reservations : "has"
    inventory ||--o{ stock_movements : "has"
    
    %% Pricing
    currencies ||--o{ exchange_rates : "has"
    currencies ||--o{ prices : "has"
    
    %% Cart
    carts ||--o{ cart_items : "has"
    
    %% Order
    orders ||--o{ order_items : "has"
    orders ||--o{ order_status_history : "has"
    orders ||--o{ order_addresses : "has"
    orders ||--o{ payments : "has"
    orders ||--o{ shipments : "has"
    orders ||--o{ coupon_usages : "has"
    
    %% Payment
    payments ||--o{ refunds : "has"
    payments ||--o{ payment_transactions : "has"
    
    %% Shipping
    carriers ||--o{ shipping_methods : "has"
    carriers ||--o{ shipments : "has"
    shipping_methods ||--o{ shipments : "has"
    shipping_methods ||--o{ shipping_rates : "has"
    
    %% Coupon
    coupons ||--o{ coupon_usages : "has"
    
    %% Review
    reviews ||--o{ review_images : "has"
    reviews ||--o{ review_votes : "has"
    reviews ||--o{ review_reports : "has"
    
    %% Comment
    comments ||--o{ comments : "parent"
    comments ||--o{ comment_likes : "has"
    
    %% Wishlist
    wishlists ||--o{ wishlist_items : "has"
    
    %% Notification
    users ||--o{ notifications : "has"
    users ||--o{ notification_preferences : "has"
    
    %% Media
    media_folders ||--o{ media_folders : "parent"
    media_folders ||--o{ media : "has"
    media ||--o{ image_variants : "has"
    
    %% Tag
    tags ||--o{ entity_tags : "has"
    
    %% Localization
    languages ||--o{ translations : "has"
    
    %% Audit
    users ||--o{ activity_logs : "has"
    users ||--o{ analytics_events : "has"
    users ||--o{ device_history : "has"
```

---

## Simplified Relationship Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORE RELATIONSHIPS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  users ─────┬──── user_profiles (1:1)                          │
│             ├──── addresses (1:N)                               │
│             ├──── user_roles ───── roles ───── role_permissions │
│             │                              ───── permissions    │
│             ├──── sessions (1:N)                                │
│             ├──── orders (1:N)                                  │
│             ├──── payments (1:N)                                │
│             ├──── reviews (1:N)                                 │
│             ├──── wishlists (1:N)                               │
│             └──── notifications (1:N)                           │
│                                                                  │
│  products ───┬──── categories (N:1)                            │
│              ├──── brands (N:1)                                 │
│              ├──── product_variants (1:N)                       │
│              ├──── product_images (1:N)                         │
│              ├──── product_attribute_values (N:N)               │
│              └──── prices (1:N)                                 │
│                                                                  │
│  orders ─────┬──── order_items (1:N)                           │
│              ├──── payments (1:N)                               │
│              ├──── shipments (1:N)                              │
│              └──── order_status_history (1:N)                   │
│                                                                  │
│  cart ───────┬──── cart_items (1:N)                            │
│              └──── (linked to user or session)                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
