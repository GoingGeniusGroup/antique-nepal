import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

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

    const variants = await unstable_cache(
      async () => {
        const rows = await prisma.productVariant.findMany({
          where: {
            productId,
            isActive: true,
          },
          orderBy: {
            displayOrder: "asc",
          },
          select: {
            id: true,
            sku: true,
            name: true,
            price: true,
            color: true,
            size: true,
          },
        });

        return rows.map((variant) => ({
          ...variant,
          price: variant.price === null ? null : Number(variant.price),
        }));
      },
      ["storefront-product-variants", productId],
      { revalidate: 3600, tags: ["products"] }
    )();

    return NextResponse.json({ variants });
  } catch (error) {
    console.error("Error fetching product variants:", error);
    return NextResponse.json(
      { error: "Failed to fetch product variants" },
      { status: 500 }
    );
  }
}
