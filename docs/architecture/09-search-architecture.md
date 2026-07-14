# Search Architecture

## 1. Elasticsearch Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                   Elasticsearch Cluster                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Node 1    │  │    Node 2    │  │    Node 3    │            │
│  │   (Master)   │  │   (Data)     │  │   (Data)     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  Indices:                                                       │
│  ├── products          (shards: 5, replicas: 2)                │
│  ├── categories        (shards: 2, replicas: 2)                │
│  ├── brands            (shards: 2, replicas: 2)                │
│  ├── blog_posts        (shards: 3, replicas: 2)                │
│  ├── pages             (shards: 2, replicas: 2)                │
│  └── suggestions       (shards: 2, replicas: 2)                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Product Index Mapping

```json
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "product_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "product_synonyms"]
        },
        "autocomplete_analyzer": {
          "type": "custom",
          "tokenizer": "edge_ngram_tokenizer",
          "filter": ["lowercase", "asciifolding"]
        }
      },
      "tokenizer": {
        "edge_ngram_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 15,
          "token_chars": ["letter", "digit"]
        }
      },
      "filter": {
        "product_synonyms": {
          "type": "synonym",
          "synonyms": [
            "sneakers, trainers, running shoes",
            "laptop, notebook, computer",
            "phone, smartphone, mobile"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "sku": { "type": "keyword" },
      "name": {
        "type": "text",
        "analyzer": "product_analyzer",
        "fields": {
          "autocomplete": {
            "type": "text",
            "analyzer": "autocomplete_analyzer",
            "search_analyzer": "standard"
          },
          "keyword": { "type": "keyword" }
        }
      },
      "slug": { "type": "keyword" },
      "description": {
        "type": "text",
        "analyzer": "product_analyzer"
      },
      "shortDescription": {
        "type": "text",
        "analyzer": "product_analyzer"
      },
      "category": {
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "text" },
          "slug": { "type": "keyword" },
          "path": { "type": "keyword" }
        }
      },
      "brand": {
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "text" },
          "slug": { "type": "keyword" }
        }
      },
      "price": {
        "properties": {
          "amount": { "type": "scaled_float", "scaling_factor": 100 },
          "currency": { "type": "keyword" },
          "compareAtPrice": { "type": "scaled_float", "scaling_factor": 100 }
        }
      },
      "variants": {
        "type": "nested",
        "properties": {
          "id": { "type": "keyword" },
          "sku": { "type": "keyword" },
          "name": { "type": "text" },
          "attributes": { "type": "object", "dynamic": true },
          "price": { "type": "scaled_float", "scaling_factor": 100 },
          "stock": { "type": "integer" },
          "isActive": { "type": "boolean" }
        }
      },
      "images": {
        "type": "nested",
        "properties": {
          "url": { "type": "keyword" },
          "alt": { "type": "text" },
          "isPrimary": { "type": "boolean" }
        }
      },
      "stock": {
        "properties": {
          "available": { "type": "integer" },
          "inStock": { "type": "boolean" }
        }
      },
      "rating": {
        "properties": {
          "average": { "type": "float" },
          "count": { "type": "integer" }
        }
      },
      "reviewCount": { "type": "integer" },
      "viewCount": { "type": "integer" },
      "tags": { "type": "keyword" },
      "attributes": { "type": "object", "dynamic": true },
      "status": { "type": "keyword" },
      "isFeatured": { "type": "boolean" },
      "isDigital": { "type": "boolean" },
      "createdAt": { "type": "date" },
      "updatedAt": { "type": "date" }
    }
  }
}
```

---

## 3. Search Features

### Full-Text Search

```typescript
async function searchProducts(query: string, filters: SearchFilters) {
  const must: any[] = [];
  const filter: any[] = [];
  const should: any[] = [];
  
  // Full-text search
  if (query) {
    must.push({
      multi_match: {
        query,
        fields: [
          'name^3',                    // Name is most important
          'name.autocomplete^2',       // Autocomplete matches
          'description',
          'shortDescription',
          'tags^2',
          'brand.name^2',
          'category.name',
          'sku^1.5',
        ],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  }
  
  // Category filter
  if (filters.categoryId) {
    filter.push({ term: { 'category.id': filters.categoryId } });
  }
  
  // Brand filter
  if (filters.brandIds?.length) {
    filter.push({ terms: { 'brand.id': filters.brandIds } });
  }
  
  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    const range: any = {};
    if (filters.minPrice) range.gte = filters.minPrice;
    if (filters.maxPrice) range.lte = filters.maxPrice;
    filter.push({ range: { 'price.amount': range } });
  }
  
  // Rating filter
  if (filters.minRating) {
    filter.push({ range: { 'rating.average': { gte: filters.minRating } } });
  }
  
  // In stock filter
  if (filters.inStock) {
    filter.push({ term: { 'stock.inStock': true } });
  }
  
  // Status filter
  filter.push({ term: { status: 'active' } });
  
  // Execute search
  const result = await esClient.search({
    index: 'products',
    body: {
      query: {
        bool: {
          must,
          filter,
          should,
        },
      },
      highlight: {
        fields: {
          name: {},
          description: {},
        },
      },
      aggs: {
        categories: {
          terms: { field: 'category.id', size: 20 },
        },
        brands: {
          terms: { field: 'brand.id', size: 20 },
        },
        price_ranges: {
          range: {
            field: 'price.amount',
            ranges: [
              { to: 50 },
              { from: 50, to: 100 },
              { from: 100, to: 200 },
              { from: 200 },
            ],
          },
        },
        avg_rating: {
          avg: { field: 'rating.average' },
        },
      },
      sort: getSortClause(filters.sortBy, filters.sortOrder),
      from: (filters.page - 1) * filters.limit,
      size: filters.limit,
    },
  });
  
  return {
    products: result.hits.hits.map((hit) => ({
      ...hit._source,
      score: hit._score,
      highlights: hit.highlight,
    })),
    total: result.hits.total.value,
    facets: {
      categories: result.aggregations.categories.buckets,
      brands: result.aggregations.brands.buckets,
      priceRanges: result.aggregations.price_ranges.buckets,
      avgRating: result.aggregations.avg_rating.value,
    },
  };
}
```

