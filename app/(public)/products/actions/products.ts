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
          where: { isPrimary: true },
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
        const hasStock = p.variants.length === 0
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
        if (product.images[0]?.url) {
          const url = product.images[0].url.trim().replace(/^\/+|["']/g, ""); // remove leading slashes and quotes
          image = url.startsWith("http") ? url : `/${url}`; // local or external
        }

        // Check if product has stock
        // If no variants exist, assume product is in stock (simple product)
        // If variants exist, check if any variant has inventory
        const hasStock = product.variants.length === 0 
          ? true 
          : product.variants.some((v) => v.inventory && v.inventory.quantity > 0);

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
