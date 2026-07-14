# File Storage Architecture

## 1. Storage Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    File Storage Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │   Client      │────▶│   API        │────▶│   S3         │   │
│  │   (Browser)   │     │   (Upload)   │     │   (Storage)  │   │
│  └──────────────┘     └──────────────┘     └──────┬───────┘   │
│                                                     │            │
│                                              ┌──────▼───────┐   │
│                                              │   CloudFront  │   │
│                                              │   (CDN)       │   │
│                                              └──────┬───────┘   │
│                                                     │            │
│  ┌──────────────┐     ┌──────────────┐     ┌──────▼───────┐   │
│  │   Client      │◀────│   CDN        │◀────│   Origin     │   │
│  │   (Browser)   │     │   (Cache)    │     │   (S3)       │   │
│  └──────────────┘     └──────────────┘     └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. S3 Bucket Structure

```
ecommerce-assets-{env}/
├── products/
│   ├── {product-id}/
│   │   ├── original/
│   │   │   └── image.jpg
│   │   ├── large/
│   │   │   └── image.jpg
│   │   ├── medium/
│   │   │   └── image.jpg
│   │   ├── small/
│   │   │   └── image.jpg
│   │   └── thumbnail/
│   │       └── image.jpg
│   └── ...
├── categories/
│   └── {category-id}/
│       └── image.jpg
├── brands/
│   └── {brand-id}/
│       └── logo.png
├── users/
│   └── {user-id}/
│       ├── avatar.jpg
│       └── ...
├── cms/
│   ├── pages/
│   │   └── {page-id}/
│   │       └── images/
│   └── blog/
│       └── {post-id}/
│           └── images/
├── banners/
│   └── {banner-id}/
│       ├── desktop.jpg
│       └── mobile.jpg
├── reviews/
│   └── {review-id}/
│       └── images/
├── documents/
│   ├── invoices/
│   └── exports/
└── temp/
    └── {upload-id}/
```

---

## 3. Image Processing Pipeline

### Upload Flow

```typescript
async function uploadMedia(file: Express.Multer.File, options: UploadOptions): Promise<Media> {
  // 1. Validate file
  validateFile(file, options);
  
  // 2. Generate unique filename
  const filename = generateFilename(file.originalname);
  const key = buildStorageKey(options, filename);
  
  // 3. Upload original to S3
  await s3.putObject({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      uploadedBy: options.userId,
      entityType: options.entityType,
      entityId: options.entityId,
    },
  });
  
  // 4. Process image (if applicable)
  let variants: ImageVariant[] = [];
  if (isImage(file.mimetype)) {
    variants = await processImage(key, file.buffer);
  }
  
  // 5. Create media record
  const media = await db.media.create({
    data: {
      filename,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      url: buildPublicUrl(key),
      cdnUrl: buildCdnUrl(key),
      width: variants[0]?.width,
      height: variants[0]?.height,
      folderId: options.folderId,
      uploadedBy: options.userId,
      metadata: {
        originalKey: key,
        variants: variants.map((v) => ({
          variant: v.variant,
          key: v.key,
          url: buildCdnUrl(v.key),
          width: v.width,
          height: v.height,
        })),
      },
    },
  });
  
  return media;
}

async function processImage(key: string, buffer: Buffer): Promise<ImageVariant[]> {
  const variants: ImageVariant[] = [];
  
  const sizes = [
    { name: 'thumbnail', width: 150, height: 150, fit: 'cover' },
    { name: 'small', width: 300, height: 300, fit: 'contain' },
    { name: 'medium', width: 600, height: 600, fit: 'contain' },
    { name: 'large', width: 1200, height: 1200, fit: 'contain' },
  ];
  
  for (const size of sizes) {
    const processed = await sharp(buffer)
      .resize(size.width, size.height, { fit: size.fit })
      .webp({ quality: 85 })
      .toBuffer();
    
    const variantKey = key.replace(/\/original\//, `/${size.name}/`);
    
    await s3.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: variantKey,
      Body: processed,
      ContentType: 'image/webp',
    });
    
    const metadata = await sharp(processed).metadata();
    
    variants.push({
      variant: size.name,
      key: variantKey,
      url: buildCdnUrl(variantKey),
      width: metadata.width,
      height: metadata.height,
    });
  }
  
  return variants;
}
```

### Image Optimization

```typescript
// Sharp configuration for different use cases
const imageConfigs = {
  product: {
    quality: 85,
    format: 'webp',
    sizes: {
      thumbnail: { width: 150, height: 150, fit: 'cover' },
      small: { width: 300, height: 300, fit: 'contain' },
      medium: { width: 600, height: 600, fit: 'contain' },
      large: { width: 1200, height: 1200, fit: 'contain' },
    },
  },
  avatar: {
    quality: 90,
    format: 'webp',
    sizes: {
      thumbnail: { width: 50, height: 50, fit: 'cover' },
      small: { width: 100, height: 100, fit: 'cover' },
      medium: { width: 200, height: 200, fit: 'cover' },
    },
  },
  banner: {
    quality: 80,
    format: 'webp',
    sizes: {
      mobile: { width: 750, height: 400, fit: 'cover' },
      desktop: { width: 1920, height: 600, fit: 'cover' },
    },
  },
  blog: {
    quality: 85,
    format: 'webp',
    sizes: {
      thumbnail: { width: 400, height: 300, fit: 'cover' },
      medium: { width: 800, height: 600, fit: 'contain' },
    },
  },
};
```

