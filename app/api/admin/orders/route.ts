import { NextResponse } from "next/server";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const sortableFields = [
  "createdAt",
  "orderNumber",
  "total",
  "status",
  "paymentStatus",
] as const;

type SortableField = (typeof sortableFields)[number];

function isOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}

function isPaymentStatus(value: string): value is PaymentStatus {
  return Object.values(PaymentStatus).includes(value as PaymentStatus);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestedPage = Number(searchParams.get("page") || 1);
  const requestedPageSize = Number(searchParams.get("pageSize") || 10);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize =
    Number.isInteger(requestedPageSize) && requestedPageSize > 0
      ? Math.min(requestedPageSize, 100)
      : 10;
  const q = (searchParams.get("q") || "").trim();
  const requestedSort = searchParams.get("sort") || "createdAt";
  const sort: SortableField = sortableFields.includes(
    requestedSort as SortableField
  )
    ? (requestedSort as SortableField)
    : "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const requestedStatus = searchParams.get("status");
  const requestedPaymentStatus = searchParams.get("paymentStatus");

  if (
    (requestedStatus && !isOrderStatus(requestedStatus)) ||
    (requestedPaymentStatus && !isPaymentStatus(requestedPaymentStatus))
  ) {
    return NextResponse.json({ error: "Invalid order filter" }, { status: 400 });
  }

  const status =
    requestedStatus && isOrderStatus(requestedStatus)
      ? requestedStatus
      : undefined;
  const paymentStatus =
    requestedPaymentStatus && isPaymentStatus(requestedPaymentStatus)
      ? requestedPaymentStatus
      : undefined;
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(q
      ? {
          OR: [
            {
              orderNumber: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              user: {
                is: {
                  name: { contains: q, mode: Prisma.QueryMode.insensitive },
                },
              },
            },
            {
              user: {
                is: {
                  email: { contains: q, mode: Prisma.QueryMode.insensitive },
                },
              },
            },
          ],
        }
      : {}),
  };

  try {
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          user: {
            select: {
              email: true,
            },
          },
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              paymentMethod: true,
            },
          },
        },
      }),
    ]);

    const data = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total.toString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.payments[0]?.paymentMethod ?? "",
      createdAt: order.createdAt,
      user: order.user,
    }));

    return NextResponse.json({ page, pageSize, total, data });
  } catch (error) {
    console.error("[Admin Orders Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
