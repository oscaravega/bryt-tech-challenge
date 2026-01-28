Bryt Designs – Frontend Shopify Challenge
This project is a frontend challenge built with Next.js (App Router) and Shopify Storefront API.
The goal was to fetch products from a Shopify collection and implement a Quick View modal with variant selection, animations, and proper accessibility handling.

🚀 Tech Stack

Next.js 14 (App Router)
TypeScript
Shopify Storefront API (GraphQL)
Framer Motion (motion/react)
Tailwind CSS
pnpm


🛠️ Setup & Running Locally

Install dependencies:

bashpnpm install

Create a .env.local file using .env.example:

bashSHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN="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"
NEXT_PUBLIC_SHOPIFY_STORE_NAME=your_store_name
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION=2025-07

Run the development server:

bashpnpm dev

Open:

http://localhost:3000

✅ Implemented Requirements
Product Listing

Fetches products from a Shopify collection handle using the Storefront API.
Each product card displays:

Image
Title
Price
Quick View trigger



Quick View Modal

Opens as a modal (not a drawer).
Close methods:

Close button
Backdrop click
Escape key


Background scroll is locked while the modal is open.
Focus management:

Focus moves into the modal on open
Focus returns to the triggering element on close
Focus is trapped inside the modal while open



Product Data Fetching

Product details are fetched on demand when opening Quick View.
Uses a dedicated API route: /api/product/[handle]
GraphQL queries are fully typed (no any for core Shopify data).

Loading State

Designed skeleton UI while product data is loading.
Prevents layout shift during fetch.

Modal Layout

Desktop: two-column layout

Media (left)
Content (right)


Mobile: stacked layout

Media on top
Content below



Variant Selection

Product options rendered as pill-style buttons.
Maintains selectedOptions state (optionName → value).
Resolves the correct variant based on selections.
Unavailable combinations are disabled dynamically.
Image updates when the selected variant changes.
Price updates when a valid variant is selected.
Fallbacks handled gracefully when variant images are missing.

Add to Bag (Simulation)

CTA disabled until a valid, available variant is selected.
Simulated async behavior (~1s delay).
CTA transitions:

Idle → Loading → Success


After success, the modal closes automatically.

Motion & Micro-Interactions

Backdrop fade in/out
Modal entrance & exit animation
Image crossfade when variant changes
Button press feedback
Loading → success animation on CTA


🧠 Design & Technical Decisions

Data fetching is deferred to modal open to reduce initial page load.
No global state used; modal behavior is fully encapsulated.
Variant resolution logic is deterministic and avoids invalid states.
Focus handling is implemented manually to ensure accessibility without external libraries.
TypeScript types mirror Shopify Storefront API responses closely to avoid runtime issues.


📌 Notes

Add-to-cart behavior is simulated as requested (no actual cart mutation).
Styling follows the provided aesthetic while prioritizing clarity and usability.
The implementation favors correctness, accessibility, and maintainability over over-engineering.


Thanks for reviewing! 👋