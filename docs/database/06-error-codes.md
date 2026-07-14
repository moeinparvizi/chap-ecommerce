# Error Codes Catalog

## 1. HTTP Status Codes

| Status | Usage | Description |
|--------|-------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request succeeded, no content returned |
| 400 | Bad Request | Invalid request syntax or parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists or conflict |
| 422 | Unprocessable Entity | Business logic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 2. Error Code Format

```
{MODULE}_{ERROR_CODE}
```

Example: `AUTH_INVALID_CREDENTIALS`, `PRODUCT_NOT_FOUND`

---

## 3. Authentication Errors

| Code | Status | Message |
|------|--------|---------|
| AUTH_INVALID_CREDENTIALS | 401 | Invalid email or password |
| AUTH_ACCOUNT_LOCKED | 423 | Account has been locked due to too many failed attempts |
| AUTH_EMAIL_NOT_VERIFIED | 401 | Email address has not been verified |
| AUTH_TOKEN_EXPIRED | 401 | Access token has expired |
| AUTH_TOKEN_INVALID | 401 | Invalid access token |
| AUTH_REFRESH_TOKEN_EXPIRED | 401 | Refresh token has expired |
| AUTH_REFRESH_TOKEN_INVALID | 401 | Invalid refresh token |
| AUTH_REFRESH_TOKEN_USED | 401 | Refresh token has already been used |
| AUTH_MFA_REQUIRED | 401 | Multi-factor authentication required |
| AUTH_MFA_INVALID | 401 | Invalid MFA code |
| AUTH_PASSWORD_RESET_EXPIRED | 400 | Password reset token has expired |
| AUTH_PASSWORD_RESET_INVALID | 400 | Invalid password reset token |
| AUTH_EMAIL_VERIFICATION_EXPIRED | 400 | Email verification token has expired |
| AUTH_EMAIL_VERIFICATION_INVALID | 400 | Invalid email verification token |
| AUTH_OAUTH_FAILED | 401 | OAuth authentication failed |
| AUTH_OAUTH_PROVIDER_NOT_SUPPORTED | 400 | OAuth provider not supported |

---

## 4. Authorization Errors

| Code | Status | Message |
|------|--------|---------|
| AUTHZ_UNAUTHORIZED | 401 | Authentication required |
| AUTHZ_FORBIDDEN | 403 | Insufficient permissions |
| AUTHZ_INVALID_PERMISSION | 403 | Permission denied for this action |
| AUTHZ_RESOURCE_OWNERSHIP | 403 | You do not own this resource |
| AUTHZ_ADMIN_REQUIRED | 403 | Admin access required |
| AUTHZ_ROLE_REQUIRED | 403 | Specific role required for this action |

---

## 5. Validation Errors

| Code | Status | Message |
|------|--------|---------|
| VALIDATION_ERROR | 400 | Request validation failed |
| VALIDATION_REQUIRED | 400 | Field is required |
| VALIDATION_INVALID_FORMAT | 400 | Field format is invalid |
| VALIDATION_TOO_SHORT | 400 | Field is too short |
| VALIDATION_TOO_LONG | 400 | Field is too long |
| VALIDATION_INVALID_EMAIL | 400 | Invalid email address |
| VALIDATION_INVALID_PHONE | 400 | Invalid phone number |
| VALIDATION_INVALID_URL | 400 | Invalid URL format |
| VALIDATION_INVALID_UUID | 400 | Invalid UUID format |
| VALIDATION_INVALID_ENUM | 400 | Invalid enum value |
| VALIDATION_INVALID_DATE | 400 | Invalid date format |
| VALIDATION_INVALID_NUMBER | 400 | Invalid number format |
| VALIDATION_MIN_VALUE | 400 | Value below minimum |
| VALIDATION_MAX_VALUE | 400 | Value exceeds maximum |
| VALIDATION_INVALID_ARRAY | 400 | Invalid array format |
| VALIDATION_ARRAY_MIN_ITEMS | 400 | Array has too few items |
| VALIDATION_ARRAY_MAX_ITEMS | 400 | Array has too many items |
| VALIDATION_INVALID_OBJECT | 400 | Invalid object format |

---

## 6. Resource Errors

| Code | Status | Message |
|------|--------|---------|
| RESOURCE_NOT_FOUND | 404 | Resource not found |
| RESOURCE_ALREADY_EXISTS | 409 | Resource already exists |
| RESOURCE_DELETED | 410 | Resource has been deleted |
| RESOURCE_LOCKED | 423 | Resource is locked |
| RESOURCE_CONFLICT | 409 | Resource conflict detected |

---

## 7. User Errors

| Code | Status | Message |
|------|--------|---------|
| USER_NOT_FOUND | 404 | User not found |
| USER_EMAIL_EXISTS | 409 | Email address already registered |
| USER_PHONE_EXISTS | 409 | Phone number already registered |
| USER_DEACTIVATED | 403 | User account has been deactivated |
| USER_SUSPENDED | 403 | User account has been suspended |
| USER_PROFILE_NOT_FOUND | 404 | User profile not found |
| USER_ADDRESS_NOT_FOUND | 404 | Address not found |
| USER_ADDRESS_LIMIT | 422 | Maximum address limit reached |

