"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { ShoppingBag, MapPin, CreditCard, Truck } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

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
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderNote, setOrderNote] = useState("");

  // Fetch cart and addresses
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchData();
    }
  }, [status, session?.user?.id, router]);

  const fetchData = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch cart items
      const cartRes = await fetch(`/api/cart?userId=${session.user.id}`);
      
      if (!cartRes.ok) {
        console.error("Cart fetch failed:", cartRes.status);
        setCartItems([]);
      } else {
        const cartData = await cartRes.json();
      
        const items = cartData.cart?.items.map((ci: any) => ({
          id: ci.id,
          name: ci.productVariant.product.name,
          price: ci.price,
          quantity: ci.quantity,
          color: ci.productVariant.color,
          size: ci.productVariant.size,
          image: ci.productVariant.product.images[0]?.url || "",
        })) || [];
        
        setCartItems(items);
      }

      // Fetch user addresses
      const addressRes = await fetch(`/api/profile/address`);
      
      if (!addressRes.ok) {
        console.error("Address fetch failed:", addressRes.status);
        setAddresses([]);
      } else {
        const addressData = await addressRes.json();
        
        if (addressData.addresses) {
          setAddresses(addressData.addresses);
          const defaultAddr = addressData.addresses.find((a: Address) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else if (addressData.addresses.length > 0) {
            setSelectedAddressId(addressData.addresses[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddressId: selectedAddressId,
          billingAddressId: selectedAddressId,
          paymentMethod,
          customerNote: orderNote || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Clear local cart count
        localStorage.setItem('cartCount', '0');
        localStorage.removeItem('cartVisited');
        window.dispatchEvent(new Event('storage'));
        
        toast.success(`Order placed successfully! Order #${result.order.orderNumber}`);
        
        // Redirect to profile page to view orders
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

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
          {/* Main Checkout Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2 font-medium">No saved addresses found</p>
                    <p className="text-sm text-muted-foreground mb-4">You need to add a delivery address before checkout</p>
                    <Button asChild>
                      <Link href="/profile">Go to Profile to Add Address</Link>
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3 border rounded-lg p-4">
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
                          <div className="text-sm text-muted-foreground">{address.country}</div>
                          <div className="text-sm font-medium mt-1">Phone: {address.phone}</div>
                          {address.isDefault && (
                            <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
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

                  <div className="flex items-start space-x-3 border rounded-lg p-4 opacity-50">
                    <RadioGroupItem value="CARD" id="card" disabled className="mt-1" />
                    <Label htmlFor="card" className="flex-1">
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Coming soon - Payment gateway integration
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 border rounded-lg p-4 opacity-50">
                    <RadioGroupItem value="DIGITAL" id="digital" disabled className="mt-1" />
                    <Label htmlFor="digital" className="flex-1">
                      <div className="font-semibold">Digital Wallets</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Coming soon - Khalti, eSewa, etc.
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
                  placeholder="Any special instructions for your order..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <div className="font-medium line-clamp-1">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.color} • {item.size}
                        </div>
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 100 && (
                    <div className="text-xs text-muted-foreground">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={submitting || addresses.length === 0}
                >
                  {submitting ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                {addresses.length === 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Please add a delivery address to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
