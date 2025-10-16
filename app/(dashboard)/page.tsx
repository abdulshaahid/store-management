"use client"

import type React from "react"

import { useState } from "react"
import { Search, Trash2, Plus, Minus, X, Check } from "lucide-react"

interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  unit: string
}

const products = [
  {
    id: "1",
    name: "Berry Cake",
    description: "Berry cake blooms.",
    price: 44.04,
    unit: "piece",
  },
  {
    id: "2",
    name: "Apple",
    description: "Apple falls swiftly.",
    price: 29.36,
    unit: "kg",
  },
  {
    id: "3",
    name: "Black Tea",
    description: "Black tea simmers.",
    price: 44.04,
    unit: "box",
  },
  {
    id: "4",
    name: "Cashew nuts",
    description: "Cashew nuts roasted.",
    price: 91.75,
    unit: "kg",
  },
  {
    id: "5",
    name: "Orange Juice",
    description: "Fresh orange juice.",
    price: 22.02,
    unit: "bottle",
  },
  {
    id: "6",
    name: "Honey",
    description: "Pure honey.",
    price: 55.05,
    unit: "jar",
  },
  {
    id: "7",
    name: "Almonds",
    description: "Roasted almonds.",
    price: 66.06,
    unit: "kg",
  },
  {
    id: "8",
    name: "Coffee",
    description: "Premium coffee beans.",
    price: 51.38,
    unit: "bag",
  },
]

