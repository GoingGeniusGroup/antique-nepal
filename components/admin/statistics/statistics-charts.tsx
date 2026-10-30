"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenuePoint = { date: string; revenue: number };
type CategoryPoint = { name: string; revenue: number };
type OrderPoint = { period: string; fulfilled: number; refunded: number };
type HourPoint = { hour: string; orders: number };

const COLORS = ["#b77945", "#548c81", "#d7a949", "#7a75a8", "#d47862"];
const currency = (value: number) =>
  `NPR ${value.toLocaleString("en-NP", { maximumFractionDigits: 0 })}`;

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const chartData = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    if (range === "daily") start.setDate(today.getDate() - 13);
    if (range === "weekly") start.setDate(today.getDate() - 83);
    if (range === "monthly") start.setMonth(today.getMonth() - 11);
    start.setHours(0, 0, 0, 0);

    const buckets = new Map<string, number>();
    const cursor = new Date(start);
    while (cursor <= today) {
      let key: string;
      if (range === "daily") {
        key = cursor.toISOString().slice(0, 10);
      } else if (range === "weekly") {
        const week = new Date(cursor);
        week.setDate(week.getDate() - ((week.getDay() + 6) % 7));
        key = week.toISOString().slice(0, 10);
      } else {
        key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      }
      buckets.set(key, 0);
      cursor.setDate(cursor.getDate() + 1);
    }

    for (const point of data) {
      const date = new Date(`${point.date}T00:00:00`);
      let key: string;
      if (range === "daily") {
        key = point.date;
      } else if (range === "weekly") {
        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        key = date.toISOString().slice(0, 10);
      } else {
        key = point.date.slice(0, 7);
      }
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + point.revenue);
    }

    return Array.from(buckets, ([key, revenue]) => ({
      label:
        range === "monthly"
          ? new Date(`${key}-01T00:00:00`).toLocaleDateString("en-NP", {
              month: "short",
              year: "2-digit",
            })
          : new Date(`${key}T00:00:00`).toLocaleDateString("en-NP", {
              month: "short",
              day: "numeric",
            }),
      revenue,
    }));
  }, [data, range]);

  return (
    <ChartPanel title="Revenue over time" description="Paid orders only">
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Revenue chart interval">
        {(["daily", "weekly", "monthly"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRange(item)}
            aria-pressed={range === item}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
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
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} minTickGap={18} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} width={38} />
              <Tooltip formatter={(value) => currency(Number(value))} />
              <Line type="monotone" dataKey="revenue" stroke="#b77945" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </ChartPanel>
  );
}

export function CategoriesChart({ data }: { data: CategoryPoint[] }) {
  return (
    <ChartPanel title="Sales by top categories" description="Revenue from paid order items">
      <div className="h-72 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="revenue" nameKey="name" cx="50%" cy="48%" innerRadius={55} outerRadius={95} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => currency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
      {data.length > 0 && (
        <ul className="mt-1 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {data.map((item, index) => (
            <li key={item.name} className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="truncate">{item.name}</span>
              <span className="ml-auto font-medium text-foreground">{currency(item.revenue)}</span>
            </li>
          ))}
        </ul>
      )}
    </ChartPanel>
  );
}

export function PeakTimesChart({ data }: { data: HourPoint[] }) {
  return (
    <ChartPanel title="Peak ordering times" description="Order placement hour in Nepal time">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={2} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="orders" name="Orders" fill="#b77945" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

export function FulfillmentChart({ data }: { data: OrderPoint[] }) {
  return (
    <ChartPanel
      title="Delivered vs. refunded orders"
      description="Monthly counts; refunded orders are shown as the available proxy for returns."
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="fulfilled" name="Delivered" fill="#548c81" radius={[4, 4, 0, 0]} />
            <Bar dataKey="refunded" name="Refunded (return proxy)" fill="#d47862" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data available for this period.
    </div>
  );
}
