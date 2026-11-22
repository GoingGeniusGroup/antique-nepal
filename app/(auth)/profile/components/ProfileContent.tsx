"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Mail, Phone, Plus } from "lucide-react";
import Link from "next/link";
import { formatNpr } from "@/lib/utils";
import type {
  Order,
  User as PrismaUser,
  Address,
  OrderItem,
  ProductVariant,
  ProductImage,
} from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Clock,
  Package,
  Edit,
  LogOut,
  Shield,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

// Define the type for the user with relations
export type UserWithRelations = PrismaUser & {
  orders?: (Order & {
    items: (OrderItem & {
      product: { images: ProductImage[] };
      productVariant: Pick<ProductVariant, "color" | "size"> | null;
    })[];
    payments?: { paymentMethod: string; status: string }[];
  })[];
  addresses?: Address[];
};

type ProfileContentProps = {
  user: UserWithRelations;
  onEdit: () => void;
};

type SavedAddress = Pick<
  Address,
  | "id"
  | "type"
  | "fullName"
  | "phone"
  | "addressLine1"
  | "addressLine2"
  | "city"
  | "state"
  | "postalCode"
  | "country"
  | "isDefault"
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSavedAddress(value: unknown): value is SavedAddress {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    (value.type === "SHIPPING" ||
      value.type === "BILLING" ||
      value.type === "BOTH") &&
    typeof value.fullName === "string" &&
    typeof value.phone === "string" &&
    typeof value.addressLine1 === "string" &&
    (typeof value.addressLine2 === "string" || value.addressLine2 === null) &&
    typeof value.city === "string" &&
    typeof value.state === "string" &&
    typeof value.postalCode === "string" &&
    typeof value.country === "string" &&
    typeof value.isDefault === "boolean"
  );
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-yellow-400 text-yellow-400"
        >
          <Clock className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-blue-400 text-blue-400"
        >
          <Package className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-blue-500 text-blue-500"
        >
          <CheckCircle2 className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-purple-400 text-purple-400"
        >
          <Truck className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-green-400 text-green-400"
        >
          <CheckCircle2 className="w-3 h-3" />
          {status}
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-red-400 text-red-400"
        >
          <span className="w-3 h-3">✕</span>
          {status}
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-orange-400 text-orange-400"
        >
          <span className="w-3 h-3">↺</span>
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function ProfileContent({ user, onEdit }: ProfileContentProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(
    user.addresses || []
  );
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const ORDERS_PER_PAGE = 5;
  
  const recentOrders = user.orders || [];

  useEffect(() => {
    setSavedAddresses(user.addresses || []);
  }, [user.addresses]);

  const handleAddAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingAddress) return;

    const formData = new FormData(event.currentTarget);
    const addressData = {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      addressLine1: String(formData.get("addressLine1") || ""),
      addressLine2: String(formData.get("addressLine2") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      country: String(formData.get("country") || ""),
      type: String(formData.get("type") || "BOTH"),
      isDefault: formData.get("isDefault") === "on",
    };

    setIsSavingAddress(true);
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Failed to save address.";
        toast.error(message);
        return;
      }

      if (!isRecord(result)) {
        throw new Error("The server returned an invalid address.");
      }

      const createdAddress = result.address;
      if (!isSavedAddress(createdAddress)) {
        throw new Error("The server returned an invalid address.");
      }

      setSavedAddresses((addresses) => [
        createdAddress,
        ...addresses.map((address) =>
          createdAddress.isDefault ? { ...address, isDefault: false } : address
        ),
      ]);
      setIsAddAddressOpen(false);
      toast.success("Address added successfully.");
      router.refresh();
    } catch (error) {
      console.error("Failed to add address:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save address."
      );
    } finally {
      setIsSavingAddress(false);
    }
  };
  
  const totalPages = Math.ceil(recentOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = recentOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container">
          <Card className="overflow-hidden border-border/50 shadow-elegant">
            <div className="h-32 bg-gradient-primary" />
            <CardContent className="pt-0 px-6 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                <Avatar className="w-32 h-32 border-4 border-background shadow-elegant">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2 text-foreground">{user.name}</h1>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </span>
                        )}
                        {savedAddresses[0] && (
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {savedAddresses[0].city},{" "}
                            {savedAddresses[0].country}
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="pb-8 px-4">
        <div className="container">
          <Card className="border-border/50 hover:shadow-elegant transition-all max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Orders
                  </p>
                  <h3 className="text-3xl font-bold">
                    {recentOrders.length}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2">
                    Lifetime purchases
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pb-20 px-4">
        <div className="container">
          <Tabs defaultValue="orders" className="space-y-3">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              {/* <TabsTrigger value="security">Security</TabsTrigger> */}
              {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {paginatedOrders.map((order) => (
                    <div key={order.id} className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">
                              {order.orderNumber}
                            </h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold text-primary">
                            {formatNpr(Number(order.total))}
                          </p>
                          {order.payments && order.payments.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {order.payments[0].paymentMethod === "COD" 
                                  ? "Cash on Delivery" 
                                  : order.payments[0].paymentMethod}
                              </Badge>
                            </div>
                          )}
                          <Link href={`/profile/${order.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

 

                      <Separator />
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-4">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses, Security, Notifications tabs... */}
            {/* (Keep the rest of your code the same) */}
            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>
                        Manage your delivery locations
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={() => setIsAddAddressOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedAddresses.map((address) => (
                    <Card
                      key={address.id}
                      className="border-border/50 hover:shadow-soft transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {address.type === "BOTH" 
                                  ? "Shipping & Billing Address" 
                                  : address.type === "SHIPPING" 
                                  ? "Shipping Address" 
                                  : "Billing Address"}
                              </h4>
                              {address.isDefault && (
                                <Badge variant="secondary" className="mt-1">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={onEdit}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Truck className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="pl-13 space-y-1 text-muted-foreground">
                          <p className="font-medium text-foreground">
                            {address.fullName}
                          </p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 w-full"
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Dialog
                open={isAddAddressOpen}
                onOpenChange={setIsAddAddressOpen}
              >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add a delivery address</DialogTitle>
                    <DialogDescription>
                      Save an address to use for delivery and checkout.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddAddress} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium">
                        Full name
                        <Input name="fullName" autoComplete="name" required />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Phone
                        <Input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium sm:col-span-2">
                        Address line 1
                        <Input
                          name="addressLine1"
                          autoComplete="address-line1"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium sm:col-span-2">
                        Address line 2 <span className="text-muted-foreground">(optional)</span>
                        <Input
                          name="addressLine2"
                          autoComplete="address-line2"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        City
                        <Input
                          name="city"
                          autoComplete="address-level2"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        State / Province
                        <Input
                          name="state"
                          autoComplete="address-level1"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Postal code
                        <Input
                          name="postalCode"
                          autoComplete="postal-code"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Country
                        <Input
                          name="country"
                          autoComplete="country-name"
                          defaultValue="Nepal"
                          required
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Address type
                        <select
                          name="type"
                          defaultValue="BOTH"
                          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        >
                          <option value="BOTH">Shipping & Billing</option>
                          <option value="SHIPPING">Shipping</option>
                          <option value="BILLING">Billing</option>
                        </select>
                      </label>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="isDefault"
                        defaultChecked={savedAddresses.length === 0}
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                      Set as my default address
                    </label>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddAddressOpen(false)}
                        disabled={isSavingAddress}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSavingAddress}>
                        {isSavingAddress ? "Saving..." : "Save Address"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>
                          Manage your security settings
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">Password</h4>
                          <p className="text-sm text-muted-foreground">
                            Last changed 2 months ago
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Not enabled
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Enable
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">Login History</h4>
                          <p className="text-sm text-muted-foreground">
                            View recent activity
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>
                          Manage saved payment options
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 rounded-lg border border-dashed border-border/50 hover:bg-accent/50 transition-colors text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-3">
                        No payment methods saved
                      </p>
                      <Button variant="outline" size="sm">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
