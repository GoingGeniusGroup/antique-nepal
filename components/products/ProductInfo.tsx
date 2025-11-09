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

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (qty: number) => void;
  isWishlisted: boolean;
  wishlistLoading: boolean;
  handleWishlistToggle: () => void;
  isAdmin: boolean;
}

const calculateAverageRating = (reviews: ProductReview[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  isWishlisted,
  wishlistLoading,
  handleWishlistToggle,
  isAdmin,
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

  const handleAddToCart = () => {
    const currentCount = parseInt(localStorage.getItem("cartCount") || "0");
    localStorage.setItem("cartCount", (currentCount + 1).toString());
    localStorage.removeItem("cartVisited");
    window.dispatchEvent(new Event("storage"));
    toast.success("Item added to cart!");
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
        </div>

        {product.description && (
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-accent transition-colors"
            >
              -
            </button>
            <span className="px-6 py-2 border-x border-border">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 hover:bg-accent transition-colors"
            >
              +
            </button>
          </div>
          <Badge variant="default" className="px-3 py-1">
            In Stock
          </Badge>
        </div>

        <div className="flex gap-3">
          {!isAdmin && (
            <>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 text-white bg-green-600 hover:bg-green-700 duration-100 gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlistToggle}
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

          <Button size="lg" onClick={handleShare} variant="outline">
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