---

## 4. CDN Configuration

### CloudFront Distribution

```typescript
const cloudfrontConfig = {
  distribution: {
    origins: [
      {
        id: 'S3Origin',
        domainName: 'ecommerce-assets-prod.s3.amazonaws.com',
        s3OriginConfig: {
          originAccessIdentity: 'origin-access-identity/cloudfront/XXXXX',
        },
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: 'S3Origin',
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: {
        queryString: false,
        cookies: { forward: 'none' },
      },
      minTTL: 0,
      defaultTTL: 86400,     // 1 day
      maxTTL: 31536000,      // 1 year
      compress: true,
    },
    cacheBehaviors: [
      {
        pathPattern: '/products/*/thumbnail/*',
        defaultTTL: 604800,   // 7 days
        maxTTL: 2592000,      // 30 days
      },
      {
        pathPattern: '/products/*/original/*',
        defaultTTL: 86400,    // 1 day
        maxTTL: 604800,       // 7 days
      },
      {
        pathPattern: '/temp/*',
        defaultTTL: 0,
        maxTTL: 3600,         // 1 hour
      },
    ],
    customErrorResponses: [
      {
        errorCode: 404,
        responsePagePath: '/404.html',
        responseCode: 404,
        errorCachingMinTTL: 300,
      },
    ],
  },
};
```

### Cache Invalidation

```typescript
async function invalidateCdnCache(paths: string[]): Promise<void> {
  await cloudfront.createInvalidation({
    DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
    },
  });
}

// Invalidate product images when product is updated
async function onProductUpdate(productId: string) {
  await invalidateCdnCache([
    `/products/${productId}/*`,
  ]);
}
```

---

## 5. File Upload Limits

| File Type | Max Size | Allowed Extensions |
|-----------|----------|-------------------|
| Images | 10 MB | jpg, jpeg, png, webp, gif |
| Videos | 100 MB | mp4, webm, mov |
| Documents | 10 MB | pdf, doc, docx, xls, xlsx |
| Avatars | 5 MB | jpg, jpeg, png, webp |
| Banners | 10 MB | jpg, jpeg, png, webp |

---

## 6. File Validation

```typescript
function validateFile(file: Express.Multer.File, options: UploadOptions): void {
  // Check file size
  const maxSize = getMaxSize(options.type);
  if (file.size > maxSize) {
    throw new BadRequestException(`File size exceeds limit of ${maxSize / 1024 / 1024}MB`);
  }
  
  // Check file type
  const allowedTypes = getAllowedTypes(options.type);
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
  }
  
  // Check for malware (optional, via external service)
  if (options.scanForMalware) {
    const isSafe = await scanFile(file.buffer);
    if (!isSafe) {
      throw new BadRequestException('File failed security scan');
    }
  }
}

function getMaxSize(type: string): number {
  const limits: Record<string, number> = {
    product_image: 10 * 1024 * 1024,
    avatar: 5 * 1024 * 1024,
    banner: 10 * 1024 * 1024,
    document: 10 * 1024 * 1024,
    video: 100 * 1024 * 1024,
  };
  return limits[type] || 10 * 1024 * 1024;
}

function getAllowedTypes(type: string): string[] {
  const types: Record<string, string[]> = {
    product_image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    avatar: ['image/jpeg', 'image/png', 'image/webp'],
    banner: ['image/jpeg', 'image/png', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
  };
  return types[type] || [];
}
```

---

## 7. Presigned URLs

```typescript
// Generate presigned URL for direct upload
async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  options: PresignedUrlOptions,
): Promise<PresignedUrlResponse> {
  const key = buildStorageKey(options, filename);
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    Metadata: {
      uploadedBy: options.userId,
      entityType: options.entityType,
      entityId: options.entityId,
    },
  });
  
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  
  return {
    uploadUrl: url,
    key,
    publicUrl: buildPublicUrl(key),
    cdnUrl: buildCdnUrl(key),
    expiresAt: new Date(Date.now() + 3600000),
  };
}

// Generate presigned URL for download
async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
```

---

## 8. Cleanup Strategy

```typescript
// Cleanup temp files older than 24 hours
async function cleanupTempFiles(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET,
    Prefix: 'temp/',
  });
  
  const objects = await s3.send(listCommand);
  
  for (const obj of objects.Contents || []) {
    if (obj.LastModified && obj.LastModified < cutoff) {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: obj.Key,
      });
    }
  }
}

// Cleanup orphaned media (not referenced by any entity)
async function cleanupOrphanedMedia(): Promise<void> {
  const orphanedMedia = await db.media.findMany({
    where: {
      createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      // Not referenced by any entity
      productImages: { none: {} },
      blogPosts: { none: {} },
      pages: { none: {} },
    },
  });
  
  for (const media of orphanedMedia) {
    await deleteMedia(media.id);
  }
}
```
