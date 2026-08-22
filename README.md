# Product Management Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://free-product-management-dashboard.vercel.app)

A modern, responsive, and feature-rich **Product & Inventory Management Dashboard** built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. It connects to the [DummyJSON Products API](https://dummyjson.com/docs/products) to manage product catalogs, stock levels, analytics, and workspace settings.

🔗 **Live Application URL**: [https://free-product-management-dashboard.vercel.app](https://free-product-management-dashboard.vercel.app)

---

## 🚀 Features

- **Global Persistent Layout (`AppShell`)**: Responsive sidebar navigation, mobile menu drawer, breadcrumb headers, theme toggler (Dark / Light mode), and toast notification banners.
- **System Overview (`/`)**: High-level metrics showing Total Catalog Value, Active Product Count, Low Stock Alerts, and Average Rating.
- **Product Catalog (`/products`)**:
  - Full-featured data table for desktop and responsive cards for mobile.
  - Search with 250ms debounced input.
  - Category filtering & multi-field sorting (Price, Rating, Stock).
  - Client-side pagination.
  - Interactive **Add Product** & **Edit Product** modal forms with validation.
  - Optimistic UI updates for immediate feedback during session.
- **Product Detail View (`/products/[id]`)**: Dedicated page showing full product specifications, image gallery, rating, pricing, and stock status.
- **Analytics Dashboard (`/analytics`)**: Category distribution graphs, inventory value stats, and stock health rates.
- **Workspace Settings (`/settings`)**: Preference management for email notifications and stock alerts.
- **Custom 404 & Error Boundaries**: User-friendly fallback pages for missing routes (`app/not-found.tsx`) and runtime exceptions (`app/error.tsx`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Primitives**: Base UI & Custom Tailwind Components

---

## 💻 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** and `npm` installed on your machine.

### Installation & Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aman-sinha-dev/product-management-dashboard.git
   cd product-management-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *`.env.example` contains:*
   ```env
   NEXT_PUBLIC_API_URL=https://dummyjson.com/products
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
├── app/
│   ├── analytics/
│   │   └── page.tsx          # Analytics & Inventory Health page
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx      # Routed Product Details page
│   │   └── page.tsx          # Product Catalog, Table, Filters & Modals
│   ├── settings/
│   │   └── page.tsx          # Workspace & Notification Settings
│   ├── error.tsx             # Global Error Boundary fallback
│   ├── not-found.tsx         # Custom 404 Page
│   ├── globals.css           # Design tokens & dark/light theme variables
│   ├── layout.tsx            # Root layout wrapping AppShell & SEO metadata
│   └── page.tsx              # Overview page with system metrics
├── components/
│   ├── products/
│   │   ├── product-filters.tsx # Search, category filter & sort toolbar
│   │   ├── product-modal.tsx   # Add & Edit product modal dialog
│   │   └── product-table.tsx   # Desktop table, mobile cards & pagination
│   ├── ui/
│   │   └── button.tsx        # Custom accessible Button component
│   ├── app-shell.tsx         # Central layout shell wrapper
│   ├── breadcrumbs.tsx       # Dynamic section / page breadcrumbs
│   ├── header.tsx            # Top navigation header bar
│   ├── sidebar.tsx           # Persistent desktop sidebar & mobile drawer panel
│   └── theme-provider.tsx    # Context API state manager for light/dark theme
├── lib/
│   ├── products.ts           # API fetchers, type definitions & helper utilities
│   └── utils.ts              # Tailwind class merger (cn)
├── .env.example              # Example environment variable file
├── package.json              # Dependencies and project scripts
└── README.md                 # Project documentation
```

---

## ⚡ Performance & SEO Optimizations

1. **Debounced Search**: Search input uses a 250ms debounce window to prevent unnecessary recalculations on every keystroke.
2. **Memoized Derivations**: Category lists, filtered results, and sorted datasets are wrapped in `useMemo`.
3. **Optimistic State Management**: Add and Edit operations update the local state immediately while sync requests complete in the background.
4. **Rich Metadata**: Dynamic OpenGraph, Twitter Cards, dynamic product detail meta titles, and structured JSON-LD ready layout.

---

## 📝 Notes & API Limitations

The application uses the public [DummyJSON API](https://dummyjson.com/). DummyJSON simulates `POST` and `PUT` requests but does not permanently save changes to an external database. Newly added or edited items are saved optimistically in the current browser session.
