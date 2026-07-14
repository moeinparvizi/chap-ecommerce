# SEO Architecture

## 1. SEO Strategy Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SEO Architecture                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Server-Side Rendering                 │   │
│  │  • Next.js App Router (SSR/SSG)                         │   │
│  │  • Dynamic metadata generation                          │   │
│  │  • Structured data injection                            │   │
│  │  • Canonical URL management                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Static Generation                     │   │
│  │  • Category pages (ISR)                                 │   │
│  │  • Blog posts (SSG)                                     │   │
│  │  • CMS pages (SSG)                                      │   │
│  │  • Sitemap generation                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Client-Side Enhancement               │   │
│  │  • Progressive hydration                                │   │
│  │  • Client-side navigation                               │   │
│  │  • Dynamic imports                                      │   │
│  │  • Code splitting                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Next.js Rendering Strategy

| Page Type | Rendering | Revalidation | Priority |
|-----------|-----------|--------------|----------|
| Home | SSG + ISR | 1 hour | Critical |
| Product listing | SSG + ISR | 5 minutes | High |
| Product detail | SSR | On-demand | Critical |
| Category | SSG + ISR | 15 minutes | High |
| Brand | SSG + ISR | 1 hour | Medium |
| Blog listing | SSG + ISR | 1 hour | Medium |
| Blog post | SSG + ISR | 24 hours | Medium |
| CMS pages | SSG + ISR | 1 hour | Low |
| Search results | SSR | Real-time | High |
| Cart | CSR | - | Low |
| Checkout | SSR | Real-time | Critical |
| Account | CSR | - | Low |

---

## 3. Metadata Generation

### Product Pages

```typescript
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const productUrl = `${baseUrl}/products/${product.slug}`;
  
  return {
    title: product.seo?.metaTitle || `${product.name} | ${siteName}`,
    description: product.seo?.metaDescription || product.shortDescription,
    keywords: product.tags,
    
    // OpenGraph
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: productUrl,
      siteName: siteName,
      images: [
        {
          url: product.images[0]?.url,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]?.url],
    },
    
    // Canonical
    alternates: {
      canonical: productUrl,
    },
    
    // Robots
    robots: {
      index: product.status === 'active',
      follow: true,
      googleBot: {
        index: product.status === 'active',
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
```

### Category Pages

```typescript
// app/categories/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  
  return {
    title: category.seo?.metaTitle || `${category.name} | ${siteName}`,
    description: category.seo?.metaDescription || category.description,
    
    openGraph: {
      title: category.name,
      description: category.description,
      url: `${baseUrl}/categories/${category.slug}`,
      images: category.image ? [category.image] : [],
    },
    
    alternates: {
      canonical: `${baseUrl}/categories/${category.slug}`,
    },
  };
}
```

### Blog Posts

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  return {
    title: post.seo?.metaTitle || `${post.title} | ${siteName} Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

---

## 4. Structured Data (JSON-LD)

### Product Schema

```typescript
// components/seo/ProductSchema.tsx
export function ProductSchema({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((img) => img.url),
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: product.price.currency,
      price: product.price.amount,
      availability: product.stock.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: product.rating.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
    } : undefined,
    review: product.reviews?.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user.displayName,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.body,
      datePublished: review.createdAt,
    })),
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### BreadcrumbList Schema

```typescript
// components/seo/BreadcrumbSchema.tsx
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.path}`,
    })),
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Organization Schema

```typescript
// components/seo/OrganizationSchema.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'E-Commerce Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/ecommerce',
      'https://facebook.com/ecommerce',
      'https://instagram.com/ecommerce',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-5555',
      contactType: 'customer service',
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Website Schema with SearchAction

```typescript
// components/seo/WebsiteSchema.tsx
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'E-Commerce Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 5. Canonical URLs

```typescript
// lib/seo/canonical.ts
export function getCanonicalUrl(path: string, locale: string = 'en'): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  return `${baseUrl}${localePrefix}${path}`;
}

// Usage in pages
export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  const canonicalUrl = getCanonicalUrl(`/products/${product.slug}`);
  
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {/* ... */}
    </>
  );
}
```

---

## 6. Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
  
  // Dynamic pages
  const [products, categories, brands, blogPosts] = await Promise.all([
    getAllProductsForSitemap(),
    getAllCategoriesForSitemap(),
    getAllBrandsForSitemap(),
    getAllBlogPostsForSitemap(),
  ]);
  
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...blogPages,
  ];
}
```

---

## 7. Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/orders/',
          '/wishlist/',
          '/search?*q=',  // Search results with query
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/cart/',
          '/checkout/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 8. Page Speed Optimization

### Image Optimization

```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL={generateBlurPlaceholder(src)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
    />
  );
}
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const ProductGallery = dynamic(() => import('@/components/product/ProductGallery'), {
  loading: () => <ProductGallerySkeleton />,
  ssr: false,
});

const ReviewSection = dynamic(() => import('@/components/reviews/ReviewSection'), {
  loading: () => <ReviewSectionSkeleton />,
});

const SearchResults = dynamic(() => import('@/components/search/SearchResults'), {
  loading: () => <SearchResultsSkeleton />,
});
```

---

## 9. Internationalized URLs

```typescript
// app/[locale]/products/[slug]/page.tsx
export function generateStaticParams() {
  const locales = ['en', 'fa'];
  const products = await getAllProducts();
  
  return products.flatMap((product) =>
    locales.map((locale) => ({
      locale,
      slug: product.slug,
    }))
  );
}

// URL structure
// /en/products/nike-air-max
// /fa/products/nike-air-max
```

---

## 10. SEO Monitoring

### Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Core Web Vitals (LCP) | < 2.5s | Lighthouse, CrUX |
| Core Web Vitals (FID) | < 100ms | Lighthouse, CrUX |
| Core Web Vitals (CLS) | < 0.1 | Lighthouse, CrUX |
| Time to First Byte (TTFB) | < 200ms | WebPageTest |
| Index Coverage | > 90% | Google Search Console |
| Crawl Errors | 0 | Google Search Console |
| Mobile Usability | 100% | Google Search Console |
| Structured Data Errors | 0 | Google Search Console |

### Automated Monitoring

```typescript
// lib/seo/monitoring.ts
async function runSeoAudit(): Promise<SeoAuditReport> {
  const pages = await getCriticalPages();
  const results: SeoCheck[] = [];
  
  for (const page of pages) {
    const checks = await Promise.all([
      checkMetadata(page),
      checkStructuredData(page),
      checkCanonicalUrl(page),
      checkOpenGraph(page),
      checkHeadingStructure(page),
      checkImageAltTags(page),
      checkInternalLinks(page),
    ]);
    
    results.push(...checks);
  }
  
  return {
    timestamp: new Date(),
    totalPages: pages.length,
    passedChecks: results.filter((r) => r.passed).length,
    failedChecks: results.filter((r) => !r.passed).length,
    checks: results,
  };
}
```
