"use client"

import { useMemo, useState } from "react"
import { useSales, groupSales, topProducts, filterSalesByRange } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SalesReports() {
  const { data: sales = [] } = useSales()
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "custom">("daily")
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")

  const viewSales = useMemo(() => {
    if (period === "custom" && start && end) {
      return filterSalesByRange(sales, new Date(start), new Date(end))
    }
    return sales
  }, [sales, period, start, end])

  const series = useMemo(() => {
    if (period === "custom") return groupSales(viewSales, "daily")
    return groupSales(viewSales, period)
  }, [viewSales, period])

  const totalAmount = viewSales.reduce((acc, s) => acc + s.total, 0)
  const transactions = viewSales.length
  const top = topProducts(viewSales).slice(0, 5)

  return (
    <div className="space-y-4">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <TabsList className="flex flex-wrap gap-1 overflow-x-auto">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
      </Tabs>

      {period === "custom" && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Date Range</CardTitle>
            <CardDescription>Select a start and end date</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2">
              <label htmlFor="start" className="text-sm">
                Start date
              </label>
              <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="end" className="text-sm">
                End date
              </label>
              <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Totals for the selected range</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Total sales amount</div>
            <div className="text-xl font-semibold">
              {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(totalAmount)}
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Transactions</div>
            <div className="text-xl font-semibold">{transactions}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Top products</div>
            <div className="text-xl font-semibold">{top[0]?.name ?? "—"}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trend</CardTitle>
          <CardDescription>Sales totals over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {series.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell>
                      {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(row.total)}
                    </TableCell>
                  </TableRow>
                ))}
                {series.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline">Download CSV</Button>
            <Button variant="secondary">Download PDF</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Based on total revenue</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top.map((t) => (
                <TableRow key={t.productId}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.qty}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(t.revenue)}
                  </TableCell>
                </TableRow>
              ))}
              {top.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>View each sale and its items</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {[...viewSales]
              .sort((a, b) => +new Date(b.date) - +new Date(a.date))
              .map((sale) => {
                const dateStr = new Date(sale.date).toLocaleString()
                return (
                  <AccordionItem key={sale.id} value={sale.id} className="border-b">
                    <AccordionTrigger className="px-2 py-3">
                      <div className="flex w-full items-center justify-between gap-3 text-left">
                        <div className="text-sm">
                          <div className="font-medium">Sale on {dateStr}</div>
                          <div className="text-muted-foreground">{sale.items.length} item(s)</div>
                        </div>
                        <div className="text-sm font-semibold">
                          {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(sale.total)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Unit</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sale.items.map((it, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{it.name}</TableCell>
                                <TableCell>{it.qty}</TableCell>
                                <TableCell>{it.unit}</TableCell>
                                <TableCell>
                                  {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
                                    it.price,
                                  )}
                                </TableCell>
                                <TableCell>
                                  {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
                                    it.subtotal,
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            {viewSales.length === 0 && <div className="text-center text-sm text-muted-foreground">No sales yet.</div>}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
