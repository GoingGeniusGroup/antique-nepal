"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, MapPin, CreditCard, Truck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { createOrder, getCart, getUserAddresses } from "@/actions/checkout";
import { useSession } from "next-auth/react";
import { formatNpr } from "@/lib/utils";

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

type EsewaInitiationResponse = {
  formUrl: string;
  payload: Record<string, string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEsewaInitiationResponse(
  value: unknown
): value is EsewaInitiationResponse {
  if (!isRecord(value) || typeof value.formUrl !== "string" || !isRecord(value.payload)) {
    return false;
  }

  return Object.values(value.payload).every(
    (fieldValue) => typeof fieldValue === "string"
  );
}

export default function CheckoutClient({
  showDevPaymentSimulation,
}: {
  showDevPaymentSimulation: boolean;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderNote, setOrderNote] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccessOrderId, setPaymentSuccessOrderId] = useState("");

  // Fetch data on client side for instant page load
  useEffect(() => {
    const callbackStatus = new URLSearchParams(window.location.search).get("status");
    if (callbackStatus === "failed" || callbackStatus === "error") {
      setPaymentError(
        "Your eSewa payment was not completed, and the order remains pending. Check your orders, or contact support if you were charged."
      );
    } else if (callbackStatus === "success") {
      setPaymentSuccessOrderId(
        new URLSearchParams(window.location.search).get("orderId") || ""
      );
    }

    const fetchData = async () => {
      if (status === "loading") return;
      
      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      try {
        const [cartResult, addressesResult] = await Promise.all([
          getCart(),
          getUserAddresses(),
        ]);

        if (cartResult.success && cartResult.items) {
          setCartItems(cartResult.items);
        }

        if (addressesResult.success && addressesResult.addresses) {
          setAddresses(addressesResult.addresses);
          const defaultAddr = addressesResult.addresses.find((a) => a.isDefault);
          const firstAddr = addressesResult.addresses[0];
          setSelectedAddressId(defaultAddr?.id || firstAddr?.id || "");
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error);
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (simulateEsewa = false) => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setPaymentError("");
    try {
      const result = await createOrder({
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        paymentMethod,
        customerNote: orderNote || undefined,
      });

      if (result.success && result.order) {
        // The existing order action clears the server cart after creating an order.
        localStorage.setItem("cartCount", "0");
        localStorage.removeItem("cartVisited");
        window.dispatchEvent(new Event("storage"));

        if (paymentMethod === "eSewa") {
          if (simulateEsewa) {
            const response = await fetch("/api/payment/esewa/simulate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: result.order.id }),
            });

            if (!response.ok) {
              throw new Error("Could not simulate eSewa payment.");
            }

            const simulationData: unknown = await response.json();
            if (
              !isRecord(simulationData) ||
              typeof simulationData.redirectUrl !== "string"
            ) {
              throw new Error("The eSewa simulation response was invalid.");
            }

            window.location.assign(simulationData.redirectUrl);
            return;
          }

          const response = await fetch("/api/payment/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: result.order.id,
              totalAmount: result.order.total,
            }),
          });

          if (!response.ok) {
            throw new Error("Could not start eSewa payment.");
          }

          const initiationData: unknown = await response.json();
          if (!isEsewaInitiationResponse(initiationData)) {
            throw new Error("The eSewa payment response was invalid.");
          }

          const form = document.createElement("form");
          form.method = "POST";
          form.action = initiationData.formUrl;
          form.style.display = "none";

          for (const [name, value] of Object.entries(initiationData.payload)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
          }

          document.body.appendChild(form);
          form.submit();
          return;
        }

        toast.success(`Order placed successfully! Order #${result.order.orderNumber}`);

        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const message =
        paymentMethod === "eSewa"
          ? "Your order was created, but we couldn't start eSewa payment. Please contact support before placing another order."
          : "Failed to place order";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto max-w-2xl px-3 sm:px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto max-w-2xl px-3 text-center sm:px-4">
          {paymentSuccessOrderId ? (
            <div className="mb-8 rounded-md border border-green-500/30 bg-green-500/10 p-6">
              <h1 className="mb-2 text-2xl font-bold text-green-700 dark:text-green-400">
                Payment successful
              </h1>
              <p className="text-sm text-muted-foreground">
                Order {paymentSuccessOrderId} is confirmed and paid.
              </p>
              <Button asChild className="mt-4">
                <Link href={`/orders/${encodeURIComponent(paymentSuccessOrderId)}`}>
                  View order confirmation
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {paymentError && (
                <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
                  {paymentError}
                </p>
              )}
              <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
              <h1 className="font-serif text-2xl font-bold mb-4 sm:text-3xl">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">Add some items to proceed with checkout</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pt-24 pb-24 bg-background">
      <div className="container mx-auto w-full max-w-6xl px-3 sm:px-6">
        <h1 className="font-serif text-3xl font-bold mb-6 sm:mb-8 sm:text-4xl">Checkout</h1>
        {paymentError && (
          <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
            {paymentError}
          </p>
        )}

        <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Left Column - Address & Payment */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
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
                          <div className="flex min-w-0 items-start space-x-3">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="min-w-0 flex-1 cursor-pointer">
                              <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="w-full min-w-0 break-words">
                                  <div className="font-semibold">{address.fullName}</div>
                                  <div className="mt-1 text-sm text-muted-foreground">
                                    {address.addressLine1}
                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {address.city}, {address.state} {address.postalCode}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Phone: {address.phone}
                                  </div>
                                </div>
                                {address.isDefault && (
                                  <span className="inline-flex shrink-0 self-start items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary sm:self-center">
                                    Default Address
                                  </span>
                                )}
                              </div>
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
                  <div className="flex min-w-0 items-start space-x-3 border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <RadioGroupItem value="Cash on Delivery" id="cod" className="mt-1" />
                    <Label htmlFor="cod" className="min-w-0 flex-1 cursor-pointer">
                      <div className="font-semibold flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Pay when your order is delivered
                      </div>
                    </Label>
                  </div>
                  <div className="flex min-w-0 items-start space-x-3 border rounded-lg p-4 mt-4 opacity-50">
                    <RadioGroupItem value="CARD" id="card" disabled className="mt-1" />
                    <Label htmlFor="card" className="min-w-0 flex-1 cursor-not-allowed">
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground mt-1">Coming soon</div>
                    </Label>
                  </div>
                  <div className="flex min-w-0 items-start space-x-3 border rounded-lg p-4 mt-4">
                    <RadioGroupItem value="eSewa" id="esewa" className="mt-1" />
                    <Label htmlFor="esewa" className="min-w-0 flex-1 cursor-pointer">
                      <div className="font-semibold">eSewa</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Pay securely through eSewa
                      </div>
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
          <div className="min-w-0 lg:col-span-1">
            <Card className="min-w-0 lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="min-w-0 space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex min-w-0 gap-2 sm:gap-3">
                      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.color} • {item.size}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="shrink-0 whitespace-nowrap text-right text-xs font-medium sm:text-sm">{formatNpr(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex min-w-0 justify-between gap-2 text-sm">
                    <span className="min-w-0 text-muted-foreground">Subtotal</span>
                    <span className="shrink-0 whitespace-nowrap">{formatNpr(subtotal)}</span>
                  </div>
                  <div className="flex min-w-0 justify-between gap-2 text-sm">
                    <span className="min-w-0 text-muted-foreground">Shipping</span>
                    <span className="shrink-0 whitespace-nowrap">{shipping === 0 ? "Free" : formatNpr(shipping)}</span>
                  </div>
                  {subtotal > 100 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      🎉 Free shipping applied!
                    </p>
                  )}
                  <Separator />
                  <div className="flex min-w-0 justify-between gap-2 text-lg font-bold">
                    <span className="min-w-0">Total</span>
                    <span className="shrink-0 whitespace-nowrap">{formatNpr(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handlePlaceOrder()}
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

                {showDevPaymentSimulation && paymentMethod === "eSewa" && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handlePlaceOrder(true)}
                    disabled={submitting || !selectedAddressId || cartItems.length === 0}
                  >
                    Simulate eSewa Payment Success
                  </Button>
                )}

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
