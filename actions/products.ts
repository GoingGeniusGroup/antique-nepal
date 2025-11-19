"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath, unstable_cache } from "next/cache";

export interface GetProductsParams {
  searchQuery?: string;
  selectedCategory?: string | null;
  inStockOnly?: boolean;
  sortBy?: string;
  page?: number;
  perPage?: number;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  badge: string;
  variants: {
    id: string;
    sku: string;
    name: string;
    price?: number;
    color?: string;
    size?: string;
    inStock: boolean;
  }[];
}

export const getProducts = unstable_cache(
  async (params: GetProductsParams) => {
    try {
      console.log("🔥🔥I am in fetching from db🔥🔥 :)");
      const {
        searchQuery = "",
        selectedCategory = null,
        inStockOnly = false,
        sortBy = "newest",
        page = 1,
        perPage = 8,
      } = params;

      // ✅ Build WHERE clause safely
      const where: Prisma.ProductWhereInput = {
        isActive: true,
        ...(searchQuery.trim()
          ? {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
                {
                  categories: {
                    some: {
                      category: {
                        name: { contains: searchQuery, mode: "insensitive" },
                      },
                    },
                  },
                },
              ],
            }
          : {}),

        ...(selectedCategory && selectedCategory !== "all"
          ? {
              categories: {
                some: {
                  OR: [
                    { category: { id: selectedCategory } },
                    { category: { slug: selectedCategory } },
                  ],
                },
              },
            }
          : {}),

        ...(inStockOnly
          ? {
              variants: {
                some: { inventory: { quantity: { gt: 0 } } },
              },
            }
          : {}),
      };

      // ✅ FIX SORT TYPE (Prisma requires `"asc"|"desc"`)
      const orderBy: Prisma.ProductOrderByWithRelationInput =
        sortBy === "newest"
          ? { createdAt: "desc" as const }
          : sortBy === "price-low"
          ? { price: "asc" as const }
          : sortBy === "price-high"
          ? { price: "desc" as const }
          : { name: "asc" as const };

      // ✅ Single database round-trip
      const [totalCount, products] = await prisma.$transaction([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy,
          include: {
            categories: {
              select: { category: { select: { id: true, name: true } } },
            },
            images: {
              take: 1,
              orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
              select: { url: true },
            },
            variants: {
              select: {
                id: true,
                sku: true,
                name: true,
                price: true,
                color: true,
                size: true,
                inventory: { select: { quantity: true } },
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / perPage);

      // ✅ Map products safely
      const formattedProducts: ProductData[] = products.map((product) => {
        const category =
          product.categories[0]?.category?.name || "Uncategorized";

        let image = "/product_placeholder.jpeg";
        const img = product.images?.[0];
        if (img?.url) {
          const clean = img.url.trim().replace(/^\/+|["']/g, "");
          image = clean.startsWith("http") ? clean : `/${clean}`;
        }

        const variants = product.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          name: v.name,
          price: v.price ? Number(v.price) : undefined,
          color: v.color || undefined,
          size: v.size || undefined,
          inStock:
            v.inventory?.quantity && v.inventory.quantity > 0 ? true : false,
        }));

        const hasStock =
          variants.length === 0 ? true : variants.some((v) => v.inStock);

        return {
          id: product.id,
          name: product.name,
          category,
          price: Number(product.price),
          image,
          inStock: hasStock,
          badge: product.isFeatured ? "Featured" : category,
          variants,
        };
      });

      return {
        products: formattedProducts,
        totalProducts: totalCount,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("[getProducts Error]:", error);
      throw new Error("Failed to fetch products");
    }
  },
  ["products"],
  {
    revalidate: 30,
    tags: ["products"],
  }
);

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      categories: { include: { category: true } },
      reviews: {
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
  };
}

export async function incrementProductView(productId: string) {
  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    revalidatePath(`/products/${productId}`);
  } catch (error) {
    console.error("Failed to increment product view count:", error);
    // Optionally, handle the error more gracefully
  }
}
