"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = { date: string; revenue: number; orders: number };
type CategoryPoint = { name: string; revenue: number };
type ProductPoint = { name: string; unitsSold: number };
type CustomerPoint = { month: string; customers: number };

const COLORS = ["#b77945", "#548c81", "#d7a949", "#7a75a8", "#d47862"];
const numberFormatter = new Intl.NumberFormat("en-NP");
const formatNpr = (value: number) => `NPR ${numberFormatter.format(value)}`;

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/50 bg-card/75 p-5 shadow-sm backdrop-blur-xl dark:border-white/10">
      <div className="mb-5">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data available for this period.
    </div>
  );
}

function toLocalDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function RevenueOrdersChart({ data }: { data: TrendPoint[] }) {
  const [range, setRange] = useState<"daily" | "monthly">("daily");
  const chartData = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const start = new Date(`${today}T00:00:00Z`);

    const buckets = new Map<string, { revenue: number; orders: number }>();
    if (range === "daily") {
      start.setUTCDate(start.getUTCDate() - 13);
      const cursor = new Date(start);
      const end = new Date(`${today}T00:00:00Z`);
      while (cursor <= end) {
        buckets.set(cursor.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    } else {
      start.setUTCDate(1);
      start.setUTCMonth(start.getUTCMonth() - 11);
      const cursor = new Date(start);
      const todayDate = new Date(`${today}T00:00:00Z`);
      const end = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), 1));
      while (cursor <= end) {
        buckets.set(
          `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`,
          { revenue: 0, orders: 0 },
        );
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      }
    }

    for (const point of data) {
      const key = range === "daily" ? point.date : point.date.slice(0, 7);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.revenue += point.revenue;
        bucket.orders += point.orders;
      }
    }

    return Array.from(buckets, ([key, values]) => ({
      label:
        range === "monthly"
          ? toLocalDate(`${key}-01`).toLocaleDateString("en-NP", { month: "short", year: "2-digit" })
          : toLocalDate(key).toLocaleDateString("en-NP", { month: "short", day: "numeric" }),
      ...values,
    }));
  }, [data, range]);

  return (
    <Panel title="Revenue & orders" description="Paid order revenue and order count over time.">
      <div className="mb-4 flex gap-2" role="group" aria-label="Sales chart interval">
        {(["daily", "monthly"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRange(item)}
            aria-pressed={range === item}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              range === item
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="h-72 w-full">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="statisticsRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b77945" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#b77945" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} minTickGap={18} />
              <YAxis yAxisId="revenue" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} width={42} />
              <YAxis yAxisId="orders" orientation="right" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={30} />
              <Tooltip
                formatter={(value, name) => [name === "Revenue" ? formatNpr(Number(value)) : numberFormatter.format(Number(value)), name]}
              />
              <Legend />
              <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#b77945" fill="url(#statisticsRevenue)" strokeWidth={2} />
              <Line yAxisId="orders" type="monotone" dataKey="orders" name="Orders" stroke="#548c81" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </div>
    </Panel>
  );
}

export function CategorySalesChart({ data }: { data: CategoryPoint[] }) {
  return (
    <Panel title="Sales by category" description="Share of paid order-item revenue.">
      <div className="h-64 w-full">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="revenue" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={92} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNpr(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </div>
      {data.length > 0 && (
        <ul className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {data.map((item, index) => (
            <li key={item.name} className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="truncate">{item.name}</span>
              <span className="ml-auto whitespace-nowrap font-medium text-foreground">{formatNpr(item.revenue)}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function ProductSalesChart({ data }: { data: ProductPoint[] }) {
  return (
    <Panel title="Best-selling products" description="Top products ranked by units sold.">
      <div className="h-72 w-full">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => numberFormatter.format(Number(value))} />
              <Bar dataKey="unitsSold" name="Units sold" fill="#548c81" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </div>
    </Panel>
  );
}

export function CustomerGrowthChart({ data }: { data: CustomerPoint[] }) {
  const formatted = data.map((item) => ({
    ...item,
    label: toLocalDate(`${item.month}-01`).toLocaleDateString("en-NP", { month: "short", year: "2-digit" }),
  }));
  return (
    <Panel title="Customer growth" description="New customer accounts created each month.">
      <div className="h-72 w-full">
        {formatted.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => numberFormatter.format(Number(value))} />
              <Bar dataKey="customers" name="New customers" fill="#d7a949" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </div>
    </Panel>
  );
}
