"use client";

import { useState } from "react";
import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { formatCurrency, formatDate } from "@/lib/admin-utils";
import { ProductWithImagesForm } from "@/components/admin/product/product-image-variant-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

type Row = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  sku: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  categoryId?: string | null;
  categories?: { id: string; name: string }[];
  images?: {
    id: string;
    url: string;
    altText?: string | null;
    displayOrder: number;
    isPrimary: boolean;
  }[];
};

export default function ProductsPage() {
  const [editingProduct, setEditingProduct] = useState<Row | null>(null);
  const [tableKey, setTableKey] = useState(0); // reload table
  const [deleteProduct, setDeleteProduct] = useState<Row | null>(null);

  const handleAddProduct = () => setEditingProduct({} as Row);
  const handleEditProduct = (product: Row) => setEditingProduct(product);
  const handleCancel = () => setEditingProduct(null);

  const handleSave = () => {
    setEditingProduct(null);
    setTableKey((prev) => prev + 1);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteProduct) return;

    try {
      const res = await fetch(`/api/admin/products/${deleteProduct.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted successfully");
        setTableKey((prev) => prev + 1);
      } else {
        toast.error("Failed to delete product");
      }
      setDeleteProduct(null);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting product");
      setDeleteProduct(null);
    }
  };

  const columns: HeroColumn<Row>[] = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{r.name}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {r.sku}
          </span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (r) => <span>{formatCurrency(r.price)}</span>,
    },
    {
      key: "isActive",
      label: "Status",
      render: (r) => (
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
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: "categories",
      label: "Categories",
      render: (r: Row) => r.categories?.map((c) => c.name).join(", ") || "-",
    },
    {
      key: "images",
      label: "Images",
      render: (r) => (
        <div className="flex items-center space-x-2">
          {r.images?.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={img.altText || "product"}
              className="w-12 h-12 object-cover"
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Products" />

        {/* Form */}
        {editingProduct && (
          <div className="p-6 rounded-md shadow-md">
            <ProductWithImagesForm
              product={
                editingProduct
                  ? {
                      ...editingProduct,
                      categoryId:
                        editingProduct.categories?.[0]?.id ?? undefined,
                    }
                  : undefined
              }
              images={editingProduct.images || []}
              onSave={handleSave}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <HeroTable<Row>
          key={tableKey}
          title="Product Management"
          fetchUrl="/api/admin/products"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          onAdd={handleAddProduct}
          onEdit={handleEditProduct}
          onDelete={(product) => setDeleteProduct(product)}
        />

        <ConfirmationDialog
          open={!!deleteProduct}
          onOpenChange={() => setDeleteProduct(null)}
          onConfirm={confirmDeleteProduct}
          title="Delete Product?"
          description="Are you sure you want to delete this image? This action cannot
                be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </PageTransition>
  );
}
