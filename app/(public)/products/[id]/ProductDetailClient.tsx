"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/contexts/theme-context";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";
import type { Product } from "@/lib/product";

interface Wishlist {
  id: string;
  items: { id: string; product: { id: string } }[];
}

const ProductDetailClient = ({
  product: initialProduct,
}: {
  product: Product;
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [product, setProduct] = useState(initialProduct);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "ADMIN";

  // Fetch wishlist status
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId || isAdmin) return;
      try {
        const res = await fetch(`/api/wishlist?userId=${userId}`);
        const data: Wishlist = await res.json();
        if (data?.items?.some((item) => item.product.id === product.id)) {
          setIsWishlisted(true);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };
    fetchWishlist();
  }, [product.id, userId, isAdmin]);

  // Wishlist toggle
  const handleWishlistToggle = async () => {
    if (!userId) {
      toast.error("You must be signed in to manage your wishlist.");
      return;
    }
    if (isAdmin) {
      toast.error("Admin users cannot use wishlist.");
      return;
    }

    setWishlistLoading(true);
    try {
      if (!isWishlisted) {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId: product.id }),
        });
        const currentCount = parseInt(
          localStorage.getItem("wishlistCount") || "0"
        );
        localStorage.setItem("wishlistCount", (currentCount + 1).toString());
        localStorage.removeItem("wishlistVisited");
        window.dispatchEvent(new Event("storage"));
        toast.success("Added to wishlist!");
        setIsWishlisted(true);
      } else {
        const wishlistRes = await fetch(`/api/wishlist?userId=${userId}`);
        const wishlistData: Wishlist = await wishlistRes.json();
        const item = wishlistData.items.find(
          (i) => i.product.id === product.id
        );
        if (item) {
          await fetch("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wishlistItemId: item.id }),
          });
          const currentCount = parseInt(
            localStorage.getItem("wishlistCount") || "0"
          );
          localStorage.setItem(
            "wishlistCount",
            Math.max(0, currentCount - 1).toString()
          );
          localStorage.removeItem("wishlistVisited");
          window.dispatchEvent(new Event("storage"));
          toast.success("Removed from wishlist!");
          setIsWishlisted(false);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: reviewToDelete }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to delete review.");
        return;
      }
      setProduct((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r.id !== reviewToDelete),
      }));
      toast.success("Review deleted successfully!");
      setReviewToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              badge={
                product.isFeatured
                  ? "Featured"
                  : product.categories[0]?.category?.name || "Product"
              }
              isDark={isDark}
            />

            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              isWishlisted={isWishlisted}
              wishlistLoading={wishlistLoading}
              handleWishlistToggle={handleWishlistToggle}
              isAdmin={isAdmin}
            />
          </div>

          <ProductTabs
            product={product}
            setProduct={setProduct}
            userId={userId}
            session={session}
            setReviewToDelete={setReviewToDelete}
            setShowDeleteDialog={setShowDeleteDialog}
          />
        </div>
      </section>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteReview}
        title="Delete Review?"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default ProductDetailClient;
