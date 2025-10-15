"use client"

import useSWR from "swr"
import type { Product, Sale, SaleItem } from "@/types"

const PRODUCTS_KEY = "sm_products"
const SALES_KEY = "sm_sales"

const initialProducts: Product[] = [
  { id: "p1", name: "Ajwa Dates", price: 12.5, unit: "kg" },
  { id: "p2", name: "Sidr Honey", price: 25, unit: "L" },
  { id: "p3", name: "Mixed Nuts", price: 8.75, unit: "kg" },
  { id: "p4", name: "Almonds", price: 9.5, unit: "kg" },
  { id: "p5", name: "Pistachios", price: 11, unit: "kg" },
]

const initialSales: Sale[] = (() => {
  // Generate some recent dummy sales for charts
  const now = new Date()
  const days = 18
  const out: Sale[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const items: SaleItem[] = [
      {
        productId: "p1",
        name: "Ajwa Dates",
        unit: "kg",
        qty: 1 + (i % 3),
        price: 12.5,
        subtotal: 12.5 * (1 + (i % 3)),
      },
      { productId: "p2", name: "Sidr Honey", unit: "L", qty: i % 2, price: 25, subtotal: 25 * (i % 2) },
    ].filter((it) => it.qty > 0)
    const total = items.reduce((a, b) => a + b.subtotal, 0)
    if (total > 0) {
      out.push({ id: `s${i}`, items, total, date: d.toISOString() })
    }
  }
  return out
})()

function ensureSeed() {
  if (typeof window === "undefined") return
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts))
  }
  if (!localStorage.getItem(SALES_KEY)) {
    localStorage.setItem(SALES_KEY, JSON.stringify(initialSales))
  }
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function useProducts() {
  ensureSeed()
  return useSWR<Product[]>(PRODUCTS_KEY, () => read(PRODUCTS_KEY, initialProducts))
}

export function useSales() {
  ensureSeed()
  return useSWR<Sale[]>(SALES_KEY, () => read(SALES_KEY, initialSales))
}

export async function addProduct(input: { name: string; price: number; unit: string }) {
  const curr = read<Product[]>(PRODUCTS_KEY, initialProducts)
  const id = crypto.randomUUID()
  const next = [...curr, { id, ...input }]
  write(PRODUCTS_KEY, next)
}

export async function updateProductPrice(id: string, price: number) {
  const curr = read<Product[]>(PRODUCTS_KEY, initialProducts)
  const next = curr.map((p) => (p.id === id ? { ...p, price } : p))
  write(PRODUCTS_KEY, next)
}

export async function deleteProduct(id: string) {
  const curr = read<Product[]>(PRODUCTS_KEY, initialProducts)
  const next = curr.filter((p) => p.id !== id)
  write(PRODUCTS_KEY, next)
}

export async function completeSale(items: SaleItem[]) {
  const curr = read<Sale[]>(SALES_KEY, initialSales)
  const total = items.reduce((a, b) => a + b.subtotal, 0)
  const sale: Sale = {
    id: crypto.randomUUID(),
    items,
    total,
    date: new Date().toISOString(),
  }
  write(SALES_KEY, [sale, ...curr])
}

export function salesForProduct(sales: Sale[], productId: string) {
  return sales
    .map((s) => {
      const items = s.items.filter((i) => i.productId === productId)
      const total = items.reduce((a, b) => a + b.subtotal, 0)
      return total > 0 ? { ...s, total } : null
    })
    .filter(Boolean) as Sale[]
}

export function totalSoldForProduct(sales: Sale[], productId: string) {
  return sales.reduce((acc, s) => {
    const match = s.items.filter((i) => i.productId === productId)
    return acc + match.reduce((a, b) => a + b.qty, 0)
  }, 0)
}

export function totalRevenueForProduct(sales: Sale[], productId: string) {
  return sales.reduce((acc, s) => {
    const match = s.items.filter((i) => i.productId === productId)
    return acc + match.reduce((a, b) => a + b.subtotal, 0)
  }, 0)
}

export function groupSales(sales: Sale[], period: "daily" | "weekly" | "monthly") {
  // returns [{ label, total }]
  const map = new Map<string, number>()
  for (const s of sales) {
    const d = new Date(s.date)
    let key = ""
    if (period === "daily") {
      key = d.toLocaleDateString()
    } else if (period === "weekly") {
      // ISO week label
      const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      const dayNum = tmp.getUTCDay() || 7
      tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil((((tmp as any) - (yearStart as any)) / 86400000 + 1) / 7)
      key = `W${weekNo} ${tmp.getUTCFullYear()}`
    } else {
      key = d.toLocaleString(undefined, { month: "short", year: "numeric" })
    }
    map.set(key, (map.get(key) || 0) + s.total)
  }
  return Array.from(map.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => {
      // naive date sort; labels are in locale; for demo only
      return a.label.localeCompare(b.label)
    })
}

export function topProducts(sales: Sale[]) {
  const m = new Map<string, { productId: string; name: string; qty: number; revenue: number }>()
  for (const s of sales) {
    for (const it of s.items) {
      const prev = m.get(it.productId) || { productId: it.productId, name: it.name, qty: 0, revenue: 0 }
      prev.qty += it.qty
      prev.revenue += it.subtotal
      m.set(it.productId, prev)
    }
  }
  return Array.from(m.values()).sort((a, b) => b.revenue - a.revenue)
}

export function filterSalesByRange(sales: Sale[], start: Date, end: Date) {
  const s = start.getTime()
  const e = end.getTime()
  return sales.filter((x) => {
    const t = new Date(x.date).getTime()
    return t >= s && t <= e
  })
}
