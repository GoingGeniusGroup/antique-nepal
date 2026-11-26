import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

const PRODUCTS_PER_PAGE = 8;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(
    searchParams.get("perPage") || String(PRODUCTS_PER_PAGE)
  );
  const searchQuery = searchParams.get("searchQuery") || "";
  const inStockOnly = searchParams.get("inStockOnly") === "true";
  const sortBy = searchParams.get("sortBy") || "newest";

  try {
    const result = await unstable_cache(
      async () => {
        const category = await prisma.category.findFirst({
          where: { slug, isActive: true },
          select: { id: true, name: true, description: true },
        });

        if (!category) {
          return {
            status: 404,
            body: {
              category: null,
              products: [],
              totalProducts: 0,
              totalPages: 0,
              currentPage: page,
            },
          };
        }

        const whereClause: Prisma.ProductWhereInput = {
          isActive: true,
          categories: { some: { categoryId: category.id } },
        };

        if (searchQuery.trim()) {
          whereClause.OR = [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ];
        }

        if (inStockOnly) {
          whereClause.AND = [
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
          ];
        }

        const orderBy: Prisma.ProductOrderByWithRelationInput =
          sortBy === "price-low"
            ? { price: "asc" }
            : sortBy === "price-high"
              ? { price: "desc" }
              : sortBy === "name"
                ? { name: "asc" }
                : { createdAt: "desc" };

        const totalProducts = await prisma.product.count({
          where: whereClause,
        });
        const products = await prisma.product.findMany({
          where: whereClause,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            isActive: true,
            stockQuantity: true,
            images: {
              select: { url: true, altText: true, isPrimary: true },
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
        });

        return {
          status: 200,
          body: {
            category,
            products: products.map((product) => ({
              ...product,
              price: Number(product.price),
              inStock:
                product.variants.length > 0
                  ? product.variants.some(
                      (variant) =>
                        variant.inventory &&
                        variant.inventory.quantity -
                          variant.inventory.reservedQuantity >
                          0
                    )
                  : product.stockQuantity > 0,
              variants: product.variants.map((variant) => ({
                id: variant.id,
                sku: variant.sku,
                name: variant.name,
                price: variant.price ? Number(variant.price) : undefined,
                color: variant.color || undefined,
                size: variant.size || undefined,
                inStock: Boolean(
                  variant.inventory &&
                    variant.inventory.quantity -
                      variant.inventory.reservedQuantity >
                      0
                ),
              })),
            })),
            totalProducts,
            totalPages: Math.ceil(totalProducts / perPage),
            currentPage: page,
          },
        };
      },
      [
        "storefront-category-products",
        slug,
        String(page),
        String(perPage),
        searchQuery,
        String(inStockOnly),
        sortBy,
      ],
      { revalidate: 3600, tags: ["products", "categories"] }
    )();

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        category: null,
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: page,
      },
      { status: 500 }
    );
  }
}
