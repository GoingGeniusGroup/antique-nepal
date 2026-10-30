"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/admin-utils";
import { Package, MapPin, CreditCard, User, Calendar, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  price: string;
  total: string;
}

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Payment {
  paymentMethod: string;
  amount: string;
  status: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  customerNote?: string;
  adminNote?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name?: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payments: Payment[];
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onUpdate: () => void;
}

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

export function OrderDetailsDialog({
  open,
  onOpenChange,
  orderId,
  onUpdate,
}: OrderDetailsDialogProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
    }
  }, [open, orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Order data received:", data);
        setOrder(data.order);
        setStatus(data.order.status);
        setPaymentStatus(data.order.paymentStatus);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to load order:", response.status, errorData);
        toast.error(errorData.error || "Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      });

      if (response.ok) {
        toast.success("Order updated successfully");
        setEditMode(false);
        await fetchOrderDetails();
        onUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[96vw] !w-[96vw] h-[95vh] max-h-[95vh] overflow-y-auto p-8">
          <DialogHeader>
            <DialogTitle>Loading Order Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-12 w-12" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[96vw] !w-[96vw] h-[95vh] max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNumber}</span>
            <div className="flex gap-2">
              {!editMode ? (
                <Button size="sm" onClick={() => setEditMode(true)}>
                  Edit Status
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditMode(false);
                    setStatus(order.status);
                    setPaymentStatus(order.paymentStatus);
                  }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleUpdate} disabled={updating}>
                    {updating ? <Spinner className="h-4 w-4 mr-2" /> : null}
                    Save
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Order Status</Label>
              {editMode ? (
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge className={getStatusColor('order', order.status)}>
                    {order.status}
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Payment Status</Label>
              {editMode ? (
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge className={getStatusColor('payment', order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Customer
              </Label>
              <div className="mt-1 text-sm">
                <div className="font-medium">{order.user.name || "N/A"}</div>
                <div className="text-muted-foreground">{order.user.email}</div>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Order Date
              </Label>
              <div className="mt-1 text-sm">{formatDate(order.createdAt)}</div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
              <Package className="h-4 w-4" /> Order Items
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">SKU</th>
                    <th className="text-center p-3">Qty</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.variantName}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{item.sku}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" /> Shipping Address
              </Label>
              <div className="text-sm border rounded-lg p-3 bg-muted/30">
                <div className="font-medium">{order.shippingAddress.fullName}</div>
                <div className="text-muted-foreground mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </div>
                <div className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </div>
                <div className="text-muted-foreground">{order.shippingAddress.country}</div>
                <div className="mt-2">Phone: {order.shippingAddress.phone}</div>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4" /> Payment Info
              </Label>
              <div className="text-sm border rounded-lg p-3 bg-muted/30">
                <div className="font-medium">Payment Method</div>
                <div className="text-muted-foreground mt-1">
                  {order.payments[0]?.paymentMethod || "N/A"}
                </div>
                <div className="mt-3">
                  <div className="font-medium">Amount</div>
                  <div className="text-lg">{formatCurrency(order.payments[0]?.amount || order.total)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.customerNote || order.adminNote) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                {order.customerNote && (
                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" /> Customer Note
                    </Label>
                    <div className="text-sm border rounded-lg p-3 bg-muted/30">
                      {order.customerNote}
                    </div>
                  </div>
                )}
                {order.adminNote && (
                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" /> Admin Note
                    </Label>
                    <div className="text-sm border rounded-lg p-3 bg-muted/30">
                      {order.adminNote}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
