"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Receipt,
  ShoppingCart,
} from "lucide-react";

type CartItem = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
};

// Mock data for demo
const mockProducts = [
  { id: "1", name: "Laptop", unit: "piece", price: 999.99 },
  { id: "2", name: "Mouse", unit: "piece", price: 29.99 },
  { id: "3", name: "Keyboard", unit: "piece", price: 79.99 },
  { id: "4", name: "Monitor", unit: "piece", price: 299.99 },
  { id: "5", name: "USB Cable", unit: "piece", price: 9.99 },
  { id: "6", name: "Headphones", unit: "piece", price: 149.99 },
];

export function NewSaleDialog() {
  const products = mockProducts;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showBill, setShowBill] = useState(false);
  const [saleData, setSaleData] = useState<CartItem[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
      : products.slice(0, 6);
  }, [products, query]);

  const total = cart.reduce((acc, it) => acc + it.price * it.qty, 0);

  function addToCart(p: {
    id: string;
    name: string;
    unit: string;
    price: number;
  }) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        { productId: p.id, name: p.name, unit: p.unit, price: p.price, qty: 1 },
      ];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }

  async function onCompleteSale() {
    if (cart.length === 0) return;

    setSaleData([...cart]);
    setShowBill(true);

    setTimeout(() => {
      setShowBill(false);
      setCart([]);
      setOpen(false);
      setSaleData([]);
    }, 4000);
  }

  function resetAndClose() {
    setOpen(false);
    setCart([]);
    setQuery("");
  }

  return (
    <>
      {/* New Sale Tile Trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group cursor-pointer rounded-xl border-2 border-dashed border-muted-foreground/25 bg-card p-4 sm:p-6 transition-all duration-300 hover:border-primary hover:bg-accent hover:shadow-lg hover:scale-[1.02]">
            <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
              <div className="rounded-full bg-primary/10 p-3 sm:p-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Plus className="size-5 sm:size-6 text-primary transition-transform group-hover:rotate-90 duration-300" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground">
                  New Sale
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create a new transaction
                </p>
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="w-[96vw] max-w-3xl h-[92vh] sm:h-[85vh] p-0 flex flex-col gap-0 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-8 duration-300">
          <DialogHeader className="px-3 pt-3 sm:px-6 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0 border-b bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 animate-in zoom-in duration-500 delay-100">
                <ShoppingCart className="size-4 sm:size-5 text-primary" />
              </div>
              <span className="animate-in slide-in-from-left duration-500 delay-150">
                New Sale
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2">
            <div className="space-y-3 sm:space-y-4 pb-2">
              {/* Search */}
              <div className="relative sticky top-0 bg-background pt-1 pb-2 z-10">
                <Search
                  className={`pointer-events-none absolute left-2.5 sm:left-3 top-1/2 size-3.5 sm:size-4 -translate-y-1/2 text-muted-foreground transition-all duration-300 ${
                    query ? "scale-110 text-primary" : ""
                  }`}
                />
                <Input
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 sm:pl-9 h-9 sm:h-10 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Product Quick-Pick */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                  Select Products
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {filtered.length}
                  </span>
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p, idx) => (
                    <button
                      key={p.id}
                      className="group/card rounded-lg border p-2 sm:p-3 text-left transition-all duration-200 hover:bg-accent hover:border-primary hover:shadow-md hover:-translate-y-1 active:scale-95 animate-in fade-in-0 slide-in-from-bottom-2"
                      style={{
                        animationDelay: `${idx * 30}ms`,
                        animationDuration: "300ms",
                      }}
                      onClick={() => addToCart(p)}
                    >
                      <div className="font-medium text-xs sm:text-sm truncate group-hover/card:text-primary transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                        {p.unit}
                      </div>
                      <div className="text-[10px] sm:text-xs font-medium text-primary mt-0.5 sm:mt-1 flex items-center justify-between">
                        <span>${p.price.toFixed(2)}</span>
                        <Plus className="size-3 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="size-3.5" />
                  Cart
                  {cart.length > 0 && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full animate-in zoom-in duration-200">
                      {cart.length}
                    </span>
                  )}
                </h4>
                <div className="space-y-2">
                  {cart.map((i, idx) => (
                    <div
                      key={i.productId}
                      className="rounded-lg border bg-card p-2.5 sm:p-3 animate-in fade-in-0 slide-in-from-right-4 hover:shadow-md hover:border-primary/50 transition-all duration-200"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        animationDuration: "300ms",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">
                            {i.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">
                            {i.unit}
                          </div>
                        </div>
                        <button
                          className="rounded-md p-1 sm:p-1.5 text-destructive hover:bg-destructive/10 flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95"
                          onClick={() => removeFromCart(i.productId)}
                          aria-label="Remove"
                        >
                          <Trash2 className="size-3.5 sm:size-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label
                            htmlFor={`price-${i.productId}`}
                            className="text-[10px] sm:text-xs text-muted-foreground mb-1 block"
                          >
                            Price / unit
                          </Label>
                          <Input
                            id={`price-${i.productId}`}
                            type="number"
                            min={0}
                            step="0.01"
                            value={i.price}
                            onChange={(e) => {
                              const v = Number(e.target.value || 0);
                              setCart((prev) =>
                                prev.map((x) =>
                                  x.productId === i.productId
                                    ? { ...x, price: v }
                                    : x
                                )
                              );
                            }}
                            className="h-8 sm:h-9 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`qty-${i.productId}`}
                            className="text-[10px] sm:text-xs text-muted-foreground mb-1 block"
                          >
                            Quantity
                          </Label>
                          <Input
                            id={`qty-${i.productId}`}
                            type="number"
                            min={1}
                            step="1"
                            value={i.qty}
                            onChange={(e) => {
                              const v = Math.max(
                                1,
                                Number(e.target.value || 1)
                              );
                              setCart((prev) =>
                                prev.map((x) =>
                                  x.productId === i.productId
                                    ? { ...x, qty: v }
                                    : x
                                )
                              );
                            }}
                            className="h-8 sm:h-9 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t text-right">
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          Subtotal:{" "}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-primary">
                          ${(i.price * i.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="rounded-lg border border-dashed p-6 sm:p-8 text-center text-xs sm:text-sm text-muted-foreground bg-muted/30">
                      <ShoppingCart className="size-8 mx-auto mb-2 opacity-50" />
                      No items added yet. Select products above.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 rounded-2xl border-t bg-gradient-to-r z-50 from-background via-primary/5 to-background shadow-md">
            <div className="px-3 sm:px-6 py-2.5 sm:py-3">
              <div className="flex items-center justify-between mb-2.5 bg-muted rounded-lg p-2">
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Total Amount
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-9 sm:h-10 text-sm transition-all hover:scale-105"
                  onClick={resetAndClose}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full sm:flex-1 h-9 sm:h-10 text-sm transition-all hover:scale-105 active:scale-95"
                  onClick={onCompleteSale}
                  disabled={cart.length === 0}
                >
                  Complete Sale
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Animation - Portal style */}
      {showBill && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md">
            {/* Success Checkmark with enhanced animation */}
            <div className="flex justify-center mb-10 sm:mb-8">
              <div className="relative animate-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-3 sm:p-5">
                  <CheckCircle2 className="size-12 sm:size-16 text-green-600" />
                </div>

                <div
                  className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping"
                  style={{
                    animationDuration: "1s",
                    animationIterationCount: "1",
                  }}
                />
              </div>
            </div>

            {/* Bill with enhanced design */}
            <div className="rounded-2xl bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 delay-200 ">
              {/* Header with gradient and pattern */}
              <div className="bg-gradient-to-r from-primary via-primary to-primary/90 px-4 sm:px-6 py-4 sm:py-5 text-primary-foreground relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                </div>

                <div className="flex items-center gap-3 relative">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm animate-in zoom-in duration-500 delay-300 shadow-lg">
                    <Receipt className="size-5 sm:size-6" strokeWidth={2.5} />
                  </div>
                  <div className="animate-in slide-in-from-left duration-500 delay-400 flex-1">
                    <h3 className="font-bold text-base sm:text-lg">
                      Sale Completed Successfully
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                      {new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill content */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[50vh] overflow-y-auto">
                <div className="space-y-2">
                  {saleData.map((item, idx) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-start gap-4 text-xs sm:text-sm animate-in slide-in-from-left-4 fade-in-0 duration-400 p-2.5 rounded-lg hover:bg-accent/50 transition-all group"
                      style={{ animationDelay: `${500 + idx * 80}ms` }}
                    >
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                          {item.qty} {item.unit} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-semibold text-primary">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total section */}
                <div
                  className="border-t-2 border-dashed pt-3 sm:pt-4 animate-in fade-in duration-500"
                  style={{ animationDelay: `${700 + saleData.length * 80}ms` }}
                >
                  <div className="flex justify-between items-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-3 sm:p-4 rounded-xl shadow-sm">
                    <span className="font-semibold text-base sm:text-lg">
                      Total Amount
                    </span>
                    <div className="text-right">
                      <div
                        className="font-bold text-2xl sm:text-3xl text-primary animate-in zoom-in duration-500"
                        style={{
                          animationDelay: `${800 + saleData.length * 80}ms`,
                        }}
                      >
                        $
                        {saleData
                          .reduce((acc, it) => acc + it.price * it.qty, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thank you message */}
                <div
                  className="text-center pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${900 + saleData.length * 80}ms` }}
                >
                  <p className="text-xs text-muted-foreground">
                    Thank you for your business!
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-close message */}
            <p
              className="text-center text-xs sm:text-sm text-white/90 mt-3 sm:mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "1100ms" }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                Closing automatically...
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
