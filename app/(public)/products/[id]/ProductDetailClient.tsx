"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  ChevronLeft,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner"; // ShadCN Spinner

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary?: boolean;
}

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: { firstName?: string | null };
}

interface ProductCategory {
  category: { id: string; name: string };
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isFeatured?: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  reviews: ProductReview[];
}

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    images: { id: string; url: string; altText?: string | null }[];
  };
}

interface Wishlist {
  id: string;
  items: WishlistItem[];
}

const calculateAverageRating = (reviews: ProductReview[]) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

const ProductDetailClient = ({ product }: { product: Product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false); // Loading state for wishlist action

  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const averageRating = calculateAverageRating(product.reviews);
  const primaryCategory = product.categories[0]?.category?.name || "Product";
  const badge = product.isFeatured ? "Featured" : primaryCategory;

  // Fetch wishlist status on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
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
  }, [product.id, userId]);

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!userId) {
      toast.error("You must be signed in to manage your wishlist.");
      return;
    }

    setWishlistLoading(true); // Start spinner

    try {
      if (!isWishlisted) {
        // Add to wishlist
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId: product.id }),
        });
        toast.success("Added to wishlist!");
        setIsWishlisted(true);
      } else {
        // Remove from wishlist
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
          toast.success("Removed from wishlist!");
          setIsWishlisted(false);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist.");
    } finally {
      setWishlistLoading(false); // Stop spinner
    }
  };

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
    <div className="min-h-screen bg-background pt-16">
      {/* Product Section */}
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
            {/* Images */}
            <div className="space-y-4">
              <Card className="overflow-hidden border-2 relative">
                {badge && (
                  <span
                    className={cn(
                      "absolute top-4 left-4 z-20 inline-block px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full",
                      isDark
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500/20 text-emerald-700"
                    )}
                  >
                    {badge}
                  </span>
                )}
                <Image
                  src={
                    product.images[selectedImage]?.url
                      ? `${product.images[selectedImage].url}`
                      : "/product_placeholder.jpeg"
                  }
                  alt={product.images[selectedImage]?.altText || product.name}
                  width={500}
                  height={500}
                  className="w-full aspect-square object-cover transition-transform duration-500 cursor-pointer hover:scale-105"
                />
              </Card>

              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={`${image.url}` || "/product_placeholder.jpeg"}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full aspect-square object-cover transition-transform duration-500 cursor-pointer hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                    <span className="font-medium text-orange-400">
                      {averageRating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews.length}{" "}
                      {product.reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>

                <h1 className="font-serif text-4xl font-bold mb-4">
                  {product.name}
                </h1>

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

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-accent transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x border-border">
                      {quantity}
                    </span>
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
                  <Button
                    size="lg"
                    onClick={() => toast.success("Item added to cart!")}
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

                  <Button size="lg" onClick={handleShare} variant="outline">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
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
          </div>

          {/* Tabs Section */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 max-w-2xl`}>
                <TabsTrigger
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
                  value="description"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
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
                      Each product is crafted with attention to detail and
                      quality. By choosing this product, you&apos;re supporting
                      sustainable practices and artisans who are passionate
                      about their craft.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <Card>
                  <CardContent className="p-6">
                    {product.reviews.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No reviews yet. Be the first to write a review!
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
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
                                  {review.user?.firstName || "Anonymous"}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailClient;
