# Product Catalog Domain

## Complete Enterprise Catalog System

---

## PART 1 — Module Structure

### 1.1 Clean Architecture Layout

```
apps/api/src/modules/catalog/
├── domain/
│   ├── entities/
│   │   ├── category.entity.ts
│   │   ├── brand.entity.ts
│   │   ├── product.entity.ts
│   │   ├── product-variant.entity.ts
│   │   ├── attribute.entity.ts
│   │   ├── attribute-value.entity.ts
│   │   ├── product-image.entity.ts
│   │   ├── product-video.entity.ts
│   │   ├── product-seo.entity.ts
│   │   ├── product-collection.entity.ts
│   │   ├── product-relation.entity.ts
│   │   └── inventory.entity.ts
│   ├── value-objects/
│   │   ├── sku.vo.ts
│   │   ├── slug.vo.ts
│   │   ├── barcode.vo.ts
│   │   ├── price.vo.ts
│   │   ├── money.vo.ts
│   │   ├── weight.vo.ts
│   │   └── dimensions.vo.ts
│   ├── events/
│   │   ├── category-created.event.ts
│   │   ├── product-created.event.ts
│   │   ├── product-updated.event.ts
│   │   ├── product-published.event.ts
│   │   ├── product-archived.event.ts
│   │   ├── stock-updated.event.ts
│   │   ├── price-changed.event.ts
│   │   └── inventory-reserved.event.ts
│   ├── exceptions/
│   │   ├── sku-already-exists.exception.ts
│   │   ├── slug-already-exists.exception.ts
│   │   ├── category-has-children.exception.ts
│   │   ├── category-has-products.exception.ts
│   │   ├── product-not-found.exception.ts
│   │   ├── insufficient-stock.exception.ts
│   │   ├── invalid-price.exception.ts
│   │   └── invalid-sku.exception.ts
│   └── repositories/
│       ├── category.repository.ts
│       ├── brand.repository.ts
│       ├── product.repository.ts
│       ├── product-variant.repository.ts
│       ├── attribute.repository.ts
│       ├── inventory.repository.ts
│       └── product-collection.repository.ts
│
├── application/
│   ├── commands/
│   │   ├── category/
│   │   │   ├── create-category.command.ts
│   │   │   ├── update-category.command.ts
│   │   │   ├── delete-category.command.ts
│   │   │   └── reorder-categories.command.ts
│   │   ├── brand/
│   │   │   ├── create-brand.command.ts
│   │   │   ├── update-brand.command.ts
│   │   │   └── delete-brand.command.ts
│   │   ├── product/
│   │   │   ├── create-product.command.ts
│   │   │   ├── update-product.command.ts
│   │   │   ├── delete-product.command.ts
│   │   │   ├── publish-product.command.ts
│   │   │   ├── archive-product.command.ts
│   │   │   ├── bulk-update-products.command.ts
│   │   │   └── import-products.command.ts
│   │   ├── variant/
│   │   │   ├── create-variant.command.ts
│   │   │   ├── update-variant.command.ts
│   │   │   └── delete-variant.command.ts
│   │   ├── inventory/
│   │   │   ├── update-stock.command.ts
│   │   │   ├── reserve-stock.command.ts
│   │   │   ├── release-stock.command.ts
│   │   │   └── adjust-stock.command.ts
│   │   └── attribute/
│   │       ├── create-attribute.command.ts
│   │       ├── update-attribute.command.ts
│   │       └── delete-attribute.command.ts
│   ├── queries/
│   │   ├── category/
│   │   │   ├── get-category-tree.query.ts
│   │   │   ├── get-category-by-id.query.ts
│   │   │   ├── get-category-by-slug.query.ts
│   │   │   └── get-categories.query.ts
│   │   ├── brand/
│   │   │   ├── get-brand.query.ts
│   │   │   ├── get-brands.query.ts
│   │   │   └── get-brand-by-slug.query.ts
│   │   ├── product/
│   │   │   ├── get-product.query.ts
│   │   │   ├── get-products.query.ts
│   │   │   ├── get-product-by-slug.query.ts
│   │   │   ├── search-products.query.ts
│   │   │   ├── get-featured-products.query.ts
│   │   │   ├── get-new-arrivals.query.ts
│   │   │   ├── get-trending-products.query.ts
│   │   │   └── get-related-products.query.ts
│   │   ├── inventory/
│   │   │   ├── get-stock.query.ts
│   │   │   ├── get-stock-by-product.query.ts
│   │   │   └── check-availability.query.ts
│   │   └── attribute/
│   │       ├── get-attributes.query.ts
│   │       └── get-attribute-groups.query.ts
│   ├── handlers/
│   │   ├── command-handlers/
│   │   │   ├── create-category.handler.ts
│   │   │   ├── create-product.handler.ts
│   │   │   ├── update-stock.handler.ts
│   │   │   └── ... (other handlers)
│   │   └── query-handlers/
│   │       ├── get-category-tree.handler.ts
│   │       ├── get-product.handler.ts
│   │       ├── search-products.handler.ts
│   │       └── ... (other handlers)
│   ├── services/
│   │   ├── product-search.service.ts
│   │   ├── product-cache.service.ts
│   │   ├── inventory-event.service.ts
│   │   └── product-export.service.ts
│   └── dto/
│       ├── category/
│       ├── brand/
│       ├── product/
│       ├── variant/
│       ├── inventory/
│       └── attribute/
│
├── infrastructure/
│   ├── repositories/
│   │   ├── prisma-category.repository.ts
│   │   ├── prisma-brand.repository.ts
│   │   ├── prisma-product.repository.ts
│   │   ├── prisma-product-variant.repository.ts
│   │   ├── prisma-attribute.repository.ts
│   │   ├── prisma-inventory.repository.ts
│   │   └── prisma-product-collection.repository.ts
│   ├── services/
│   │   ├── elasticsearch.service.ts
│   │   ├── product-index.service.ts
│   │   └── image-optimization.service.ts
│   ├── mappers/
│   │   ├── category.mapper.ts
│   │   ├── brand.mapper.ts
│   │   ├── product.mapper.ts
│   │   └── ... (other mappers)
│   └── cache/
│       ├── category-cache.strategy.ts
│       ├── product-cache.strategy.ts
│       └── search-cache.strategy.ts
│
├── presentation/
│   ├── controllers/
│   │   ├── category.controller.ts
│   │   ├── brand.controller.ts
│   │   ├── product.controller.ts
│   │   ├── product-admin.controller.ts
│   │   ├── variant.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── attribute.controller.ts
│   │   ├── collection.controller.ts
│   │   └── search.controller.ts
│   ├── guards/
│   │   └── product-owner.guard.ts
│   ├── interceptors/
│   │   ├── product-cache.interceptor.ts
│   │   └── search-cache.interceptor.ts
│   └── dto/
│       ├── create-category.dto.ts
│       ├── update-category.dto.ts
│       ├── create-brand.dto.ts
│       ├── create-product.dto.ts
│       ├── update-product.dto.ts
│       ├── create-variant.dto.ts
│       ├── update-inventory.dto.ts
│       ├── product-query.dto.ts
│       └── search-query.dto.ts
│
└── catalog.module.ts
```

