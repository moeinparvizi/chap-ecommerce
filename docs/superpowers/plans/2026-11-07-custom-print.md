# Custom Print Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Independent UI and upload work may be delegated under dispatching-parallel-agents after contracts are frozen.

**Goal:** Customer artwork review, administrator pricing, explicit trial payment and ordinary order fulfillment.
**Architecture:** Dedicated print configurations/requests and private chunked uploads in PostgreSQL, with paid requests linked one-to-one to existing Orders. NestJS controls identity, state transitions, quotes and inventory; Next.js renders the shared flow.
**Tech Stack:** Existing NestJS 10, Prisma 6/PostgreSQL, Next.js 15/React 19, TypeScript, Vitest.
**Spec:** `docs/superpowers/specs/2026-11-07-custom-print-design.md` (approved with 10 MiB file limit).

## Global Constraints

- Maximum artwork size: 10 MiB decoded; supported PNG/JPEG/PDF. Chunk size: 1 MiB. Private authenticated uploads/downloads; metadata lists never contain file bytes.
- Preserve existing Persian RTL, themes and responsive UI; use existing dependencies.
- Admin defines eligible existing products and quotes the final total after review. No client-submitted identity/price/paid state.
- No real payment gateway or charges. Explicit test mode requires server `PAYMENT_TEST_MODE=true`.
- Push coherent changes and verify automatic deployments of both existing Vercel projects. Preserve online records; use additive migration and isolated-schema test fixtures.

## Review Focus

- An uploaded 10 MiB file must complete through bounded requests and download intact; over-limit, missing/mutated parts and cross-user access fail (Task 2).
- Configuration changes after submission must not rewrite garment/location/contact snapshots or an approved quote (Task 3).
- Simultaneous payment and repeated fulfillment/cancellation must create one order, reserve once and restore at most once (Task 3).
- Server errors must leave the customer form and artwork intact and cannot show fake success or a localStorage order (Task 4).
- Mobile users must reach all garment choices, quote/payment actions and admin review without page overflow (Tasks 4-5).

## Frozen interfaces

Shared module: `packages/shared/src/custom-print.ts`, exported from shared index. Types PrintProductType = TSHIRT | PANTS | MUG | OTHER; PrintRequestStatus = PENDING_REVIEW | APPROVED | REJECTED | PAID; constants MAX_ARTWORK_BYTES=10485760 and ARTWORK_CHUNK_BYTES=1048576, default position labels/options.

API prefix `/api/custom-print`:
- GET `/settings` public -> `{testPaymentEnabled,maxUploadBytes,chunkBytes}`.
- GET `/products` public -> enabled PrintProduct[] with `product` (existing Product incl images), only ACTIVE/in-stock.
- GET `/configurations` admin -> PrintProduct[] with product. POST `/configurations` admin upsert body `{productId,type,enabled,positions:string[]}` -> configuration. MUG positions always []; garments require nonempty positions.
- POST `/uploads` signed in body `{filename,mimeType,size}` -> metadata `{id,filename,mimeType,size,totalChunks,completed}`.
- PUT `/uploads/:id/parts/:index` owner body `{base64}` -> `{stored:true}`. All but final part exactly 1 MiB; final exact declared size. Same-body retries idempotent; changed parts rejected.
- POST `/uploads/:id/complete` owner -> metadata, after all parts,size and magic-byte validation. Completed parts immutable.
- GET `/uploads/:id` metadata and GET `/uploads/:id/parts/:index` -> `{base64}` owner or admin; no public access.
- POST `/requests` signed in body `{productId,designUploadId,locationId,phone,quantity,positions:string[],size?,color?,notes?}` -> request.
- GET `/requests` scoped own/all admin and GET `/requests/:id` scoped detail -> request fields below.
- POST `/requests/:id/review` admin body `{decision:'APPROVED'|'REJECTED',quotedAmount?,reviewNote?}` -> request. Require quote >0 for approval; nonempty reviewNote for rejection.
- POST `/requests/:id/pay-test` owner -> ordinary Order. Repeated successful call returns the same Order.

Request response: id,userId,customerName,productId,productName,productImage,productType,quantity,size,color,positions,notes,phone,locationJson,designUploadId,status,quotedAmount,reviewNote,orderId,createdAt,updatedAt; `designUpload:{id,filename,mimeType,size,totalChunks,completed}`; `order?:{id,status,amount,paymentMethod}`. Never contains bytes or password. Amount uses the existing stored order currency (toman); existing UI may show equivalent rial.

Schema names: PrintProduct(productId unique,type String,enabled Boolean,positions String[]); PrintUpload(userId,filename,mimeType,size,totalChunks,completed,createdAt); PrintUploadPart(uploadId,index,data Bytes) composite PK; CustomPrintRequest snapshots above, reviewerId?, orderId? unique and designUploadId unique. User/Product/Order gain reverse relations. Order gains READY status and `customPrintRequest` reverse relation.

