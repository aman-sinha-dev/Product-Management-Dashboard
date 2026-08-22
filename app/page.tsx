'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/components/products-provider'
import { formatPrice } from '@/lib/products'
import { ArrowRight, BarChart3, Package } from 'lucide-react'

export default function OverviewPage() {
  const router = useRouter()
  const { products, loading } = useProducts()

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStockCount = products.filter((p) => p.stock < 20).length
  const avgRating = products.length
    ? (products.reduce((a, p) => a + p.rating, 0) / products.length).toFixed(1)
    : '0.0'

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">System Overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Here is a high-level summary of your catalog metrics
            and inventory health.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/products')} className="cursor-pointer">
            <Package className="mr-2 size-4" />
            Manage Products
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Catalog Value', formatPrice(totalValue), 'Across all inventory'],
          ['Total Products', products.length.toString(), 'In active catalog'],
          [
            'Low Stock Items',
            lowStockCount.toString(),
            'Requires reorder attention',
          ],
          ['Average Rating', `${avgRating} / 5`, 'Overall customer sentiment'],
        ].map(([title, value, detail]) => (
          <div key={title} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-3 text-2xl font-semibold">
              {loading ? '—' : value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      {/* Quick Nav Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">Products Catalog</h3>
              <p className="text-xs text-muted-foreground">
                Full inventory table & editing
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Search, filter, edit stock levels, and add new products to your
            store catalog.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full cursor-pointer"
            onClick={() => router.push('/products')}
          >
            Go to Products <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-xs text-muted-foreground">
                Category breakdown & health
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Review performance metrics, inventory distribution by category,
            and stock health rates.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full cursor-pointer"
            onClick={() => router.push('/analytics')}
          >
            View Analytics <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
