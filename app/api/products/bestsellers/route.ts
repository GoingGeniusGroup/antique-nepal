import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Step 1: Aggregate OrderItems to find total sales per product variant
    const salesByVariant = await prisma.orderItem.groupBy({
      by: ["productVariantId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    });

    // Step 2: Get the product IDs for these variants
    const variantIds = salesByVariant.map((item) => item.productVariantId);
    const variants = await prisma.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      select: {
        id: true,
        productId: true,
      },
    });

    // Create a map for quick lookup of variantId -> productId
    const variantToProductMap = new Map(
      variants.map((v) => [v.id, v.productId])
    );

    // Step 3: Aggregate sales by the parent product ID
    const salesByProduct = new Map<string, number>();
    for (const sale of salesByVariant) {
      const productId = variantToProductMap.get(sale.productVariantId);
      if (productId) {
        const currentSales = salesByProduct.get(productId) || 0;
        salesByProduct.set(productId, currentSales + (sale._sum.quantity || 0));
      }
    }

    // Step 4: Sort product IDs by total sales and take the top 10
    const sortedProductIds = Array.from(salesByProduct.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => entry[0]);

    // Step 5: Fetch the actual product data for the top 10
    const bestSellers = await prisma.product.findMany({
      where: {
        id: {
          in: sortedProductIds,
        },
      },
      include: {
        images: {
          take: 1,
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          select: { url: true },
        },
      },
    });

    // Preserve the sort order from the sales calculation
    const orderedBestSellers = sortedProductIds
      .map((id) => bestSellers.find((p) => p.id === id))
      .filter((p) => p); // Filter out any potential undefined values

    const formattedProducts = orderedBestSellers.map((product) => {
      // Helper function to format image URL
      const formatImageUrl = (url: string | undefined) => {
        if (!url) return "/product_placeholder.jpeg";
        const cleanUrl = url.trim().replace(/^["']+|["']$/g, "");
        return cleanUrl.startsWith("http") ? cleanUrl : `/${cleanUrl}`;
      };

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image: formatImageUrl(product.images[0]?.url),
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("[GET_BESTSELLERS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
