import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * GET /api/admin/orders/[orderId] - Get order details
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            variantName: true,
            sku: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        shippingAddress: {
          select: {
            fullName: true,
            phone: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
        billingAddress: {
          select: {
            fullName: true,
            phone: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
        payments: {
          select: {
            paymentMethod: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Convert Decimal fields to strings
    const safeOrder = {
      ...order,
      subtotal: order.subtotal.toString(),
      shippingCost: order.shippingCost.toString(),
      tax: order.tax.toString(),
      total: order.total.toString(),
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toString(),
        total: item.total.toString(),
      })),
      payments: order.payments.map((payment) => ({
        ...payment,
        amount: payment.amount.toString(),
      })),
    };

    return NextResponse.json({ order: safeOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders/[orderId] - Update order status
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { status, paymentStatus, adminNote, trackingNumber } = body;

    // Build update data
    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: {
        ...order,
        total: order.total.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/orders/[orderId] - Delete an order
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    console.log("Attempting to delete order:", orderId);

    // Check if order exists first
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Delete in transaction to ensure all related records are removed
    await prisma.$transaction(async (tx) => {
      // 1. Delete all payments associated with this order
      await tx.payment.deleteMany({
        where: { orderId: orderId },
      });

      // 2. Delete all order items (should cascade but explicit for safety)
      await tx.orderItem.deleteMany({
        where: { orderId: orderId },
      });

      // 3. Finally delete the order itself
      await tx.order.delete({
        where: { id: orderId },
      });
    });

    console.log("Order deleted successfully:", orderId);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
