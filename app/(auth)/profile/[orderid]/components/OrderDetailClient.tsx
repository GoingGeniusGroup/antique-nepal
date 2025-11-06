"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Truck,
  Clock,
  ArrowLeft,
} from "lucide-react";
import type {
  Order,
  OrderItem,
  ProductVariant,
  Product,
  ProductImage,
  Address,
} from "@prisma/client";

// Define serializable types
type SerializableProduct = Omit<
  Product,
  "price" | "createdAt" | "updatedAt"
> & {
  price: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
};

type SerializableProductVariant = Omit<
  ProductVariant,
  "price" | "weight" | "createdAt" | "updatedAt"
> & {
  price: string | null;
  weight: string | null;
  createdAt: string;
  updatedAt: string;
  product: SerializableProduct;
};

type SerializableOrderItem = Omit<
  OrderItem,
  "price" | "total" | "createdAt"
> & {
  price: string;
  total: string;
  createdAt: string;
  productVariant: SerializableProductVariant;
};

type SerializableOrder = Omit<
  Order,
  "subtotal" | "shippingCost" | "tax" | "total" | "createdAt" | "updatedAt"
> & {
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  items: SerializableOrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
};

type OrderDetailClientProps = {
  order: SerializableOrder;
};

const PDFDownloader = dynamic(() => import("./PDFDownloader"), { ssr: false });

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
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-blue-400 text-blue-400"
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
          <Package className="w-3 h-3" />
          {status}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "SHIPPED":
      return <Truck className="w-5 h-5 text-blue-600" />;
    case "PROCESSING":
      return <Clock className="w-5 h-5 text-amber-600" />;
    default:
      return <Package className="w-5 h-5 text-muted-foreground" />;
  }
};

// This component will receive the order data as props
export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl">
          <div className="flex justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href="/profile">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <PDFDownloader order={order} />
          </div>
          <div>
            <h2 className="font-cinzel text-3xl font-bold mb-4">
              Your Order Detail
            </h2>

            {/* Order Header */}
            <Card className="overflow-hidden border-border/50 shadow-elegant mb-6">
              <div className="h-2 bg-gradient-primary"></div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-3">
                      {order.orderNumber}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">
                      Order Total
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      NPR {Number(order.total).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Ordered */}
            <Card className="border-border/50 shadow-elegant mb-6">
              <CardContent className="p-8">
                <h2 className="font-semibold text-2xl mb-6">Items Ordered</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-6 p-6 rounded-lg bg-accent/50 border border-border/50 hover:shadow-soft transition-all"
                    >
                      <Image
                        src={
                          item.productVariant.product.images[0]?.url ||
                          "/product_placeholder.jpeg"
                        }
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="w-32 h-32 object-cover rounded-lg shadow-soft"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-3">
                          {item.productName}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground block mb-1">
                              Color
                            </span>
                            <span className="font-medium">
                              {item.productVariant.color || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block mb-1">
                              Size
                            </span>
                            <span className="font-medium">
                              {item.productVariant.size || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block mb-1">
                              Quantity
                            </span>
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          NPR {Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card className="border-border/50 shadow-elegant">
                <CardContent className="p-8">
                  <h2 className="font-semibold text-2xl mb-6">
                    Shipping Address
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.addressLine1}
                      </p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-muted-foreground">
                          {order.shippingAddress.addressLine2}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.country}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2 pt-2">
                        <Phone className="w-4 h-4" />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="border-border/50 shadow-elegant">
                <CardContent className="p-8">
                  <h2 className="font-semibold text-2xl mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        NPR {Number(order.subtotal).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">
                        NPR {Number(order.shippingCost).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold">
                        NPR {Number(order.tax).toLocaleString()}
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-2xl pt-2">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">
                        NPR {Number(order.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Button size="lg" variant="outline" className="w-full">
                <Package className="w-5 h-5 mr-2" />
                Track Order
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
