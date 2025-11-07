"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import type { ProductData } from "@/app/(public)/products/actions/products";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface ProductGridProps {
  products: ProductData[];
  productVariants?: Record<
    string,
    Array<{
      id: string;
      name: string;
      sku: string;
      price?: number;
      color?: string;
      size?: string;
    }>
  >;
}

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name?: string;
    price?: number;
    imageUrl?: string;
  };
}

export function ProductGrid({
  products,
  productVariants = {},
}: ProductGridProps) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch wishlist initially
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/wishlist?userId=${userId}`);
        const data: { items?: WishlistItem[] } = await res.json();
        const productIds = data?.items?.map((item) => item.product.id) || [];
        setWishlistItems(productIds);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      } finally {
        setWishlistLoaded(true);
      }
    };

    fetchWishlist();
  }, [userId]);

  // Toggle wishlist add/remove
  const toggleWishlist = async (productId: string) => {
    if (!userId) {
      toast.error("You must be signed in to manage wishlist.");
      return;
    }

    const isInWishlist = wishlistItems.includes(productId);
    try {
      if (!isInWishlist) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
        
        if (!res.ok) {
          const error = await res.json();
          toast.error(error.error || "Failed to add to wishlist");
          return;
        }
        
        setWishlistItems((prev) => [...prev, productId]);
        toast.success("Added to wishlist!");
      } else {
        const res = await fetch(`/api/wishlist?userId=${userId}`);
        
        if (!res.ok) {
          toast.error("Failed to fetch wishlist");
          return;
        }
        
        const data: { items?: WishlistItem[] } = await res.json();
        const item = data?.items?.find((i) => i.product.id === productId);

        if (!item) {
          toast.error("Item not found in wishlist.");
          return;
        }

        const deleteRes = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wishlistItemId: item.id }),
        });
        
        if (!deleteRes.ok) {
          toast.error("Failed to remove from wishlist");
          return;
        }
        
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
      throw err;
    }
  };

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          isWishlisted={wishlistItems.includes(product.id)}
          toggleWishlist={toggleWishlist}
          wishlistLoaded={wishlistLoaded}
          productVariants={productVariants[product.id] || []}
        />
      ))}
    </div>
  );
}
