"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Pagination } from "@/components/products/pagination";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";

// Example images
import bag1 from "@/public/hemp-bag-1.jpg";
import bag2 from "@/public/hemp-bag-2.jpg";
import bag3 from "@/public/hemp-bag-3.jpg";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: any;
  inStock: boolean;
  isWishlisted?: boolean;
}

const ITEMS_PER_PAGE = 4;

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Himalayan Hemp Tote Bag",
      price: 89.99,
      image: bag1,
      inStock: true,
      isWishlisted: true,
    },
    {
      id: 2,
      name: "Traditional Woven Backpack",
      price: 129.99,
      image: bag2,
      inStock: true,
      isWishlisted: true,
    },
    {
      id: 3,
      name: "Artisan Shoulder Bag",
      price: 99.99,
      image: bag3,
      inStock: false,
      isWishlisted: true,
    },
    {
      id: 4,
      name: "Mountain Sling Bag",
      price: 59.99,
      image: bag1,
      inStock: true,
      isWishlisted: true,
    },
    {
      id: 5,
      name: "Eco-Friendly Satchel",
      price: 79.99,
      image: bag2,
      inStock: true,
      isWishlisted: true,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleWishlist = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item
      )
    );
  };

  const removeItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    if (
      (currentPage - 1) * ITEMS_PER_PAGE >= updatedItems.length &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
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
                {paginatedItems.map((item, index) => (
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
                      onClick={() => toggleWishlist(item.id)}
                      className={cn(
                        "absolute top-3 right-3 p-2 rounded-full transition-colors z-10",
                        isDark
                          ? "bg-white/90 hover:bg-white"
                          : "bg-white/95 hover:bg-white shadow-md"
                      )}
                    >
                      <Heart
                        size={18}
                        className={cn(
                          "transition-colors",
                          item.isWishlisted
                            ? "fill-red-500 stroke-red-500"
                            : "stroke-black"
                        )}
                      />
                    </button>

                    {/* Product Image */}
                    <div className="relative aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3
                        className={cn(
                          "font-semibold mb-2 line-clamp-1",
                          isDark ? "text-white" : "text-[#2d2520]"
                        )}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={cn(
                          "text-xl font-bold mb-4",
                          isDark ? "text-amber-300" : "text-primary"
                        )}
                      >
                        ${item.price}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                          disabled={!item.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-red-500 cursor-pointer"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
