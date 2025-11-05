"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Users, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/admin-utils";
import { useSession } from "next-auth/react";

/**
 * Admin Dashboard Page
 * 
 * Features:
 * - Total Users and Total Products overview
 * - Recent products list
 * - Quick navigation to detailed views
 */

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  createdAt: string;
};

export default function AdminHomePage() {
  const { data: session } = useSession();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total users
        const usersRes = await fetch("/api/admin/users?page=1&pageSize=1");
        const usersData = await usersRes.json();
        setTotalUsers(usersData.total || 0);

        // Fetch total products and recent products
        const productsRes = await fetch("/api/admin/products?page=1&pageSize=5&sort=createdAt&order=desc");
        const productsData = await productsRes.json();
        setTotalProducts(productsData.total || 0);
        setRecentProducts(productsData.data || []);
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
      href: "/admin/users"
    },
    { 
      title: "Total Products", 
      value: loading ? "..." : totalProducts.toLocaleString(), 
      icon: Package, 
      color: "text-purple-600 dark:text-purple-400", 
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      href: "/admin/products"
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="mb-2">
          <h2 className="text-xl text-muted-foreground dark:text-slate-400">
            Welcome, <span className="font-bold text-foreground dark:text-slate-100">{session?.user?.name || "Admin"}</span>
          </h2>
        </div>
        
        <PageHeader title="Dashboard" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer dark:!bg-slate-800 dark:!border-slate-600 border-2 hover:border-blue-300 dark:hover:border-blue-600">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground dark:text-slate-100 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-full ${stat.bgColor} flex-shrink-0 ml-4`}>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Products - Half Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground dark:text-slate-100">Recent Products</h2>
              <Link 
                href="/admin/products"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground dark:text-slate-400">
                  Loading...
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground dark:text-slate-400">
                  No products found
                </div>
              ) : (
                recentProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-slate-600 hover:bg-muted/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground dark:text-slate-100 truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <p className="text-sm font-bold text-foreground dark:text-slate-100">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-muted-foreground dark:text-slate-400 whitespace-nowrap">{formatDate(product.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Placeholder for future content */}
          <div className="hidden lg:block">
            {/* Space for additional dashboard widgets */}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
