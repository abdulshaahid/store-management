"use client"

import { useMemo, useState } from "react"
import { useSales, groupSales } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function BusinessSummary() {
  const { data: sales = [] } = useSales()
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly")

  const totals = useMemo(() => {
    const revenue = sales.reduce((acc, s) => acc + s.total, 0)
    const tx = sales.length
    return { revenue, tx }
  }, [sales])

  const series = useMemo(() => groupSales(sales, period), [sales, period])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(totals.revenue)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{totals.tx}</CardContent>
      </Card>
      <Card className="md:col-span-3">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Trend</CardTitle>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-muted" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v) =>
                    Intl.NumberFormat(undefined, { style: "currency", currency: "USD", notation: "compact" }).format(v)
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
        </CardContent>
      </Card>
    </div>
  )
}
