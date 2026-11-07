# Custom print requests and orders

## Intent and confirmed requirements

Customers choose a product enabled by an administrator, upload their own artwork, select print positions when the product requires them, and provide a contact telephone and delivery address. Administrators inspect the artwork, see contact details, approve with a final quote or reject with a reason. The user confirmed that this is a trial version with no payment gateway, and that administrators determine the final price after inspecting the design. Approved requests offer an explicitly labelled simulated payment; no money is collected. After simulated payment, exactly one order enters the existing order lists and proceeds through preparation, readiness, shipment and delivery.

## Approach

Extend the existing NestJS API, Prisma/PostgreSQL database and Next.js UI. Keep unreviewed artwork requests in a dedicated workflow, and create an ordinary Order only after the approved request is paid in test mode. This preserves existing customer/admin order lists without representing unapproved designs as purchases.

Alternatives considered: creating pending orders immediately mixes design review with fulfillment; a separate fulfillment system duplicates the existing orders. Both conflict with the requested approval-before-payment flow and existing order screens. A real gateway or manual transfer adds setup the trial version does not have. Simulated payment is the implementation proposal based on the user's trial-version answer, and must be clearly disclosed in every payment-related screen and stored order.

## Customer experience

- Public `/custom-print` page, linked from desktop/mobile storefront navigation; browsing eligible products is public, submitting requires sign-in.
- Choose an enabled, ACTIVE, in-stock product. The manager configures its type: TSHIRT, PANTS, MUG or OTHER.
- T-shirts require one or more configured positions (defaults: front, back, left sleeve, right sleeve). Pants require configured positions (defaults: front/back left/right leg). Mugs show no position field and submit no positions. OTHER may require administrator-configured positions or none.
- Apparel also records size and color as text; these are specifications rather than separate inventory variants. Quantity is an integer from 1 to 100. The product's existing total stock remains authoritative.
- Upload one PNG, JPEG or PDF, at most 2 MiB, with a preview for images and a download/file summary for PDFs. Explain the size/type limit before upload.
- Require contact telephone and an existing delivery location owned by the authenticated customer. Prefill telephone from the account/location when available; offer the existing address-management link when no address exists. Optional notes accompany the design.
- `/account/print-requests` lists only the signed-in customer's requests, review notes, approved amount, payment action and eventual order link/status. Refresh after actions and allow manual refresh; surface API failures.
- Rejected requests show the reason and allow a new submission, without silently mutating the original request.
- Approved amount is the complete total including product, printing and delivery; customer sees that total before payment. No client-supplied price is accepted.
- The action is labelled `پرداخت آزمایشی — بدون برداشت وجه`. Successful simulation creates/returns an ordinary order, marked `paymentMethod: test`, and directs the customer to their existing orders.

## Administrator experience

- `/admin/custom-print` has two sections: eligible-product setup and submitted requests, linked in the admin sidebar.
- Setup selects an existing product, its type, enabled status and allowed print positions. Managers can enable any existing product; no hard-coded catalog of shirts/mugs. Active storefront availability still depends on existing product status and stock.
- Each request shows customer name, telephone with a call action, address snapshot, original product name/options, quantity, artwork preview/download, selected positions, size/color and notes.
- Review accepts only PENDING_REVIEW. Approve requires a positive final quote; reject requires a reason. The approved quote is immutable once paid. Repeated or stale reviews cannot overwrite another decision.
- Managers see fulfillment through the existing orders screen; that screen includes the print specifications and private artwork access, and displays the actual test-payment label instead of assuming every order is paid online.
- Customers/admins receive in-app notifications for approval/rejection and successful test payment using the existing Notification table.

## Data model and API boundaries

