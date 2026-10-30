import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });
    const totalRevenue = revenueResult._sum.total ? Number(revenueResult._sum.total) : 0;

    // ✅ Explicitly type as 'any' to prevent strict empty-object inference during build
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ordersByStatusRaw: any = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ordersByStatus = ordersByStatusRaw.map((item: any) => ({
      status: item.status,
      count: item._count._all,
    }));

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const safeRecentOrders = recentOrders.map((order) => ({
      ...order,
      total: Number(order.total),
    }));

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders: safeRecentOrders,
    });
  } catch (error) {
    console.error("[Admin Order Stats Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch order statistics" },
      { status: 500 }
    );
  }
}