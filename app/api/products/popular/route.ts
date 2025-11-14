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
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        wishlistItems: {
          select: {
            id: true,
          },
        },
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
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviewCount
          : 0;

      const wishlistCount = product.wishlistItems.length;

      const popularityScore =
        (product.viewCount || 0) * WEIGHTS.VIEW_COUNT +
        wishlistCount * WEIGHTS.WISHLIST_COUNT +
        reviewCount * WEIGHTS.REVIEW_COUNT +
        averageRating * WEIGHTS.AVERAGE_RATING;

      // Helper function to format image URL
      const formatImageUrl = (url: string | undefined) => {
        if (!url) return "/product_placeholder.jpeg";
        const cleanUrl = url.trim().replace(/^["']|["']$/g, "").replace(/^\/+/g, "");
        return cleanUrl.startsWith("http") ? cleanUrl : `/${cleanUrl}`;
      };

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        description: product.description,
        images: product.images.map(img => ({ url: formatImageUrl(img.url) })),
        popularityScore,
      };
    });

    // Sort by the calculated score in descending order
    const popularProducts = productsWithPopularity.sort(
      (a, b) => b.popularityScore - a.popularityScore
    );

    if (popularProducts.length === 0) {
      return NextResponse.json(null);
    }

    const topProduct = {
      ...popularProducts[0],
      tag: "Popular",
    };

    // Return the top 1
    return NextResponse.json(topProduct);
  } catch (error) {
    console.error("[GET_POPULAR_PRODUCTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
