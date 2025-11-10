import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const variants = await prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        inventory: true,
      },
    });

    return NextResponse.json({ variants });
  } catch (error) {
    console.error("Error fetching product variants:", error);
    return NextResponse.json(
      { error: "Failed to fetch product variants" },
      { status: 500 }
    );
  }
}
