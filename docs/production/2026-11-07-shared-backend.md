# Shared backend cutover

## Verified state

On 2026-11-07 the deployed web project enabled `NEXT_PUBLIC_DEMO_MODE` and had no API URL or database connection configured. Both category writes and reads used `demoRequest`, before `fetch` could execute. `/api/categories` and `/api/health` on the public domain returned 404. The local NestJS API returned 200 and read 11 categories (6 roots, 5 children) from the local PostgreSQL `ecommerce` database. All category statuses were valid. All 16 live database tables, columns, indexes, and foreign keys were inspected without changing them.

## Deployment choice

Keep the existing Next.js frontend and NestJS backend. Deploy the API as a separate Vercel project rooted at `apps/api`, backed by a dedicated Neon PostgreSQL database. Proxy browser `/api/*` requests from the web project to that backend using server-side `API_URL`. This preserves the existing modules and avoids replacing the backend with duplicate Next.js handlers. A VPS would also work but no server is available. The existing portfolio database belongs to another application and must not be reused.

The user requested online deployment preparation and authorized only a free database plan. Neon integration terms require separate action-time approval. No paid plan is authorized.

## Required changes

1. Protect the backend before publishing it: signed expiring authentication tokens; hashed passwords; server-enforced administrator permissions; customer ownership checks; password-free customer responses; validated login/registration and category bodies.
2. Send actual API requests from the web app, include the signed token, and support both administrator roles. Preserve explicitly selected demo mode until the real backend is verified.
3. Refetch categories when either navigation menu opens and show loading/errors instead of silently hiding failures. Verify parents and children returned by the actual transport.
4. Prepare a repeatable database/schema deployment and a controlled migration of catalog data. Never copy customer credentials or personal records to a new provider without explicit approval. Create an online administrator through a private setup command, never through public demo credentials.
5. Build and test API/web; push; deploy API; verify health and persistence; configure web API URL, disable demo, redeploy; verify anonymous category GET, authorized category POST, child relationship, and visibility in an independent customer browser.

## Validation and rollback

Test invalid/missing tokens, customer denial on category writes, administrator/superadministrator writes, user ownership, network errors, and immediate menu refresh. Use isolated database fixtures for mutation tests. Do not switch the public web project out of demo until backend health, authentication, and real category persistence pass. Existing local data remains untouched.

## Provisioning

The dedicated free Neon database has the Prisma schema and a copy of 11 categories, 6 products and 7 product images. Existing customers, orders and credentials were not copied. A new superadministrator was created with a random bcrypt-hashed password; its credentials are kept only in ignored `tmp/online-admin.txt`.

For a new empty target, set private `DATABASE_URL` and run `pnpm db:push` from the root. Then run `node apps/api/scripts/provision-online.mjs` with optional `SOURCE_DATABASE_URL` for catalog-only copying and `ONLINE_ADMIN_EMAIL` for a new administrator. Check source and target before execution. Keep connection strings in private environment variables; never pass secrets through public frontend variables. The script refuses to overwrite an existing local credential file.

Validation before cutover: 11 API tests and 19 web tests passed; all package typechecks and the root production build passed. The compiled NestJS API connected to Neon, rejected anonymous category writes, authenticated the new administrator, created a temporary root and child, and returned both to a separate anonymous client. The temporary records were deleted afterward.