---

## 8. Product Errors

| Code | Status | Message |
|------|--------|---------|
| PRODUCT_NOT_FOUND | 404 | Product not found |
| PRODUCT_SKU_EXISTS | 409 | Product SKU already exists |
| PRODUCT_SLUG_EXISTS | 409 | Product slug already exists |
| PRODUCT_INACTIVE | 422 | Product is not active |
| PRODUCT_OUT_OF_STOCK | 422 | Product is out of stock |
| PRODUCT_LOW_STOCK | 422 | Insufficient stock available |
| PRODUCT_VARIANT_NOT_FOUND | 404 | Product variant not found |
| PRODUCT_VARIANT_SKU_EXISTS | 409 | Variant SKU already exists |
| PRODUCT_IMAGE_NOT_FOUND | 404 | Product image not found |

---

## 9. Category Errors

| Code | Status | Message |
|------|--------|---------|
| CATEGORY_NOT_FOUND | 404 | Category not found |
| CATEGORY_SLUG_EXISTS | 409 | Category slug already exists |
| CATEGORY_HAS_PRODUCTS | 422 | Category has associated products |
| CATEGORY_HAS_CHILDREN | 422 | Category has child categories |
| CATEGORY_MAX_DEPTH | 422 | Maximum category depth exceeded |
| CATEGORY_CIRCULAR_REFERENCE | 422 | Circular category reference detected |

---

## 10. Brand Errors

| Code | Status | Message |
|------|--------|---------|
| BRAND_NOT_FOUND | 404 | Brand not found |
| BRAND_SLUG_EXISTS | 409 | Brand slug already exists |
| BRAND_HAS_PRODUCTS | 422 | Brand has associated products |

---

## 11. Order Errors

| Code | Status | Message |
|------|--------|---------|
| ORDER_NOT_FOUND | 404 | Order not found |
| ORDER_NUMBER_EXISTS | 409 | Order number already exists |
| ORDER_STATUS_INVALID | 422 | Invalid order status transition |
| ORDER_CANNOT_CANCEL | 422 | Order cannot be cancelled at this stage |
| ORDER_CANNOT_MODIFY | 422 | Order cannot be modified at this stage |
| ORDER_ALREADY_PAID | 422 | Order has already been paid |
| ORDER_TOTAL_MISMATCH | 422 | Order total does not match items total |
| ORDER_ITEM_NOT_FOUND | 404 | Order item not found |

---

## 12. Payment Errors

| Code | Status | Message |
|------|--------|---------|
| PAYMENT_NOT_FOUND | 404 | Payment not found |
| PAYMENT_FAILED | 422 | Payment processing failed |
| PAYMENT_ALREADY_COMPLETED | 422 | Payment has already been completed |
| PAYMENT_AMOUNT_MISMATCH | 422 | Payment amount does not match order total |
| PAYMENT_METHOD_INVALID | 422 | Invalid payment method |
| PAYMENT_METHOD_NOT_FOUND | 404 | Payment method not found |
| PAYMENT_REFUND_EXCEEDS | 422 | Refund amount exceeds payment amount |
| PAYMENT_IDEMPOTENCY_CONFLICT | 409 | Payment with same idempotency key exists |

---

## 13. Cart Errors

| Code | Status | Message |
|------|--------|---------|
| CART_NOT_FOUND | 404 | Cart not found |
| CART_EMPTY | 422 | Cart is empty |
| CART_ITEM_NOT_FOUND | 404 | Cart item not found |
| CART_ITEM_DUPLICATE | 409 | Product already in cart |
| CART_ITEM_QUANTITY_INVALID | 422 | Invalid quantity |
| CART_ITEM_OUT_OF_STOCK | 422 | Product is out of stock |
| CART_ITEM_INSUFFICIENT_STOCK | 422 | Insufficient stock available |
| CART_EXPIRED | 422 | Cart has expired |

---

## 14. Coupon Errors

| Code | Status | Message |
|------|--------|---------|
| COUPON_NOT_FOUND | 404 | Coupon not found |
| COUPON_CODE_EXISTS | 409 | Coupon code already exists |
| COUPON_INVALID | 422 | Invalid coupon code |
| COUPON_EXPIRED | 422 | Coupon has expired |
| COUPON_NOT_ACTIVE | 422 | Coupon is not active |
| COUPON_USAGE_LIMIT | 422 | Coupon usage limit reached |
| COUPON_USER_USAGE_LIMIT | 422 | User coupon usage limit reached |
| COUPON_MIN_ORDER_NOT_MET | 422 | Order does not meet minimum amount |
| COUPON_PRODUCT_NOT_IN_LIST | 422 | Product not eligible for this coupon |

---

## 15. Review Errors

