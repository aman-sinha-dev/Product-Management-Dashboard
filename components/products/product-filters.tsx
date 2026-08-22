'use client'

import { Search } from 'lucide-react'

interface ProductFiltersProps {
  query: string
  onQueryChange: (q: string) => void
  category: string
  onCategoryChange: (c: string) => void
  sort: string
  onSortChange: (s: string) => void
  categories: string[]
  totalCount: number
}

export function ProductFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
  totalCount,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold">All products</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount} products found
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative">
          <span className="sr-only">Search products</span>
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search products..."
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
          />
        </label>
        <select
          aria-label="Filter category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-9 cursor-pointer rounded-lg border bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>
          {categories.slice(1).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 cursor-pointer rounded-lg border bg-background px-3 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Rating: high to low</option>
          <option value="stock">Stock: low first</option>
        </select>
      </div>
    </div>
  )
}
