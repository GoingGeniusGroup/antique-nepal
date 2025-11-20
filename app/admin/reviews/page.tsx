"use client";

import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { formatDate } from "@/lib/admin-utils";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Review Management Page
 *
 * Features:
 * - View all product reviews with search, sort, and pagination
 * - Delete reviews
 * - Real-time refresh
 */

export default function ReviewsPage() {
  type Row = {
    id: string;
    user: {
      name: string | null;
      email: string;
    };
    product: {
      name: string;
    };
    rating: number;
    title: string | null;
    comment: string;
    createdAt: string;
  };

  const [tableKey, setTableKey] = useState(0);
  const [deleteReview, setDeleteReview] = useState<Row | null>(null);

  // DELETE Review
  const handleDeleteReview = async () => {
    if (!deleteReview) return;

    try {
      const res = await fetch(`/api/reviews/${deleteReview.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTableKey((prev) => prev + 1);
        toast.success("Review deleted successfully");
      } else {
        toast.error("Failed to delete review");
      }
      setDeleteReview(null);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting review");
      setDeleteReview(null);
    }
  };

  const columns: HeroColumn<Row>[] = [
    {
      key: "user",
      label: "User",
      sortable: false,
      render: (r: Row) => (
        <div className="flex flex-col">
          <span className="font-medium">{r.user.name || "—"}</span>
          <span className="text-xs text-muted-foreground">{r.user.email}</span>
        </div>
      ),
    },
    {
      key: "product",
      label: "Product",
      sortable: true,
      render: (r: Row) => r.product.name,
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (r: Row) => <span className="font-semibold">{r.rating} ⭐</span>,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (r: Row) => r.title || "—",
    },
    {
      key: "comment",
      label: "Comment",
      sortable: false,
      render: (r: Row) => (
        <span className="line-clamp-2 max-w-xs">{r.comment}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (r: Row) => formatDate(r.createdAt),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Reviews" />

        <HeroTable<Row>
          key={tableKey}
          title="Review Management"
          fetchUrl="/api/reviews"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          onDelete={setDeleteReview}
        />

        {/* Delete Dialog */}
        <ConfirmationDialog
          open={!!deleteReview}
          onOpenChange={() => setDeleteReview(null)}
          onConfirm={handleDeleteReview}
          title="Delete Review?"
          description="Are you sure you want to delete this review? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </PageTransition>
  );
}
