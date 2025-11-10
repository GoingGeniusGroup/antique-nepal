"use client";

import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

interface ProductReview {
  rating: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  reviews: ProductReview[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price?: number;
  color?: string;
  size?: string;
  images?: { url: string; altText?: string }[];
  inventory?: { quantity: number };
}

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (qty: number) => void;
  isWishlisted: boolean;
  wishlistLoading: boolean;
  handleWishlistToggle: () => void;
  isAdmin: boolean;
  onAddToCartClick: () => void;
  isAddingToCart: boolean;
  variants: ProductVariant[];
}

const calculateAverageRating = (reviews: ProductReview[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const ProductInfo = ({
  product,
  isWishlisted,
  wishlistLoading,
  handleWishlistToggle,
  isAdmin,
  onAddToCartClick,
  isAddingToCart,
  variants,
}: ProductInfoProps) => {
  const averageRating = calculateAverageRating(product.reviews);

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: "Check out this amazing product!",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share product.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
            <span className="font-medium text-orange-400">{averageRating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviews.length}{" "}
              {product.reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        <h1 className="font-serif text-4xl font-bold mb-4">{product.name}</h1>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl font-bold text-primary">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <Badge variant="default" className="px-3 py-1">
            In Stock
          </Badge>
        </div>

        {product.description && (
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {variants.length > 0 && (
        <div>
          <Separator />
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold tracking-tight">
              Available Variants ({variants.length})
            </h3>

            <details className="group">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition">
                Show all variants
              </summary>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="
              border rounded-xl p-4 
              hover:shadow-md transition-all duration-200 
              flex items-center justify-between bg-card
            "
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {v.name || `${v.color ?? ""} ${v.size ?? ""}`}
                      </p>

                      {(v.color || v.size) && (
                        <p className="text-sm text-muted-foreground">
                          {v.color && <span>Color: {v.color}</span>}
                          {v.color && v.size && <span> • </span>}
                          {v.size && <span>Size: {v.size}</span>}
                        </p>
                      )}
                    </div>

                    {v.color && (
                      <div
                        className="w-6 h-6 rounded-full border shadow-sm"
                        style={{ backgroundColor: v.color }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex gap-3">
          {!isAdmin && (
            <>
              <Button
                size="lg"
                onClick={onAddToCartClick}
                disabled={isAddingToCart}
                className="flex-1 text-white cursor-pointer bg-green-600 hover:bg-green-700 duration-100 gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer bg-transparent"
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <Spinner className="h-5 w-5" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                )}
              </Button>
            </>
          )}

          <Button
            className="cursor-pointer bg-transparent"
            size="lg"
            onClick={handleShare}
            variant="outline"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Truck className="h-6 w-6 mx-auto text-primary" />
              <p className="text-xs font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">
                On orders over ₹999
              </p>
            </div>
            <div className="space-y-2">
              <RotateCcw className="h-6 w-6 mx-auto text-primary" />
              <p className="text-xs font-medium">Easy Returns</p>
              <p className="text-xs text-muted-foreground">
                30-day return policy
              </p>
            </div>
            <div className="space-y-2">
              <Shield className="h-6 w-6 mx-auto text-primary" />
              <p className="text-xs font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                100% secure checkout
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
