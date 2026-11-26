"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { CATEGORY_OPTIONS } from "@/data/category-options";

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

const productCardInclude = {
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
} satisfies Prisma.ProductInclude;

type ProductWithCardRelations = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

function toProductData(product: ProductWithCardRelations): ProductData {
  const category = product.categories[0]?.category?.name || "Uncategorized";
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

  const variants = product.variants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    name: variant.name,
    price: variant.price ? Number(variant.price) : undefined,
    color: variant.color || undefined,
    size: variant.size || undefined,
    inStock: variant.inventory
      ? variant.inventory.quantity - variant.inventory.reservedQuantity > 0
      : false,
  }));

  return {
    id: product.id,
    name: product.name,
    category,
    price: Number(product.price),
    image,
    inStock:
      variants.length === 0
        ? product.stockQuantity > 0
        : variants.some((variant) => variant.inStock),
    badge: product.isFeatured ? "Featured" : category,
    variants,
  };
}

export async function getProducts(params: GetProductsParams) {
  const cacheParams = {
    searchQuery: params.searchQuery ?? "",
    selectedCategory: params.selectedCategory ?? null,
    inStockOnly: params.inStockOnly ?? false,
    sortBy: params.sortBy ?? "newest",
    page: params.page ?? 1,
    perPage: params.perPage ?? 8,
  };

  return unstable_cache(
    async () => {
    try {
      console.log("🔥🔥I am in fetching from db🔥🔥 :)");
      const {
        searchQuery,
        selectedCategory,
        inStockOnly,
        sortBy,
        page,
        perPage,
      } = cacheParams;

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
        include: productCardInclude,
      } satisfies Prisma.ProductFindManyArgs;

      type ProductWithRelations = Prisma.ProductGetPayload<typeof productsQuery>;
      const products: ProductWithRelations[] = await prisma.product.findMany(productsQuery);

      const totalPages = Math.ceil(totalCount / perPage);
      const formattedProducts = products.map(toProductData);

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
    [
      "storefront-products",
      cacheParams.searchQuery,
      cacheParams.selectedCategory ?? "",
      String(cacheParams.inStockOnly),
      cacheParams.sortBy,
      String(cacheParams.page),
      String(cacheParams.perPage),
    ],
    {
      revalidate: 3600,
      tags: ["products"],
    }
  )();
}

export async function getProductById(id: string) {
  const session = await auth();
  const product = await unstable_cache(
    async () => {
      const cachedProduct = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          isFeatured: true,
          images: {
            where: { url: { not: "" } },
            orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
            select: { id: true, url: true, altText: true, isPrimary: true },
          },
          categories: {
            select: {
              category: {
                select: { id: true, name: true, slug: true, image: true },
              },
            },
          },
          reviews: {
            where: { status: "APPROVED" },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!cachedProduct) return null;

      return {
        ...cachedProduct,
        price: Number(cachedProduct.price),
        reviews: cachedProduct.reviews.map((review) => ({
          ...review,
          createdAt: review.createdAt.toISOString(),
        })),
      };
    },
    ["storefront-product-detail", id],
    { revalidate: 3600, tags: ["products"] }
  )();

  if (!product) return null;

  const pendingReviews = session?.user?.id
    ? await prisma.review.findMany({
        where: {
          productId: id,
          userId: session.user.id,
          status: "PENDING",
        },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

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
    reviews: [
      ...product.reviews,
      ...pendingReviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  };
}

export async function getRelatedProducts(
  productId: string,
  categoryId?: string,
  categorySlug?: string
): Promise<ProductData[]> {
  return unstable_cache(
    async () => {
  const related: ProductWithCardRelations[] = [];

  if (categoryId) {
    related.push(
      ...(await prisma.product.findMany({
        where: {
          isActive: true,
          id: { not: productId },
          categories: { some: { categoryId } },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: productCardInclude,
      }))
    );
  }

  const selectedIds = new Set([productId, ...related.map(({ id }) => id)]);
  const remaining = 4 - related.length;
  if (remaining <= 0) return related.map(toProductData);

  const fallbackSlugs = CATEGORY_OPTIONS.map(({ slug }) => slug).filter(
    (slug) => slug !== categorySlug
  );
  if (fallbackSlugs.length === 0) return related.map(toProductData);

  const fallback = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { notIn: [...selectedIds] },
      categories: {
        some: {
          category: {
            isActive: true,
            slug: { in: fallbackSlugs },
          },
        },
      },
    },
    take: remaining,
    orderBy: { createdAt: "desc" },
    include: productCardInclude,
  });

  return [...related, ...fallback].map(toProductData);
    },
    [
      "storefront-related-products",
      productId,
      categoryId ?? "",
      categorySlug ?? "",
      "limit-4",
    ],
    { revalidate: 3600, tags: ["products"] }
  )();
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
    updateTag("products");

    revalidatePath(`/products/${productId}`);
  } catch (error) {
    console.error("Failed to increment product view count:", error);
  }
}