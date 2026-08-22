'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BarChart3, LayoutDashboard, Package, Settings, X } from 'lucide-react'

export const navItems = [
  { label: 'Overview', href: '/', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]

interface SidebarProps {
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isNavActive = (item: (typeof navItems)[number]) => {
    if (item.exact) return pathname === '/'
    return pathname.startsWith(item.href)
  }

  const handleNavClick = (href: string) => {
    onCloseMobile()
    router.push(href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card px-5 py-6 lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">ProductHub</span>
        </Link>

        <p className="px-2 pt-12 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>

        <nav className="mt-3 flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isNavActive(item)
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <p className="px-2 pt-9 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Manage
        </p>

        <button
          onClick={() => handleNavClick('/settings')}
          className={`mt-3 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            pathname === '/settings'
              ? 'bg-secondary font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Settings className="size-4" />
          Settings
        </button>
      </aside>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r bg-card px-5 py-6 shadow-2xl lg:hidden">
            <div>
              <div className="flex items-center justify-between px-2">
                <Link href="/" className="flex items-center gap-3" onClick={onCloseMobile}>
                  <div className="grid size-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
                    P
                  </div>
                  <span className="text-lg font-semibold tracking-tight">ProductHub</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={onCloseMobile}
                  aria-label="Close sidebar"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <p className="px-2 pt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Workspace
              </p>

              <nav className="mt-3 flex flex-col gap-1">
                {navItems.map(item => {
                  const Icon = item.icon
                  const active = isNavActive(item)
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                        active
                          ? 'bg-secondary font-medium text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              <p className="px-2 pt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Manage
              </p>

              <button
                onClick={() => handleNavClick('/settings')}
                className={`mt-3 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  pathname === '/settings'
                    ? 'bg-secondary font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Settings className="size-5" />
                Settings
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3 px-2">
                <div className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Store Manager</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
