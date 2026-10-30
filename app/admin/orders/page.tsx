"use client";

import { useState } from "react";
import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/admin-utils";
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

/**
 * Orders Management Page
 * 
 * Features:
 * - View all orders with search, sort, and pagination
 * - Update order status and payment status
 * - Process refunds and cancellations
 * - Real-time order tracking
 */

export default function OrdersPage() {
  type Row = {
    id: string;
    orderNumber: string;
    total: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    user: { email: string };
  };

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Row | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // View Order Details
  const handleViewOrder = (order: Row) => {
    setSelectedOrderId(order.id);
    setShowDetailsDialog(true);
  };

  // Delete Order
  const handleDeleteOrder = (order: Row) => {
    setOrderToDelete(order);
    setShowDeleteDialog(true);
  };

  // Confirm delete and call API
  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      console.log("Deleting order:", orderToDelete.id);
      const response = await fetch(`/api/admin/orders/${orderToDelete.id}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);
      
      if (response.ok) {
        toast.success(`Order ${orderToDelete.orderNumber} deleted successfully`);
        setRefreshKey((prev) => prev + 1);
        setShowDeleteDialog(false);
        setOrderToDelete(null);
      } else {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Delete failed:", error);
        toast.error(error.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  // Refresh after order update
  const handleOrderUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const columns: HeroColumn<Row>[] = [
    { key: "orderNumber", label: "Order #", sortable: true, render: (r: Row) => (
      <span className="font-mono text-sm font-medium">{r.orderNumber}</span>
    ) },
    { key: "user", label: "Customer", render: (r: Row) => r.user?.email || "—" },
    { key: "total", label: "Total", sortable: true, render: (r: Row) => (
      <span className="font-semibold">{formatCurrency(r.total)}</span>
    ) },
    { key: "status", label: "Status", sortable: true, render: (r: Row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor('order', r.status)}`}>
        {r.status}
      </span>
    ) },
    { key: "paymentStatus", label: "Payment", sortable: true, render: (r: Row) => {
      const paymentMethod = r.paymentMethod === "COD" ? "Cash on Delivery" : r.paymentMethod;
      const displayText = r.paymentStatus === "PAID" ? "PAID" : paymentMethod;
      return (
        <span className="text-sm font-medium">{displayText}</span>
      );
    } },
    { key: "createdAt", label: "Date", sortable: true, render: (r: Row) => formatDate(r.createdAt) },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Orders" />
        <HeroTable<Row>
          key={refreshKey}
          title="Order Management"
          fetchUrl="/api/admin/orders"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          onEdit={handleViewOrder}
          onDelete={handleDeleteOrder}
        />
      </div>

      {/* Order Details Dialog */}
      {selectedOrderId && (
        <OrderDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          orderId={selectedOrderId}
          onUpdate={handleOrderUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete order ${orderToDelete?.orderNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </PageTransition>
  );
}
