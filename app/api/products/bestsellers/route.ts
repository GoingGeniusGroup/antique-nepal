import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Aggregate OrderItems by productVariantId
    const salesByVariant = await prisma.orderItem.groupBy({
      by: ["productVariantId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
    });

    // 2. Get parent product IDs for those variants
    const variantIds = salesByVariant.map((item) => item.productVariantId);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, productId: true },
    });

    const variantToProduct = new Map(
      variants.map((v) => [v.id, v.productId])
    );

    // 3. Sum total sales per product
    const salesByProduct = new Map<string, number>();

    for (const sale of salesByVariant) {
      const productId = variantToProduct.get(sale.productVariantId);
      if (productId) {
        const current = salesByProduct.get(productId) || 0;
        salesByProduct.set(productId, current + (sale._sum.quantity || 0));
      }
    }

    // 4. Sort products by sales and take top 10
    const sortedProductIds = Array.from(salesByProduct.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    // 5. Fetch product data
    const bestSellers = await prisma.product.findMany({
      where: { id: { in: sortedProductIds } },
      include: {
        images: {
          take: 1,
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          select: { url: true },
        },
      },
    });

    // 6. Order products according to sortedProductIds *and* tell TypeScript they’re not undefined
    const orderedBestSellers = sortedProductIds
      .map((id) => bestSellers.find((p) => p.id === id))
      .filter((p): p is typeof bestSellers[number] => Boolean(p));

    // Helper to sanitize image URLs
    const formatImageUrl = (url: string | undefined) => {
      if (!url) return "/product_placeholder.jpeg";

      // Remove unwanted quotes or whitespace
      const clean = url.trim().replace(/^["']+|["']$/g, "");

      // Ensure it starts with slash or http
      return clean.startsWith("http") ? clean : `/${clean}`;
    };

    // 7. Format return shape
    const formattedProducts = orderedBestSellers.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: formatImageUrl(product.images[0]?.url),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("[GET_BESTSELLERS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
