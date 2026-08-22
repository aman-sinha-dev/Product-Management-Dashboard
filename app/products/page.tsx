'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductFilters } from '@/components/products/product-filters'
import { emptyForm, FormState, ProductModal } from '@/components/products/product-modal'
import { ProductTable } from '@/components/products/product-table'
import { useProducts } from '@/components/products-provider'
import { Product } from '@/lib/products'
import { Package, Plus, RefreshCw } from 'lucide-react'

export default function ProductsPage() {
  const { products, loading, error, loadProducts, addProduct, updateProduct } =
    useProducts()

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const pageSize = 8

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 250)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setPage(1)
  }, [debouncedQuery, category, sort])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  )

  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            `${p.title} ${p.brand ?? ''} ${p.category}`
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase()) &&
            (category === 'all' || p.category === category)
        )
        .sort((a, b) =>
          sort === 'price-low'
            ? a.price - b.price
            : sort === 'price-high'
              ? b.price - a.price
              : sort === 'rating'
                ? b.rating - a.rating
                : sort === 'stock'
                  ? a.stock - b.stock
                  : a.id - b.id
        ),
    [products, debouncedQuery, category, sort]
  )

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      title: p.title,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      description: p.description,
      brand: p.brand ?? '',
      imageUrl: p.thumbnail,
    })
    setFormOpen(true)
  }

  const toggleFavorite = (id: number) => {
    setFavorites((f) =>
      f.includes(id) ? f.filter((item) => item !== id) : [...f, id]
    )
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      Number(form.price) <= 0 ||
      Number(form.stock) < 0 ||
      !form.imageUrl.trim()
    )
      return notify('Complete all required fields with valid values.')

    setSaving(true)
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      thumbnail: form.imageUrl.trim(),
    }

    try {
      if (editing) {
        await updateProduct(editing.id, payload)
        notify('Product updated')
      } else {
        await addProduct(payload)
        notify('Product added successfully')
      }
      setFormOpen(false)
    } catch {
      notify('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Catalog management</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your full product list, edit details, and add new items.
          </p>
        </div>
        <Button onClick={openAdd} className="cursor-pointer">
          <Plus data-icon="inline-start" />
          Add product
        </Button>
      </div>

      {/* Catalog Container */}
      <div id="products" className="mt-8 rounded-xl border bg-card">
        {/* Filter Toolbar */}
        <ProductFilters
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          categories={categories}
          totalCount={filtered.length}
        />

        {error ? (
          <div className="m-6 rounded-lg border border-destructive/30 bg-destructive/10 p-5">
            <p className="font-medium">Couldn’t load products</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 cursor-pointer"
              onClick={loadProducts}
            >
              <RefreshCw data-icon="inline-start" />
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <ProductTable
            products={visible}
            favorites={favorites}
            page={page}
            totalPages={pages}
            onToggleFavorite={toggleFavorite}
            onEdit={openEdit}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {formOpen && (
        <ProductModal
          editing={editing}
          form={form}
          saving={saving}
          onFormChange={setForm}
          onClose={() => setFormOpen(false)}
          onSubmit={submit}
        />
      )}

      {/* Toast Notice */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  )
}
