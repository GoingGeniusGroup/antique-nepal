"use client";

import { useState } from "react";
import Image from "next/image";
import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { formatDate } from "@/lib/admin-utils";
import { CategoryForm } from "@/components/admin/category/category-form";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Badge } from "@/components/ui/badge";

type Row = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    products: number;
  };
};

export default function CategoryPage() {
  const [editingCategory, setEditingCategory] = useState<Row | null>(null);
  const [tableKey, setTableKey] = useState(0); // reload table
  const [deleteCategory, setDeleteCategory] = useState<Row | null>(null);

  const handleAddCategory = () => setEditingCategory({} as Row);
  const handleEditCategory = (category: Row) => setEditingCategory(category);
  const handleCancel = () => setEditingCategory(null);

  const handleSave = () => {
    setEditingCategory(null);
    setTableKey((prev) => prev + 1);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${deleteCategory.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Category deleted successfully");
        setTableKey((prev) => prev + 1);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete category");
      }
      setDeleteCategory(null);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting category");
      setDeleteCategory(null);
    }
  };

  const columns: HeroColumn<Row>[] = [
    {
        key: "image",
        label: "Image",
        render: (r) => (
            <div className="w-16 h-16 relative">
            <Image
                src={r.image || "/product_placeholder.jpeg"}
                alt={r.name}
                fill
                className="object-cover rounded-md"
            />
            </div>
        ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (r) => <span className="font-mono text-sm">{r.slug}</span>,
    },
    {
      key: "description",
      label: "Description",
      render: (r) => r.description || "—",
    },
    {
      key: "_count.products",
      label: "Products",
      sortable: true,
      render: (r) => <Badge variant="outline">{r._count.products}</Badge>,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (r) => formatDate(r.createdAt),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Categories" />

        {editingCategory && (
          <div className="p-6 rounded-md shadow-md">
            <CategoryForm
              category={editingCategory.id ? editingCategory : undefined}
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
          title="Category Management"
          fetchUrl="/api/admin/categories"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={(category) => setDeleteCategory(category)}
        />

        <ConfirmationDialog
          open={!!deleteCategory}
          onOpenChange={() => setDeleteCategory(null)}
          onConfirm={confirmDeleteCategory}
          title="Delete Category?"
          description="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </PageTransition>
  );
}
