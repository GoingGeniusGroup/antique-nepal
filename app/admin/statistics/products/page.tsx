import { Eye, Package, Trophy } from "lucide-react";
import { StatCard } from "@/components/admin/statistics/stat-card";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import prisma from "@/lib/prisma";
import { requireStatisticsAdmin } from "@/lib/admin-statistics";
import { Prisma } from "@prisma/client";

const decimalToNumber = (value: Prisma.Decimal) => Number(value.toString());
const formatNpr = (value: number) =>
  `NPR ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function StatisticsProductsPage() {
  await requireStatisticsAdmin();
  const [products, orderItems] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        viewCount: true,
        variants: {
          select: { inventory: { select: { quantity: true, reservedQuantity: true, lowStockThreshold: true } } },
        },
      },
    }),
    prisma.orderItem.findMany({
      where: { order: { paymentStatus: "PAID" } },
      select: {
        quantity: true,
        total: true,
        productVariant: { select: { productId: true } },
      },
    }),
  ]);
  const sales = new Map<string, { quantity: number; revenue: number }>();
  for (const item of orderItems) {
    const current = sales.get(item.productVariant.productId) ?? { quantity: 0, revenue: 0 };
    current.quantity += item.quantity;
    current.revenue += decimalToNumber(item.total);
    sales.set(item.productVariant.productId, current);
  }
  const inventory = products.map((product) => {
    const available = product.variants.reduce(
      (sum, variant) => sum + Math.max(0, (variant.inventory?.quantity ?? 0) - (variant.inventory?.reservedQuantity ?? 0)),
      0
    );
    const lowStockVariants = product.variants.filter((variant) =>
      variant.inventory && variant.inventory.quantity - variant.inventory.reservedQuantity <= variant.inventory.lowStockThreshold
    ).length;
    return { product, available, lowStockVariants };
  });
  const ranked = products
    .map((product) => ({ ...product, ...(sales.get(product.id) ?? { quantity: 0, revenue: 0 }) }))
    .sort((a, b) => b.revenue - a.revenue);
  const bestRevenue = ranked[0];
  const bestQuantity = [...ranked].sort((a, b) => b.quantity - a.quantity)[0];
  const lowStock = inventory.filter(({ lowStockVariants }) => lowStockVariants > 0)
    .sort((a, b) => a.available - b.available);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Product Statistics" description="Bestsellers, product interest, and inventory alerts." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Top by Revenue" value={bestRevenue?.name ?? "—"} description={bestRevenue ? formatNpr(bestRevenue.revenue) : "No paid sales yet"} icon={Trophy} accent="bg-amber-500/10 text-amber-700 dark:text-amber-300" />
          <StatCard title="Top by Quantity Sold" value={bestQuantity?.name ?? "—"} description={bestQuantity ? `${bestQuantity.quantity.toLocaleString("en-NP")} units sold` : "No paid sales yet"} icon={Package} accent="bg-sky-500/10 text-sky-700 dark:text-sky-300" />
          <StatCard title="Low-stock Products" value={lowStock.length.toLocaleString("en-NP")} description="At least one variant is at or below its threshold" icon={Eye} accent="bg-rose-500/10 text-rose-700 dark:text-rose-300" />
        </div>
        <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Bestsellers and product views</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ranked by revenue from paid order items.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Units sold</th>
                  <th className="px-5 py-3 font-medium">Revenue</th>
                  <th className="px-5 py-3 font-medium">Product views</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ranked.slice(0, 20).map((product, index) => (
                  <tr key={product.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{index + 1}. {product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.sku}</div>
                    </td>
                    <td className="px-5 py-3.5">{product.quantity.toLocaleString("en-NP")}</td>
                    <td className="px-5 py-3.5">{formatNpr(product.revenue)}</td>
                    <td className="px-5 py-3.5">{product.viewCount.toLocaleString("en-NP")}</td>
                  </tr>
                ))}
                {ranked.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No products available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold">Low-stock alerts</h2>
            <p className="mt-1 text-sm text-muted-foreground">Based on each variant’s configured low-stock threshold.</p>
          </div>
          {lowStock.length ? (
            <ul className="divide-y">
              {lowStock.slice(0, 10).map(({ product, available, lowStockVariants }) => (
                <li key={product.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-rose-700 dark:text-rose-300">
                    {available} available · {lowStockVariants} low-stock {lowStockVariants === 1 ? "variant" : "variants"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No products are currently below their stock thresholds.</p>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
