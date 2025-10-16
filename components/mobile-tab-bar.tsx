"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { label: "Home", href: "/", icon: "fa-solid fa-house" },
  { label: "Products", href: "/products", icon: "fa-solid fa-box" },
  { label: "Reports", href: "/reports", icon: "fa-solid fa-chart-line" },
  { label: "Summary", href: "/summary", icon: "fa-solid fa-chart-pie" },
]

export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
      />
      <nav
        aria-label="Bottom tabs"
        className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-lg border-t shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)] rounded-t-3xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4 px-2 pt-3 pb-1">
          {items.map((it) => {
            const active = pathname === it.href
            return (
              <li key={it.href} className="relative">
                <Link
                  href={it.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs transition-all duration-300 relative group",
                    active 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {/* Active indicator pill */}
                  <div 
                    className={cn(
                      "absolute inset-x-2 top- h-12 bg-primary/10 rounded-2xl transition-all duration-300",
                      active ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                  />
                  
                  {/* Icon container with bounce animation */}
                  <div className="relative z-10">
                    <i 
                      className={cn(
                        it.icon,
                        "text-xl transition-all duration-300",
                        active && "animate-bounce-once scale-110"
                      )}
                      style={{
                        animation: active ? 'bounceOnce 0.6s ease-out' : 'none'
                      }}
                    />
                  </div>
                  
                  {/* Label with slide-up animation */}
                  <span 
                    className={cn(
                      "leading-none relative z-10 transition-all duration-300",
                      active ? "font-semibold opacity-100 translate-y-0" : "font-medium opacity-80 group-hover:opacity-100"
                    )}
                  >
                    {it.label}
                  </span>
                  
                  {/* Active dot indicator */}
              
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <style jsx>{`
        @keyframes bounceOnce {
          0%, 100% {
            transform: translateY(0) scale(1.1);
          }
          50% {
            transform: translateY(-8px) scale(1.15);
          }
        }
        
        .animate-bounce-once {
          animation: bounceOnce 0.6s ease-out;
        }
      `}</style>
    </>
  )
}