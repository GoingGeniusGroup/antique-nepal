import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const latestProduct = await prisma.product.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: {
          take: 1,
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          select: { url: true },
        },
      },
    });

    if (!latestProduct) {
      return NextResponse.json(null);
    }

    const formatImageUrl = (url: string | undefined) => {
      if (!url) return "/product_placeholder.jpeg";
      const cleanUrl = url.trim().replace(/^["']|["']$/g, "").replace(/^\/+/g, "");
      return cleanUrl.startsWith("http") ? cleanUrl : `/${cleanUrl}`;
    };

    const productData = {
      id: latestProduct.id,
      name: latestProduct.name,
      price: Number(latestProduct.price),
      description: latestProduct.description,
      images: latestProduct.images.map(img => ({ url: formatImageUrl(img.url) })),
      tag: "Latest",
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error("[GET_LATEST_PRODUCT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
