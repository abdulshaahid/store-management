"use client"

import { type PropsWithChildren, useState } from "react"
import { addProduct, useProducts } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const units = ["kg", "g", "L", "ml", "pcs"] as const

export function AddProductDialog({ children }: PropsWithChildren) {
  const { mutate } = useProducts()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [unit, setUnit] = useState<string>("pcs")
  const { toast } = useToast()

  async function onSave() {
    if (!name.trim()) return
    await addProduct({ name: name.trim(), price: Number(price || 0), unit })
    await mutate()
    toast({ title: "Product added", description: `${name} created.` })
    setName("")
    setPrice(0)
    setUnit("pcs")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ajwa Dates" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price per unit</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value || 0))}
            />
          </div>
          <div className="grid gap-2">
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