- New PrintProduct configuration linked one-to-one to Product, holding type, enabled flag, positions and timestamps. Public listing omits non-ACTIVE/disabled/out-of-stock products.
- New CustomPrintRequest linked to the submitting User and Product and optionally one unique Order. Store immutable product/options/address/contact snapshots, quantity, positions, notes, private artwork bytes/base64 plus filename/MIME/size, status, quote, review note and timestamps. Store who reviewed it. Do not expose artwork bytes in list endpoints or ordinary order payloads.
- States: PENDING_REVIEW -> APPROVED or REJECTED; APPROVED -> PAID through the test-payment endpoint only. Paid requests remain linked to their order; fulfillment state comes from Order.
- Add READY to OrderStatus for the requested ready-before-shipping step. Existing status renderers and filters recognize it.
- API resource `/custom-print`: public products GET; administrator configuration GET/POST/PUT; authenticated request POST; scoped request list/detail GET; private design GET; administrator review POST; customer-owned test-payment POST.
- New controllers use validated DTOs. Identity/role comes from the server's signed token, not userId from the browser. Customers can view/pay/download only their own request; administrators and superadministrators can review all. A customer cannot review requests or configure products, and cannot create an already-paid print order through the generic order endpoint.
- Shared contracts and position labels live in packages/shared. New code follows domain-module conventions and extends the affected helper in apps/web/src/app/lib/api.ts.

## Integrity, files and payment

- Persist uploads privately in PostgreSQL for this bounded trial, following the project's existing database-backed image strategy without introducing a paid storage dependency. Verify decoded size and file signatures on the server, reject SVG/executable content and mismatched MIME. Use authenticated downloads with safe attachment filenames and no public artwork URLs.
- 2 MiB decoded size keeps base64 request bodies below Vercel's function payload limit. No browser-local fallback may report a successful print request/order after an API error.
- Test payment is allowed only with server-side `PAYMENT_TEST_MODE=true`. The response/UI expose whether it is enabled. Production mode with that variable unset offers no simulated or invented successful payment.
- Test payment reloads authoritative approval, quote and product stock. Claim the approved request and decrement inventory conditionally inside the same transaction that creates its unique linked Order. Concurrent/retried payment returns the same existing order; insufficient stock leaves the request unpaid and creates no order. Store the exact approved quote and snapshots; never use current edited client data.
- Existing OrdersService must not deduct stock again for a print order when shipping. For these orders enforce PROCESSING -> READY -> SHIPPED -> DELIVERED, with cancellation permitted before shipment and reserved inventory restored exactly once. Repeating the same status is harmless; backwards transitions and shipping a cancelled order fail. Original ordinary-order behavior is preserved except recognizing READY in shared presentation.
- Protect the generic Order create/update route from attaching or forging a custom-print association or overwriting a print order's payment/amount/items/customer. Paid print data changes only through the defined service operations.
- Schema deployment is additive, includes reviewed SQL migration, and preserves all existing online data. Test database mutations use an isolated schema. No live charges occur in verification.

## Visual and project constraints

Extend the incumbent Persian RTL interface and its light/dark theme, cards, form controls and navigation. Use responsive stacked forms/cards on narrow screens; do not introduce page-level horizontal overflow. All fields have visible labels, validation errors, pending/disabled actions and recoverable loading/error states. New app screens use the existing design system; no redesign is requested.

## Verification and completion

- Unit/API tests: configured product eligibility; garment-required and mug-forbidden positions; upload signature/type/size; server-owned location/identity; anonymous/cross-user/admin permissions; approve/reject validation; payment before approval/after rejection; disabled test mode; authoritative pricing; double/concurrent payment; stock failures, restoration and no double decrement; unique normal-order creation.
- Integration against an isolated PostgreSQL schema: configure a shirt and mug, submit with a real image fixture as a customer, approve with an administrator, simulate payment, verify the same order is listed for customer/admin and its print details remain accessible; complete preparation/readiness/shipping/delivery, and check an independent rejection path.
- Frontend tests exercise customer submission, conditional position fields, administrator review, and explicit test-payment action/error handling. Run relevant API/web suites, all package typechecks and root build.
- Verify rendered desktop/mobile UI through the installed Chrome runtime when available. If browser control is externally blocked, report that limit separately from verified API behavior.
- Inspect diffs, commit/push each coherent change, apply the additive schema to the intended Neon database, set the authorized trial configuration, and verify both Vercel deployments and actual online order persistence. Only disposable test fixtures are used; do not charge money or change real customer orders.

## Implementation decisions left to the builder

Choose exact DTO/component filenames, internal query/select helpers and transaction retry mechanics. Use existing dependencies unless a necessary primary-source-supported requirement is found. Keep modules focused; do not restructure unrelated catalog or checkout flows. Database-backed uploads are bounded trial storage; a future object-storage/gateway integration is a separate deployment decision.
