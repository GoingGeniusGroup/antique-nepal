"use client";

import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/admin-utils";

/**
 * Products Management Page
 * 
 * Features:
 * - View all products with search, sort, and pagination
 * - Add new products with variants and pricing
 * - Edit product details and inventory
 * - Manage product status (active/inactive)
 */

export default function ProductsPage() {
  type Row = {
    id: string;
    name: string;
    sku: string;
    price: string;
    isActive: boolean;
    createdAt: string;
  };

  // CRUD Operations for Products
  const handleAddProduct = () => {
    alert("Add Product functionality - to be implemented with comprehensive product form");
  };

  const handleEditProduct = (product: Row) => {
    alert(`Edit Product: ${product.name} - to be implemented with product form modal`);
  };

  const handleDeleteProduct = (product: Row) => {
    if (confirm(`Are you sure you want to delete product: ${product.name}?`)) {
      alert("Delete Product functionality - to be implemented with API call");
    }
  };

  const columns: HeroColumn<Row>[] = [
    { key: "name", label: "Product Name", sortable: true, render: (r: Row) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{r.name}</span>
        <span className="text-xs text-gray-500 font-mono">{r.sku}</span>
      </div>
    ) },
    { key: "price", label: "Price", sortable: true, render: (r: Row) => (
      <span className="font-semibold text-green-700">{formatCurrency(r.price)}</span>
    ) },
    { key: "isActive", label: "Status", render: (r: Row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor('active', String(r.isActive))}`}>
        {r.isActive ? "Active" : "Inactive"}
      </span>
    ) },
    { key: "createdAt", label: "Created", sortable: true, render: (r: Row) => formatDate(r.createdAt) },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Products" />
      <HeroTable<Row>
        title="Product Management"
        fetchUrl="/api/admin/products"
        columns={columns}
        defaultSort="createdAt"
        defaultOrder="desc"
        pageSizeOptions={[10, 20, 50]}
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
      </div>
    </PageTransition>
  );
}
