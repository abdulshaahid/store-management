import ProductDetails from "@/components/products/product-details"

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <ProductDetails id={params.id} />
    </div>
  )
}
