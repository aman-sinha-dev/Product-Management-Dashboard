'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getProducts, Product, saveProduct } from '@/lib/products'

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string
  loadProducts: () => Promise<void>
  addProduct: (data: {
    title: string
    category: string
    brand?: string
    price: number
    stock: number
    description: string
    thumbnail: string
  }) => Promise<Product>
  updateProduct: (
    id: number,
    data: {
      title: string
      category: string
      brand?: string
      price: number
      stock: number
      description: string
      thumbnail: string
    }
  ) => Promise<Product>
  getProductById: (id: number) => Product | undefined
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const CUSTOM_PRODUCTS_KEY = 'catalog_custom_products'

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getStoredCustomProducts = (): Product[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.localStorage.getItem(CUSTOM_PRODUCTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveStoredCustomProducts = (customs: Product[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customs))
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const apiProducts = await getProducts()
      const customProducts = getStoredCustomProducts()

      const mergedMap = new Map<number, Product>()
      apiProducts.forEach((p) => mergedMap.set(p.id, p))
      customProducts.forEach((p) => mergedMap.set(p.id, p))

      const mergedList = Array.from(mergedMap.values())
      setProducts(mergedList)
    } catch {
      setError('We couldn’t load the catalog. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const addProduct = async (data: {
    title: string
    category: string
    brand?: string
    price: number
    stock: number
    description: string
    thumbnail: string
  }): Promise<Product> => {
    const newId = Date.now()
    const newProduct: Product = {
      id: newId,
      title: data.title,
      category: data.category,
      brand: data.brand || 'Unbranded',
      price: data.price,
      stock: data.stock,
      description: data.description,
      thumbnail: data.thumbnail,
      images: [data.thumbnail],
      rating: 4.8,
      discountPercentage: 0,
    }

    const customs = [newProduct, ...getStoredCustomProducts()]
    saveStoredCustomProducts(customs)
    setProducts((current) => [newProduct, ...current])

    try {
      await saveProduct(data)
    } catch {
      // Ignored for DummyJSON mock limitations
    }

    return newProduct
  }

  const updateProduct = async (
    id: number,
    data: {
      title: string
      category: string
      brand?: string
      price: number
      stock: number
      description: string
      thumbnail: string
    }
  ): Promise<Product> => {
    let updatedProduct: Product | undefined

    setProducts((current) =>
      current.map((p) => {
        if (p.id === id) {
          updatedProduct = {
            ...p,
            title: data.title,
            category: data.category,
            brand: data.brand || p.brand,
            price: data.price,
            stock: data.stock,
            description: data.description,
            thumbnail: data.thumbnail,
            images: [data.thumbnail],
          }
          return updatedProduct
        }
        return p
      })
    )

    if (updatedProduct) {
      const customs = getStoredCustomProducts().map((p) => (p.id === id ? updatedProduct! : p))
      if (!customs.some((p) => p.id === id)) {
        customs.unshift(updatedProduct!)
      }
      saveStoredCustomProducts(customs)

      try {
        await saveProduct(data, id)
      } catch {
        // Ignored for DummyJSON mock limitations
      }
    }

    return updatedProduct!
  }

  const getProductById = (id: number): Product | undefined => {
    return products.find((p) => p.id === id)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        loadProducts,
        addProduct,
        updateProduct,
        getProductById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
