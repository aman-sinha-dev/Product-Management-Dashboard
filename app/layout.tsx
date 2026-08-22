import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AppShell } from '@/components/app-shell'

export const metadata: Metadata = {
  metadataBase: new URL('https://free-product-management-dashboard.vercel.app'),
  title: {
    default: 'Product Management Dashboard | Inventory & Stock Control',
    template: '%s | ProductHub Management Dashboard',
  },
  description:
    'Comprehensive product management dashboard to organize product catalog, manage stock levels, track pricing, and view real-time inventory analytics.',
  keywords: [
    'Product Management Dashboard',
    'Inventory Management System',
    'Stock Control System',
    'Product Catalog Manager',
    'E-commerce Inventory Manager',
    'Next.js Dashboard',
  ],
  authors: [{ name: 'Aman Sinha', url: 'https://github.com/aman-sinha-dev' }],
  openGraph: {
    title: 'Product Management Dashboard | Inventory & Stock Control',
    description:
      'Manage product catalog, track stock levels, and monitor inventory metrics in one focused workspace.',
    url: 'https://free-product-management-dashboard.vercel.app',
    type: 'website',
    locale: 'en_US',
    siteName: 'ProductHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Management Dashboard',
    description:
      'Manage product catalog, track stock levels, and monitor inventory metrics in one focused workspace.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
