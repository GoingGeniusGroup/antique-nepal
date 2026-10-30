import { PackageSearch, UsersRound } from "lucide-react";

type Product = {
  id: string;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: number;
};

type StockItem = {
  id: string;
  name: string;
  sku: string;
  available: number;
  threshold: number;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  spend: number;
};

const formatNpr = (value: number) =>
  `NPR ${value.toLocaleString("en-NP", { maximumFractionDigits: 0 })}`;

function TablePanel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof PackageSearch;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/50 bg-card/75 text-card-foreground shadow-sm backdrop-blur-xl dark:border-white/10">
      <div className="flex items-start gap-3 border-b p-5">
        <span className="rounded-xl bg-primary/10 p-2 text-primary"><Icon aria-hidden="true" className="h-4 w-4" /></span>
        <div>
          <h2 className="font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function TopProductsTable({ products }: { products: Product[] }) {
  return (
    <TablePanel title="Top products" description="Five best sellers by paid units sold." icon={PackageSearch}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Units</th>
              <th className="px-5 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {products.map((product, index) => (
              <tr key={product.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{index + 1}. {product.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{product.sku}</p>
                </td>
                <td className="px-5 py-3.5 tabular-nums">{product.unitsSold.toLocaleString("en-NP")}</td>
                <td className="px-5 py-3.5 whitespace-nowrap tabular-nums">{formatNpr(product.revenue)}</td>
              </tr>
            ))}
            {!products.length && <EmptyRow colSpan={3} message="No paid product sales yet." />}
          </tbody>
        </table>
      </div>
    </TablePanel>
  );
}

export function TopCustomersTable({ customers }: { customers: Customer[] }) {
  return (
    <TablePanel title="Top customers" description="Highest lifetime spend on paid orders." icon={UsersRound}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {customers.map((customer, index) => (
              <tr key={customer.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{index + 1}. {customer.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{customer.email}</p>
                </td>
                <td className="px-5 py-3.5 tabular-nums">{customer.orderCount.toLocaleString("en-NP")}</td>
                <td className="px-5 py-3.5 whitespace-nowrap tabular-nums">{formatNpr(customer.spend)}</td>
              </tr>
            ))}
            {!customers.length && <EmptyRow colSpan={3} message="No paid customer purchases yet." />}
          </tbody>
        </table>
      </div>
    </TablePanel>
  );
}

export function LowStockTable({ items }: { items: StockItem[] }) {
  return (
    <TablePanel title="Low-stock alerts" description="Active products at or below their inventory threshold." icon={PackageSearch}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Available</th>
              <th className="px-5 py-3 font-medium">Threshold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {items.slice(0, 5).map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.sku}</p>
                </td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-rose-700 dark:text-rose-300">{item.available}</td>
                <td className="px-5 py-3.5 tabular-nums">{item.threshold}</td>
              </tr>
            ))}
            {!items.length && <EmptyRow colSpan={3} message="No low-stock products to report." />}
          </tbody>
        </table>
      </div>
    </TablePanel>
  );
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-muted-foreground">{message}</td>
    </tr>
  );
}
