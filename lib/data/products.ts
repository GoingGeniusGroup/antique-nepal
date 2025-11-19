"use cache";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const revalidate = 60; // Cache for 60 seconds
export const tags = ["products"]; // Tag for revalidation

type GetProductsParams = {
  page: number;
  pageSize: number;
  q: string;
  sort: string;
  order: "asc" | "desc";
};

export async function getProducts({
  page,
  pageSize,
  q,
  sort,
  order,
}: GetProductsParams) {
  const where: Prisma.ProductWhereInput | undefined = q
    ? {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { sku: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
        categories: true,
        images: true,
        variants: true,
        reviews: true,
        wishlistItems: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const safe = data.map((p) => ({
    ...p,
    price: (p.price as unknown as Prisma.Decimal).toString(),
  }));

  return { page, pageSize, total, data: safe };
}
