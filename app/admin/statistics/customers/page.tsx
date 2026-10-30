import { BadgeCheck, UserPlus, Users } from "lucide-react";
import { StatCard } from "@/components/admin/statistics/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import prisma from "@/lib/prisma";
import { requireStatisticsAdmin } from "@/lib/admin-statistics";
import { Prisma } from "@prisma/client";

const formatNpr = (value: number) =>
  `NPR ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (value: Date) =>
  value.toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" });

export default async function StatisticsCustomersPage() {
  await requireStatisticsAdmin();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [customers, activeBuyerCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        orders: { select: { total: true, paymentStatus: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({
      where: {
        role: "CUSTOMER",
        orders: { some: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" } },
      },
    }),
  ]);
  const newSignups = customers.filter((customer) => customer.createdAt >= sevenDaysAgo).length;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Customer Statistics" description="Customer growth, recent activity, and lifetime purchasing." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Customers" value={customers.length.toLocaleString("en-NP")} description="Registered customer accounts" icon={Users} accent="bg-sky-500/10 text-sky-700 dark:text-sky-300" />
          <StatCard title="New Signups" value={newSignups.toLocaleString("en-NP")} description="Customer accounts created in the last 7 days" icon={UserPlus} accent="bg-violet-500/10 text-violet-700 dark:text-violet-300" />
          <StatCard title="Active Buyers" value={activeBuyerCount.toLocaleString("en-NP")} description="Customers with a paid order in the last 30 days" icon={BadgeCheck} accent="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" />
        </div>
        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Customer purchasing summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">Spend includes paid orders only; order count includes all placed orders.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Orders placed</th>
                  <th className="px-5 py-3 font-medium">Amount spent</th>
                  <th className="px-5 py-3 font-medium">Join date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((customer) => {
                  const paidOrders = customer.orders.filter((order) => order.paymentStatus === "PAID");
                  const spent = paidOrders.reduce((sum, order) => sum + Number((order.total as Prisma.Decimal).toString()), 0);
                  return (
                    <tr key={customer.id} className="hover:bg-muted/30">
                      <td className="px-5 py-3.5 font-medium">{customer.name || "—"}</td>
                      <td className="px-5 py-3.5">{customer.email}</td>
                      <td className="px-5 py-3.5">{customer.orders.length.toLocaleString("en-NP")}</td>
                      <td className="px-5 py-3.5">{formatNpr(spent)}</td>
                      <td className="px-5 py-3.5">{formatDate(customer.createdAt)}</td>
                    </tr>
                  );
                })}
                {customers.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No customer accounts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