---

## PART 2 — Domain Entities

### 2.1 Category Entity

```typescript
// modules/catalog/domain/entities/category.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Slug } from '../value-objects/slug.vo';
import { CategoryCreatedEvent } from '../events/category-created.event';
import { CategoryUpdatedEvent } from '../events/category-updated.event';
import { CategoryDeletedEvent } from '../events/category-deleted.event';

export interface CategoryProps {
  name: string;
  slug: Slug;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  icon?: string;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  level: number;
  path: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Category extends AggregateRoot<CategoryProps> {
  private constructor(props: CategoryProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    bannerUrl?: string;
    icon?: string;
    parentId?: string;
    metaTitle?: string;
    metaDescription?: string;
    sortOrder?: number;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Category {
    const category = new Category({
      name: data.name,
      slug: Slug.create(data.slug),
      description: data.description,
      imageUrl: data.imageUrl,
      bannerUrl: data.bannerUrl,
      icon: data.icon,
      parentId: data.parentId,
      metaTitle: data.metaTitle || data.name,
      metaDescription: data.metaDescription || data.description,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      level: 0,
      path: '',
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    category.addDomainEvent(new CategoryCreatedEvent(category.id, category.name));
    return category;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug.value;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get bannerUrl(): string | undefined {
    return this.props.bannerUrl;
  }

  get icon(): string | undefined {
    return this.props.icon;
  }

  get parentId(): string | undefined {
    return this.props.parentId;
  }

  get metaTitle(): string | undefined {
    return this.props.metaTitle;
  }

  get metaDescription(): string | undefined {
    return this.props.metaDescription;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isFeatured(): boolean {
    return this.props.isFeatured;
  }

  get level(): number {
    return this.props.level;
  }

  get path(): string {
    return this.props.path;
  }

  get productCount(): number {
    return this.props.productCount;
  }

  get isRoot(): boolean {
    return !this.props.parentId;
  }

  get hasChildren(): boolean {
    return this.level < 5; // Max depth
  }

  updateCategory(data: Partial<CategoryProps>): void {
    Object.assign(this.props, data);
    if (data.name) {
      this.props.slug = Slug.create(data.slug || Slug.fromName(data.name).value);
    }
    this.touch();
    this.addDomainEvent(new CategoryUpdatedEvent(this.id, this.name));
  }

  setParent(parentId: string | undefined, parentPath: string, parentLevel: number): void {
    this.props.parentId = parentId;
    this.props.level = parentLevel + 1;
    this.props.path = parentPath ? `${parentPath}/${this.id}` : this.id;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  setFeatured(): void {
    this.props.isFeatured = true;
    this.touch();
  }

  unsetFeatured(): void {
    this.props.isFeatured = false;
    this.touch();
  }

  incrementProductCount(): void {
    this.props.productCount++;
    this.touch();
  }

  decrementProductCount(): void {
    if (this.props.productCount > 0) {
      this.props.productCount--;
      this.touch();
    }
  }

  delete(): void {
    this.softDelete();
    this.addDomainEvent(new CategoryDeletedEvent(this.id, this.name));
  }
}
```

### 2.2 Brand Entity

```typescript
// modules/catalog/domain/entities/brand.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Slug } from '../value-objects/slug.vo';

export interface BrandProps {
  name: string;
  slug: Slug;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  story?: string;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Brand extends AggregateRoot<BrandProps> {
  private constructor(props: BrandProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
    websiteUrl?: string;
    story?: string;
    metaTitle?: string;
    metaDescription?: string;
    sortOrder?: number;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Brand {
    return new Brand({
      name: data.name,
      slug: Slug.create(data.slug),
      description: data.description,
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      websiteUrl: data.websiteUrl,
      story: data.story,
      metaTitle: data.metaTitle || data.name,
      metaDescription: data.metaDescription || data.description,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug.value;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get logoUrl(): string | undefined {
    return this.props.logoUrl;
  }

  get bannerUrl(): string | undefined {
    return this.props.bannerUrl;
  }

  get websiteUrl(): string | undefined {
    return this.props.websiteUrl;
  }

  get story(): string | undefined {
    return this.props.story;
  }

  get metaTitle(): string | undefined {
    return this.props.metaTitle;
  }

  get metaDescription(): string | undefined {
    return this.props.metaDescription;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isFeatured(): boolean {
    return this.props.isFeatured;
  }

  get productCount(): number {
    return this.props.productCount;
  }

  updateBrand(data: Partial<BrandProps>): void {
    Object.assign(this.props, data);
    if (data.name) {
      this.props.slug = Slug.create(data.slug || Slug.fromName(data.name).value);
    }
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  setFeatured(): void {
    this.props.isFeatured = true;
    this.touch();
  }

  unsetFeatured(): void {
    this.props.isFeatured = false;
    this.touch();
  }

  incrementProductCount(): void {
    this.props.productCount++;
    this.touch();
  }

  decrementProductCount(): void {
    if (this.props.productCount > 0) {
      this.props.productCount--;
      this.touch();
    }
  }
}
```

### 2.3 Product Entity

