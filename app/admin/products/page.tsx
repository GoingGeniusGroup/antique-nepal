"use client";

import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { ProductForm } from "@/components/admin/product/product-form";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/admin-utils";
import { useState } from "react";

export default function ProductsPage() {
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
    categories?: { id: string; name: string }[];
    images?: { id: string; url: string; altText?: string | null }[];
  };

  const [openForm, setOpenForm] = useState(false);
  // CRUD Operations for Products
  const handleAddProduct = () => {
    setOpenForm(true);
  };

  const handleEditProduct = (product: Row) => {
    // setSelectedProduct(product);
    // setOpenForm(true);
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
        </div>
      ),
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
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (r: Row) => formatDate(r.createdAt),
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

        <AnimatePresence>
          {openForm && (
            <Dialog open={openForm} onOpenChange={setOpenForm}>
              <DialogTitle className="text-xl font-semibold p-6 border-b">
                  Add or Edit Product
              </DialogTitle>
              <DialogContent className="p-0">
                <motion.div
                  className="w-full max-w-[1200px] mx-auto rounded-lg p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductForm onSave={() => setOpenForm(false)} />

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setOpenForm(false)}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
