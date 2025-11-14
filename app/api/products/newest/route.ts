import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Fetch the 10 newest products
      include: {
        images: {
          take: 1,
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          select: { url: true },
        },
      },
    });

    const formattedProducts = products.map((product) => {
      // Helper function to format image URL
      const formatImageUrl = (url: string | undefined) => {
        if (!url) return "/product_placeholder.jpeg";
        const cleanUrl = url.trim().replace(/^\/+|["']/g, "");
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
    console.error("[GET_NEWEST_PRODUCTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
