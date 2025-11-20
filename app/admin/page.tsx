"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import {
  Users,
  Package,
  ArrowRight,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/admin-utils";
import { useSession } from "next-auth/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/**
 * Admin Dashboard Page
 *
 * Features:
 * - Total Users, Total Products, Total Orders and Total Income overview
 * - Recent products list
 * - Recent orders list
 * - Quick navigation to detailed views
 */

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  createdAt: string;
};

type Order = {
  id: string;
  orderNumber: string;
  total: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user: { email: string };
  paymentMethod: string;
};

type TopCategory = {
  id: string;
  name: string;
  totalSales: number;
};

type PopularProductStat = {
  id: string;
  name: string;
  wishlistCount: number;
  cartCount: number;
  orderCount: number;
};

const CATEGORY_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#a855f7",
  "#ef4444",
];

export default function AdminHomePage() {
  const { data: session } = useSession();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProductStat[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total users
        const usersRes = await fetch("/api/admin/users?page=1&pageSize=1");
        const usersData = await usersRes.json();
        setTotalUsers(usersData.total || 0);

        // Fetch total products and recent products
        const productsRes = await fetch(
          "/api/admin/products?page=1&pageSize=5&sort=createdAt&order=desc"
        );
        const productsData = await productsRes.json();
        setTotalProducts(productsData.total || 0);
        setRecentProducts(productsData.data || []);

        // Fetch total orders and recent orders
        const ordersRes = await fetch(
          "/api/admin/orders?page=1&pageSize=5&sort=createdAt&order=desc"
        );
        const ordersData = await ordersRes.json();
        setTotalOrders(ordersData.total || 0);
        setRecentOrders(ordersData.data || []);

        // Calculate total income and stats from paid orders
        const incomeRes = await fetch("/api/admin/orders/stats");
        const incomeData = await incomeRes.json();
        setTotalIncome(incomeData.totalIncome || 0);
        setTopCategories(incomeData.topCategories || []);
        setPopularProducts(incomeData.popularProducts || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: loading ? "..." : totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      href: "/admin/users",
    },
    {
      title: "Total Products",
      value: loading ? "..." : totalProducts.toLocaleString(),
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      href: "/admin/products",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      href: "/admin/orders",
    },
    {
      title: "Total Income",
      value: loading ? "..." : formatCurrency(totalIncome.toString()),
      icon: DollarSign,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      href: "/admin/orders",
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="mb-1">
          <h2 className="text-lg text-muted-foreground dark:text-slate-400">
            Welcome,{" "}
            <span className="font-bold text-foreground dark:text-slate-100">
              {session?.user?.name || "Admin"}
            </span>
          </h2>
        </div>

        <PageHeader title="Dashboard" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href}>
                <Card className="p-4 hover:shadow-md transition-all cursor-pointer dark:!bg-slate-800 dark:!border-slate-600 border hover:border-blue-300 dark:hover:border-blue-600">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground dark:text-slate-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground dark:text-slate-100 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${stat.bgColor} flex-shrink-0 ml-3`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Products and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Recent Products */}
          <Card className="p-4 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground dark:text-slate-100">
                Recent Products
              </h2>
              <Link
                href="/admin/products"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                  Loading...
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                  No products found
                </div>
              ) : (
                recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-border dark:border-slate-600 hover:bg-muted/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground dark:text-slate-100 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <p className="text-sm font-bold text-foreground dark:text-slate-100">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-4 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground dark:text-slate-100">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                  Loading...
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                  No orders found
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-border dark:border-slate-600 hover:bg-muted/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground dark:text-slate-100 truncate">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                        {order.user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground dark:text-slate-100">
                          {formatCurrency(order.total)}
                        </p>
                        <div className="flex gap-1 mt-0.5">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              order.paymentStatus === "PAID"
                                ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                                : order.paymentStatus === "FAILED"
                                ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                                : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-4 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground dark:text-slate-100">
                Top Sales Categories
              </h2>
            </div>

            <div className="h-52">
              {loading ? (
                <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                  Loading...
                </div>
              ) : topCategories.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                  No category sales data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories}
                      dataKey="totalSales"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label
                    >
                      {topCategories.map((entry, index) => (
                        <Cell
                          key={entry.id}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(String(value))
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-4 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground dark:text-slate-100">
              Popular Products
            </h2>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                Loading...
              </div>
            ) : popularProducts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground dark:text-slate-400 text-sm">
                No product engagement data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="orderCount"
                    name="Ordered"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="cartCount"
                    name="In Carts"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="wishlistCount"
                    name="Wishlisted"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
