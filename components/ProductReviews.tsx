"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Product, ProductReview } from "@/lib/product";

interface ProductReviewsProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  userId?: string;
  setReviewToDelete: (id: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

interface ReviewApiResponse extends Omit<ProductReview, "createdAt"> {
  createdAt: string;
}

function ReviewStars({
  rating,
  interactive = false,
  onSelect,
}: {
  rating: number;
  interactive?: boolean;
  onSelect?: (rating: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "group" : "img"}
      aria-label={interactive ? "Choose a rating" : `${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            aria-pressed={star === rating}
            onClick={() => onSelect?.(star)}
            className="rounded-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AD8259]"
          >
            <Star
              aria-hidden="true"
              className={`h-7 w-7 ${
                star <= rating
                  ? "fill-[#AD8259] text-[#AD8259]"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        ) : (
          <Star
            key={star}
            aria-hidden="true"
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-[#AD8259] text-[#AD8259]"
                : "text-muted-foreground/30"
            }`}
          />
        )
      )}
    </div>
  );
}

export function ProductReviews({
  product,
  setProduct,
  userId,
  setReviewToDelete,
  setShowDeleteDialog,
}: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const approvedReviews = product.reviews.filter(
    (review) => review.status === "APPROVED"
  );
  const visibleReviews = product.reviews
    .filter(
      (review) =>
        review.status === "APPROVED" ||
        (review.userId === userId && review.status === "PENDING")
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const ownReview = userId
    ? approvedReviews.find((review) => review.userId === userId)
    : undefined;
  const pendingReview = userId
    ? product.reviews.find(
        (review) => review.userId === userId && review.status === "PENDING"
      )
    : undefined;
  const averageRating = approvedReviews.length
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
      approvedReviews.length
    : 0;

  const beginEditing = () => {
    if (!ownReview) return;
    setRating(ownReview.rating);
    setTitle(ownReview.title || "");
    setComment(ownReview.comment);
    setIsEditing(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setErrorMessage("Please sign in to submit a review.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: isEditing && ownReview ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing && ownReview
            ? { reviewId: ownReview.id, rating, title, comment }
            : { productId: product.id, rating, title, comment }
        ),
      });

      const payload: ReviewApiResponse | { error?: string } =
        await response.json();
      if (!response.ok) {
        setErrorMessage(
          "error" in payload && payload.error
            ? payload.error
            : "We couldn't submit your review. Please try again."
        );
        return;
      }

      if (!("id" in payload)) {
        throw new Error("The review response was incomplete.");
      }

      const savedReview: ProductReview = {
        ...payload,
        createdAt: new Date(payload.createdAt),
      };
      setProduct((current) => ({
        ...current,
        reviews: isEditing
          ? current.reviews.map((review) =>
              review.id === savedReview.id ? savedReview : review
            )
          : [savedReview, ...current.reviews],
      }));

      setIsEditing(false);
      setRating(5);
      setTitle("");
      setComment("");
      setSuccessMessage(
        isEditing
          ? "Your review has been updated."
          : "Thank you! Your review is submitted and awaiting approval."
      );
    } catch (error) {
      console.error("Failed to submit product review:", error);
      setErrorMessage("We couldn't submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setRating(5);
    setTitle("");
    setComment("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <section
      aria-labelledby="product-reviews-heading"
      className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 border-b border-border pb-7 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium uppercase tracking-[0.18em] text-[#AD8259]">
            Customer feedback
          </p>
          <h2
            id="product-reviews-heading"
            className="font-cinzel text-2xl font-semibold sm:text-3xl"
          >
            Reviews
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-cinzel text-4xl font-semibold">
            {averageRating ? averageRating.toFixed(1) : "—"}
          </span>
          <div>
            <ReviewStars rating={Math.round(averageRating)} />
            <p className="mt-1 text-sm text-muted-foreground">
              {approvedReviews.length}{" "}
              {approvedReviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <p role="status" className="mt-5 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <div className="grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="space-y-6">
          {visibleReviews.length === 0 ? (
            <p className="py-5 text-muted-foreground">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            visibleReviews.map((review) => {
              const isPending = review.status === "PENDING";
              return (
                <article
                  key={review.id}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <ReviewStars rating={review.rating} />
                      <p className="mt-2 text-sm font-medium">
                        {review.user?.name || "Customer"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isPending && (
                        <span className="rounded-full bg-[#AD8259]/10 px-3 py-1 text-xs font-medium text-[#8F6948]">
                          Awaiting approval
                        </span>
                      )}
                      {userId === review.userId && !isPending && (
                        <>
                          <button
                            type="button"
                            onClick={beginEditing}
                            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            aria-label="Delete your review"
                            onClick={() => {
                              setReviewToDelete(review.id);
                              setShowDeleteDialog(true);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <time
                        dateTime={new Date(review.createdAt).toISOString()}
                        className="text-sm text-muted-foreground"
                      >
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        }).format(new Date(review.createdAt))}
                      </time>
                    </div>
                  </div>
                  {review.title && (
                    <h3 className="mt-3 font-semibold">{review.title}</h3>
                  )}
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {review.comment}
                  </p>
                </article>
              );
            })
          )}
        </div>

        <div className="rounded-lg bg-muted/40 p-5 sm:p-6">
          {!userId ? (
            <div>
              <h3 className="font-cinzel text-xl font-semibold">
                Share your experience
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sign in to write a review for this product.
              </p>
              <Button asChild className="mt-5 bg-[#AD8259] text-white hover:bg-[#8F6948]">
                <Link href="/login">
                  Sign in to review
                </Link>
              </Button>
            </div>
          ) : pendingReview && !isEditing ? (
            <div role="status">
              <h3 className="font-cinzel text-xl font-semibold">
                Review submitted
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your review is awaiting approval before it appears publicly.
              </p>
            </div>
          ) : ownReview && !isEditing ? (
            <div>
              <h3 className="font-cinzel text-xl font-semibold">
                Thank you for your review
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You have already reviewed this product.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={beginEditing}
                className="mt-5 border-[#AD8259] text-[#8F6948] hover:bg-[#AD8259]/10"
              >
                Edit your review
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-cinzel text-xl font-semibold">
                  {isEditing ? "Edit your review" : "Write a review"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your feedback helps others choose with confidence.
                </p>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium">Rating</span>
                <ReviewStars
                  rating={rating}
                  interactive
                  onSelect={setRating}
                />
              </div>

              <div>
                <label
                  htmlFor="review-title"
                  className="mb-2 block text-sm font-medium"
                >
                  Title
                </label>
                <Input
                  id="review-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What stood out to you?"
                  maxLength={120}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-medium"
                >
                  Your review
                </label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Share your thoughts about the product..."
                  rows={5}
                  maxLength={3000}
                  required
                />
              </div>

              {errorMessage && (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#AD8259] text-white hover:bg-[#8F6948]"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEditing
                      ? "Save changes"
                      : "Submit review"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
