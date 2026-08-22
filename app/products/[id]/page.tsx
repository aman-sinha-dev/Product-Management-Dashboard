import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { formatPrice, getProducts, stockLabel } from '@/lib/products'
import { ArrowLeft, Star } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const products = await getProducts()
  const product = products.find(item => item.id === Number(id))
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.title} | Product Specifications`,
    description: product.description,
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const products = await getProducts()
  const product = products.find(item => item.id === Number(id))
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>
      <div className="mt-6 grid gap-8 rounded-2xl border bg-card p-5 sm:p-8 md:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center rounded-xl bg-muted p-6">
          <img
            src={product.images?.[0] ?? product.thumbnail}
            alt={product.title}
            className="max-h-80 w-full object-contain"
          />
        </div>
        <div>
          <p className="text-sm capitalize text-muted-foreground">{product.category}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.title}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="mt-1 text-xl font-semibold">{formatPrice(product.price)}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="mt-1 text-xl font-semibold">{product.discountPercentage}%</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="mt-1 font-semibold">
                {product.stock} · {stockLabel(product.stock)}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="mt-1 flex items-center gap-1 font-semibold">
                <Star className="size-4 fill-current text-primary" />
                {product.rating.toFixed(1)} / 5
              </p>
            </div>
          </div>
          <dl className="mt-6 flex flex-col gap-2 border-t pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Brand</dt>
              <dd className="font-medium">{product.brand ?? 'Unbranded'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Product ID</dt>
              <dd className="font-medium">#{product.id}</dd>
            </div>
          </dl>
          <Link href="/products" className={buttonVariants({ className: 'mt-6 cursor-pointer' })}>
            Return to catalog
          </Link>
        </div>
      </div>
    </div>
  )
}
