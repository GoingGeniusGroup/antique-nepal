import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 10), 100);
  const q = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "createdAt"; // createdAt | orderNumber | total | status | paymentStatus
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const where: Prisma.OrderWhereInput | undefined = q
    ? {
        OR: [
          { orderNumber: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { user: { email: { contains: q, mode: Prisma.QueryMode.insensitive } } },
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { [sort]: order },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        user: { select: { email: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const safe = data.map((o) => ({
    ...o,
    total: (o.total as unknown as Prisma.Decimal).toString(),
    createdAt: o.createdAt,
  }));

  return NextResponse.json({ page, pageSize, total, data: safe });
}
