"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath, unstable_cache } from "next/cache";
import { auth } from "@/lib/auth";

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
              AND: [
                {
                  OR: [
                    { stockQuantity: { gt: 0 } },
                    {
                      variants: {
                        some: {
                          isActive: true,
                          inventory: { quantity: { gt: 0 } },
                        },
                      },
                    },
                  ],
                },
              ],
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

      // ✅ Run queries sequentially to maintain strict type inference
      const totalCount = await prisma.product.count({ where });

      const productsQuery = {
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy,
        include: {
          categories: {
            select: {
              category: { select: { id: true, name: true, image: true } },
            },
          },
          images: {
            where: { url: { not: "" } },
            orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
            select: { url: true, isPrimary: true },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              name: true,
              price: true,
              color: true,
              size: true,
              inventory: {
                select: { quantity: true, reservedQuantity: true },
              },
            },
          },
        },
      } satisfies Prisma.ProductFindManyArgs;

      type ProductWithRelations = Prisma.ProductGetPayload<typeof productsQuery>;
      const products: ProductWithRelations[] = await prisma.product.findMany(productsQuery);

      const totalPages = Math.ceil(totalCount / perPage);

      // ✅ Map products safely
      const formattedProducts: ProductData[] = products.map((product) => {
        const category =
          product.categories[0]?.category?.name || "Uncategorized";

        const imageUrl =
          product.images.find((img) => img.isPrimary)?.url ||
          product.images.find((img) => img.url)?.url ||
          product.image ||
          product.categories[0]?.category.image;
        let image = "/product_placeholder.jpeg";
        if (imageUrl) {
          const clean = imageUrl.trim();
          image = /^https?:\/\//i.test(clean)
            ? clean
            : clean.startsWith("/")
              ? clean
              : `/${clean}`;
        }

        const variants = product.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          name: v.name,
          price: v.price ? Number(v.price) : undefined,
          color: v.color || undefined,
          size: v.size || undefined,
          inStock:
            v.inventory
              ? v.inventory.quantity - v.inventory.reservedQuantity > 0
              : false,
        }));

        const hasStock =
          variants.length === 0
            ? product.stockQuantity > 0
            : variants.some((v) => v.inStock);

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
  const session = await auth();
  const reviewsWhere: Prisma.ReviewWhereInput = session?.user?.id
    ? {
        OR: [
          { status: "APPROVED" },
          { status: "PENDING", userId: session.user.id },
        ],
      }
    : { status: "APPROVED" };

  const productQuery = {
    where: { id },
    include: {
      images: {
        where: { url: { not: "" } },
        orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
      },
      categories: { include: { category: true } },
      reviews: {
        where: reviewsWhere,
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  } satisfies Prisma.ProductFindUniqueArgs;

  type ProductWithFullDetails = Prisma.ProductGetPayload<typeof productQuery>;
  const product: ProductWithFullDetails | null = await prisma.product.findUnique(productQuery);

  if (!product) return null;

  return {
    ...product,
    images:
      product.images.length > 0
        ? product.images
        : product.image
          ? [
              {
                id: `${product.id}-image`,
                url: product.image,
                altText: product.name,
                isPrimary: true,
              },
            ]
          : product.categories[0]?.category.image
            ? [
                {
                  id: `${product.id}-category-image`,
                  url: product.categories[0].category.image,
                  altText: product.name,
                  isPrimary: true,
                },
              ]
            : [],
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
  }
}