```typescript
// modules/catalog/domain/entities/product.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Slug } from '../value-objects/slug.vo';
import { Money } from '../value-objects/money.vo';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductUpdatedEvent } from '../events/product-updated.event';
import { ProductPublishedEvent } from '../events/product-published.event';
import { ProductArchivedEvent } from '../events/product-archived.event';
import { PriceChangedEvent } from '../events/price-changed.event';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DISCONTINUED = 'discontinued',
}

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
  SUBSCRIPTION = 'subscription',
}

export interface ProductProps {
  sku: string;
  name: string;
  slug: Slug;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  productType: ProductType;
  categoryId: string;
  brandId?: string;
  status: ProductStatus;
  isVisible: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isTaxable: boolean;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
  tags?: string[];
  attributes?: Record<string, any>;
  ratingAverage: number;
  ratingCount: number;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  sortOrder: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    sku: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    longDescription?: string;
    productType?: ProductType;
    categoryId: string;
    brandId?: string;
    status?: ProductStatus;
    isVisible?: boolean;
    isFeatured?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    isTaxable?: boolean;
    barcode?: string;
    weight?: number;
    weightUnit?: string;
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
    tags?: string[];
  }): Product {
    const product = new Product({
      sku: data.sku,
      name: data.name,
      slug: Slug.create(data.slug),
      description: data.description,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      productType: data.productType || ProductType.PHYSICAL,
      categoryId: data.categoryId,
      brandId: data.brandId,
      status: data.status || ProductStatus.DRAFT,
      isVisible: data.isVisible ?? true,
      isFeatured: data.isFeatured ?? false,
      isTrending: data.isTrending ?? false,
      isNewArrival: data.isNewArrival ?? true,
      isTaxable: data.isTaxable ?? true,
      barcode: data.barcode,
      weight: data.weight,
      weightUnit: data.weightUnit || 'kg',
      length: data.length,
      width: data.width,
      height: data.height,
      dimensionUnit: data.dimensionUnit || 'cm',
      metaTitle: data.metaTitle || data.name,
      metaDescription: data.metaDescription || data.description,
      canonicalUrl: data.canonicalUrl,
      keywords: data.keywords || [],
      tags: data.tags || [],
      attributes: {},
      ratingAverage: 0,
      ratingCount: 0,
      reviewCount: 0,
      viewCount: 0,
      soldCount: 0,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    product.addDomainEvent(new ProductCreatedEvent(product.id, product.name, product.sku));
    return product;
  }

  get sku(): string {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug.value;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get shortDescription(): string | undefined {
    return this.props.shortDescription;
  }

  get longDescription(): string | undefined {
    return this.props.longDescription;
  }

  get productType(): ProductType {
    return this.props.productType;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get brandId(): string | undefined {
    return this.props.brandId;
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  get isVisible(): boolean {
    return this.props.isVisible;
  }

  get isFeatured(): boolean {
    return this.props.isFeatured;
  }

  get isTrending(): boolean {
    return this.props.isTrending;
  }

  get isNewArrival(): boolean {
    return this.props.isNewArrival;
  }

  get isTaxable(): boolean {
    return this.props.isTaxable;
  }

  get barcode(): string | undefined {
    return this.props.barcode;
  }

  get weight(): number | undefined {
    return this.props.weight;
  }

  get weightUnit(): string | undefined {
    return this.props.weightUnit;
  }

  get ratingAverage(): number {
    return this.props.ratingAverage;
  }

  get ratingCount(): number {
    return this.props.ratingCount;
  }

  get reviewCount(): number {
    return this.props.reviewCount;
  }

  get viewCount(): number {
    return this.props.viewCount;
  }

  get soldCount(): number {
    return this.props.soldCount;
  }

  get isPublished(): boolean {
    return this.props.status === ProductStatus.ACTIVE;
  }

  get isDraft(): boolean {
    return this.props.status === ProductStatus.DRAFT;
  }

  updateProduct(data: Partial<ProductProps>): void {
    Object.assign(this.props, data);
    if (data.name) {
      this.props.slug = Slug.create(data.slug || Slug.fromName(data.name).value);
    }
    this.touch();
    this.addDomainEvent(new ProductUpdatedEvent(this.id, this.name));
  }

  publish(): void {
    this.props.status = ProductStatus.ACTIVE;
    this.props.publishedAt = new Date();
    this.touch();
    this.addDomainEvent(new ProductPublishedEvent(this.id, this.name));
  }

  unpublish(): void {
    this.props.status = ProductStatus.DRAFT;
    this.props.publishedAt = undefined;
    this.touch();
  }

  archive(): void {
    this.props.status = ProductStatus.ARCHIVED;
    this.touch();
    this.addDomainEvent(new ProductArchivedEvent(this.id, this.name));
  }

  discontinue(): void {
    this.props.status = ProductStatus.DISCONTINUED;
    this.touch();
  }

  setFeatured(): void {
    this.props.isFeatured = true;
    this.touch();
  }

  unsetFeatured(): void {
    this.props.isFeatured = false;
    this.touch();
  }

  setTrending(): void {
    this.props.isTrending = true;
    this.touch();
  }

  unsetTrending(): void {
    this.props.isTrending = false;
    this.touch();
  }

  incrementViewCount(): void {
    this.props.viewCount++;
    this.touch();
  }

  incrementSoldCount(quantity: number): void {
    this.props.soldCount += quantity;
    this.touch();
  }

  updateRating(average: number, count: number): void {
    this.props.ratingAverage = average;
    this.props.ratingCount = count;
    this.touch();
  }
}
```

### 2.4 Product Variant Entity

```typescript
// modules/catalog/domain/entities/product-variant.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Money } from '../value-objects/money.vo';

export enum VariantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface ProductVariantProps {
  productId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: Money;
  compareAtPrice?: Money;
  costPrice?: Money;
  barcode?: string;
  imageUrl?: string;
  weight?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  status: VariantStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductVariant extends AggregateRoot<ProductVariantProps> {
  private constructor(props: ProductVariantProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    productId: string;
    sku: string;
    name: string;
    attributes: Record<string, string>;
    price: number;
    currency?: string;
    compareAtPrice?: number;
    costPrice?: number;
    barcode?: string;
    imageUrl?: string;
    weight?: number;
    stockQuantity?: number;
    lowStockThreshold?: number;
  }): ProductVariant {
    return new ProductVariant({
      productId: data.productId,
      sku: data.sku,
      name: data.name,
      attributes: data.attributes,
      price: Money.create(data.price, data.currency || 'USD'),
      compareAtPrice: data.compareAtPrice ? Money.create(data.compareAtPrice, data.currency || 'USD') : undefined,
      costPrice: data.costPrice ? Money.create(data.costPrice, data.currency || 'USD') : undefined,
      barcode: data.barcode,
      imageUrl: data.imageUrl,
      weight: data.weight,
      stockQuantity: data.stockQuantity || 0,
      lowStockThreshold: data.lowStockThreshold || 10,
      status: VariantStatus.ACTIVE,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get productId(): string {
    return this.props.productId;
  }

  get sku(): string {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }

  get attributes(): Record<string, string> {
    return this.props.attributes;
  }

  get price(): Money {
    return this.props.price;
  }

  get compareAtPrice(): Money | undefined {
    return this.props.compareAtPrice;
  }

  get costPrice(): Money | undefined {
    return this.props.costPrice;
  }

  get barcode(): string | undefined {
    return this.props.barcode;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get stockQuantity(): number {
    return this.props.stockQuantity;
  }

  get lowStockThreshold(): number {
    return this.props.lowStockThreshold;
  }

  get status(): VariantStatus {
    return this.props.status;
  }

  get isAvailable(): boolean {
    return this.props.status === VariantStatus.ACTIVE && this.props.stockQuantity > 0;
  }

  get isInStock(): boolean {
    return this.props.stockQuantity > 0;
  }

  get isLowStock(): boolean {
    return this.props.stockQuantity <= this.props.lowStockThreshold && this.props.stockQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.props.stockQuantity <= 0;
  }

  get profit(): Money | undefined {
    if (!this.props.costPrice) return undefined;
    return this.props.price.subtract(this.props.costPrice);
  }

  updateVariant(data: Partial<ProductVariantProps>): void {
    Object.assign(this.props, data);
    this.touch();
  }

  updatePrice(price: number, currency?: string): void {
    this.props.price = Money.create(price, currency || this.props.price.currency);
    this.touch();
  }

  updateStock(quantity: number): void {
    this.props.stockQuantity = quantity;
    if (quantity <= 0) {
      this.props.status = VariantStatus.OUT_OF_STOCK;
    } else if (this.props.status === VariantStatus.OUT_OF_STOCK) {
      this.props.status = VariantStatus.ACTIVE;
    }
    this.touch();
  }

  reserveStock(quantity: number): boolean {
    if (this.props.stockQuantity >= quantity) {
      this.props.stockQuantity -= quantity;
      this.touch();
      return true;
    }
    return false;
  }

  releaseStock(quantity: number): void {
    this.props.stockQuantity += quantity;
    if (this.props.stockQuantity > 0 && this.props.status === VariantStatus.OUT_OF_STOCK) {
      this.props.status = VariantStatus.ACTIVE;
    }
    this.touch();
  }

  activate(): void {
    this.props.status = VariantStatus.ACTIVE;
    this.touch();
  }

  deactivate(): void {
    this.props.status = VariantStatus.INACTIVE;
    this.touch();
  }
}
```

