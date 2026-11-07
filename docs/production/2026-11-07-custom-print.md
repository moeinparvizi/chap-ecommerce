# Custom printing trial — 2026-11-07

## Operation

- Customer page: `/custom-print`. The navigation includes desktop/mobile entry points.
- Customer tracking: `/account/print-requests`; paid trial requests also appear in `/account/orders`.
- Administrator configuration/review: `/admin/custom-print`. Select an existing product, enable printing, choose TSHIRT/PANTS/MUG/OTHER and permitted positions. Products must also be ACTIVE and in stock. No existing catalog product is silently enabled for printing.
- Garments require position(s), size and color. Mugs have no position choice. OTHER products require a position when their configuration defines choices.
- The customer provides an owned saved delivery address and contact phone. The request stores snapshots, so later profile/catalog edits do not rewrite the submitted specifications.
- The administrator privately views/downloads the artwork, sees the phone, and approves with the complete final total in **toman** or rejects with a reason. Approval cannot subsequently be repriced.
- Explicit **trial payment — no money withdrawn** creates one ordinary order. No payment gateway is connected. API `PAYMENT_TEST_MODE=true` is required. `.env.example` defaults to false; `apps/api/vercel.json` explicitly enables it for this authorized trial deployment. Remove that trial setting before introducing any real payment integration.
- Print fulfillment allows PROCESSING → READY → SHIPPED → DELIVERED. PROCESSING/READY may be cancelled. Payment reserves inventory once; repeated payment returns the same order; cancellation restores inventory once. Linked print orders cannot be deleted or have their quote/identity/items overwritten through generic order endpoints.

## Private artwork

PNG/JPEG/PDF only, maximum decoded size 10 MiB. File signatures, canonical base64, exact part sizes and contiguous completion are validated server-side. Upload and download use authenticated 1 MiB chunks, keeping individual payloads bounded. Only the owner and administrators can read completed artwork; only its owner can write it. Lists expose metadata and private upload IDs, never file bytes or public artwork URLs.

Storage uses the existing PostgreSQL database for this trial. Each user can hold at most five unattached uploads, including completed ones. Unattached sessions expire after 24 hours and the next upload creation reclaims expired files/parts; files attached to requests remain available. This is trial storage, with future object storage a separate change.

## Database deployment

The existing Neon schema matched the reviewed pre-feature Prisma model exactly. Its 16 tables had no migration history. `202611070000_baseline` records that existing model; it was marked applied, without recreating existing tables. `202611070001_custom_print` then added four tables, foreign keys/indexes and the READY enum value. Both migrations also ran from scratch in an isolated local schema. No resets or catalog/customer imports were used.

For future schema changes, review migrations against the intended target and use Prisma migrate deploy. Do not rerun baseline SQL against a populated database. Keep database URLs and credentials in private environment configuration.

## Verification

- API suite: 56 passing tests. Its 10 database integration cases skip when `CUSTOM_PRINT_TEST_DATABASE_URL` is absent; all 10 were separately run successfully against a disposable local schema and removed afterward.
- Web suite: 31 passing tests, including 10 MiB chunk transport, garment/mug choices, formatted phone normalization, validation before upload, preserved fields on server failure, review and trial payment.
- All workspace typechecks and root build passed. Test aliases resolve workspace source so fresh CI tests do not require prebuilt shared/db dist directories.
- Compiled HTTP smoke: `apps/api/scripts/verify-custom-print.mjs`, with explicit `DATABASE_URL` and `PRINT_SMOKE_API_URL`. For an authorized remote trial also require `PRINT_SMOKE_ALLOW_ONLINE=true`. The script creates uniquely identified disposable users/products/artwork/requests/orders, tests exact 10 MiB upload/download equality, privacy, admin pricing/rejection, concurrent payment, ordinary order visibility, delivery and idempotent cancellation, then removes only its fixtures. It performs no real charge. API and database must refer to the same environment.
- Existing root lint is unavailable: API invokes ESLint without an installed ESLint dependency; web uses the removed `next lint` command. This pre-existing tool configuration was not changed as part of printing. Formatting and type/build checks were run for this feature.

Live deployment and browser verification results are recorded after the feature push.
