import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const MONTHS_TO_SHOW = 12;

export type GrowthMetric = {
  current: number;
  previous: number;
};

export type StatisticsDashboardData = {
  metrics: {
    revenue: number;
    orders: number;
    activeProducts: number;
    customers: number;
  };
  growth: {
    revenue: GrowthMetric;
    orders: GrowthMetric;
    activeProducts: GrowthMetric;
    customers: GrowthMetric;
  };
  revenueTrend: Array<{ date: string; revenue: number; orders: number }>;
  customerGrowth: Array<{ month: string; customers: number }>;
  categorySales: Array<{ name: string; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    sku: string;
    unitsSold: number;
    revenue: number;
  }>;
  lowStock: Array<{
    id: string;
    name: string;
    sku: string;
    available: number;
    threshold: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    orderCount: number;
    spend: number;
  }>;
};

function monthStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function decimalToNumber(value: { toString(): string } | null | undefined) {
  return value ? Number(value.toString()) : 0;
}

function addGrowthValue(
  map: Map<string, { name: string; revenue: number }>,
  id: string,
  name: string,
  revenue: number,
) {
  const entry = map.get(id) ?? { name, revenue: 0 };
  entry.revenue += revenue;
  map.set(id, entry);
}

export async function requireStatisticsAdmin() {
  const session = await auth();
  if (!session?.user || !("role" in session.user) || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }
}