function QuantityInput({
  value,
  onChange,
  unit,
  step = 0.5,
}: {
  value: string
  onChange: (value: string) => void
  unit: string
  step?: number
}) {
  const handleDecrement = () => {
    const current = Number.parseFloat(value) || 0
    const newValue = Math.max(0, current - step)
    onChange(newValue === 0 ? "" : newValue.toFixed(2))
  }

  const handleIncrement = () => {
    const current = Number.parseFloat(value) || 0
    onChange((current + step).toFixed(2))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Allow empty string, numbers, and decimal point
    if (inputValue === "" || !isNaN(Number(inputValue))) {
      onChange(inputValue)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDecrement}
        className="bg-gray-100 hover:bg-gray-200 text-black px-3 sm:px-4 py-2 rounded-lg transition"
      >
        <Minus className="w-5 h-5" />
      </button>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="0"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-center font-semibold text-base"
      />
      <button
        onClick={handleIncrement}
        className="bg-lime-300 hover:bg-lime-400 text-black px-3 sm:px-4 py-2 rounded-lg transition"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState("home")
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [quantityInput, setQuantityInput] = useState("")
  const [editingDiscount, setEditingDiscount] = useState(false)
  const [customDiscount, setCustomDiscount] = useState(0)
  const [showCartPreview, setShowCartPreview] = useState(false)

  const handleAddClick = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
    setQuantityInput("")
    setShowQuantityModal(true)
  }

  const confirmAddToCart = () => {
    if (!selectedProduct || !quantityInput) return
    const quantity = Number.parseFloat(quantityInput) || 0
    if (quantity <= 0) return

    const existing = cart.find((item) => item.id === selectedProduct.id)
    if (existing) {
      setCart(
        cart.map((item) => (item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item)),
      )
    } else {
      setCart([
        ...cart,
        {
          ...selectedProduct,
          quantity,
          unit: selectedProduct.unit,
        },
      ])
    }
    setShowQuantityModal(false)
    setSelectedProduct(null)
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = customDiscount
  const total = subtotal - discount

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (currentPage === "cart") {
    return (
      <CartPage
        cart={cart}
        subtotal={subtotal}
        discount={discount}
        total={total}
        onBack={() => setCurrentPage("home")}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onEditDiscount={(value) => setCustomDiscount(value)}
        editingDiscount={editingDiscount}
        setEditingDiscount={setEditingDiscount}
        onClearCart={() => setCart([])}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row gap-0">
        {/* Main Content */}
        <div className="flex-1 pb-40 lg:pb-24">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Store</h1>
              <div className="flex items-center gap-2 bg-lime-300 px-4 py-2 rounded-full font-semibold text-sm sm:text-base">
                Ticket{" "}
                <span className="bg-white text-black px-3 py-1 rounded-full text-xs sm:text-sm ml-2">
                  {cart.length}
                </span>
              </div>
            </div>
          </header>

          {/* Search with Dropdown */}
          <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
            <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto w-full">
              <div className="relative">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-full">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-base flex-1 min-w-0"
                  />
                </div>
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
                      >
                        <button
                          onClick={() => {
                            setSearchQuery(product.name)
                          }}
                          className="flex-1 text-left"
                        >
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">
                            AED {product.price.toFixed(2)} / {product.unit}
                          </p>
                        </button>
                        <button
                          onClick={() => handleAddClick(product)}
                          className="bg-lime-300 hover:bg-lime-400 text-black px-2 py-1 rounded-full font-semibold transition text-xs flex-shrink-0 ml-2"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">All Items</h2>
              <button className="text-lime-500 font-semibold hover:text-lime-600 text-sm sm:text-base">See All</button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button className="flex items-center gap-2 bg-white border-2 border-dashed border-gray-300 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm sm:text-base">
                <Plus className="w-5 h-5" />
                Add
              </button>
              <button className="px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition text-sm sm:text-base">
                All Items
              </button>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">per {product.unit}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lime-700 text-xs sm:text-base"><span className="text-black/60 font-medium text-xs">AED</span> {product.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleAddClick(product)}
                          className="bg-lime-300 hover:bg-lime-400 text-black px-2 sm:px-3 py-2 rounded-full font-semibold transition text-sm sm:text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </main>
        </div>

        <div
          className={`fixed lg:static inset-0 z-40 lg:z-0 transition-all duration-300 ${
            showCartPreview ? "visible" : "invisible lg:visible"
          }`}
        >
          {/* Overlay for mobile */}
          <div
            className={`absolute inset-0 bg-black lg:hidden transition-opacity ${
              showCartPreview ? "opacity-50" : "opacity-0"
            }`}
            onClick={() => setShowCartPreview(false)}
          />

          {/* Cart Preview Panel */}
          <div
            className={`absolute lg:sticky lg:top-16 right-0 top-0 bottom-0 w-full sm:w-96 bg-white border-l border-gray-200 overflow-y-auto transition-transform lg:translate-x-0 h-screen lg:h-[calc(100vh-4rem)] ${
              showCartPreview ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-4 sm:p-6 sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold">Cart Preview</h3>
              <button onClick={() => setShowCartPreview(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {cart.length > 0 ? (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">
                            {item.description} • {item.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">AED {item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 0.5)}
                            className="text-gray-600 hover:text-black transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold w-8 text-center">{item.quantity.toFixed(2)}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 0.5)}
                            className="bg-lime-300 hover:bg-lime-400 text-black rounded-full w-4 h-4 flex items-center justify-center transition"
                          >
                            <Plus className="w-2 h-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary in Preview */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Sub total:</span>
                      <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold">AED {discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-2">
                      <span>Total:</span>
                      <span>AED {total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    {showQuantityModal && selectedProduct && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
    <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-[90%] sm:max-w-md animate-in fade-in zoom-in-95 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg sm:text-xl font-bold break-words min-w-0">
          {selectedProduct.name}
        </h3>
        <button
          onClick={() => setShowQuantityModal(false)}
          className="text-gray-500 hover:text-gray-700 ml-3"
          aria-label="close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

  

      {/* Price */}
      <p className="text-2xl sm:text-3xl font-bold mb-1">AED {selectedProduct.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500 mb-4">per {selectedProduct.unit}</p>

      {/* Quantity input */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-3">Quantity ({selectedProduct.unit})</label>

        <QuantityInput value={quantityInput === "" ? 1 : quantityInput} onChange={setQuantityInput} step={selectedProduct.unit === "piece" ? 1 : 0.01} min={0} />

        <p className="text-xs text-gray-500 mt-2">Supports decimal values (e.g., 0.5, 1.5, 2.25)</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowQuantityModal(false)}
          className="flex-1 border-2 border-gray-300 text-black py-3 rounded-full font-semibold hover:bg-gray-50 transition text-sm sm:text-base"
        >
          Cancel
        </button>

        <button
          onClick={confirmAddToCart}
          disabled={Number(quantityInput) <= 0 || quantityInput === ""}
          className="flex-1 bg-lime-300 hover:bg-lime-400 text-black py-3 rounded-full font-semibold transition text-sm sm:text-base disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
)}

      <div className="fixed bottom-18 lg:bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 sm:px-6 lg:px-8 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto flex gap-3">
          {/* Cart Preview Toggle Button - visible on mobile */}
          <button
            onClick={() => setShowCartPreview(!showCartPreview)}
            className="lg:hidden flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Preview ({cart.length})
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => setCart([])}
            className="flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Cancel
          </button>

          {/* Charge Button */}
          <button
            onClick={() => setCurrentPage("cart")}
            className="flex-1 bg-lime-300 hover:bg-lime-400 text-black py-3 rounded-full font-semibold transition disabled:opacity-50 text-sm sm:text-base"
            disabled={cart.length === 0}
          >
            Charge ({cart.length})
          </button>
        </div>
      </div>
    </div>
  )
}

function CartPage({
  cart,
  subtotal,
  discount,
  total,
  onBack,
  onUpdateQuantity,
  onRemove,
  onEditDiscount,
  editingDiscount,
  setEditingDiscount,
  onClearCart,
}: {
  cart: CartItem[]
  subtotal: number
  discount: number
  total: number
  onBack: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onEditDiscount: (value: number) => void
  editingDiscount: boolean
  setEditingDiscount: (value: boolean) => void
  onClearCart: () => void
}) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [amountReceived, setAmountReceived] = useState(total.toFixed(2))

  const orderId = `#${Math.random().toString(36).substring(2, 15).toUpperCase()}`
  const currentDate = new Date()
  const dateStr = currentDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  const timeStr = currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })

  const handleCharge = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onClearCart()
      onBack()
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-white pb-32 md:pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 max-w-7xl mx-auto">
          <button onClick={onBack} className="text-2xl font-bold hover:text-gray-600 transition">
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Charge</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Total Amount Card */}
        <div className="bg-gradient-to-br from-lime-300 to-lime-200 rounded-2xl p-6 sm:p-8 text-black mb-8 shadow-lg">
          <p className="text-sm text-gray-700 mb-2">Total Amount Due</p>
          <h2 className="text-4xl sm:text-5xl font-bold">AED {total.toFixed(2)}</h2>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 border border-dashed border-gray-200 shadow-md rounded-xl p-6 mb-8 space-y-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">ID order :</p>
            <p className="text-base font-semibold">{orderId}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-600 mb-1">Date :</p>
              <p className="text-base font-semibold">{dateStr}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Time :</p>
              <p className="text-base font-semibold">{timeStr}</p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        {cart.length > 0 ? (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold">Items in Cart</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 p-4 shadow-md rounded-xl border border-dashed border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:text-red-700 transition p-1 flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm sm:text-base">AED {item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 0.5)}
                        className="text-gray-600 hover:text-black transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.quantity.toFixed(2)}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 0.5)}
                        className="bg-lime-300 hover:bg-lime-400 text-black rounded-full w-5 h-5 flex items-center justify-center transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        )}

        {/* Summary */}
        {cart.length > 0 && (
          <div className="bg-gray-50 shadow-md border border-dashed border-gray-200 rounded-xl p-6 space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Sub total :</span>
              <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base items-center">
              <span className="text-gray-600">Discount :</span>
              {editingDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-black/50 text-xs">AED</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => onEditDiscount(Number.parseFloat(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-right font-semibold"
                    min="0"
                    step="0.5"
                  />
                  <button
                    onClick={() => setEditingDiscount(false)}
                    className="text-lime-600 font-semibold hover:text-lime-700"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingDiscount(true)}
                  className="font-semibold hover:text-lime-600 transition"
                >
                  AED {discount.toFixed(2)}
                </button>
              )}
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
              <span>Total :</span>
              <span>AED {total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </main>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 bg-lime-300 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-lime-300 rounded-full p-6 shadow-lg">
              <Check className="w-12 h-12 text-black animate-bounce" strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-18 lg:bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 sm:px-6 lg:px-8 py-4 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto flex gap-3">
          {/* Cancel Button */}
          <button
            onClick={onBack}
            className="flex-1 border-2 border-black text-black py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Cancel
          </button>

          {/* Charge Button */}
          <button
            onClick={handleCharge}
            disabled={cart.length === 0}
            className="flex-1 bg-lime-300 hover:bg-lime-400 text-black py-3 rounded-full font-semibold transition disabled:opacity-50 text-sm sm:text-base"
          >
            Charge ({cart.length})
          </button>
        </div>
      </div>
    </div>
  )
}
