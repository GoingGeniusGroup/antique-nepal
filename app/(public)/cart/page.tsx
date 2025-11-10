"use client";

import Link from "next/link";
import { ChevronLeft, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";

import { Pagination } from "@/components/products/pagination";

const cartItems = [
  {
    id: 1,
    name: "Traditional Hemp Tote Bag",
    price: 3499,
    image: "/hemp-bag-1 1.png",
    quantity: 1,
    category: "Bags",
  },
  {
    id: 2,
    name: "Hemp Crossbody Bag",
    price: 2799,
    image: "/hemp-bag-2 1.png",
    quantity: 2,
    category: "Bags",
  },
  {
    id: 3,
    name: "Premium Hemp Weekender",
    price: 5999,
    image: "/hemp-bag-3 1.png",
    quantity: 1,
    category: "Bags",
  },
  {
    id: 4,
    name: "Organic Hemp Backpack",
    price: 4599,
    image: "/hemp-bag-1 1.png",
    quantity: 1,
    category: "Bags",
  },
  {
    id: 5,
    name: "Hemp Clutch Bag",
    price: 2299,
    image: "/hemp-bag-2 1.png",
    quantity: 1,
    category: "Accessories",
  },
];

const ITEMS_PER_PAGE = 3;

export default function CartPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);

  const paginatedItems = cartItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Shopping Cart</span>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {paginatedItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 shrink-0 rounded-md bg-muted overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            width={200}
                            height={200}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {item.category}
                            </p>
                            <h3 className="font-semibold text-sm mb-2">
                              {item.name}
                            </h3>
                            <p className="text-lg font-bold text-primary">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button className="text-muted-foreground cursor-pointer hover:text-destructive transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>

                          <div className="flex items-center border border-border rounded-md">
                            <button className="px-3 py-1 cursor-pointer hover:bg-accent transition-colors">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 border-x border-border text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button className="px-3 py-1 cursor-pointer hover:bg-accent transition-colors">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-sm font-semibold">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* ShadCN Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Shipping
                          {shipping === 0 && (
                            <span className="text-green-600"> (Free)</span>
                          )}
                        </span>
                        <span className="font-medium">
                          {shipping === 0 ? "Free" : `₹${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (18%)</span>
                        <span className="font-medium">₹{tax}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{total}</span>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                      asChild
                    >
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full mt-2"
                      asChild
                    >
                      <Link href="/products">Continue Shopping</Link>
                    </Button>

                    {shipping > 0 && (
                      <div className="p-3 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-600 rounded-md text-xs text-amber-800 dark:text-slate-200">
                        Add ₹{999 - subtotal} more for free shipping!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Add items to your cart to proceed with checkout
                </p>
                <Button asChild className="mt-6">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
