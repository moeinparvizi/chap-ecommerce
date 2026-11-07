# Storefront product context

This existing ShopHub application serves Persian-speaking shoppers and store administrators through a Next.js storefront, account area and administration panel. Preserve the incumbent Persian RTL, English/LTR and light/dark theme behavior, existing cards, controls, navigation and CSS tokens. New print screens are task-oriented extensions of that interface, not a redesign.

The approved custom-print specification is in `../../docs/superpowers/specs/2026-11-07-custom-print-design.md`. Customers choose an administrator-enabled product, supply private PNG/JPEG/PDF artwork up to 10 MiB, garment options, telephone and their existing address. Administrators review the design and set the complete final total in toman or reject with a reason. Approved requests can create an ordinary fulfillment order only through explicitly simulated payment, when the server enables test mode. No money is collected. Successful data and state always come from the real API.
