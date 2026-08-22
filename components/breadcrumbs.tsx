'use client'

import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    if (pathname === '/') return { section: 'Workspace', page: 'Overview' }
    if (pathname === '/products') return { section: 'Workspace', page: 'Products' }
    if (pathname.startsWith('/products/')) return { section: 'Workspace', page: 'Product Details' }
    if (pathname === '/analytics') return { section: 'Workspace', page: 'Analytics' }
    if (pathname === '/settings') return { section: 'Manage', page: 'Settings' }
    return { section: 'Workspace', page: 'Dashboard' }
  }

  const { section, page } = getBreadcrumbs()

  return (
    <p className="text-sm text-muted-foreground">
      {section} / <span className="font-medium text-foreground">{page}</span>
    </p>
  )
}