### Task 1: Shared contracts and additive persistence
**Files:** shared custom-print module/index; Prisma schema; `packages/db/prisma/migrations/202611070001_custom_print/migration.sql`.
**Produces:** frozen constants/types and generated Prisma delegates `printProduct`, `printUpload`, `printUploadPart`, `customPrintRequest`.
- [ ] Add focused failing tests for position/type handling and supported file bounds/signatures (owned by Task 2), and request/payment integration scenarios (Task 3) before their implementations.
- [ ] Add models/relations/READY; generate migration diff against current datamodel without applying to live DB. Regenerate client; build shared and db.
- [ ] Check schema validation/typecheck. Keep feature registration until implementation compiles; commit/push first coherent backend deliverable with Tasks 2-3.

### Task 2: Private chunked artwork transport
**Files:** `apps/api/src/custom-print/uploads.service.ts`, `uploads.dto.ts`; `apps/api/test/print-uploads.spec.ts`.
**Consumes:** frozen Prisma upload schema and 1/10 MiB shared constants.
**Produces:** UploadsService.start(userId,dto), part(userId,id,index,base64), complete(userId,id), metadata(actor,id), downloadPart(actor,id,index). Actor `{id,role}`; owner+admin read, owner-only writes. Service Injectable with explicit Prisma injection.
- [ ] Write/run failing tests: exact 10 MiB accepted via 10 bounded chunks; oversize/invalid MIME/magic/base64, size mismatch, missing chunk, changed retry and other-owner read/write fail.
- [ ] Implement persisted sessions/parts, bounded decoding, completion validation, safe metadata and immutable finalized chunks. Limit incomplete sessions to 5 per user and expire after 24 hours; no unbounded orphan files.
- [ ] Run upload tests and API typecheck; send exact contracts/integration requirements to primary agent.

### Task 3: Review, test payment and fulfillment API
**Files:** custom-print module/controller/DTO/service; access guard/app module; orders service/controller; `apps/api/test/custom-print.integration.spec.ts` and auth tests.
**Consumes:** configuration/schema/shared types and UploadsService.
**Produces:** all frozen HTTP endpoints; authoritative ordinary Orders including print metadata/safe upload reference; READY progression for paid print orders.
- [ ] Write/run failing integration tests with isolated PostgreSQL schema (explicit test database env): shirt/mug setup, owned artwork/location, invalid positions, private access, approval/rejection, test-mode gating, quote immutability, double/concurrent pay and inventory, ordinary order lists, READY/shipment/no-double-deduction/cancellation restoration.
- [ ] Implement DTO validation and service-owned identity; scoped selects; snapshots; notifications. Implement transactional conditional claim/reserve/create and retry handling. Preserve stock on idempotent repeats.
- [ ] Whitelist generic create/update; disallow forged nested print associations and protected print-order data edits. Include print summary on ordinary order reads, without byte fields.
- [ ] Run API tests/typecheck and compiled HTTP check; commit/push the coherent backend/schema/contracts implementation. Do not apply schema to a live target before reviewing migration and target.

### Task 4: Customer/admin UI and transport
**Files:** `apps/web/src/app/lib/custom-print-api.ts`; customer public page + account requests; admin custom-print page; shared UI helpers/CSS; navigation and ordinary order pages; focused frontend tests. Existing transport may export request for reuse.
**Consumes:** frozen endpoints above.
**Produces:** complete responsive Persian UI, chunked progress upload/private download, product configuration, review, explicit trial payment and linked order display.
- [ ] Write/run failing customer tests for shirt-required/mug-hidden positions, missing files/phones/location, 10 MiB bounded upload and visible submit failure. Admin tests approve with positive quote/reject reason. Account test approved pay action creates order and redirects/links.
- [ ] Implement UI on incumbent tokens/cards/form controls; render all API loading/errors without local fallbacks, disable pending actions, preserve fields after error; use authenticated chunked download into browser Blob.
- [ ] Add navigation links desktop/mobile/customer/admin and extend order status/print detail/payment labels. Keep data APIs real even when optional legacy demo is selected; indicate sign-in/configuration limits truthfully.
- [ ] Run web suite/typecheck and detector on changed targets. Primary agent integrates, reviews and runs root build, then commits/pushes UI.

### Task 5: Deployment, user-requested order test and final review
**Files:** deployment guide and progress ledger; environment template for PAYMENT_TEST_MODE. No tracked secrets.
- [ ] Review complete diff and fresh reviewer against spec; fix important findings with a regression test. Run all suites/typechecks/build/diff check.
- [ ] Apply reviewed additive migration to isolated local schema first, then intended Neon DB without reset/data-loss flags. Set private `PAYMENT_TEST_MODE=true` only for this authorized trial deployment. Verify both Vercel builds.
- [ ] Live HTTP fixture: manager config -> customer upload -> request -> approval+quote -> explicitly simulated pay -> same linked order for customer/admin -> READY -> SHIPPED -> DELIVERED; separate reject/blocked-payment case. Test full 10 MiB transfer. Clean only disposable fixtures; retain no real charges.
- [ ] Verify customer/admin rendered UI and mobile via Chrome skill; report any external control blocker accurately. Update docs/ledger and push all final changes; final report actual validation and deployment state.