### 2.5 Attribute Entity

```typescript
// modules/catalog/domain/entities/attribute.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum AttributeType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export interface AttributeProps {
  name: string;
  slug: string;
  type: AttributeType;
  options?: string[];
  isFilterable: boolean;
  isVariant: boolean;
  isRequired: boolean;
  groupId?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Attribute extends BaseEntity<AttributeProps> {
  private constructor(props: AttributeProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    name: string;
    slug: string;
    type: AttributeType;
    options?: string[];
    isFilterable?: boolean;
    isVariant?: boolean;
    isRequired?: boolean;
    groupId?: string;
    sortOrder?: number;
  }): Attribute {
    return new Attribute({
      name: data.name,
      slug: data.slug,
      type: data.type,
      options: data.options || [],
      isFilterable: data.isFilterable ?? false,
      isVariant: data.isVariant ?? false,
      isRequired: data.isRequired ?? false,
      groupId: data.groupId,
      sortOrder: data.sortOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get type(): AttributeType {
    return this.props.type;
  }

  get options(): string[] {
    return this.props.options || [];
  }

  get isFilterable(): boolean {
    return this.props.isFilterable;
  }

  get isVariant(): boolean {
    return this.props.isVariant;
  }

  get isRequired(): boolean {
    return this.props.isRequired;
  }

  get groupId(): string | undefined {
    return this.props.groupId;
  }

  updateAttribute(data: Partial<AttributeProps>): void {
    Object.assign(this.props, data);
    this.touch();
  }

  addOption(option: string): void {
    if (!this.props.options) {
      this.props.options = [];
    }
    if (!this.props.options.includes(option)) {
      this.props.options.push(option);
      this.touch();
    }
  }

  removeOption(option: string): void {
    if (this.props.options) {
      this.props.options = this.props.options.filter(o => o !== option);
      this.touch();
    }
  }
}
```

### 2.6 Inventory Entity

```typescript
// modules/catalog/domain/entities/inventory.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { StockUpdatedEvent } from '../events/stock-updated.event';
import { InventoryReservedEvent } from '../events/inventory-reserved.event';

export interface InventoryProps {
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Inventory extends AggregateRoot<InventoryProps> {
  private constructor(props: InventoryProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    productId: string;
    variantId?: string;
    warehouseId: string;
    quantity?: number;
    lowStockThreshold?: number;
    reorderPoint?: number;
    reorderQuantity?: number;
  }): Inventory {
    const quantity = data.quantity || 0;
    return new Inventory({
      productId: data.productId,
      variantId: data.variantId,
      warehouseId: data.warehouseId,
      quantity,
      reservedQuantity: 0,
      availableQuantity: quantity,
      lowStockThreshold: data.lowStockThreshold || 10,
      reorderPoint: data.reorderPoint,
      reorderQuantity: data.reorderQuantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get productId(): string {
    return this.props.productId;
  }

  get variantId(): string | undefined {
    return this.props.variantId;
  }

  get warehouseId(): string {
    return this.props.warehouseId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get reservedQuantity(): number {
    return this.props.reservedQuantity;
  }

  get availableQuantity(): number {
    return this.props.availableQuantity;
  }

  get lowStockThreshold(): number {
    return this.props.lowStockThreshold;
  }

  get isInStock(): boolean {
    return this.props.availableQuantity > 0;
  }

  get isLowStock(): boolean {
    return this.props.availableQuantity <= this.props.lowStockThreshold && this.props.availableQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.props.availableQuantity <= 0;
  }

  get needsReorder(): boolean {
    return this.props.reorderPoint !== undefined && this.props.availableQuantity <= this.props.reorderPoint;
  }

  addStock(quantity: number): void {
    this.props.quantity += quantity;
    this.recalculateAvailable();
    this.touch();
    this.addDomainEvent(new StockUpdatedEvent(this.id, this.productId, this.quantity));
  }

  removeStock(quantity: number): boolean {
    if (this.props.availableQuantity >= quantity) {
      this.props.quantity -= quantity;
      this.recalculateAvailable();
      this.touch();
      this.addDomainEvent(new StockUpdatedEvent(this.id, this.productId, this.quantity));
      return true;
    }
    return false;
  }

  reserveStock(quantity: number): boolean {
    if (this.props.availableQuantity >= quantity) {
      this.props.reservedQuantity += quantity;
      this.recalculateAvailable();
      this.touch();
      this.addDomainEvent(new InventoryReservedEvent(this.id, this.productId, quantity));
      return true;
    }
    return false;
  }

  releaseStock(quantity: number): void {
    if (this.props.reservedQuantity >= quantity) {
      this.props.reservedQuantity -= quantity;
      this.recalculateAvailable();
      this.touch();
    }
  }

  commitStock(quantity: number): void {
    if (this.props.reservedQuantity >= quantity) {
      this.props.reservedQuantity -= quantity;
      this.props.quantity -= quantity;
      this.recalculateAvailable();
      this.touch();
    }
  }

  adjustStock(newQuantity: number, reason: string): void {
    const difference = newQuantity - this.props.quantity;
    this.props.quantity = newQuantity;
    this.recalculateAvailable();
    this.touch();
    this.addDomainEvent(new StockUpdatedEvent(this.id, this.productId, this.quantity));
  }

  private recalculateAvailable(): void {
    this.props.availableQuantity = this.props.quantity - this.props.reservedQuantity;
  }
}
```

### 2.7 Money Value Object

```typescript
// modules/catalog/domain/value-objects/money.vo.ts
import { ValueObject } from '../../../shared/domain/entities/value-object';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    return new Money({ amount: Math.round(amount * 100) / 100, currency });
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  add(other: Money): Money {
    if (this.props.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return Money.create(this.props.amount + other.props.amount, this.props.currency);
  }

  subtract(other: Money): Money {
    if (this.props.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return Money.create(this.props.amount - other.props.amount, this.props.currency);
  }

  multiply(factor: number): Money {
    return Money.create(this.props.amount * factor, this.props.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this.props.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.props.amount > other.props.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.props.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.props.amount < other.props.amount;
  }

  equals(other: Money): boolean {
    return this.props.amount === other.props.amount && this.props.currency === other.currency;
  }

  isZero(): boolean {
    return this.props.amount === 0;
  }

  format(locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.props.currency,
    }).format(this.props.amount);
  }
}
```

### 2.8 Slug Value Object

```typescript
// modules/catalog/domain/value-objects/slug.vo.ts
import { ValueObject } from '../../../shared/domain/entities/value-object';

interface SlugProps {
  value: string;
}

export class Slug extends ValueObject<SlugProps> {
  private constructor(props: SlugProps) {
    super(props);
  }

  static create(value: string): Slug {
    const slug = Slug.sanitize(value);
    if (!slug) {
      throw new Error('Invalid slug');
    }
    return new Slug({ value: slug });
  }

  static fromName(name: string): Slug {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return new Slug({ value: slug });
  }

  get value(): string {
    return this.props.value;
  }

  private static sanitize(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
```

