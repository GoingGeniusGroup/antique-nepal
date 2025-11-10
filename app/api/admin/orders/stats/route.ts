import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * GET /api/admin/orders/stats
 * Calculate total income from paid orders
 */
export async function GET() {
  try {
    // Get all paid orders
    const paidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      select: {
        total: true,
      },
    });

    // Calculate total income
    const totalIncome = paidOrders.reduce((sum, order) => {
      return sum + Number((order.total as unknown as Prisma.Decimal).toString());
    }, 0);

    return NextResponse.json({ 
      totalIncome,
      totalPaidOrders: paidOrders.length 
    });
  } catch (error) {
    console.error("Error calculating order stats:", error);
    return NextResponse.json(
      { error: "Failed to calculate order statistics" },
      { status: 500 }
    );
  }
}
