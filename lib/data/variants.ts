"use cache";

import prisma from "@/lib/prisma";

export const revalidate = 60; // Cache for 60 seconds

export async function getVariantsByProductId(productId: string) {
  "use cache";

  const variants = await prisma.productVariant.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

  return variants;
}

// Export with specific cache tags for per-product invalidation
export async function getVariantsByProductIdWithTag(productId: string) {
  "use cache";

  const variants = await prisma.productVariant.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

  return variants;
}

// Define cache tags dynamically per product
getVariantsByProductIdWithTag.tags = (productId: string) => [
  `variants-${productId}`,
  "variants",
];
