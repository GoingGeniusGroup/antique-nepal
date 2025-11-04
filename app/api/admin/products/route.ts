import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductSchema } from "@/app/validations/product/product-schema";
import { success, ZodError } from "zod";

// Fetch all products
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 10), 100);
  const q = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "createdAt"; // createdAt | name | price | isActive
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

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
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        isActive: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const safe = data.map((p) => ({
    ...p,
    price: (p.price as unknown as Prisma.Decimal).toString(),
  }));

  return NextResponse.json({ page, pageSize, total, data: safe });
}

// Create Products
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ProductSchema.parse(body);

    // Check duplicate slug or sku
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug: data.slug }, { sku: data.sku }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with this slug or SKU already exists",
        },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data,
    });
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