### Autocomplete

```typescript
async function autocomplete(query: string): Promise<string[]> {
  const result = await esClient.search({
    index: 'products',
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'name.autocomplete': {
                  query,
                  operator: 'and',
                },
              },
            },
            { term: { status: 'active' } },
          ],
        },
      },
      _source: ['name'],
      size: 10,
    },
  });
  
  return result.hits.hits.map((hit) => hit._source.name);
}
```

### Search Suggestions

```typescript
async function getSuggestions(query: string): Promise<{
  products: string[];
  categories: string[];
  brands: string[];
}> {
  const [productSuggestions, categorySuggestions, brandSuggestions] = await Promise.all([
    // Product name suggestions
    esClient.search({
      index: 'products',
      body: {
        suggest: {
          product_suggest: {
            prefix: query,
            completion: {
              field: 'name.suggest',
              size: 5,
              fuzzy: { fuzziness: 'AUTO' },
            },
          },
        },
      },
    }),
    
    // Category suggestions
    esClient.search({
      index: 'categories',
      body: {
        query: {
          match: { name: { query, fuzziness: 'AUTO' } },
        },
        size: 3,
        _source: ['name'],
      },
    }),
    
    // Brand suggestions
    esClient.search({
      index: 'brands',
      body: {
        query: {
          match: { name: { query, fuzziness: 'AUTO' } },
        },
        size: 3,
        _source: ['name'],
      },
    }),
  ]);
  
  return {
    products: productSuggestions.suggest.product_suggest[0].options.map(
      (opt) => opt.text,
    ),
    categories: categorySuggestions.hits.hits.map((hit) => hit._source.name),
    brands: brandSuggestions.hits.hits.map((hit) => hit._source.name),
  };
}
```

---

## 4. Index Management

### Reindexing Strategy

```typescript
// Event-driven reindexing
@OnEvent('product.created')
@OnEvent('product.updated')
async handleProductChange(event: ProductEvent) {
  const product = await this.getProductForIndex(event.productId);
  
  await esClient.index({
    index: 'products',
    id: product.id,
    body: product,
  });
}

@OnEvent('product.deleted')
async handleProductDelete(event: ProductDeletedEvent) {
  await esClient.delete({
    index: 'products',
    id: event.productId,
  });
}

// Bulk reindex (for migrations)
async function reindexAllProducts(): Promise<void> {
  const batchSize = 1000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const products = await db.product.findMany({
      skip: offset,
      take: batchSize,
      include: { category: true, brand: true, variants: true, images: true },
    });
    
    if (products.length === 0) {
      hasMore = false;
      break;
    }
    
    const bulkBody = products.flatMap((product) => [
      { index: { _index: 'products', _id: product.id } },
      transformProductForIndex(product),
    ]);
    
    await esClient.bulk({ body: bulkBody });
    
    offset += batchSize;
  }
}
```

### Index Lifecycle

```typescript
// Hot-Warm-Cold architecture
const indexLifecycle = {
  policy: {
    phases: {
      hot: {
        actions: {
          rollover: {
            max_age: '7d',
            max_size: '50gb',
          },
        },
      },
      warm: {
        min_age: '7d',
        actions: {
          shrink: { number_of_shards: 1 },
          forcemerge: { max_num_segments: 1 },
        },
      },
      cold: {
        min_age: '30d',
        actions: {
          freeze: {},
        },
      },
      delete: {
        min_age: '90d',
        actions: {
          delete: {},
        },
      },
    },
  },
};
```

---

## 5. Search Analytics

```typescript
// Track search queries for analytics
interface SearchLog {
  id: string;
  query: string;
  userId?: string;
  resultsCount: number;
  filters: Record<string, unknown>;
  sortBy: string;
  clickedProductId?: string;
  timestamp: Date;
}

async function logSearch(query: string, results: SearchResult, userId?: string) {
  await db.searchLog.create({
    data: {
      query,
      userId,
      resultsCount: results.total,
      filters: results.appliedFilters,
      sortBy: results.sortBy,
      timestamp: new Date(),
    },
  });
  
  // Update search suggestions
  await updateSearchSuggestions(query);
}

async function updateSearchSuggestions(query: string) {
  const key = `search:popular`;
  await redis.zincrby(key, 1, query.toLowerCase());
  
  // Keep only top 1000 suggestions
  await redis.zremrangebyrank(key, 1000, -1);
}
```
