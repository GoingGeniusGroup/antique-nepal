import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductSchema } from "@/app/validations/product/product-schema";

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
export async function POST(req: Request) {}
