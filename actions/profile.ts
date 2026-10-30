"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Get user's orders with items and payments
 */
export async function getUserOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
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
            productVariant: {
              select: {
                id: true,
                color: true,
                size: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: {
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        payments: {
          select: {
            id: true,
            paymentMethod: true,
            amount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert Decimal to string for JSON serialization
    const ordersWithStringValues = orders.map((order) => ({
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
    }));

    return { success: true, orders: ordersWithStringValues };
  } catch (error) {
    console.error("Get user orders error:", error);
    return { success: false, error: "Failed to get orders" };
  }
}