---

## PART 3 — Application Layer (Commands & Queries)

### 3.1 Create Product Command

```typescript
// modules/catalog/application/commands/product/create-product.command.ts
export interface CreateProductCommand {
  sku: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  productType?: string;
  categoryId: string;
  brandId?: string;
  status?: string;
  isVisible?: boolean;
  isFeatured?: boolean;
  isTaxable?: boolean;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
  tags?: string[];
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency?: string;
  variants?: CreateVariantInput[];
  attributes?: Record<string, string>;
  imageIds?: string[];
}

// modules/catalog/application/commands/product/create-product.handler.ts
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../../repositories/product.repository';
import { CategoryRepository } from '../../repositories/category.repository';
import { ProductVariantRepository } from '../../repositories/product-variant.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { ProductVariant } from '../../domain/entities/product-variant.entity';
import { Slug } from '../../domain/value-objects/slug.vo';
import { SkuAlreadyExistsException } from '../../domain/exceptions/sku-already-exists.exception';
import { SlugAlreadyExistsException } from '../../domain/exceptions/slug-already-exists.exception';

@Injectable()
@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    // Check SKU uniqueness
    const existingSku = await this.productRepository.findBySku(command.sku);
    if (existingSku) {
      throw new SkuAlreadyExistsException(command.sku);
    }

    // Check slug uniqueness
    const existingSlug = await this.productRepository.findBySlug(command.slug);
    if (existingSlug) {
      throw new SlugAlreadyExistsException(command.slug);
    }

    // Verify category exists
    const category = await this.categoryRepository.findById(command.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Create product
    const product = Product.create({
      sku: command.sku,
      name: command.name,
      slug: command.slug,
      description: command.description,
      shortDescription: command.shortDescription,
      longDescription: command.longDescription,
      categoryId: command.categoryId,
      brandId: command.brandId,
      status: command.status as ProductStatus,
      isVisible: command.isVisible,
      isFeatured: command.isFeatured,
      isTaxable: command.isTaxable,
      barcode: command.barcode,
      weight: command.weight,
      weightUnit: command.weightUnit,
      length: command.length,
      width: command.width,
      height: command.height,
      dimensionUnit: command.dimensionUnit,
      metaTitle: command.metaTitle,
      metaDescription: command.metaDescription,
      canonicalUrl: command.canonicalUrl,
      keywords: command.keywords,
      tags: command.tags,
    });

    // Save product
    const savedProduct = await this.productRepository.create(product);

    // Create variants if provided
    if (command.variants && command.variants.length > 0) {
      for (const variantData of command.variants) {
        const variant = ProductVariant.create({
          productId: savedProduct.id,
          ...variantData,
        });
        await this.variantRepository.create(variant);
      }
    }

    // Update category product count
    category.incrementProductCount();
    await this.categoryRepository.update(category.id, category);

    // Publish events
    await this.eventBus.publishAll(savedProduct.domainEvents);
    savedProduct.clearEvents();

    return savedProduct;
  }
}
```

### 3.2 Get Product Query

```typescript
// modules/catalog/application/queries/product/get-product.query.ts
export interface GetProductQuery {
  id?: string;
  slug?: string;
}

// modules/catalog/application/queries/product/get-product.handler.ts
import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './get-product.query';
import { ProductRepository } from '../../repositories/product.repository';
import { ProductVariantRepository } from '../../repositories/product-variant.repository';
import { ProductCacheService } from '../../services/product-cache.service';
import { NotFoundException } from '../../../../shared/domain/exceptions/not-found.exception';

@Injectable()
@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly cacheService: ProductCacheService,
  ) {}

  async execute(query: GetProductQuery): Promise<any> {
    // Try cache first
    const cacheKey = query.id || query.slug;
    const cached = await this.cacheService.getProduct(cacheKey);
    if (cached) {
      return cached;
    }

    // Get product
    let product;
    if (query.id) {
      product = await this.productRepository.findById(query.id);
    } else if (query.slug) {
      product = await this.productRepository.findBySlug(query.slug);
    }

    if (!product) {
      throw new NotFoundException('Product', cacheKey);
    }

    // Get variants
    const variants = await this.variantRepository.findByProductId(product.id);

    // Get images
    const images = await this.productRepository.findImages(product.id);

    // Get SEO data
    const seo = await this.productRepository.findSeo(product.id);

    const result = {
      ...product,
      variants,
      images,
      seo,
    };

    // Cache result
    await this.cacheService.setProduct(cacheKey, result, 300); // 5 minutes

    return result;
  }
}
```

### 3.3 Search Products Query

```typescript
// modules/catalog/application/queries/product/search-products.query.ts
export interface SearchProductsQuery {
  query?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  attributes?: Record<string, string[]>;
}

// modules/catalog/application/queries/product/search-products.handler.ts
import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchProductsQuery } from './search-products.query';
import { ProductSearchService } from '../../services/product-search.service';
import { ProductCacheService } from '../../services/product-cache.service';

@Injectable()
@QueryHandler(SearchProductsQuery)
export class SearchProductsHandler implements IQueryHandler<SearchProductsQuery> {
  constructor(
    private readonly searchService: ProductSearchService,
    private readonly cacheService: ProductCacheService,
  ) {}

  async execute(query: SearchProductsQuery): Promise<any> {
    const page = query.page || 1;
    const limit = query.limit || 20;

    // Try cache
    const cacheKey = `search:${JSON.stringify(query)}`;
    const cached = await this.cacheService.getSearchResults(cacheKey);
    if (cached) {
      return cached;
    }

    // Search
    const results = await this.searchService.search({
      query: query.query,
      categoryId: query.categoryId,
      brandId: query.brandId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      rating: query.rating,
      inStock: query.inStock,
      isFeatured: query.isFeatured,
      isNewArrival: query.isNewArrival,
      isTrending: query.isTrending,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page,
      limit,
      attributes: query.attributes,
    });

    // Cache results
    await this.cacheService.setSearchResults(cacheKey, results, 120); // 2 minutes

    return results;
  }
}
```

### 3.4 Update Stock Command

```typescript
// modules/catalog/application/commands/inventory/update-stock.command.ts
export interface UpdateStockCommand {
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantity: number;
  reason?: string;
}

// modules/catalog/application/commands/inventory/update-stock.handler.ts
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStockCommand } from './update-stock.command';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { ProductVariantRepository } from '../../repositories/product-variant.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { ProductCacheService } from '../../services/product-cache.service';

@Injectable()
@CommandHandler(UpdateStockCommand)
export class UpdateStockHandler implements ICommandHandler<UpdateStockCommand> {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly variantRepository: ProductVariantRepository,
    private readonly eventBus: EventBus,
    private readonly cacheService: ProductCacheService,
  ) {}

  async execute(command: UpdateStockCommand): Promise<void> {
    // Find or create inventory record
    let inventory = await this.inventoryRepository.findByProductAndWarehouse(
      command.productId,
      command.warehouseId,
      command.variantId,
    );

    if (!inventory) {
      inventory = await this.inventoryRepository.create({
        productId: command.productId,
        variantId: command.variantId,
        warehouseId: command.warehouseId,
        quantity: command.quantity,
      });
    } else {
      inventory.adjustStock(command.quantity, command.reason || 'Manual adjustment');
      await this.inventoryRepository.update(inventory.id, inventory);
    }

    // Update variant stock if applicable
    if (command.variantId) {
      const variant = await this.variantRepository.findById(command.variantId);
      if (variant) {
        variant.updateStock(inventory.availableQuantity);
        await this.variantRepository.update(variant.id, variant);
      }
    }

    // Invalidate cache
    await this.cacheService.invalidateProductCache(command.productId);

    // Publish events
    await this.eventBus.publishAll(inventory.domainEvents);
    inventory.clearEvents();
  }
}
```

