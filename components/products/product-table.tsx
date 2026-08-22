'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatPrice, Product, stockLabel } from '@/lib/products'
import { ChevronLeft, ChevronRight, Heart, Pencil } from 'lucide-react'

interface ProductTableProps {
  products: Product[]
  favorites: number[]
  page: number
  totalPages: number
  onToggleFavorite: (id: number) => void
  onEdit: (product: Product) => void
  onPageChange: (newPage: number) => void
}

export function ProductTable({
  products,
  favorites,
  page,
  totalPages,
  onToggleFavorite,
  onEdit,
  onPageChange,
}: ProductTableProps) {
  const router = useRouter()

  return (
    <>
      {/* Desktop Data Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30">
                <td className="px-6 py-3">
                  <button
                    className="flex cursor-pointer items-center gap-3 text-left"
                    onClick={() => router.push(`/products/${p.id}`)}
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      loading="lazy"
                      className="size-10 rounded-lg bg-muted object-cover"
                    />
                    <span>
                      <span className="block max-w-52 truncate font-medium">
                        {p.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {p.brand ?? 'Unbranded'}
                      </span>
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">
                  {p.category}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                    {stockLabel(p.stock)}
                  </span>
                </td>
                <td className="px-4 py-3">{p.rating.toFixed(1)} / 5</td>
                <td className="px-6 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      aria-label={`Favorite ${p.title}`}
                      onClick={() => onToggleFavorite(p.id)}
                    >
                      <Heart
                        className={
                          favorites.includes(p.id)
                            ? 'fill-current text-primary'
                            : ''
                        }
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      aria-label={`Edit ${p.title}`}
                      onClick={() => onEdit(p)}
                    >
                      <Pencil />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid gap-3 p-4 md:hidden">
        {products.map((p) => (
          <article key={p.id} className="rounded-lg border p-4">
            <div className="flex gap-3">
              <img
                src={p.thumbnail}
                alt={p.title}
                loading="lazy"
                className="size-14 rounded-lg bg-muted object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{p.title}</h3>
                <p className="text-sm capitalize text-muted-foreground">
                  {p.category} · {formatPrice(p.price)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stockLabel(p.stock)} · {p.rating.toFixed(1)} rating
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.push(`/products/${p.id}`)}
              >
                View details
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="cursor-pointer"
                onClick={() => onEdit(p)}
              >
                Edit
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t p-4">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft data-icon="inline-start" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </>
  )
}
