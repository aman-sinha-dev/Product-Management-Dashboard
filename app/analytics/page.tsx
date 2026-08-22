import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BarChart3, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analytics Overview',
  description: 'View catalog performance, inventory distribution by category, and stock health rates.',
}

const metrics = [
  ['Catalog value', '$128,420', '+12.4%'],
  ['Units in stock', '1,284', '+8.2%'],
  ['Average rating', '4.6 / 5', '+0.3'],
  ['Low-stock rate', '14.8%', '-2.1%'],
]
const categories = [
  ['Beauty', 82],
  ['Fragrances', 68],
  ['Furniture', 54],
  ['Groceries', 43],
  ['Laptops', 31],
]

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Back to overview
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium text-primary">Performance overview</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A clear view of inventory health across your catalog.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, change]) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="size-3" />
              {change} vs last period
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-secondary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Inventory by category</h2>
              <p className="text-sm text-muted-foreground">
                Relative product count
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-5">
            {categories.map(([name, value]) => (
              <div key={name as string}>
                <div className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">Inventory health</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Actionable areas for your team
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {[
              ['Healthy stock', '72%', 'Most products are well stocked'],
              ['Needs attention', '18%', 'Review stock levels this week'],
              ['Critical', '10%', 'Reorder before the next sale'],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-lg font-semibold">{value}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
