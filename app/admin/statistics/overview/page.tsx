import { BarChart3, CircleDollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { CategoriesChart, RevenueChart } from "@/components/admin/statistics/statistics-charts";
import { StatCard } from "@/components/admin/statistics/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import prisma from "@/lib/prisma";
import { requireStatisticsAdmin } from "@/lib/admin-statistics";
import { Prisma } from "@prisma/client";

const decimalToNumber = (value: Prisma.Decimal) => Number(value.toString());

export default async function StatisticsOverviewPage() {
  await requireStatisticsAdmin();
  const [paidOrders, orderCount, productViews, paidOrderItems] = await Promise.all([
    prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      select: { total: true, createdAt: true },
    }),
    prisma.order.count(),
    prisma.product.aggregate({ _sum: { viewCount: true } }),
    prisma.orderItem.findMany({
      where: { order: { paymentStatus: "PAID" } },
      select: {
        total: true,
        productVariant: {
          select: {
            product: {
              select: {
                categories: { select: { category: { select: { id: true, name: true } } } },
              },
            },
          },
        },
      },
    }),
  ]);

  const totalRevenue = paidOrders.reduce((sum, order) => sum + decimalToNumber(order.total), 0);
  const viewCount = productViews._sum.viewCount ?? 0;
  const conversionRate = viewCount > 0 ? (paidOrders.length / viewCount) * 100 : 0;
  const revenueByDate = new Map<string, number>();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);
  for (const order of paidOrders) {
    if (order.createdAt < oneYearAgo) continue;
    const day = order.createdAt.toISOString().slice(0, 10);
    revenueByDate.set(day, (revenueByDate.get(day) ?? 0) + decimalToNumber(order.total));
  }

  const categoryRevenue = new Map<string, { name: string; revenue: number }>();
  for (const item of paidOrderItems) {
    const itemRevenue = decimalToNumber(item.total);
    const categories = item.productVariant.product.categories;
    if (categories.length === 0) {
      const existing = categoryRevenue.get("uncategorized") ?? { name: "Uncategorized", revenue: 0 };
      existing.revenue += itemRevenue;
      categoryRevenue.set("uncategorized", existing);
      continue;
    }
    for (const { category } of categories) {
      const existing = categoryRevenue.get(category.id) ?? { name: category.name, revenue: 0 };
      existing.revenue += itemRevenue / categories.length;
      categoryRevenue.set(category.id, existing);
    }
  }

  const topCategories = Array.from(categoryRevenue.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Statistics Overview" description="A snapshot of revenue, orders, and sales performance." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Revenue" value={`NPR ${totalRevenue.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} description="Lifetime revenue from paid orders" icon={CircleDollarSign} accent="bg-amber-500/10 text-amber-700 dark:text-amber-300" />
          <StatCard title="Total Orders" value={orderCount.toLocaleString("en-NP")} description={`${paidOrders.length.toLocaleString("en-NP")} paid orders`} icon={ShoppingBag} accent="bg-sky-500/10 text-sky-700 dark:text-sky-300" />
          <StatCard title="Conversion Rate" value={`${conversionRate.toFixed(2)}%`} description="Paid orders ÷ recorded product views (estimate)" icon={TrendingUp} accent="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" />
          <StatCard title="Average Order Value" value={`NPR ${(paidOrders.length ? totalRevenue / paidOrders.length : 0).toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} description="Average total of paid orders" icon={BarChart3} accent="bg-violet-500/10 text-violet-700 dark:text-violet-300" />
        </div>
        <p className="-mt-3 text-xs text-muted-foreground">
          Conversion uses aggregate product page views and paid-order count because the database does not track storefront sessions or unique visitors.
        </p>
        <div className="grid gap-5 xl:grid-cols-2">
          <RevenueChart data={Array.from(revenueByDate, ([date, revenue]) => ({ date, revenue }))} />
          <CategoriesChart data={topCategories} />
        </div>
      </div>
    </PageTransition>
  );
}
