"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { TrendingUp, Users, ShoppingCart, Package, DollarSign } from "lucide-react";

/**
 * Admin Dashboard Page
 * 
 * Features:
 * - Overview statistics and KPIs
 * - Recent activity summaries
 * - Quick action buttons
 * - Chart placeholders for future analytics
 */

export default function AdminHomePage() {
  // Mock data - replace with real API calls
  const stats = [
    { title: "Total Revenue", value: "NPR 1,24,500", change: "+12.5%", icon: DollarSign, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-950/50" },
    { title: "Total Orders", value: "156", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/50" },
    { title: "Total Products", value: "89", change: "+3.1%", icon: Package, color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-950/50" },
    { title: "Total Users", value: "1,234", change: "+15.3%", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bgColor: "bg-indigo-50 dark:bg-indigo-950/50" },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Dashboard" />

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 sm:p-6 hover:shadow-md transition-shadow dark:!bg-slate-800 dark:!border-slate-600">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{stat.change}</span>
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} flex-shrink-0 ml-2`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Recent Activity - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base sm:text-lg font-semibold text-foreground">Sales Overview</div>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center rounded-lg bg-gradient-to-br from-muted/30 to-muted/50 border-2 border-dashed border-muted-foreground/20">
            <div className="text-center px-4">
              <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-blue-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">Chart will be implemented here</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</div>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {[
              { action: "New order #1234", time: "2 min ago", type: "order" },
              { action: "Product updated", time: "5 min ago", type: "product" },
              { action: "New user registered", time: "10 min ago", type: "user" },
              { action: "Payment received", time: "15 min ago", type: "payment" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50 dark:!bg-slate-700/50 hover:bg-muted/70 dark:!hover:bg-slate-700 transition-colors">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'order' ? 'bg-blue-400 dark:bg-blue-300' :
                    activity.type === 'product' ? 'bg-purple-400 dark:bg-purple-300' :
                    activity.type === 'user' ? 'bg-green-400 dark:bg-green-300' : 'bg-orange-400 dark:bg-orange-300'
                  }`} />
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </div>
    </PageTransition>
  );
}
