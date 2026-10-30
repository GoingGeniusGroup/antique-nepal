import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 10), 100);
  const q = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "createdAt"; // createdAt | email | firstName | lastName | role
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const where: Prisma.UserWhereInput | undefined = q
    ? {
        OR: [
          { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { [sort]: order },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ page, pageSize, total, data });
}
