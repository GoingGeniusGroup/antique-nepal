import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * GET /api/profile/orders - Get user's orders
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id as string },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            variantName: true,
            quantity: true,
            price: true,
            total: true,
          },
        },
        shippingAddress: {
          select: {
            fullName: true,
            addressLine1: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
        payments: {
          select: {
            paymentMethod: true,
            status: true,
            amount: true,
          },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert Decimal fields to strings
    const safeOrders = orders.map((order) => ({
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

    return NextResponse.json({ orders: safeOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
