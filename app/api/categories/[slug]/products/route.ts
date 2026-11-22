import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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
    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          category: null,
          products: [],
          totalProducts: 0,
          totalPages: 0,
          currentPage: page,
        },
        { status: 404 }
      );
    }

    const whereClause: Prisma.ProductWhereInput = {
      categories: {
        some: {
          categoryId: category.id,
        },
      },
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

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === "price-low") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price-high") {
      orderBy = { price: "desc" };
    } else if (sortBy === "name") {
      orderBy = { name: "asc" };
    } else {
      orderBy = { createdAt: "desc" }; // newest
    }

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
          select: {
            url: true,
            altText: true,
            isPrimary: true,
          },
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

    const totalPages = Math.ceil(totalProducts / perPage);

    const formattedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
      inStock:
        p.variants.length > 0
          ? p.variants.some(
              (variant) =>
                variant.inventory &&
                variant.inventory.quantity -
                  variant.inventory.reservedQuantity >
                  0
            )
          : p.stockQuantity > 0,
      variants: p.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        price: variant.price ? Number(variant.price) : undefined,
        color: variant.color || undefined,
        size: variant.size || undefined,
        inStock: Boolean(
          variant.inventory &&
            variant.inventory.quantity - variant.inventory.reservedQuantity > 0
        ),
      })),
    }));

    return NextResponse.json({
      category,
      products: formattedProducts,
      totalProducts,
      totalPages,
      currentPage: page,
    });
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
