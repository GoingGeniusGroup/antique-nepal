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
      whereClause.isActive = true; // Assuming isActive indicates stock
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
        images: {
          select: {
            url: true,
            altText: true,
            isPrimary: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalProducts / perPage);

    const formattedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
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
