import { Suspense } from "react"
import { NewSaleDialog } from "@/components/sales/new-sale-dialog"
import { SalesSummaryChart } from "@/components/charts/sales-summary-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { Download } from "lucide-react"

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header: always show title */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">Home</h1>
        {/* Mobile only New Sale button */}
        <div className="md:hidden">
          <NewSaleDialog />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {/* Sales Summary Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sales Summary</CardTitle>
            <CardDescription>Daily, weekly, or monthly totals</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <Suspense>
              <SalesSummaryChart />
            </Suspense>
            <Button variant="secondary" className="w-full md:w-auto flex items-center">
              <Download className="mr-2 size-4" />
              Download (CSV)
            </Button>
          </CardContent>
        </Card>

        {/* Right column */}
<div className="grid gap-2">
  {/* Desktop New Sale card */}
  <div className="hidden md:block">
    <Card>
      <CardHeader>
        <CardTitle className="text-balance text-base">New Sale</CardTitle>
        <CardDescription>Create a new transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <NewSaleDialog>
          <Button className="w-full" variant="default">
            New Sale
          </Button>
        </NewSaleDialog>
      </CardContent>
    </Card>
  </div>

  {/* Add Product Card */}
  <Card>
    <CardHeader>
      <CardTitle className="text-balance text-base">Add Product</CardTitle>
      <CardDescription>Quickly add a new product</CardDescription>
    </CardHeader>
    <CardContent>
      <AddProductDialog>
        <Button className="w-full" variant="default">
          Add Product
        </Button>
      </AddProductDialog>
    </CardContent>
  </Card>
</div>

      </section>
    </div>
  )
}
