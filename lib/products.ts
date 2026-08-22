export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
  tags?: string[]
}

type ProductResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com/products'

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}?limit=100`, {
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Unable to load the product catalog.')
  const data = (await response.json()) as ProductResponse
  return data.products
}

export async function saveProduct(product: Partial<Product>, id?: number) {
  const url = id ? `${API_BASE}/${id}` : `${API_BASE}/add`
  const response = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!response.ok) throw new Error('Unable to save product.')
  return (await response.json()) as Product
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    value
  )
export const stockLabel = (stock: number) =>
  stock === 0 ? 'Out of stock' : stock < 20 ? 'Low stock' : 'In stock'
export const stockTone = (stock: number) =>
  stock === 0 ? 'danger' : stock < 20 ? 'warning' : 'success'
