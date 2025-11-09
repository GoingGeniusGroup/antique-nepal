import { useState } from "react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Session } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/products/pagination";
import toast from "react-hot-toast";
import type { Product } from "@/lib/product";

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  title?: string | null;
  createdAt: Date;
  userId: string;
  user?: { name?: string | null };
}

interface ProductTabsProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  userId?: string;
  session: Session | null;
  setReviewToDelete: (id: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

export const ProductTabs = ({
  product,
  setProduct,
  userId,
  session,
  setReviewToDelete,
  setShowDeleteDialog,
}: ProductTabsProps) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  const pageSize = 5;
  const totalReviewPages = Math.ceil(product.reviews.length / pageSize);
  const paginatedReviews = product.reviews.slice(
    (currentReviewPage - 1) * pageSize,
    currentReviewPage * pageSize
  );

  const handleSubmitReview = async () => {
    if (!userId) {
      toast.error("You must be signed in to leave a review.");
      return;
    }
    if (!formData.comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setReviewLoading(true);
    try {
      const method = editingReviewId ? "PUT" : "POST";
      const body = editingReviewId
        ? { reviewId: editingReviewId, ...formData }
        : { productId: product.id, ...formData };

      const res = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to submit review.");
        return;
      }

      const updatedReview = await res.json();

      if (editingReviewId) {
        setProduct((prev) => ({
          ...prev,
          reviews: prev.reviews.map((r) =>
            r.id === editingReviewId ? { ...r, ...updatedReview } : r
          ),
        }));
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
      } else {
        setProduct((prev) => ({
          ...prev,
          reviews: [...prev.reviews, updatedReview],
        }));
        toast.success("Review added successfully!");
      }

      setFormData({ rating: 5, title: "", comment: "" });
      setShowReviewModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = (review: ProductReview) => {
    setFormData({
      rating: review.rating,
      title: review.title || "",
      comment: review.comment,
    });
    setEditingReviewId(review.id);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setEditingReviewId(null);
    setFormData({ rating: 5, title: "", comment: "" });
  };

  return (
    <div className="mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-2xl">
          <TabsTrigger
            className="data-[state=active]:bg-white cursor-pointer dark:data-[state=active]:bg-gray-600"
            value="description"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-white cursor-pointer dark:data-[state=active]:bg-gray-600"
            value="reviews"
          >
            Reviews ({product.reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-8">
          <Card>
            <CardContent className="p-6 prose prose-sm max-w-none">
              <h3 className="font-serif text-2xl font-semibold mb-4">
                About This Product
              </h3>
              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {product.description}
                </p>
              )}
              <p className="text-muted-foreground leading-relaxed">
                Each product is crafted with attention to detail and quality. By
                choosing this product, you&apos;re supporting sustainable
                practices and artisans who are passionate about their craft.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex mb-6">
                {userId ? (
                  <div className="flex w-full justify-between items-center">
                    <h1 className="text-2xl font-semibold">Reviews:</h1>
                    <Button
                      onClick={() => setShowReviewModal(true)}
                      size="sm"
                      variant="default"
                      className="gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                      {editingReviewId ? "Edit Review" : "Write a Review"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-full justify-between items-center">
                    <h1 className="text-2xl font-semibold">Reviews:</h1>
                    <Button
                      onClick={() =>
                        toast.error("Please login to leave a review")
                      }
                      size="sm"
                      variant="default"
                      className="gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>

              <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingReviewId ? "Edit Your Review" : "Write a Review"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, rating: star }))
                            }
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= formData.rating
                                  ? "fill-orange-400 text-orange-400"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g., Great quality!"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Comment
                      </label>
                      <textarea
                        value={formData.comment}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>

                  <DialogFooter className="flex gap-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      {reviewLoading ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Submitting...
                        </>
                      ) : editingReviewId ? (
                        "Update Review"
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                    <Button
                      className="cursor-pointer"
                      onClick={closeReviewModal}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {paginatedReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to write a review!
                </p>
              ) : (
                <div className="space-y-6">
                  {paginatedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-orange-400 text-orange-400"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">
                            {review.user?.name ||
                              session?.user?.name ||
                              "Anonymous"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {userId === review.userId && (
                            <>
                              <button
                                onClick={() => handleEditReview(review)}
                                className="p-1 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                                title="Edit review"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setReviewToDelete(review.id);
                                  setShowDeleteDialog(true);
                                }}
                                className="p-1 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                                title="Delete review"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="font-semibold mb-1">{review.title}</h4>
                      )}
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}

                  <Pagination
                    currentPage={currentReviewPage}
                    totalPages={totalReviewPages}
                    onPageChange={setCurrentReviewPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
