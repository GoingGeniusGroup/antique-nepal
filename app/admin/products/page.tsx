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
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    sku: string;
    price: string;
    isActive: boolean;
    isFeatured: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
    createdAt: string;
    updatedAt: string;
    categories?: { id: string; name: string }[];
    images?: { id: string; url: string; altText?: string | null }[];
    variants?: { id: string; name: string }[];
    reviews?: { id: string; rating: number; comment: string }[];
    wishlistItems?: { id: string; userId: string }[];
  };

  // CRUD Operations for Products
  const handleAddProduct = () => {
    alert(
      "Add Product functionality - to be implemented with comprehensive product form"
    );
  };

  const handleEditProduct = (product: Row) => {
    alert(
      `Edit Product: ${product.name} - to be implemented with product form modal`
    );
  };

  const handleDeleteProduct = (product: Row) => {
    if (confirm(`Are you sure you want to delete product: ${product.name}?`)) {
      alert("Delete Product functionality - to be implemented with API call");
    }
  };

  const columns: HeroColumn<Row>[] = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (r: Row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{r.name}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {r.sku}
          </span>
          <span className="text-xs text-muted-foreground">{r.slug}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (r: Row) => r.description || "-",
    },
    {
      key: "shortDescription",
      label: "Short Description",
      render: (r: Row) => r.shortDescription || "-",
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (r: Row) => <span>{formatCurrency(r.price)}</span>,
    },
    {
      key: "isActive",
      label: "Status",
      render: (r: Row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            r.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (r: Row) => (r.isFeatured ? "Yes" : "No"),
    },
    {
      key: "metaTitle",
      label: "Meta Title",
      render: (r: Row) => r.metaTitle || "-",
    },
    {
      key: "metaDescription",
      label: "Meta Description",
      render: (r: Row) => r.metaDescription || "-",
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (r: Row) => formatDate(r.createdAt),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      sortable: true,
      render: (r: Row) => formatDate(r.updatedAt),
    },
    {
      key: "categories",
      label: "Categories",
      render: (r: Row) =>
        r.categories?.map((c: any) => c.name).join(", ") || "-",
    },
    {
      key: "images",
      label: "Images",
      render: (r: Row) =>
        r.images?.map((img: any) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.altText || "product"}
            className="w-12 h-12 object-cover inline-block mr-2"
          />
        )),
    },
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
