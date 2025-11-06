import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch cart items for a user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: {
                      take: 1,
                      orderBy: { isPrimary: "desc" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[v0] Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const { userId, productVariantId, quantity } = await req.json();

    if (!userId || !productVariantId || !quantity) {
      return NextResponse.json(
        { error: "userId, productVariantId, and quantity are required" },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    // Get variant price
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json(
        { error: "Product variant not found" },
        { status: 404 }
      );
    }

    const price = variant.price || variant.product.price;

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return NextResponse.json({ cartItem: updatedItem });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productVariantId,
        quantity,
        price,
      },
    });

    return NextResponse.json({ cartItem });
  } catch (error) {
    console.error("[v0] Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const { cartItemId, quantity } = await req.json();

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { error: "cartItemId and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json({ cartItem });
  } catch (error) {
    console.error("[v0] Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const { cartItemId } = await req.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: "cartItemId is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