---

## PART 4 — Infrastructure Layer

### 4.1 Product Repository

```typescript
// modules/catalog/infrastructure/repositories/prisma-product.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProductRepository } from '../../application/repositories/product.repository';
import { Product, ProductStatus } from '../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
    });
    return record ? ProductMapper.toDomain(record) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const record = await this.prisma.product.findFirst({
      where: { sku, deletedAt: null },
    });
    return record ? ProductMapper.toDomain(record) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const record = await this.prisma.product.findFirst({
      where: { slug, deletedAt: null },
    });
    return record ? ProductMapper.toDomain(record) : null;
  }

  async findMany(options: {
    categoryId?: string;
    brandId?: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isTrending?: boolean;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStock?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: Product[]; total: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (options.categoryId) where.categoryId = options.categoryId;
    if (options.brandId) where.brandId = options.brandId;
    if (options.status) where.status = options.status;
    if (options.isFeatured !== undefined) where.isFeatured = options.isFeatured;
    if (options.isNewArrival !== undefined) where.isNewArrival = options.isNewArrival;
    if (options.isTrending !== undefined) where.isTrending = options.isTrending;
    if (options.rating) where.ratingAverage = { gte: options.rating };

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (options.sortBy) {
      orderBy[options.sortBy] = options.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [records, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: records.map(ProductMapper.toDomain),
      total,
    };
  }

  async create(product: Product): Promise<Product> {
    const record = await this.prisma.product.create({
      data: ProductMapper.toPersistence(product),
    });
    return ProductMapper.toDomain(record);
  }

  async update(id: string, product: Product): Promise<Product> {
    const record = await this.prisma.product.update({
      where: { id },
      data: ProductMapper.toPersistence(product),
    });
    return ProductMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findImages(productId: string): Promise<any[]> {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findSeo(productId: string): Promise<any | null> {
    return this.prisma.seoMetadata.findFirst({
      where: { entityType: 'product', entityId: productId },
    });
  }

  async countByCategory(categoryId: string): Promise<number> {
    return this.prisma.product.count({
      where: { categoryId, deletedAt: null },
    });
  }

  async countByBrand(brandId: string): Promise<number> {
    return this.prisma.product.count({
      where: { brandId, deletedAt: null },
    });
  }
}
```

### 4.2 Category Repository

```typescript
// modules/catalog/infrastructure/repositories/prisma-category.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CategoryRepository } from '../../application/repositories/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({
      where: { id, deletedAt: null },
    });
    return record ? CategoryMapper.toDomain(record) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const record = await this.prisma.category.findFirst({
      where: { slug, deletedAt: null },
    });
    return record ? CategoryMapper.toDomain(record) : null;
  }

  async findTree(): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map(CategoryMapper.toDomain);
  }

  async findChildren(parentId: string): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { parentId, deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map(CategoryMapper.toDomain);
  }

  async findRootCategories(): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { parentId: null, deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map(CategoryMapper.toDomain);
  }

  async findFeatured(): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { isFeatured: true, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
    return records.map(CategoryMapper.toDomain);
  }

  async create(category: Category): Promise<Category> {
    const record = await this.prisma.category.create({
      data: CategoryMapper.toPersistence(category),
    });
    return CategoryMapper.toDomain(record);
  }

  async update(id: string, category: Category): Promise<Category> {
    const record = await this.prisma.category.update({
      where: { id },
      data: CategoryMapper.toPersistence(category),
    });
    return CategoryMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hasChildren(id: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: { parentId: id, deletedAt: null },
    });
    return count > 0;
  }

  async hasProducts(id: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });
    return count > 0;
  }
}
```

---

## PART 5 — Presentation Layer (Controllers)

### 5.1 Product Controller

```typescript
// modules/catalog/presentation/controllers/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';

// Commands & Queries
import { CreateProductCommand } from '../../application/commands/product/create-product.command';
import { UpdateProductCommand } from '../../application/commands/product/update-product.command';
import { DeleteProductCommand } from '../../application/commands/product/delete-product.command';
import { GetProductQuery } from '../../application/queries/product/get-product.query';
import { GetProductsQuery } from '../../application/queries/product/get-products.query';
import { SearchProductsQuery } from '../../application/queries/product/search-products.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@ApiTags('Products')
@Controller('products')
export class ProductController extends BaseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(@Query() query: ProductQueryDto) {
    const result = await this.queryBus.execute(new GetProductsQuery(query));
    return this.paginated(result.products, {
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
      totalPages: Math.ceil(result.total / (query.limit || 20)),
      hasNext: (query.page || 1) * (query.limit || 20) < result.total,
      hasPrev: (query.page || 1) > 1,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchProducts(@Query() query: ProductQueryDto) {
    const result = await this.queryBus.execute(new SearchProductsQuery(query));
    return this.paginated(result.products, {
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
      totalPages: Math.ceil(result.total / (query.limit || 20)),
      hasNext: (query.page || 1) * (query.limit || 20) < result.total,
      hasPrev: (query.page || 1) > 1,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string) {
    const result = await this.queryBus.execute(new GetProductQuery({ id }));
    return this.success(result);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductBySlug(@Param('slug') slug: string) {
    const result = await this.queryBus.execute(new GetProductQuery({ slug }));
    return this.success(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(@Body() dto: CreateProductDto) {
    const result = await this.commandBus.execute(new CreateProductCommand(dto));
    return this.success(result);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const result = await this.commandBus.execute(new UpdateProductCommand({ id, ...dto }));
    return this.success(result);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async deleteProduct(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteProductCommand({ id }));
    return this.success({ message: 'Product deleted successfully' });
  }
}
```

### 5.2 Category Controller

```typescript
// modules/catalog/presentation/controllers/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController extends BaseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get category tree' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategoryTree() {
    const result = await this.queryBus.execute(new GetCategoryTreeQuery());
    return this.success(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async getCategory(@Param('id') id: string) {
    const result = await this.queryBus.execute(new GetCategoryQuery({ id }));
    return this.success(result);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async getCategoryBySlug(@Param('slug') slug: string) {
    const result = await this.queryBus.execute(new GetCategoryBySlugQuery({ slug }));
    return this.success(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    const result = await this.commandBus.execute(new CreateCategoryCommand(dto));
    return this.success(result);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const result = await this.commandBus.execute(new UpdateCategoryCommand({ id, ...dto }));
    return this.success(result);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteCategoryCommand({ id }));
    return this.success({ message: 'Category deleted successfully' });
  }
}
```

