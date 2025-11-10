"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, MapPin, CreditCard, Truck } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { createOrder } from "@/actions/checkout";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface CheckoutClientProps {
  cartItems: CartItem[];
  addresses: Address[];
}

export default function CheckoutClient({ cartItems, addresses }: CheckoutClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderNote, setOrderNote] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createOrder({
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        paymentMethod,
        customerNote: orderNote || undefined,
      });

      if (result.success && result.order) {
        // Clear local cart count
        localStorage.setItem("cartCount", "0");
        localStorage.removeItem("cartVisited");
        window.dispatchEvent(new Event("storage"));

        toast.success(`Order placed successfully! Order #${result.order.orderNumber}`);

        // Redirect to profile page to view orders
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to proceed with checkout</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No saved addresses found</p>
                    <Button asChild variant="outline">
                      <Link href="/profile">Add Address in Profile</Link>
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div className="font-semibold">{address.fullName}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.postalCode}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Phone: {address.phone}
                              </div>
                              {address.isDefault && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                    Default Address
                                  </span>
                                </div>
                              )}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-start space-x-3 border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <RadioGroupItem value="Cash on Delivery" id="cod" className="mt-1" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Pay when your order is delivered
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 border rounded-lg p-4 mt-4 opacity-50">
                    <RadioGroupItem value="CARD" id="card" disabled className="mt-1" />
                    <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground mt-1">Coming soon</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Special instructions for delivery..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.color} • {item.size}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">${item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal > 100 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      🎉 Free shipping applied!
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={submitting || !selectedAddressId || cartItems.length === 0}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing an order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
