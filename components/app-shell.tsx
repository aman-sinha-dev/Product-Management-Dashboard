'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { ThemeProvider } from '@/components/theme-provider'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Sidebar (Desktop & Mobile Drawer) */}
        <Sidebar
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <section className="lg:pl-64">
          {/* Top Header Navigation */}
          <Header
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onNotify={notify}
          />

          {/* Page Children */}
          <div>{children}</div>
        </section>

        {/* Global Toast Notice */}
        {notice && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-50 rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-lg"
          >
            {notice}
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}
