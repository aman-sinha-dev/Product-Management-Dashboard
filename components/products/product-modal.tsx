'use client'

import { Button } from '@/components/ui/button'
import { Product } from '@/lib/products'
import { X } from 'lucide-react'

export type FormState = {
  title: string
  category: string
  price: string
  stock: string
  description: string
  brand: string
  imageUrl: string
}

export const emptyForm: FormState = {
  title: '',
  category: 'beauty',
  price: '',
  stock: '',
  description: '',
  brand: '',
  imageUrl: '',
}

interface ProductModalProps {
  editing: Product | null
  form: FormState
  saving: boolean
  onFormChange: (form: FormState) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function ProductModal({
  editing,
  form,
  saving,
  onFormChange,
  onClose,
  onSubmit,
}: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4">
      <form
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-2xl border bg-card p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {editing ? 'Edit product' : 'Add product'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Required fields are marked by the browser.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            aria-label="Close form"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">Product name</span>
            <input
              required
              value={form.title}
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label>
            <span className="text-sm font-medium">Category</span>
            <input
              required
              value={form.category}
              onChange={(e) => onFormChange({ ...form, category: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label>
            <span className="text-sm font-medium">Brand</span>
            <input
              value={form.brand}
              onChange={(e) => onFormChange({ ...form, brand: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label>
            <span className="text-sm font-medium">Price</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => onFormChange({ ...form, price: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label>
            <span className="text-sm font-medium">Stock quantity</span>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => onFormChange({ ...form, stock: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">Product image URL</span>
            <input
              required
              type="url"
              value={form.imageUrl}
              onChange={(e) => onFormChange({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border bg-background p-3 text-sm"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => onFormChange(emptyForm)}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="cursor-pointer">
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
