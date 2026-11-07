-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'READY';

-- CreateTable
CREATE TABLE "PrintProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "positions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintUpload" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "totalChunks" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrintUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintUploadPart" (
    "uploadId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "PrintUploadPart_pkey" PRIMARY KEY ("uploadId","index")
);

-- CreateTable
CREATE TABLE "CustomPrintRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "productType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "positions" TEXT[],
    "notes" TEXT,
    "phone" TEXT NOT NULL,
    "locationJson" TEXT NOT NULL,
    "designUploadId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "quotedAmount" DOUBLE PRECISION,
    "reviewNote" TEXT,
    "reviewerId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomPrintRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrintProduct_productId_key" ON "PrintProduct"("productId");

-- CreateIndex
CREATE INDEX "PrintUpload_userId_createdAt_idx" ON "PrintUpload"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPrintRequest_designUploadId_key" ON "CustomPrintRequest"("designUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPrintRequest_orderId_key" ON "CustomPrintRequest"("orderId");

-- CreateIndex
CREATE INDEX "CustomPrintRequest_userId_createdAt_idx" ON "CustomPrintRequest"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomPrintRequest_status_createdAt_idx" ON "CustomPrintRequest"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "PrintProduct" ADD CONSTRAINT "PrintProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintUpload" ADD CONSTRAINT "PrintUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintUploadPart" ADD CONSTRAINT "PrintUploadPart_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "PrintUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintRequest" ADD CONSTRAINT "CustomPrintRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintRequest" ADD CONSTRAINT "CustomPrintRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintRequest" ADD CONSTRAINT "CustomPrintRequest_designUploadId_fkey" FOREIGN KEY ("designUploadId") REFERENCES "PrintUpload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintRequest" ADD CONSTRAINT "CustomPrintRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPrintRequest" ADD CONSTRAINT "CustomPrintRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