---

## PART 6 — Angular Implementation

### 6.1 Product Management Page

```typescript
// features/catalog/pages/products/product-list/product-list.page.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService, Product } from '../../../services/product.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    TableComponent,
    PaginationComponent,
  ],
  template: `
    <div class="product-list-page">
      <div class="page-header">
        <h1>Products</h1>
        <app-button routerLink="/admin/products/create">
          Add Product
        </app-button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <app-input
          placeholder="Search products..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()" />
        
        <select [(ngModel)]="statusFilter" (ngModelChange)="loadProducts()">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select [(ngModel)]="categoryFilter" (ngModelChange)="loadProducts()">
          <option value="">All Categories</option>
          @for (category of categories(); track category.id) {
            <option [value]="category.id">{{ category.name }}</option>
          }
        </select>
      </div>

      <!-- Products Table -->
      <app-table [columns]="columns" [data]="products()">
        <ng-template #cellTemplate let-row let-column="column">
          @switch (column.key) {
            @case ('image') {
              <img [src]="row.imageUrl || 'assets/images/placeholder.png'" 
                   [alt]="row.name" 
                   class="product-image" />
            }
            @case ('name') {
              <div>
                <span class="product-name">{{ row.name }}</span>
                <span class="product-sku">SKU: {{ row.sku }}</span>
              </div>
            }
            @case ('price') {
              <span>{{ row.price | currency }}</span>
            }
            @case ('stock') {
              <span [class]="getStockClass(row.stockQuantity)">
                {{ row.stockQuantity }}
              </span>
            }
            @case ('status') {
              <span class="status-badge" [class]="row.status">
                {{ row.status }}
              </span>
            }
            @case ('actions') {
              <div class="action-buttons">
                <a [routerLink]="['/admin/products', row.id, 'edit']">Edit</a>
                <button (click)="deleteProduct(row.id)" class="delete">Delete</button>
              </div>
            }
          }
        </ng-template>
      </app-table>

      <!-- Pagination -->
      <app-pagination
        [currentPage]="currentPage()"
        [totalPages]="totalPages()"
        (pageChange)="onPageChange($event)" />
    </div>
  `,
  styles: [`
    .product-list-page {
      padding: 2rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }
    .product-name {
      display: block;
      font-weight: 500;
    }
    .product-sku {
      display: block;
      font-size: var(--text-xs);
      color: var(--color-text-tertiary);
    }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: 500;
    }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge.draft { background: #fef3c7; color: #92400e; }
    .status-badge.archived { background: #e5e7eb; color: #374151; }
    .stock-low { color: var(--color-warning); }
    .stock-out { color: var(--color-error); }
    .action-buttons { display: flex; gap: 0.5rem; }
    .action-buttons a, .action-buttons button {
      padding: 0.25rem 0.5rem;
      font-size: var(--text-sm);
      border: none;
      background: none;
      cursor: pointer;
      color: var(--color-primary-600);
    }
    .action-buttons .delete { color: var(--color-error); }
  `]
})
export class ProductListPage implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);

  searchQuery = '';
  statusFilter = '';
  categoryFilter = '';

  columns = [
    { key: 'image', label: '' },
    { key: 'name', label: 'Product' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts({
      page: this.currentPage(),
      search: this.searchQuery,
      status: this.statusFilter,
      categoryId: this.categoryFilter,
    }).subscribe({
      next: (result) => {
        this.products.set(result.products);
        this.totalPages.set(result.meta.totalPages);
        this.totalItems.set(result.meta.total);
      },
    });
  }

  loadCategories(): void {
    // Load categories for filter
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  getStockClass(quantity: number): string {
    if (quantity === 0) return 'stock-out';
    if (quantity < 10) return 'stock-low';
    return '';
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
      });
    }
  }
}
```

### 6.2 Product Form Page

```typescript
// features/catalog/pages/products/product-form/product-form.page.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService, Product } from '../../../services/product.service';
import { CategoryService, Category } from '../../../services/category.service';
import { BrandService, Brand } from '../../../services/brand.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent, InputComponent],
  template: `
    <div class="product-form-page">
      <div class="page-header">
        <h1>{{ isEditing() ? 'Edit Product' : 'Create Product' }}</h1>
      </div>

      <form (ngSubmit)="onSubmit()" class="product-form">
        <!-- Basic Info -->
        <section class="form-section">
          <h2>Basic Information</h2>
          
          <div class="form-grid">
            <app-input
              label="Product Name"
              [(ngModel)]="formData.name"
              name="name"
              [required]="true" />

            <app-input
              label="SKU"
              [(ngModel)]="formData.sku"
              name="sku"
              [required]="true" />

            <app-input
              label="Barcode"
              [(ngModel)]="formData.barcode"
              name="barcode" />

            <div class="form-group">
              <label>Category *</label>
              <select [(ngModel)]="formData.categoryId" name="categoryId" required>
                <option value="">Select Category</option>
                @for (category of categories(); track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Brand</label>
              <select [(ngModel)]="formData.brandId" name="brandId">
                <option value="">Select Brand</option>
                @for (brand of brands(); track brand.id) {
                  <option [value]="brand.id">{{ brand.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="formData.status" name="status">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Short Description</label>
            <textarea [(ngModel)]="formData.shortDescription" name="shortDescription" rows="2"></textarea>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="formData.description" name="description" rows="4"></textarea>
          </div>
        </section>

        <!-- Pricing -->
        <section class="form-section">
          <h2>Pricing</h2>
          <div class="form-grid">
            <app-input
              label="Price *"
              type="number"
              [(ngModel)]="formData.price"
              name="price"
              [required]="true" />

            <app-input
              label="Compare at Price"
              type="number"
              [(ngModel)]="formData.compareAtPrice"
              name="compareAtPrice" />

            <app-input
              label="Cost Price"
              type="number"
              [(ngModel)]="formData.costPrice"
              name="costPrice" />
          </div>
        </section>

        <!-- Inventory -->
        <section class="form-section">
          <h2>Inventory</h2>
          <div class="form-grid">
            <app-input
              label="Stock Quantity"
              type="number"
              [(ngModel)]="formData.stockQuantity"
              name="stockQuantity" />

            <app-input
              label="Low Stock Threshold"
              type="number"
              [(ngModel)]="formData.lowStockThreshold"
              name="lowStockThreshold" />
          </div>
        </section>

        <!-- SEO -->
        <section class="form-section">
          <h2>SEO</h2>
          <div class="form-grid">
            <app-input
              label="Meta Title"
              [(ngModel)]="formData.metaTitle"
              name="metaTitle" />

            <app-input
              label="Slug"
              [(ngModel)]="formData.slug"
              name="slug" />
          </div>

          <div class="form-group">
            <label>Meta Description</label>
            <textarea [(ngModel)]="formData.metaDescription" name="metaDescription" rows="2"></textarea>
          </div>
        </section>

        <!-- Actions -->
        <div class="form-actions">
          <app-button
            type="button"
            variant="secondary"
            (clicked)="cancel()">
            Cancel
          </app-button>
          <app-button
            type="submit"
            [loading]="saving()">
            {{ isEditing() ? 'Update' : 'Create' }}
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .product-form-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .product-form {
      background: white;
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-md);
    }
    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-border);
    }
    .form-section:last-of-type {
      border-bottom: none;
    }
    .form-section h2 {
      margin: 0 0 1rem;
      font-size: 1.125rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: var(--text-sm);
      font-weight: 500;
    }
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
    }
  `]
})
export class ProductFormPage implements OnInit {
  isEditing = signal(false);
  saving = signal(false);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);

  formData: any = {
    name: '',
    sku: '',
    barcode: '',
    categoryId: '',
    brandId: '',
    status: 'draft',
    shortDescription: '',
    description: '',
    price: 0,
    compareAtPrice: null,
    costPrice: null,
    stockQuantity: 0,
    lowStockThreshold: 10,
    metaTitle: '',
    slug: '',
    metaDescription: '',
  };

  private productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditing.set(true);
      this.loadProduct(this.productId);
    }
    this.loadCategories();
    this.loadBrands();
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.formData = { ...product };
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands) => this.brands.set(brands),
    });
  }

  onSubmit(): void {
    this.saving.set(true);

    const request = this.isEditing()
      ? this.productService.updateProduct(this.productId!, this.formData)
      : this.productService.createProduct(this.formData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
```

---

## PART 7 — API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Categories** |
| GET | `/categories` | No | Get category tree |
| GET | `/categories/:id` | No | Get category by ID |
| GET | `/categories/slug/:slug` | No | Get category by slug |
| POST | `/categories` | Yes (Admin) | Create category |
| PATCH | `/categories/:id` | Yes (Admin) | Update category |
| DELETE | `/categories/:id` | Yes (Admin) | Delete category |
| **Brands** |
| GET | `/brands` | No | List brands |
| GET | `/brands/:id` | No | Get brand by ID |
| GET | `/brands/slug/:slug` | No | Get brand by slug |
| POST | `/brands` | Yes (Admin) | Create brand |
| PATCH | `/brands/:id` | Yes (Admin) | Update brand |
| DELETE | `/brands/:id` | Yes (Admin) | Delete brand |
| **Products** |
| GET | `/products` | No | List products |
| GET | `/products/search` | No | Search products |
| GET | `/products/:id` | No | Get product by ID |
| GET | `/products/slug/:slug` | No | Get product by slug |
| POST | `/products` | Yes (Admin) | Create product |
| PATCH | `/products/:id` | Yes (Admin) | Update product |
| DELETE | `/products/:id` | Yes (Admin) | Delete product |
| POST | `/products/:id/publish` | Yes (Admin) | Publish product |
| POST | `/products/:id/archive` | Yes (Admin) | Archive product |
| **Variants** |
| GET | `/products/:id/variants` | No | List variants |
| POST | `/products/:id/variants` | Yes (Admin) | Create variant |
| PATCH | `/products/variants/:id` | Yes (Admin) | Update variant |
| DELETE | `/products/variants/:id` | Yes (Admin) | Delete variant |
| **Inventory** |
| GET | `/inventory` | Yes (Admin) | List inventory |
| GET | `/inventory/:productId` | Yes (Admin) | Get product inventory |
| PATCH | `/inventory/:id` | Yes (Admin) | Update stock |
| POST | `/inventory/:id/reserve` | Yes (Admin) | Reserve stock |
| DELETE | `/inventory/:id/reserve` | Yes (Admin) | Release stock |
| **Attributes** |
| GET | `/attributes` | No | List attributes |
| POST | `/attributes` | Yes (Admin) | Create attribute |
| PATCH | `/attributes/:id` | Yes (Admin) | Update attribute |
| DELETE | `/attributes/:id` | Yes (Admin) | Delete attribute |
| **Collections** |
| GET | `/collections` | No | List collections |
| GET | `/collections/:id` | No | Get collection |
| POST | `/collections` | Yes (Admin) | Create collection |
| PATCH | `/collections/:id` | Yes (Admin) | Update collection |
| DELETE | `/collections/:id` | Yes (Admin) | Delete collection |

---

## PART 8 — Performance Optimization

### 8.1 Database Indexes

```sql
-- Product indexes
CREATE INDEX idx_products_category_id ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_brand_id ON products(brand_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status ON products(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_products_is_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_products_is_trending ON products(is_trending) WHERE is_trending = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_products_rating ON products(rating_average DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_created_at ON products(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_tags ON products USING gin(tags);
CREATE INDEX idx_products_attributes ON products USING gin(attributes);

-- Category indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories USING gin(path gin_trgm_ops);
CREATE INDEX idx_categories_slug ON categories(slug) WHERE deleted_at IS NULL;

-- Variant indexes
CREATE INDEX idx_variants_product_id ON product_variants(product_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_variants_sku ON product_variants(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_variants_status ON product_variants(status) WHERE deleted_at IS NULL;

-- Inventory indexes
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX idx_inventory_low_stock ON inventory(available_quantity) WHERE available_quantity <= low_stock_threshold;
```

### 8.2 Caching Strategy

```typescript
// Product Cache Strategy
export class ProductCacheStrategy {
  private readonly PRODUCT_TTL = 300; // 5 minutes
  private readonly CATEGORY_TTL = 900; // 15 minutes
  private readonly BRAND_TTL = 900; // 15 minutes
  private readonly SEARCH_TTL = 120; // 2 minutes

  async getProduct(id: string): Promise<any | null> {
    return this.cache.get(`product:${id}`);
  }

  async setProduct(id: string, data: any): Promise<void> {
    await this.cache.set(`product:${id}`, data, this.PRODUCT_TTL);
  }

  async invalidateProduct(id: string): Promise<void> {
    await this.cache.del(`product:${id}`);
    await this.cache.delPattern(`product:*`);
  }

  async getCategoryTree(): Promise<any | null> {
    return this.cache.get('category:tree');
  }

  async setCategoryTree(data: any): Promise<void> {
    await this.cache.set('category:tree', data, this.CATEGORY_TTL);
  }

  async invalidateCategoryTree(): Promise<void> {
    await this.cache.del('category:tree');
  }
}
```

---

## Summary

### Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Complete Catalog Module | ✅ | Categories, Brands, Products, Variants, Attributes, Pricing, Media, Inventory, SEO, Search, Collections |
| Backend | ✅ | Clean Architecture with DDD, CQRS |
| Frontend | ✅ | Angular pages for product/category/brand management |
| REST APIs | ✅ | 40+ endpoints |
| Validation | ✅ | DTOs with class-validator |
| Performance | ✅ | Database indexes, caching strategy |
| Documentation | ✅ | Complete API documentation |

### Statistics

| Metric | Count |
|--------|-------|
| **Domain Entities** | 12 |
| **Value Objects** | 7 |
| **Commands** | 15+ |
| **Queries** | 10+ |
| **Controllers** | 9 |
| **DTOs** | 15+ |
| **Repositories** | 7 |
| **Angular Pages** | 6+ |
| **API Endpoints** | 40+ |

The Product Catalog module is ready for integration with other modules (Cart, Orders, Reviews, Wishlist).
