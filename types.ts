export type Product = {
  id: string
  name: string
  price: number
  unit: string // kg, g, L, ml, pcs
}

export type SaleItem = {
  productId: string
  name: string
  unit: string
  qty: number
  price: number
  subtotal: number
}

export type Sale = {
  id: string
  items: SaleItem[]
  total: number
  date: string // ISO
}
