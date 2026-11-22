import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const addCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable().optional(),
  quantity: z.number().int().positive(),
});

const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().positive(),
});

function isAdmin(
  session: { user?: object | null } | null | undefined
) {
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

// GET - Fetch cart items for a user
export async function GET() {
  try {
    const session = await auth();

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Prevent admins from accessing cart
    if (isAdmin(session)) {
      return NextResponse.json(
        { error: "Admin users cannot access cart" },
        { status: 403 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { isPrimary: "desc" },
                },
              },
            },
            productVariant: {
              select: { name: true, sku: true, color: true, size: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      cart: cart
        ? {
            ...cart,
            items: cart.items.map((item) => ({
              ...item,
              price: Number(item.price),
            })),
          }
        : null,
    });
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
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Prevent admins from adding to cart
    if (isAdmin(session)) {
      return NextResponse.json(
        { error: "Admin users cannot add items to cart" },
        { status: 403 }
      );
    }

    const body: unknown = await req.json();
    const parsedBody = addCartItemSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "productId, optional variantId, and a positive integer quantity are required" },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity } = parsedBody.data;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { isActive: true },
          include: { inventory: true },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    const hasActiveVariants = product.variants.length > 0;
    const variant = hasActiveVariants
      ? product.variants.find((candidate) => candidate.id === variantId)
      : null;

    if (hasActiveVariants && !variant) {
      return NextResponse.json(
        { error: "Select a valid active variant for this product" },
        { status: 400 }
      );
    }

    if (!hasActiveVariants && variantId != null) {
      return NextResponse.json(
        { error: "This product does not have active variants" },
        { status: 400 }
      );
    }

    const availableQuantity = variant
      ? Math.max(
          0,
          (variant.inventory?.quantity ?? 0) -
            (variant.inventory?.reservedQuantity ?? 0)
        )
      : product.stockQuantity;
    const price = variant?.price ?? product.price;
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    const existingItem = cart
      ? await prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId,
            productVariantId: variant?.id ?? null,
          },
        })
      : null;
    const requestedQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (requestedQuantity > availableQuantity) {
      return NextResponse.json(
        { error: "Requested quantity exceeds available stock" },
        { status: 409 }
      );
    }

    const activeCart =
      cart ??
      (await prisma.cart.create({
        data: {
          userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }));

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: requestedQuantity },
      });
      return NextResponse.json({ cartItem: updatedItem });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: activeCart.id,
        productId,
        productVariantId: variant?.id ?? null,
        quantity,
        price,
      },
    });

    return NextResponse.json({ cartItem }, { status: 201 });
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
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Prevent admins from updating cart
    if (isAdmin(session)) {
      return NextResponse.json(
        { error: "Admin users cannot update cart" },
        { status: 403 }
      );
    }

    const body: unknown = await req.json();
    const parsedBody = updateCartItemSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "cartItemId and a positive integer quantity are required" },
        { status: 400 }
      );
    }

    const { cartItemId, quantity } = parsedBody.data;
    const existingItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
      include: {
        product: { select: { stockQuantity: true, isActive: true } },
        productVariant: { include: { inventory: true } },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const availableQuantity = existingItem.productVariant
      ? Math.max(
          0,
          (existingItem.productVariant.inventory?.quantity ?? 0) -
            (existingItem.productVariant.inventory?.reservedQuantity ?? 0)
        )
      : existingItem.product.stockQuantity;

    if (!existingItem.product.isActive || quantity > availableQuantity) {
      return NextResponse.json(
        { error: "Requested quantity exceeds available stock" },
        { status: 409 }
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
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Prevent admins from deleting from cart
    if (isAdmin(session)) {
      return NextResponse.json(
        { error: "Admin users cannot delete cart items" },
        { status: 403 }
      );
    }

    const body: unknown = await req.json();
    const parsedBody = z
      .object({ cartItemId: z.string().min(1) })
      .safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "cartItemId is required" },
        { status: 400 }
      );
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: {
        id: parsedBody.data.cartItemId,
        cart: { userId },
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
