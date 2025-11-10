import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Checkout API - Creates an order from cart items
 * 
 * POST /api/checkout
 * Body: { 
 *   shippingAddressId: string, 
 *   billingAddressId?: string,
 *   paymentMethod: string,
 *   customerNote?: string
 * }
 */

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { shippingAddressId, billingAddressId, paymentMethod, customerNote } = body;
    const userId = session.user.id as string;

    // Validate required fields
    if (!userId || !shippingAddressId) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Get user's cart with items
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate order totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = 0; // Tax calculation can be added later
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Use billing address same as shipping if not provided
    const finalBillingAddressId = billingAddressId || shippingAddressId;

    // Determine payment status based on payment method
    const paymentStatus = (paymentMethod === "Cash on Delivery" || paymentMethod === "COD") ? "PENDING" : "PENDING";

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING",
          paymentStatus,
          subtotal,
          shippingCost,
          tax,
          total,
          currency: "USD",
          shippingAddressId,
          billingAddressId: finalBillingAddressId,
          customerNote,
          items: {
            create: cart.items.map((item) => ({
              productVariantId: item.productVariantId,
              productName: item.productVariant.product.name,
              variantName: item.productVariant.name,
              sku: item.productVariant.sku,
              quantity: item.quantity,
              price: item.price,
              total: Number(item.price) * item.quantity,
            })),
          },
          payments: {
            create: {
              amount: total,
              currency: "USD",
              status: paymentStatus,
              paymentMethod: paymentMethod || "Cash on Delivery",
              metadata: {
                paymentType: paymentMethod,
                createdAt: new Date().toISOString(),
              },
            },
          },
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          payments: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      // Clear the cart after order creation
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total.toString(),
        status: order.status,
        paymentMethod: paymentMethod || "COD",
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
