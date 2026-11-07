# Project guide for AI assistants

## Repository map

- `apps/api`: NestJS API. Features are grouped by domain under `src/`, typically with a module, controller, and service. `src/prisma` provides database access; `src/common` contains shared HTTP infrastructure.
- `apps/web`: Next.js App Router and React UI. Routes and layouts live in `src/app`, including `(public)`, `admin`, and `auth`; shared UI components live in `src/components/ui`.
- `packages/db`: Prisma schema at `prisma/schema.prisma` and exported client in `src/index.ts`.
- `packages/shared`: shared TypeScript types, constants, and Zod validators.
- `docs/`: domain and architecture documents. Check the relevant document for context, but verify claims against the implementation; some documents describe planned architecture (including an Angular frontend) rather than the current Next.js app.

## Setup and commands

Use Node.js 20 or newer and pnpm 9 (the repository pins pnpm 9.15.4). Run commands from the repository root.

```sh
pnpm install --frozen-lockfile
pnpm db:generate
pnpm dev                 # API and web together
pnpm dev:api             # API, default port 3000
pnpm dev:web             # web, port 4200
pnpm build               # shared, db, API, then web
pnpm typecheck
pnpm test                # recursive package tests
pnpm test:api
pnpm test:web
```

For local configuration, use `.env.example` as a starting point and keep secrets out of version control. `docker compose up -d` starts PostgreSQL and Redis; its PostgreSQL password differs from the example `DATABASE_URL`, so align your local configuration before connecting. Prisma commands include `pnpm db:migrate` and `pnpm db:push`: both modify the configured database, so check `DATABASE_URL` and the intended target first.

The configured seed script points to `packages/db/prisma/seed.ts`, which is currently absent; there is a separate `packages/db/seed.js`. Inspect it and the database target before attempting a seed. The root `lint` script runs recursively, and the API lint script includes `--fix`, so it can modify files. The web lint script uses `next lint`; verify it works with the installed Next.js version before relying on it.

## Tests and verification

- API tests use Vitest with the Node environment and are discovered under `apps/api/test/**/*.spec.ts` and `*.e2e-spec.ts`. The existing e2e suite skips when `DATABASE_URL` is unset; a passing run with skips does not verify database behavior. Use an isolated test database for database-backed tests.
- Web tests use Vitest with jsdom and are discovered under `apps/web/src/**/*.test.{ts,tsx}`. Place focused tests next to the relevant code.
- Run the relevant test and typecheck commands for a change; run `pnpm build` when changes affect build or package integration. Report failures and skipped checks. CI also runs lint, API and web tests, and build; see `.github/workflows/ci.yml` for its exact setup.

## Implementation conventions

- Follow `.editorconfig` and `.prettierrc`: two-space indentation, LF, single quotes and semicolons. Keep edits scoped to the task and preserve unrelated changes.
- Keep API routing in controllers, domain logic in services, and register dependencies in feature modules. The API uses the `/api` global prefix and exposes Swagger at `/api/docs`. Its bootstrap configures a global validation pipe; use concrete validated DTOs for new request contracts rather than assuming existing `any` bodies are validated.
- When changing API contracts, update the relevant consumers and tests. The web currently has two API helpers (`src/app/lib/api.ts` and `src/lib/api.ts`) with different configuration behavior; inspect the one used by the affected feature. The former hard-codes localhost.
- Put reusable cross-package contracts in `packages/shared` and database schema changes in `packages/db/prisma/schema.prisma`. Regenerate the Prisma client after schema changes and include an appropriate migration when the change requires one.
- Preserve existing Persian/English, RTL/LTR, and theme behavior when changing UI. Browser storage is used by several current flows; access it only in client-side execution.
- Treat authentication and authorization as security-sensitive: inspect actual server-side enforcement instead of assuming client-side state or architecture documents provide it.
