"use client"

import { useMemo, useState } from "react"
import { useProducts, useSales, salesForProduct, groupSales } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import Link from "next/link"

export default function ProductDetails({ id }: { id: string }) {
  const { data: products = [] } = useProducts()
  const { data: sales = [] } = useSales()
  const product = products.find((p) => p.id === id)
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  const productSales = useMemo(() => salesForProduct(sales, id), [sales, id])
  const series = useMemo(() => groupSales(productSales, period), [productSales, period])

  if (!product) {
    return (
      <div>
        <p className="text-muted-foreground">Product not found.</p>
        <Link href="/products" className="text-sm underline underline-offset-4">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">{product.name}</h1>
        <Link href="/products" className="text-sm underline underline-offset-4">
          Back
        </Link>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Sales for {product.name}</CardTitle>
          <CardDescription>View sales over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList className="flex flex-wrap gap-1 overflow-x-auto">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value={period} className="m-0">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-muted" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(v) =>
                        Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                        }).format(v)
                      }
                      width={60}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v)
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="oklch(var(--color-primary))"
                      fill="oklch(var(--color-chart-1))"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
