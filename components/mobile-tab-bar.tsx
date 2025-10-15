"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, PackageSearch, LineChart } from "lucide-react"

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: PackageSearch },
  { label: "Reports", href: "/reports", icon: LineChart },
  { label: "Summary", href: "/summary", icon: LineChart },
]

export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Bottom tabs"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon
          const active = pathname === it.href
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-xs",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" />
                <span className="leading-none">{it.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
