import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { FileQuestion, Home, Package } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-muted-foreground">
        <FileQuestion className="size-8 text-primary" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Sorry, we couldn’t find the page or product you were looking for. It might have been moved or deleted.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}>
          <Home className="mr-2 size-4" />
          Return to Overview
        </Link>
        <Link href="/products" className={buttonVariants({ variant: 'default', className: 'cursor-pointer' })}>
          <Package className="mr-2 size-4" />
          Browse Products Catalog
        </Link>
      </div>
    </div>
  )
}
