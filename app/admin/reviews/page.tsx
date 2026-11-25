"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, LoaderCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { HeroTable, type HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/admin-utils";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

type ReviewRow = {
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
  status: ReviewStatus;
  createdAt: string;
};

async function getErrorMessage(response: Response, fallback: string) {
  const body: unknown = await response.json();
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }
  return fallback;
}

export default function ReviewsPage() {
  const [tableKey, setTableKey] = useState(0);
  const [deleteReview, setDeleteReview] = useState<ReviewRow | null>(null);
  const [viewReview, setViewReview] = useState<ReviewRow | null>(null);
  const [busyReviewId, setBusyReviewId] = useState<string | null>(null);

  const handleStatusChange = async (
    review: ReviewRow,
    status: "APPROVED" | "PENDING"
  ) => {
    setBusyReviewId(review.id);
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        toast.error(await getErrorMessage(response, "Failed to update review."));
        return;
      }

      setTableKey((current) => current + 1);
      toast.success(
        status === "APPROVED" ? "Review approved." : "Review hidden."
      );
    } catch (error) {
      console.error("Failed to update review status:", error);
      toast.error("An error occurred while updating the review.");
    } finally {
      setBusyReviewId(null);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteReview) return;

    setBusyReviewId(deleteReview.id);
    try {
      const response = await fetch(`/api/admin/reviews/${deleteReview.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error(await getErrorMessage(response, "Failed to delete review."));
        return;
      }

      setTableKey((current) => current + 1);
      toast.success("Review deleted.");
      setDeleteReview(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("An error occurred while deleting the review.");
    } finally {
      setBusyReviewId(null);
    }
  };

  const columns: HeroColumn<ReviewRow>[] = [
    {
      key: "user",
      label: "User",
      sortable: false,
      render: (review) => (
        <div className="flex flex-col">
          <span className="font-medium">{review.user.name || "—"}</span>
          <span className="text-xs text-muted-foreground">
            {review.user.email}
          </span>
        </div>
      ),
    },
    {
      key: "product",
      label: "Product",
      sortable: true,
      render: (review) => review.product.name,
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (review) => (
        <span className="font-semibold">{review.rating} / 5</span>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: false,
      render: (review) => review.title || "—",
    },
    {
      key: "comment",
      label: "Comment",
      sortable: false,
      render: (review) => (
        <span className="line-clamp-2 max-w-xs">{review.comment}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (review) => {
        const statusClasses: Record<ReviewStatus, string> = {
          APPROVED:
            "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300",
          PENDING:
            "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
          REJECTED:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
        };
        const label =
          review.status.charAt(0) + review.status.slice(1).toLowerCase();

        return (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[review.status]}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (review) => formatDate(review.createdAt),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Reviews" />

        <HeroTable<ReviewRow>
          key={tableKey}
          title="Review Management"
          fetchUrl="/api/reviews"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          renderActions={(review) => {
            const isBusy = busyReviewId === review.id;
            const nextStatus =
              review.status === "APPROVED" ? "PENDING" : "APPROVED";

            return (
              <div className="flex min-w-32 items-center justify-center gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  title="View full comment"
                  aria-label="View full comment"
                  onClick={() => setViewReview(review)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={isBusy}
                  title={nextStatus === "APPROVED" ? "Approve" : "Hide"}
                  aria-label={nextStatus === "APPROVED" ? "Approve" : "Hide"}
                  onClick={() => void handleStatusChange(review, nextStatus)}
                >
                  {isBusy ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : nextStatus === "APPROVED" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-amber-700" />
                  )}
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={isBusy}
                  title="Delete review"
                  aria-label="Delete review"
                  onClick={() => setDeleteReview(review)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            );
          }}
        />

        <Dialog
          open={!!viewReview}
          onOpenChange={(open) => {
            if (!open) setViewReview(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{viewReview?.title || "Review comment"}</DialogTitle>
              <DialogDescription>
                {viewReview?.product.name} ·{" "}
                {viewReview?.user.name || viewReview?.user.email} ·{" "}
                {viewReview ? formatDate(viewReview.createdAt) : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-4 text-sm leading-6">
              {viewReview?.comment}
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          open={!!deleteReview}
          onOpenChange={(open) => {
            if (!open && busyReviewId !== deleteReview?.id) {
              setDeleteReview(null);
            }
          }}
          onConfirm={handleDeleteReview}
          title="Delete Review?"
          description="Are you sure you want to permanently delete this review? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </div>
    </PageTransition>
  );
}
