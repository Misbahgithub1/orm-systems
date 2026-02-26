## ORM Systems – Next.js E‑Commerce Frontend

This project is a **Next.js (App Router)** frontend for an e‑commerce experience built on top of the public `fakestoreapi.com`. It demonstrates modern React patterns, a clean folder structure, and pixel‑perfect UI for:

- Category listing with filters and "Load more"
- Product detail pages with rich layout and search
- Shared API layer and reusable UI components

---

### Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: React‑Bootstrap, SCSS modules
- **Icons**: `react-bootstrap-icons`
- **Data Source**: `https://fakestoreapi.com`

---

### Project Structure (high level)

- `src/app/`
  - `layout.tsx` – global layout, navbar + footer
  - `globals.scss` – global styles
  - `styles/_variables.scss` – design tokens (typography, spacing, colors)
  - `category/` – category listing page (filters, load more)
  - `products/[id]/` – dynamic product detail page (images, search)
  - `components/`
    - `Navbar/` – top navigation
    - `Footer/` – footer matching design reference
    - `AddToCartButton/` – reusable Add to Cart CTA
    - `Portfolio/`, `hero/`, etc. – marketing sections
- `src/lib/api/`
  - `products.ts` – shared `Product` type and product/category APIs
  - `productService.ts` – product‑detail helpers (single product, related)

---

### Key Features

- **Category Page**
  - Fetches categories and products dynamically from FakeStore API.
  - Sidebar filters:
    - Rating (4+, 3+, 2+)
    - Dynamic price range slider based on current products.
  - "See more" toggle for category list.
  - Pagination via **Load More** button.

- **Product Detail Page**
  - Dynamic route at `/products/[id]`.
  - Uses `next/image` for the main product image.
  - Shows:
    - Title and short subtitle
    - Star rating row (5 stars) with numeric value and review count
    - Category, price, stock badge
    - Quantity selector with `- / +` controls
    - Primary **Add to Cart** button and favourite (heart) icon.
  - Search section:
    - Debounced search over `https://fakestoreapi.com/products/`
    - When input is empty, no extra list is shown (focus remains on product)
    - Results display product thumbnails and titles and navigate on click.

- **API Layer**
  - `getCategories`, `getProductsByCategory`, `getAllProducts`, `getProductById`, `getRelatedProducts`.
  - All calls use `async/await` with centralised error handling.

- **Styling**
  - SCSS modules per page/component for strong encapsulation.
  - Shared design tokens via `@use "../../styles/variables" as *;` – no deprecated `@import`.
  - Responsive layouts tuned for desktop, tablet, and mobile.

---

### Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

3. **Open the app**

Visit `http://localhost:3000` in your browser.

---

### Production Build

```bash
npm run build
npm start
```

This will create an optimized production build and start the Next.js server.

---

### Code Style & Conventions

- Prefer **functional React components** with hooks.
- Keep all **data fetching** in `src/lib/api` or dedicated service files.
- Use **SCSS modules** for styling and import shared tokens via:

```scss
@use "../../styles/variables" as *;
```

- Avoid `console.log` in production code; use it only for temporary debugging.

---

### Notes

- Product and category data are powered by `fakestoreapi.com`; no API keys are required.
- Images from `fakestoreapi.com` are allowed in `next.config.ts` under `images.remotePatterns`.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
