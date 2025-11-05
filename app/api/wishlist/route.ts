import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const wishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  return NextResponse.json(wishlist || {});
}

export async function POST(req: Request) {
  const { userId, productId } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "Missing userId or productId" },
      { status: 400 }
    );
  }

  // Find default wishlist for user
  let wishlist = await prisma.wishlist.findFirst({
    where: { userId, isDefault: true },
  });

  if (!wishlist) {
    // create default wishlist
    wishlist = await prisma.wishlist.create({
      data: { userId, name: "My Wishlist", isDefault: true },
    });
  }

  // Add product to wishlist (ignore if already exists)
  await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: { wishlistId: wishlist.id, productId },
    },
    update: {},
    create: { wishlistId: wishlist.id, productId },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { wishlistItemId } = await req.json();

  if (!wishlistItemId) {
    return NextResponse.json(
      { error: "Missing wishlistItemId" },
      { status: 400 }
    );
  }

  try {
    await prisma.wishlistItem.delete({
      where: { id: wishlistItemId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
