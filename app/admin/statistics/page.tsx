import {
  BadgeDollarSign,
  PackageCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { CustomerGrowthChart, RevenueOrdersChart, CategorySalesChart, ProductSalesChart } from "@/components/admin/statistics/dashboard-charts";
import { LowStockTable, TopCustomersTable, TopProductsTable } from "@/components/admin/statistics/dashboard-tables";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { StatCard } from "@/components/admin/statistics/stat-card";
import { getStatisticsDashboardData, requireStatisticsAdmin, type GrowthMetric } from "@/lib/admin-statistics";

export const dynamic = "force-dynamic";

function GrowthDescription({ metric }: { metric: GrowthMetric }) {
  if (metric.previous === 0) {
    return <span>{metric.current > 0 ? "New this month · compared with the same period last month" : "No activity this month"}</span>;
  }
  const change = ((metric.current - metric.previous) / metric.previous) * 100;
  const sign = change > 0 ? "+" : "";
  const color = change > 0 ? "text-emerald-700 dark:text-emerald-300" : change < 0 ? "text-rose-700 dark:text-rose-300" : "";
  return (
    <span>
      <span className={`font-semibold ${color}`}>{sign}{change.toFixed(1)}%</span>
      {" "}vs same period last month
    </span>
  );
}

export default async function StatisticsDashboardPage() {
  await requireStatisticsAdmin();
  const data = await getStatisticsDashboardData();

  return (
    <PageTransition>
      <div className="space-y-7">
        <PageHeader
          title="Statistics Dashboard"
          description="A clear view of sales, customers, and inventory performance."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`NPR ${data.metrics.revenue.toLocaleString("en-NP", { maximumFractionDigits: 0 })}`}
            description={<GrowthDescription metric={data.growth.revenue} />}
            icon={BadgeDollarSign}
            accent="bg-amber-500/10 text-amber-700 dark:text-amber-300"
          />
          <StatCard
            title="Total Orders"
            value={data.metrics.orders.toLocaleString("en-NP")}
            description={<GrowthDescription metric={data.growth.orders} />}
            icon={ShoppingCart}
            accent="bg-sky-500/10 text-sky-700 dark:text-sky-300"
          />
          <StatCard
            title="Active Products"
            value={data.metrics.activeProducts.toLocaleString("en-NP")}
            description={<GrowthDescription metric={data.growth.activeProducts} />}
            icon={PackageCheck}
            accent="bg-violet-500/10 text-violet-700 dark:text-violet-300"
          />
          <StatCard
            title="Total Customers"
            value={data.metrics.customers.toLocaleString("en-NP")}
            description={<GrowthDescription metric={data.growth.customers} />}
            icon={Users}
            accent="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          />
        </div>

        <RevenueOrdersChart data={data.revenueTrend} />

        <div className="grid gap-5 xl:grid-cols-2">
          <CategorySalesChart data={data.categorySales} />
          <ProductSalesChart data={data.topProducts.map(({ name, unitsSold }) => ({ name, unitsSold }))} />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <TopProductsTable products={data.topProducts} />
          <TopCustomersTable customers={data.topCustomers} />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <CustomerGrowthChart data={data.customerGrowth} />
          <LowStockTable items={data.lowStock} />
        </div>
      </div>
    </PageTransition>
  );
}
