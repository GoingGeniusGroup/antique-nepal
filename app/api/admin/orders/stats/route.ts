import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

/**
 * GET /api/admin/orders/stats
 * Calculate total income from paid orders and top sales categories
 *
 * Uses unstable_cache similar to getProducts to avoid recalculating
 * heavy stats on every dashboard load.
 */
const getAdminOrderStats = unstable_cache(
  async () => {
    // Get all paid orders
    const paidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      select: {
        id: true,
        total: true,
      },
    });

    // Calculate total income
    const totalIncome = paidOrders.reduce((sum, order) => {
      return sum + Number((order.total as unknown as Prisma.Decimal).toString());
    }, 0);

    // Aggregate orders by status for additional dashboard insights
    const ordersByStatusRaw = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    const ordersByStatus = ordersByStatusRaw.map((item) => ({
      status: item.status,
      count: item._count._all,
    }));

    // Get order items for paid orders and aggregate sales by category
    const paidOrderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          paymentStatus: "PAID",
        },
      },
      select: {
        total: true,
        productVariant: {
          select: {
            product: {
              select: {
                categories: {
                  select: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const categorySalesMap = new Map<
      string,
      {
        name: string;
        totalSales: number;
      }
    >();

    for (const item of paidOrderItems) {
      const itemTotal = Number(
        (item.total as unknown as Prisma.Decimal).toString()
      );

      const productCategories = item.productVariant.product.categories;

      if (!productCategories || productCategories.length === 0) {
        continue;
      }

      for (const productCategory of productCategories) {
        const category = productCategory.category;
        if (!category) continue;

        const existing = categorySalesMap.get(category.id) ?? {
          name: category.name,
          totalSales: 0,
        };

        existing.totalSales += itemTotal;
        categorySalesMap.set(category.id, existing);
      }
    }

    const topCategories = Array.from(categorySalesMap.entries())
      .map(([id, value]) => ({ id, name: value.name, totalSales: value.totalSales }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    // Popular products based on wishlist, cart, and paid order activity
    const productStatsMap = new Map<
      string,
      {
        wishlistCount: number;
        cartCount: number;
        orderCount: number;
      }
    >();

    const wishlistCounts = await prisma.wishlistItem.groupBy({
      by: ["productId"],
      _count: {
        _all: true,
      },
    });

    for (const item of wishlistCounts) {
      productStatsMap.set(item.productId, {
        wishlistCount: item._count._all,
        cartCount: 0,
        orderCount: 0,
      });
    }

    const cartItems = await prisma.cartItem.findMany({
      select: {
        quantity: true,
        productVariant: {
          select: {
            productId: true,
          },
        },
      },
    });

    for (const item of cartItems) {
      const productId = item.productVariant.productId;
      const existing =
        productStatsMap.get(productId) ??
        {
          wishlistCount: 0,
          cartCount: 0,
          orderCount: 0,
        };

      existing.cartCount += item.quantity;
      productStatsMap.set(productId, existing);
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          paymentStatus: "PAID",
        },
      },
      select: {
        quantity: true,
        productVariant: {
          select: {
            productId: true,
          },
        },
      },
    });

    for (const item of orderItems) {
      const productId = item.productVariant.productId;
      const existing =
        productStatsMap.get(productId) ??
        {
          wishlistCount: 0,
          cartCount: 0,
          orderCount: 0,
        };

      existing.orderCount += item.quantity;
      productStatsMap.set(productId, existing);
    }

    const productIds = Array.from(productStatsMap.keys());

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const productNameMap = new Map(products.map((p) => [p.id, p.name]));

    const popularProducts = Array.from(productStatsMap.entries())
      .map(([id, stats]) => {
        const name = productNameMap.get(id) ?? "Unknown product";
        const score =
          stats.orderCount * 3 + stats.cartCount * 2 + stats.wishlistCount;

        return {
          id,
          name,
          wishlistCount: stats.wishlistCount,
          cartCount: stats.cartCount,
          orderCount: stats.orderCount,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ score, ...rest }) => rest);

    return {
      totalIncome,
      totalPaidOrders: paidOrders.length,
      ordersByStatus,
      topCategories,
      popularProducts,
    };
  },
  ["admin-order-stats"],
  {
    revalidate: 30,
    tags: ["admin-order-stats"],
  }
);

export async function GET() {
  try {
    const data = await getAdminOrderStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calculating order stats:", error);
    return NextResponse.json(
      { error: "Failed to calculate order statistics" },
      { status: 500 }
    );
  }
}
