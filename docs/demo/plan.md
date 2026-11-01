# Portfolio demo delivery

Preserve the existing Next.js storefront and NestJS/PostgreSQL implementation. Add an opt-in browser demo adapter controlled by NEXT_PUBLIC_DEMO_MODE. Seed realistic, fictional catalog, customers, orders, reviews and marketing data. Keep mutations isolated in each browser, with a reset action and clear demo notice; never connect demo checkout to payments or shared production data. Keep normal API mode available through configuration.

1. Verify demo behavior with tests: catalog relationships, login, mutation persistence, isolation and reset.
2. Implement demo fixtures/adapter and visible demo controls; configure deploy and development instructions.
3. Run web tests, TypeScript and production build.
4. Publish to the existing free Vercel account, verify storefront/admin/cart, capture real screenshots.
5. Add README with demo links, credentials, screenshots, setup, architecture and demo limitations. Push reviewed changes and verify deployed commit.
