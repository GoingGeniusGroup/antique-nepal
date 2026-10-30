import { CalendarClock, CheckCircle2, Clock3, PackageCheck, Truck, XCircle } from "lucide-react";
import { FulfillmentChart, PeakTimesChart } from "@/components/admin/statistics/statistics-charts";
import { StatCard } from "@/components/admin/statistics/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import prisma from "@/lib/prisma";
import { requireStatisticsAdmin } from "@/lib/admin-statistics";

const statuses = [
  { key: "PENDING", title: "Pending", icon: Clock3, accent: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  { key: "PROCESSING", title: "Processing", icon: PackageCheck, accent: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  { key: "SHIPPED", title: "Shipped", icon: Truck, accent: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  { key: "DELIVERED", title: "Delivered", icon: CheckCircle2, accent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  { key: "CANCELLED", title: "Canceled", icon: XCircle, accent: "bg-rose-500/10 text-rose-700 dark:text-rose-300" },
] as const;

function nepalHour(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date)
  );
}

export default async function StatisticsOrdersPage() {
  await requireStatisticsAdmin();
  const orders = await prisma.order.findMany({
    select: { status: true, paymentStatus: true, createdAt: true },
  });
  const counts = new Map<string, number>();
  const hourlyCounts = Array.from({ length: 24 }, () => 0);
  const monthly = new Map<string, { fulfilled: number; refunded: number }>();
  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
    hourlyCounts[nepalHour(order.createdAt)] += 1;

    const monthKey = `${order.createdAt.getUTCFullYear()}-${String(order.createdAt.getUTCMonth() + 1).padStart(2, "0")}`;
    const bucket = monthly.get(monthKey) ?? { fulfilled: 0, refunded: 0 };
    if (order.status === "DELIVERED") bucket.fulfilled += 1;
    if (order.status === "REFUNDED" || order.paymentStatus === "REFUNDED") bucket.refunded += 1;
    monthly.set(monthKey, bucket);
  }

  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  since.setHours(0, 0, 0, 0);
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(since);
    date.setMonth(since.getMonth() + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      period: date.toLocaleDateString("en-NP", { month: "short" }),
      ...(monthly.get(key) ?? { fulfilled: 0, refunded: 0 }),
    };
  });
  const highestHour = hourlyCounts.reduce((peak, count, hour) => count > hourlyCounts[peak] ? hour : peak, 0);
  const peakLabel = orders.length
    ? `${String(highestHour).padStart(2, "0")}:00–${String(highestHour + 1).padStart(2, "0")}:00`
    : "—";

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Order Statistics" description="Order status, fulfillment, and ordering patterns." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statuses.map((status) => {
            const Icon = status.icon;
            const count = status.key === "PROCESSING"
              ? (counts.get("PROCESSING") ?? 0) + (counts.get("CONFIRMED") ?? 0)
              : counts.get(status.key) ?? 0;
            return (
              <StatCard
                key={status.key}
                title={status.title}
                value={count.toLocaleString("en-NP")}
                description={status.key === "PROCESSING" ? "Includes confirmed orders" : "All-time orders"}
                icon={Icon}
                accent={status.accent}
              />
            );
          })}
          <StatCard title="Peak Ordering Time" value={peakLabel} description="Busiest one-hour period (Nepal time)" icon={CalendarClock} accent="bg-orange-500/10 text-orange-700 dark:text-orange-300" />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <PeakTimesChart data={hourlyCounts.map((count, hour) => ({ hour: `${String(hour).padStart(2, "0")}:00`, orders: count }))} />
          <FulfillmentChart data={monthlyData} />
        </div>
      </div>
    </PageTransition>
  );
}
