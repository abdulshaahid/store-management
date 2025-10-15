"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bone as Honey, Home, LineChart, PackageSearch } from "lucide-react"

const items = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Sales Reports", href: "/reports" },
  { label: "Business Summary", href: "/summary" },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-sidebar md:block">
      <div className="flex items-center gap-2 px-4 py-4">
        <Honey className="size-5 text-primary" />
        <div>
          <p className="text-sm font-semibold leading-none">Store Manager</p>
          <p className="text-xs text-muted-foreground">Dates • Honey • Nuts</p>
        </div>
      </div>
      <nav className="mt-2 grid gap-1 p-2">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <span className="inline-flex items-center gap-2">
                {it.label === "Home" && <Home className="size-4" />}
                {it.label === "Products" && <PackageSearch className="size-4" />}
                {it.label === "Sales Reports" && <LineChart className="size-4" />}
                {it.label === "Business Summary" && <LineChart className="size-4" />}
                {it.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