export async function getStatisticsDashboardData(): Promise<StatisticsDashboardData> {
  const now = new Date();
  const thisMonthStart = monthStart(now);
  const chartStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS_TO_SHOW - 1), 1));
  const previousMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const previousComparableEnd = new Date(
    Math.min(
      previousMonthStart.getTime() + now.getTime() - thisMonthStart.getTime(),
      thisMonthStart.getTime(),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productSalesQuery: Promise<any[]> = prisma.orderItem.groupBy({
    by: ["productVariantId"],
    where: { order: { paymentStatus: "PAID" } },
    _sum: { quantity: true, total: true },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerSalesQuery: Promise<any[]> = prisma.order.groupBy({
    by: ["userId"],
    where: { paymentStatus: "PAID" },
    _sum: { total: true },
    _count: { _all: true },
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });

  const [
    lifetimeRevenue,
    totalOrders,
    activeProducts,
    totalCustomers,
    paidOrders,
    placedOrders,
    newCustomers,
    newActiveProducts,
    productSales,
    lowStockInventory,
    customerSales,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: chartStart, lt: now },
      },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: previousMonthStart, lt: now } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        createdAt: { gte: chartStart, lt: now },
      },
      select: { createdAt: true },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        createdAt: { gte: previousMonthStart, lt: now },
      },
      select: { createdAt: true },
    }),
    productSalesQuery,
    prisma.inventory.findMany({
      where: { productVariant: { product: { isActive: true } } },
      select: {
        quantity: true,
        reservedQuantity: true,
        lowStockThreshold: true,
        productVariant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: { select: { name: true } },
          },
        },
      },
    }),
    customerSalesQuery,
  ]);

  const revenueByDate = new Map<string, { revenue: number; orders: number }>();
  const monthlyRevenue = new Map<string, { revenue: number; orders: number }>();
  for (const order of paidOrders) {
    const day = dateKey(order.createdAt);
    const daily = revenueByDate.get(day) ?? { revenue: 0, orders: 0 };
    daily.revenue += decimalToNumber(order.total);
    daily.orders += 1;
    revenueByDate.set(day, daily);

    const month = monthKey(order.createdAt);
    const monthly = monthlyRevenue.get(month) ?? { revenue: 0, orders: 0 };
    monthly.revenue += decimalToNumber(order.total);
    monthly.orders += 1;
    monthlyRevenue.set(month, monthly);
  }

  const customerCounts = new Map<string, number>();
  for (const customer of newCustomers) {
    const month = monthKey(customer.createdAt);
    customerCounts.set(month, (customerCounts.get(month) ?? 0) + 1);
  }

  const orderCountFor = (start: Date, end: Date) =>
    placedOrders.filter((order) => order.createdAt >= start && order.createdAt < end).length;
  const revenueFor = (start: Date, end: Date) =>
    paidOrders
      .filter((order) => order.createdAt >= start && order.createdAt < end)
      .reduce((sum, order) => sum + decimalToNumber(order.total), 0);
  const customerCountFor = (start: Date, end: Date) =>
    newCustomers.filter((customer) => customer.createdAt >= start && customer.createdAt < end).length;
  const activeProductCountFor = (start: Date, end: Date) =>
    newActiveProducts.filter((product) => product.createdAt >= start && product.createdAt < end).length;

  const salesByVariant = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productSales.map((sale: any) => [
      sale.productVariantId,
      {
        unitsSold: sale._sum.quantity ?? 0,
        revenue: decimalToNumber(sale._sum.total),
      },
    ]),
  );
  const variants = salesByVariant.size
    ? await prisma.productVariant.findMany({
        where: { id: { in: Array.from(salesByVariant.keys()) } },
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              categories: {
                select: { category: { select: { id: true, name: true } } },
              },
            },
          },
        },
      })
    : [];
  const productTotals = new Map<
    string,
    { name: string; sku: string; unitsSold: number; revenue: number }
  >();
  const categoryTotals = new Map<string, { name: string; revenue: number }>();
  for (const variant of variants) {
    const sale = salesByVariant.get(variant.id);
    if (!sale) continue;

    const currentProduct = productTotals.get(variant.product.id) ?? {
      name: variant.product.name,
      sku: variant.product.sku,
      unitsSold: 0,
      revenue: 0,
    };
    currentProduct.unitsSold += sale.unitsSold;
    currentProduct.revenue += sale.revenue;
    productTotals.set(variant.product.id, currentProduct);

    const categories = variant.product.categories;
    if (categories.length === 0) {
      addGrowthValue(categoryTotals, "uncategorized", "Uncategorized", sale.revenue);
    } else {
      for (const { category } of categories) {
        addGrowthValue(categoryTotals, category.id, category.name, sale.revenue / categories.length);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customerIds = customerSales.map((customer: any) => customer.userId);
  const customers = customerIds.length
    ? await prisma.user.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));

  const lowStockItems: StatisticsDashboardData["lowStock"] = [];
  for (const inventory of lowStockInventory) {
    const available = Math.max(0, inventory.quantity - inventory.reservedQuantity);
    if (available > inventory.lowStockThreshold) continue;

    lowStockItems.push({
      id: inventory.productVariant.id,
      name: `${inventory.productVariant.product.name} · ${inventory.productVariant.name}`,
      sku: inventory.productVariant.sku,
      available,
      threshold: inventory.lowStockThreshold,
    });
  }

  const monthTrend = Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
    const month = new Date(Date.UTC(chartStart.getUTCFullYear(), chartStart.getUTCMonth() + index, 1));
    const key = monthKey(month);
    return {
      month: key,
      customers: customerCounts.get(key) ?? 0,
    };
  });

  return {
    metrics: {
      revenue: decimalToNumber(lifetimeRevenue._sum.total),
      orders: totalOrders,
      activeProducts,
      customers: totalCustomers,
    },
    growth: {
      revenue: {
        current: revenueFor(thisMonthStart, now),
        previous: revenueFor(previousMonthStart, previousComparableEnd),
      },
      orders: {
        current: orderCountFor(thisMonthStart, now),
        previous: orderCountFor(previousMonthStart, previousComparableEnd),
      },
      activeProducts: {
        current: activeProductCountFor(thisMonthStart, now),
        previous: activeProductCountFor(previousMonthStart, previousComparableEnd),
      },
      customers: {
        current: customerCountFor(thisMonthStart, now),
        previous: customerCountFor(previousMonthStart, previousComparableEnd),
      },
    },
    revenueTrend: Array.from(revenueByDate, ([date, totals]) => ({
      date,
      ...totals,
    })),
    customerGrowth: monthTrend,
    categorySales: Array.from(categoryTotals.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    topProducts: Array.from(productTotals, ([id, product]) => ({ id, ...product }))
      .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
      .slice(0, 5),
    lowStock: lowStockItems.sort((a, b) => a.available - b.available),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topCustomers: customerSales.flatMap((sale: any) => {
      const customer = customerById.get(sale.userId);
      return customer
        ? [{
            id: customer.id,
            name: customer.name || "Unnamed customer",
            email: customer.email,
            orderCount: sale._count._all,
            spend: decimalToNumber(sale._sum.total),
          }]
        : [];
    }),
  };
}
