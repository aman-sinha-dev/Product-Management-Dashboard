'use client'

import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { useTheme } from '@/components/theme-provider'
import { Bell, Menu, Moon, Sun } from 'lucide-react'

interface HeaderProps {
  onOpenMobileNav: () => void
  onNotify: (message: string) => void
}

export function Header({ onOpenMobileNav, onNotify }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="relative flex h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu className="size-5" />
        </Button>

        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          aria-label="Notifications"
          onClick={() => onNotify('You are all caught up')}
        >
          <Bell className="size-5" />
        </Button>

        <div className="ml-2 hidden size-8 place-items-center rounded-full bg-secondary text-xs font-semibold sm:grid">
          JD
        </div>
      </div>
    </header>
  )
}
