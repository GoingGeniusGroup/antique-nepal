"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Pagination } from "@/components/products/pagination";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";

interface WishlistProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    images: WishlistProductImage[];
  };
}

const ITEMS_PER_PAGE = 4;

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const userId = "cmhlfpblq0002ijmcd33f866n"; // get from session/auth

  // Fetch wishlist from API
  useEffect(() => {
    fetch(`/api/wishlist?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.items) {
          setItems(data.items);
        }
      })
      .catch((err) => console.error("Failed to fetch wishlist:", err));
  }, [userId]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Remove item from wishlist
  const removeItem = async (id: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlistItemId: id }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);

      // Adjust current page if needed
      if (
        (currentPage - 1) * ITEMS_PER_PAGE >= updatedItems.length &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }

      toast.success("Item removed from wishlist!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item from wishlist.");
    }
  };

  // Toggle wishlist (remove only, since it's already in wishlist)
  const toggleWishlist = async (item: WishlistItem) => {
    if (!item) return;
    await removeItem(item.id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved for
              later
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Start adding items you love to your wishlist
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedItems.map((item, index) => {
                  const product = item.product;
                  const primaryImage =
                    product.images.find((img) => img.isPrimary) ||
                    product.images[0];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        "border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative group",
                        isDark
                          ? "border-white/10 bg-linear-to-br from-[#1f1f1f] to-[#2a2a2a]"
                          : "border-[#e8e0d8] bg-white"
                      )}
                    >
                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={() => toggleWishlist(item)}
                        className={cn(
                          "absolute top-3 right-3 p-2 rounded-full transition-colors z-10",
                          isDark
                            ? "bg-white/90 hover:bg-white"
                            : "bg-white/95 hover:bg-white shadow-md"
                        )}
                      >
                        <Heart
                          size={18}
                          className="fill-red-500 stroke-red-500"
                        />
                      </button>

                      {/* Product Image */}
                      <div className="relative aspect-square">
                        <Image
                          src={`/${primaryImage?.url}`}
                          alt={primaryImage?.altText || product.name}
                          className="object-cover"
                          fill
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3
                          className={cn(
                            "font-semibold mb-2 line-clamp-1",
                            isDark ? "text-white" : "text-[#2d2520]"
                          )}
                        >
                          {product.name}
                        </h3>
                        <p
                          className={cn(
                            "text-xl font-bold mb-4",
                            isDark ? "text-amber-300" : "text-primary"
                          )}
                        >
                          ${Number(product.price).toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
