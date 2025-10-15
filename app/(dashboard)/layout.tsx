import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileTabBar } from "@/components/mobile-tab-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-[1400px]">
        <Sidebar />
        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-24">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  )
}
