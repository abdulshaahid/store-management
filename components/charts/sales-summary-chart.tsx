"use client"

import { useMemo, useState } from "react"
import { useSales, groupSales } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"

export function SalesSummaryChart() {
  const { data: sales = [] } = useSales()
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  const data = useMemo(() => groupSales(sales, period), [sales, period])

  return (
    <div className="space-y-3">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="flex flex-wrap gap-1 overflow-x-auto">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value={period} className="m-0">
          <Card>
            <CardContent className="pt-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(var(--color-chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="oklch(var(--color-chart-1))" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
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
                      fill="url(#fillPrimary)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
