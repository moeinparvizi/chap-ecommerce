# Shared backend implementation plan

**Goal:** Category and subcategory writes from the administrator are stored in PostgreSQL and retrieved over HTTP by every storefront customer.

**Architecture:** Preserve Next.js and NestJS as two Vercel projects. A dedicated free Neon database stores shared records; `/api` on the frontend proxies to NestJS. Demo mode is disabled only after backend verification.

**Spec:** `docs/production/2026-11-07-shared-backend.md`

- [x] Add failing authentication/authorization tests covering anonymous and customer category writes, administrator and superadministrator writes, expired tokens, and private resource ownership.
- [x] Implement signed authentication, password hashing, safe customer/profile fields, login/registration validation, and a global access guard.
- [x] Add failing frontend transport and menu tests for real GET/POST, bearer tokens, parent-child rendering, reopening menus after remote updates, and network errors.
- [x] Implement same-origin API proxy configuration, signed-token login, both administrator roles, and menu loading/error/refresh behavior.
- [x] Add backend Vercel build settings and private provisioning scripts for schema/catalog/admin setup with no secrets in Git.
- [x] Run relevant API/web tests, typechecks, production builds, and real HTTP persistence checks against an isolated database.
- [x] Review diffs, commit, push, verify Vercel deploy; provision approved free database and backend; configure frontend cutover only after health and permissions checks pass.
- [ ] Verify category creation and anonymous retrieval using independent HTTP clients and the storefront mega menu; record any remaining external approval/setup requirements.
