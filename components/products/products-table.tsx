"use client"

import { useMemo, useState } from "react"
import { AddProductDialog } from "./add-product-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  useProducts,
  updateProductPrice,
  deleteProduct,
  useSales,
  totalSoldForProduct,
  totalRevenueForProduct,
} from "@/lib/store"
import { ArrowDownUp, Pencil, Save, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductsTable() {
  const { data: products = [], mutate } = useProducts()
  const { data: sales = [] } = useSales()
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price">("name")
  const [editing, setEditing] = useState<{ [id: string]: number }>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products
    return [...list].sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : a.price - b.price))
  }, [products, query, sortBy])

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle>Products</CardTitle>
        <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative sm:w-64">
            <Input
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            className="w-full sm:w-auto bg-transparent"
            variant="outline"
            onClick={() => setSortBy(sortBy === "name" ? "price" : "name")}
          >
            <ArrowDownUp className="mr-2 size-4" />
            Sort by {sortBy === "name" ? "Price" : "Name"}
          </Button>
          <AddProductDialog>
            <Button className="w-full sm:w-auto">Add Product</Button>
          </AddProductDialog>
        </div>
      </CardHeader>

      {/* Mobile-first card list */}
      <CardContent className="md:hidden space-y-3">
        {filtered.map((p) => {
          const sold = totalSoldForProduct(sales, p.id)
          const revenue = totalRevenueForProduct(sales, p.id)
          const isEditing = editing[p.id] !== undefined
          return (
            <div key={p.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/products/${p.id}`} className="font-medium underline-offset-4 hover:underline">
                  {p.name}
                </Link>
                <span className="text-xs text-muted-foreground">{p.unit}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Price / unit</div>
                  {isEditing ? (
                    <Input
                      className="h-9 w-full max-w-[8rem]"
                      type="number"
                      min={0}
                      step="0.01"
                      value={editing[p.id]}
                      onChange={(e) => setEditing({ ...editing, [p.id]: Number(e.target.value || 0) })}
                    />
                  ) : (
                    <div className="text-sm">
                      {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(p.price)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total sold</div>
                  <div className="text-sm">{sold}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Total sales</div>
                  <div className="text-sm">
                    {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(revenue)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {isEditing ? (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      await updateProductPrice(p.id, Number(editing[p.id]))
                      await mutate()
                      const { [p.id]: _, ...rest } = editing
                      setEditing(rest)
                    }}
                  >
                    <Save className="mr-2 size-4" />
                    Save
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => setEditing({ ...editing, [p.id]: p.price })}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    await deleteProduct(p.id)
                    await mutate()
                  }}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No products found.</div>
        )}
      </CardContent>

      {/* Original table for md+ */}
      <CardContent className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price / unit</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Total sold</TableHead>
              <TableHead>Total sales</TableHead>
              <TableHead className="w-40"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const sold = totalSoldForProduct(sales, p.id)
              const revenue = totalRevenueForProduct(sales, p.id)
              const isEditing = editing[p.id] !== undefined
              return (
                <TableRow key={p.id} className="hover:bg-accent/50">
                  <TableCell>
                    <Link href={`/products/${p.id}`} className="font-medium underline-offset-4 hover:underline">
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        className="h-9 w-28"
                        type="number"
                        min={0}
                        step="0.01"
                        value={editing[p.id]}
                        onChange={(e) => setEditing({ ...editing, [p.id]: Number(e.target.value || 0) })}
                      />
                    ) : (
                      Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(p.price)
                    )}
                  </TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell>{sold}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(revenue)}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <Button
                        size="sm"
                        onClick={async () => {
                          await updateProductPrice(p.id, Number(editing[p.id]))
                          await mutate()
                          const { [p.id]: _, ...rest } = editing
                          setEditing(rest)
                        }}
                      >
                        <Save className="mr-2 size-4" />
                        Save
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setEditing({ ...editing, [p.id]: p.price })}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await deleteProduct(p.id)
                        await mutate()
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
