"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Menu,
  Moon,
  Package,
  Settings,
  Sun,
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const isDark = window.localStorage.getItem("catalog-theme") === "dark";
    setDark(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    window.localStorage.setItem("catalog-theme", dark ? "dark" : "light");
  }, [dark]);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard, exact: true },
    { label: "Products", href: "/products", icon: Package },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const isNavActive = (item: (typeof navItems)[number]) => {
    if (item.exact) return pathname === "/";
    return pathname.startsWith(item.href);
  };

  const getBreadcrumbs = () => {
    if (pathname === "/") return { section: "Workspace", page: "Overview" };
    if (pathname === "/products")
      return { section: "Workspace", page: "Products" };
    if (pathname.startsWith("/products/"))
      return { section: "Workspace", page: "Product Details" };
    if (pathname === "/analytics")
      return { section: "Workspace", page: "Analytics" };
    if (pathname === "/settings")
      return { section: "Manage", page: "Settings" };
    return { section: "Workspace", page: "Dashboard" };
  };

  const breadcrumbs = getBreadcrumbs();

  const handleNavClick = (href: string) => {
    setMobileNavOpen(false);
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card px-5 py-6 lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">
            ProductHub
          </span>
        </Link>

        <p className="px-2 pt-12 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Workspace
        </p>

        <nav className="mt-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item);
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <p className="px-2 pt-9 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Manage
        </p>

        <button
          onClick={() => router.push("/settings")}
          className={`mt-3 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="size-4" />
          Settings
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="lg:pl-64">
        {/* Top Header */}
        <header className="relative flex h-16 items-center justify-between border-b bg-card px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <Menu className="size-5" />
            </Button>

            {/* Mobile Nav Dropdown */}
            {mobileNavOpen && (
              <div className="absolute left-4 top-14 z-40 flex w-48 flex-col gap-1 rounded-lg border bg-card p-2 shadow-lg">
                <button
                  className="cursor-pointer rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => handleNavClick("/")}
                >
                  Overview
                </button>
                <button
                  className="cursor-pointer rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => handleNavClick("/products")}
                >
                  Products
                </button>
                <button
                  className="cursor-pointer rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => handleNavClick("/analytics")}
                >
                  Analytics
                </button>
                <button
                  className="cursor-pointer rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => handleNavClick("/settings")}
                >
                  Settings
                </button>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {breadcrumbs.section} /{" "}
              <span className="font-medium text-foreground">
                {breadcrumbs.page}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              onClick={() => notify("You are all caught up")}
            >
              <Bell className="size-5" />
            </Button>
            <div className="ml-2 grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">
              JD
            </div>
          </div>
        </header>

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
  );
}
