"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, TrendingUp, Download } from "lucide-react"

// Mock hook - replace with your actual useSales implementation
const useSales = () => ({
  data: [
    { id: 1, date: new Date(), productName: "Widget A", quantity: 5, amount: 150, total: 150 },
    { id: 2, date: new Date(), productName: "Widget B", quantity: 3, amount: 90, total: 90 },
    { id: 3, date: new Date(), productName: "Widget A", quantity: 2, amount: 60, total: 60 },
    { id: 4, date: new Date(Date.now() - 86400000), productName: "Widget C", quantity: 10, amount: 300, total: 300 },
    { id: 5, date: new Date(Date.now() - 86400000 * 2), productName: "Widget A", quantity: 4, amount: 120, total: 120 },
    { id: 6, date: new Date(), productName: "Widget D", quantity: 7, amount: 210, total: 210 },
    { id: 7, date: new Date(), productName: "Widget E", quantity: 2, amount: 80, total: 80 },
    { id: 8, date: new Date(), productName: "Widget F", quantity: 1, amount: 40, total: 40 },
  ]
})

type Sale = {
  id: number
  date: Date
  productName: string
  quantity: number
  amount: number
  total: number
}

type Period = "today" | "week" | "month" | "year"

function filterSalesByPeriod(sales: Sale[], period: Period) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (period) {
    case "today":
      return sales.filter(sale => new Date(sale.date) >= startOfToday)
    case "week":
      const weekAgo = new Date(startOfToday)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sales.filter(sale => new Date(sale.date) >= weekAgo)
    case "month":
      const monthAgo = new Date(startOfToday)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return sales.filter(sale => new Date(sale.date) >= monthAgo)
    case "year":
      const yearAgo = new Date(startOfToday)
      yearAgo.setFullYear(yearAgo.getFullYear() - 1)
      return sales.filter(sale => new Date(sale.date) >= yearAgo)
    default:
      return sales
  }
}

function calculateMetrics(sales: Sale[]) {
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalProducts = sales.reduce((sum, sale) => sum + sale.quantity, 0)
  
  const productStats = sales.reduce((acc, sale) => {
    if (!acc[sale.productName]) {
      acc[sale.productName] = { quantity: 0, amount: 0 }
    }
    acc[sale.productName].quantity += sale.quantity
    acc[sale.productName].amount += sale.amount
    return acc
  }, {} as Record<string, { quantity: number; amount: number }>)
  
  const topProducts = Object.entries(productStats)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10)
  
  return { totalAmount, totalProducts, topProducts }
}

function getPeriodLabel(period: Period) {
  const now = new Date()
  switch (period) {
    case "today":
      return now.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    case "week":
      return "Last 7 days"
    case "month":
      return "Last 30 days"
    case "year":
      return "Last year"
    default:
      return ""
  }
}

function SalesSummaryChart() {
  const { data: sales = [] } = useSales()
  const [period, setPeriod] = useState<Period>("today")

  const metrics = useMemo(() => {
    const filtered = filterSalesByPeriod(sales, period)
    return calculateMetrics(filtered)
  }, [sales, period])

  const periodLabel = getPeriodLabel(period)

  return (
    <div className="space-y-3 sm:space-y-4 sm:p-0">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-9 sm:h-10 p-0.5 sm:p-1">
          <TabsTrigger value="today" className="text-xs sm:text-sm px-1 sm:px-3">Today</TabsTrigger>
          <TabsTrigger value="week" className="text-xs sm:text-sm px-1 sm:px-3">Week</TabsTrigger>
          <TabsTrigger value="month" className="text-xs sm:text-sm px-1 sm:px-3">Month</TabsTrigger>
          <TabsTrigger value="year" className="text-xs sm:text-sm px-1 sm:px-3">Year</TabsTrigger>
        </TabsList>
        
        <TabsContent value={period} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          {/* Period Label */}
          <div className="text-center py-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-sm">
              {periodLabel}
            </span>
          </div>

          {/* Stats Grid - Responsive 2 columns */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Revenue Card */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-green-50/80 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10 overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/70 dark:bg-green-900/30 shadow-sm">
                    <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-700 dark:text-green-400" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-xs text-green-700/70 dark:text-green-400/70 font-medium">Revenue</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900 dark:text-green-100 leading-none">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(metrics.totalAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Card */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/70 dark:bg-blue-900/30 shadow-sm">
                    <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-xs text-blue-700/70 dark:text-blue-400/70 font-medium">Items Sold</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 dark:text-blue-100 leading-none">{metrics.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold">Top Products</h3>
              </div>
              
              {metrics.topProducts.length > 0 ? (
                <div className="space-y-1.5 max-h-[280px] sm:max-h-[320px] overflow-y-auto overscroll-contain -mr-1 pr-1 sm:-mr-2 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {metrics.topProducts.map(([name, stats], index) => (
                    <div 
                      key={name} 
                      className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/30 dark:to-gray-800/20 hover:from-amber-50/60 hover:to-orange-50/60 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30 flex-shrink-0 shadow-sm">
                        <span className="text-[10px] sm:text-xs font-bold text-green-700 dark:text-green-400">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate leading-tight">{name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{stats.quantity} units</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 leading-tight">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(stats.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted/30 flex items-center justify-center mb-2">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">No sales data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SalesSummary() {
  return (
    <Card className="md:col-span-2 shadow-lg">
      <CardHeader>
        <CardTitle>Sales Summary</CardTitle>
        <CardDescription>Daily, weekly, or monthly totals</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <SalesSummaryChart />
        <Button variant="secondary" className="w-full md:w-auto flex items-center">
          <Download className="mr-2 size-4" />
          Download (CSV)
        </Button>
      </CardContent>
    </Card>
  )
}