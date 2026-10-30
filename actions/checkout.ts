"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Create an order from the user's cart
 */
export async function createOrder(data: {
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: string;
  customerNote?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get cart with items
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Validate address exists
    const shippingAddress = await prisma.address.findFirst({
      where: { id: data.shippingAddressId, userId },
    });

    if (!shippingAddress) {
      return { success: false, error: "Invalid shipping address" };
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    const shippingCost = subtotal > 100 ? 0 : 10;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING",
          paymentStatus:
            data.paymentMethod === "Cash on Delivery" || data.paymentMethod === "COD"
              ? "PENDING"
              : "PENDING",
          subtotal,
          shippingCost,
          tax,
          total,
          currency: "NPR",
          shippingAddressId: data.shippingAddressId,
          billingAddressId: data.billingAddressId || data.shippingAddressId,
          customerNote: data.customerNote,
          items: {
            create: cart.items.map((item) => ({
              productVariantId: item.productVariantId,
              productName: item.productVariant.product.name,
              variantName: item.productVariant.name || "",
              sku: item.productVariant.sku || "",
              quantity: item.quantity,
              price: item.price,
              total: Number(item.price) * item.quantity,
            })),
          },
          payments: {
            create: {
              amount: total,
              currency: "NPR",
              status: "PENDING",
              paymentMethod: data.paymentMethod || "Cash on Delivery",
              metadata: {
                paymentType: data.paymentMethod,
                createdAt: new Date().toISOString(),
              },
            },
          },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Revalidate profile page to show new order
    revalidatePath("/profile");

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total.toString(),
      },
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, error: "Failed to create order" };
  }
}

/**
 * Get user's cart with items
 */
export async function getCart() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: { images: true },
                },
              },
            },
          },
        },
      },
    });

    const cartItems =
      cart?.items.map((ci) => ({
        id: ci.id,
        name: ci.productVariant.product.name,
        price: Number(ci.price),
        quantity: ci.quantity,
        color: ci.productVariant.color || "",
        size: ci.productVariant.size || "",
        image: ci.productVariant.product.images[0]?.url || "",
      })) || [];

    return { success: true, items: cartItems };
  } catch (error) {
    console.error("Get cart error:", error);
    return { success: false, error: "Failed to get cart" };
  }
}

/**
 * Get user's addresses
 */
export async function getUserAddresses() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return { success: true, addresses };
  } catch (error) {
    console.error("Get addresses error:", error);
    return { success: false, error: "Failed to get addresses" };
  }
}