| Code | Status | Message |
|------|--------|---------|
| REVIEW_NOT_FOUND | 404 | Review not found |
| REVIEW_ALREADY_EXISTS | 409 | You have already reviewed this product |
| REVIEW_CANNOT_REVIEW_OWN | 422 | Cannot review your own product |
| REVIEW_PURCHASE_REQUIRED | 422 | Purchase required to review |
| REVIEW_INVALID_RATING | 422 | Rating must be between 1 and 5 |
| REVIEW_NOT_APPROVED | 422 | Review has not been approved |

---

## 16. Wishlist Errors

| Code | Status | Message |
|------|--------|---------|
| WISHLIST_NOT_FOUND | 404 | Wishlist not found |
| WISHLIST_ITEM_NOT_FOUND | 404 | Wishlist item not found |
| WISHLIST_ITEM_EXISTS | 409 | Product already in wishlist |
| WISHLIST_LIMIT | 422 | Wishlist has reached maximum items |
| WISHLIST_NOT_PUBLIC | 404 | Wishlist is not public |

---

## 17. Shipping Errors

| Code | Status | Message |
|------|--------|---------|
| SHIPPING_METHOD_NOT_FOUND | 404 | Shipping method not found |
| SHIPPING_RATE_NOT_FOUND | 404 | Shipping rate not found |
| SHIPMENT_NOT_FOUND | 404 | Shipment not found |
| SHIPMENT_STATUS_INVALID | 422 | Invalid shipment status transition |
| SHIPMENT_TRACKING_INVALID | 422 | Invalid tracking number |
| CARRIER_NOT_FOUND | 404 | Carrier not found |

---

## 18. Media Errors

| Code | Status | Message |
|------|--------|---------|
| MEDIA_NOT_FOUND | 404 | Media file not found |
| MEDIA_UPLOAD_FAILED | 500 | File upload failed |
| MEDIA_FILE_TOO_LARGE | 413 | File size exceeds limit |
| MEDIA_FILE_TYPE_INVALID | 415 | File type not supported |
| MEDIA_FOLDER_NOT_FOUND | 404 | Folder not found |
| MEDIA_FOLDER_HAS_FILES | 422 | Folder is not empty |
| MEDIA_FOLDER_MAX_DEPTH | 422 | Maximum folder depth exceeded |

---

## 19. CMS Errors

| Code | Status | Message |
|------|--------|---------|
| PAGE_NOT_FOUND | 404 | Page not found |
| PAGE_SLUG_EXISTS | 409 | Page slug already exists |
| BLOG_POST_NOT_FOUND | 404 | Blog post not found |
| BLOG_POST_SLUG_EXISTS | 409 | Blog post slug already exists |
| BANNER_NOT_FOUND | 404 | Banner not found |
| BANNER_SLOT_INVALID | 422 | Invalid banner slot |

---

## 20. Notification Errors

| Code | Status | Message |
|------|--------|---------|
| NOTIFICATION_NOT_FOUND | 404 | Notification not found |
| NOTIFICATION_TEMPLATE_NOT_FOUND | 404 | Notification template not found |
| NOTIFICATION_SEND_FAILED | 500 | Failed to send notification |
| NOTIFICATION_CHANNEL_INVALID | 422 | Invalid notification channel |

---

## 21. Inventory Errors

| Code | Status | Message |
|------|--------|---------|
| INVENTORY_NOT_FOUND | 404 | Inventory record not found |
| INVENTORY_ALREADY_EXISTS | 409 | Inventory record already exists |
| INVENTORY_QUANTITY_INVALID | 422 | Invalid quantity |
| INVENTORY_INSUFFICIENT_STOCK | 422 | Insufficient stock available |
| INVENTORY_RESERVATION_FAILED | 422 | Failed to reserve stock |
| INVENTORY_RESERVATION_EXPIRED | 422 | Stock reservation has expired |

---

## 22. System Errors

| Code | Status | Message |
|------|--------|---------|
| SYSTEM_ERROR | 500 | Internal server error |
| SYSTEM_MAINTENANCE | 503 | System is under maintenance |
| SYSTEM_RATE_LIMITED | 429 | Too many requests |
| SYSTEM_INVALID_REQUEST | 400 | Invalid request |
| SYSTEM_INVALID_TOKEN | 401 | Invalid or expired token |
| SYSTEM_DATABASE_ERROR | 500 | Database error occurred |
| SYSTEM_CACHE_ERROR | 500 | Cache error occurred |
| SYSTEM_EXTERNAL_SERVICE_ERROR | 502 | External service error |

---

## 23. Search Errors

| Code | Status | Message |
|------|--------|---------|
| SEARCH_QUERY_INVALID | 400 | Invalid search query |
| SEARCH_INDEX_ERROR | 500 | Search index error |
| SEARCH_TIMEOUT | 504 | Search request timed out |

---

## 24. File Storage Errors

| Code | Status | Message |
|------|--------|---------|
| STORAGE_UPLOAD_FAILED | 500 | File upload to storage failed |
| STORAGE_FILE_NOT_FOUND | 404 | File not found in storage |
| STORAGE_FILE_TOO_LARGE | 413 | File size exceeds storage limit |
| STORAGE_INVALID_TYPE | 415 | File type not allowed |
| STORAGE_QUOTA_EXCEEDED | 507 | Storage quota exceeded |
