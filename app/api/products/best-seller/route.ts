import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Adjust these weights to change the importance of each metric
const WEIGHTS = {
  VIEW_COUNT: 0.2,
  WISHLIST_COUNT: 0.4,
  REVIEW_COUNT: 0.3,
  AVERAGE_RATING: 0.1,
};

export async function GET() {
  try {
    const bestSeller = await prisma.orderItem.groupBy({
      by: ["productVariantId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 1,
    });

    if (bestSeller.length > 0 && bestSeller[0].productVariantId) {
      const productVariant = await prisma.productVariant.findUnique({
        where: {
          id: bestSeller[0].productVariantId,
        },
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
                select: { url: true },
              },
            },
          },
        },
      });

      if (productVariant) {
        const formatImageUrl = (url: string | undefined) => {
          if (!url) return "/product_placeholder.jpeg";
          const cleanUrl = url.trim().replace(/^["']|["']$/g, "").replace(/^\/+/g, "");
          return cleanUrl.startsWith("http") ? cleanUrl : `/${cleanUrl}`;
        };

        const productData = {
          id: productVariant.product.id,
          name: productVariant.product.name,
          price: Number(productVariant.product.price),
          description: productVariant.product.description,
          images: productVariant.product.images.map(img => ({ url: formatImageUrl(img.url) })),
          tag: "Best Seller",
        };

        return NextResponse.json(productData);
      }
    }

    // Fallback to most popular product if no best seller
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        reviews: { select: { rating: true } },
        wishlistItems: { select: { id: true } },
        images: {
          take: 1,
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          select: { url: true },
        },
      },
    });

    const productsWithPopularity = products.map((product) => {
      const reviewCount = product.reviews.length;
      const averageRating =
        reviewCount > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
          : 0;
      const wishlistCount = product.wishlistItems.length;
      const popularityScore =
        (product.viewCount || 0) * WEIGHTS.VIEW_COUNT +
        wishlistCount * WEIGHTS.WISHLIST_COUNT +
        reviewCount * WEIGHTS.REVIEW_COUNT +
        averageRating * WEIGHTS.AVERAGE_RATING;
      return { ...product, popularityScore };
    });

    const popularProducts = productsWithPopularity.sort(
      (a, b) => b.popularityScore - a.popularityScore
    );

    if (popularProducts.length > 0) {
      const topProduct = popularProducts[0];
      const formatImageUrl = (url: string | undefined) => {
        if (!url) return "/product_placeholder.jpeg";
        const cleanUrl = url.trim().replace(/^["']|["']$/g, "").replace(/^\/+/g, "");
        return cleanUrl.startsWith("http") ? cleanUrl : `/${cleanUrl}`;
      };

      const productData = {
        id: topProduct.id,
        name: topProduct.name,
        price: Number(topProduct.price),
        description: topProduct.description,
        images: topProduct.images.map(img => ({ url: formatImageUrl(img.url) })),
        tag: "Popular", // Tag as popular since it's a fallback
      };
      return NextResponse.json(productData);
    }

    // Fallback to the latest product if no popular product is found
    const latestProduct = await prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
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
      tag: "New", // Tag as new since it's a fallback
    };
    return NextResponse.json(productData);

  } catch (error) {
    console.error("[GET_BEST_SELLER_PRODUCT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
