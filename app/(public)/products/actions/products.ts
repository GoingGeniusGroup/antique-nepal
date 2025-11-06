"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
}

export async function getProducts(params: GetProductsParams) {
  try {
    const {
      searchQuery = "",
      selectedCategory = null,
      inStockOnly = false,
      sortBy = "newest",
      page = 1,
      perPage = 8,
    } = params;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Search by product name
    if (searchQuery.trim()) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (selectedCategory) {
      where.categories = {
        some: {
          category: {
            id: selectedCategory,
          },
        },
      };
    }

    // Get products with their relations
    let products = await prisma.product.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: {
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
          take: 1,
        },

        variants: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy:
        sortBy === "newest"
          ? { createdAt: "desc" }
          : sortBy === "price-low"
          ? { price: "asc" }
          : sortBy === "price-high"
          ? { price: "desc" }
          : { name: "asc" },
    });

    if (inStockOnly) {
      products = products.filter((p) => {
        // If no variants, consider it in stock
        // If has variants, check inventory
        const hasStock =
          p.variants.length === 0
            ? true
            : p.variants.some((v) => v.inventory && v.inventory.quantity > 0);
        return hasStock;
      });
    }

    // Calculate pagination
    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const skip = (page - 1) * perPage;

    // Apply pagination
    const paginatedProducts = products.slice(skip, skip + perPage);

    const formattedProducts: ProductData[] = paginatedProducts.map(
      (product) => {
        const category =
          product.categories[0]?.category?.name || "Uncategorized";
        // Ensure image is a valid URL for Next.js Image
        let image = "/product_placeholder.jpeg"; // default

        const chosenImage = product.images[0];
        if (chosenImage?.url) {
          const url = chosenImage.url.trim().replace(/^\/+|["']/g, "");
          image = url.startsWith("http") ? url : `/${url}`;
        }

        // Check if product has stock
        // If no variants exist, assume product is in stock (simple product)
        // If variants exist, check if any variant has inventory
        const hasStock =
          product.variants.length === 0
            ? true
            : product.variants.some(
                (v) => v.inventory && v.inventory.quantity > 0
              );

        return {
          id: product.id,
          name: product.name,
          category,
          price: Number(product.price),
          image,
          inStock: hasStock,
          badge: product.isFeatured ? "Featured" : category,
        };
      }
    );

    return {
      products: formattedProducts,
      totalProducts: totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("[v0] Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
      categories: {
        include: {
          category: true,
        },
      },
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
    price: product.price.toNumber(), // 👈 convert Decimal -> number
  };
}
