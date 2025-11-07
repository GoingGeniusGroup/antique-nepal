"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Pagination } from "@/components/products/pagination";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

// ---------------------- TYPES ----------------------
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

interface CartApiItem {
  id: string;
  price: number;
  quantity: number;
  productVariant: {
    color: string;
    size: string;
    product: {
      name: string;
      images: { url: string }[];
    };
  };
}

interface CartApiResponse {
  cart: {
    items: CartApiItem[];
  };
}

const ITEMS_PER_PAGE = 2;

// ---------------------- FETCHER ----------------------
const fetcher = async (url: string): Promise<{ items: CartItem[] }> => {
  const res = await fetch(url);
  const json: CartApiResponse = await res.json();

  const items: CartItem[] =
    json.cart?.items.map((ci) => ({
      id: ci.id,
      name: ci.productVariant.product.name,
      price: ci.price,
      quantity: ci.quantity,
      color: ci.productVariant.color,
      size: ci.productVariant.size,
      image: ci.productVariant.product.images[0]?.url || "",
    })) || [];

  return { items };
};

// ---------------------- CART COMPONENT ----------------------
type LoadingButton = "minus" | "plus" | "remove";

const Cart = ({ userId }: { userId: string }) => {
  const { data, mutate, error } = useSWR<{ items: CartItem[] }>(
    `/api/cart?userId=${userId}`,
    fetcher
  );

  const items = data?.items || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMap, setLoadingMap] = useState<
    Record<string, LoadingButton | null>
  >({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const visibleItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  // ---------------------- SHOW SPINNER WHILE LOADING ----------------------
  if (!data && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  // ---------------------- UPDATE QUANTITY ----------------------
  const updateQuantity = async (
    id: string,
    change: number,
    button: LoadingButton
  ) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      setLoadingMap((prev) => ({ ...prev, [id]: button }));
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: id, quantity: newQuantity }),
      });
      mutate();
      toast.success("Cart updated successfully!");
    } catch {
      toast.error("Failed to update cart.");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: null }));
    }
  };

  // ---------------------- REMOVE ITEM ----------------------
  const confirmRemoveItem = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const removeItem = async () => {
    if (!itemToDelete) return;
    
    const id = itemToDelete;
    try {
      setLoadingMap((prev) => ({ ...prev, [id]: "remove" }));
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId: id }),
      });

      if (visibleItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      // Instantly update count in localStorage
      const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
      localStorage.setItem('cartCount', Math.max(0, currentCount - 1).toString());
      localStorage.removeItem('cartVisited'); // Reset badge
      window.dispatchEvent(new Event('storage')); // Trigger navbar update
      
      mutate();
      toast.success("Item removed successfully!");
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: null }));
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // ---------------------- RENDER ----------------------
  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <ThemeToggle variant="fixed" position="right-4 top-24" />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-accent/30 rounded-lg border border-border">
              <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
              <h2 className="font-serif text-3xl font-semibold mb-3">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Discover our collection of handcrafted hemp bags made by skilled
                Nepali artisans
              </p>
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* CART ITEMS */}
              <div className="lg:col-span-2 space-y-4">
                {visibleItems.map((item) => {
                  const loadingButton = loadingMap[item.id];

                  return (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-6">
                        <div className="relative flex-shrink-0 w-32 h-32">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 object-cover rounded-lg border border-border"
                          />
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-serif text-xl font-semibold">
                                {item.name}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    Color:
                                  </span>
                                  <span className="font-medium">
                                    {item.color}
                                  </span>
                                </div>
                                <span className="text-border">|</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">
                                    Size:
                                  </span>
                                  <span className="font-medium">
                                    {item.size}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmRemoveItem(item.id)}
                              disabled={!!loadingButton}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              {loadingButton === "remove" ? (
                                <Spinner className="h-5 w-5" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 border border-border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, -1, "minus")
                                }
                                disabled={!!loadingButton}
                                className="h-10 w-10"
                              >
                                {loadingButton === "minus" ? (
                                  <Spinner className="h-4 w-4" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                              </Button>

                              <span className="text-lg font-semibold w-12 text-center">
                                {item.quantity}
                              </span>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, 1, "plus")
                                }
                                disabled={!!loadingButton}
                                className="h-10 w-10"
                              >
                                {loadingButton === "plus" ? (
                                  <Spinner className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${item.price} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>

              {/* ORDER SUMMARY */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-6">
                  <h2 className="font-serif text-2xl font-bold">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {subtotal > 0 && subtotal < 100 && (
                      <div className="bg-accent/50 border border-border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">
                          Add{" "}
                          <span className="font-semibold text-primary">
                            ${(100 - subtotal).toFixed(2)}
                          </span>{" "}
                          more for free shipping
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                      size="lg"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" /> Proceed to
                      Checkout
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-primary">✓</div>
                      <p className="text-muted-foreground">
                        Free shipping on orders over $100
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-primary">✓</div>
                      <p className="text-muted-foreground">
                        30-day easy returns
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-primary">✓</div>
                      <p className="text-muted-foreground">
                        Secure payment guaranteed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={removeItem}
        title="Remove Item"
        description="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};

export default Cart;
