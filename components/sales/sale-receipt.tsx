import { SaleItem } from "@/lib/store"

type SaleReceiptProps = {
  items: SaleItem[]
  total: number
  saleNumber: string
  timestamp: string
}

export function SaleReceipt({ items, total, saleNumber, timestamp }: SaleReceiptProps) {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
        <div className="text-3xl font-bold mb-2">Sale Complete</div>
        <div className="text-blue-100 text-sm">Receipt #{saleNumber}</div>
      </div>

      <div className="p-6 space-y-4">
        <div className="text-center text-sm text-gray-500 mb-4">
          {new Date(timestamp).toLocaleString()}
        </div>

        <div className="border-t border-b border-gray-200 py-4 space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.qty} {item.unit} × ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="font-medium text-gray-900">
                ${item.subtotal.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
          <div className="text-xl font-bold text-gray-900">TOTAL</div>
          <div className="text-2xl font-bold text-blue-600">
            ${total.toFixed(2)}
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pt-4">
          Thank you for your purchase!
        </div>
      </div>
    </div>
  )
}
