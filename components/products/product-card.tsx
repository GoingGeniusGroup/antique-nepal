"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";
import { ProductData } from "@/app/(public)/products/actions/products";

interface ProductCardProps {
  product: ProductData;
  index?: number;
}

export function ProductCard({ product, image, index = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const handleCartClick = () => {
    toast.success("Item added to cart!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "group h-full flex flex-col rounded-lg md:rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300",
        isDark
          ? "border-white/10 bg-linear-to-br from-[#1f1f1f] to-[#2a2a2a]"
          : "border-[#e8e0d8] bg-white"
      )}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          <Image
            src={product.image || "/product_placeholder.jpeg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={cn(
              "absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 rounded-full transition-colors z-10",
              isDark
                ? "bg-white/90 hover:bg-white"
                : "bg-white/95 hover:bg-white shadow-md"
            )}
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              className={cn(
                "md:w-5 md:h-5 transition-colors",
                isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-black"
              )}
            />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white font-semibold">Out of Stock</p>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex-1 p-2 md:p-3 lg:p-4 flex flex-col gap-1.5 md:gap-2 lg:gap-3",
            isDark
              ? "bg-linear-to-br from-[#1f1f1f] to-[#2a2a2a] text-white"
              : "bg-white text-[#2d2520]"
          )}
        >
          <div className="flex gap-2">
            <span
              className={cn(
                "inline-block px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full",
                isDark
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500/20 text-emerald-700"
              )}
            >
              {product.badge}
            </span>
          </div>

          <div className="flex-1">
            <h3
              className={cn(
                "font-semibold text-[11px] md:text-xs lg:text-sm leading-tight line-clamp-2",
                isDark ? "text-white" : "text-[#2d2520]"
              )}
            >
              {product.name}
            </h3>
          </div>

          <div
            className={cn(
              "flex items-center justify-between pt-1.5 md:pt-2 border-t",
              isDark ? "border-white/20" : "border-white/20"
            )}
          >
            <span
              className={cn(
                "text-sm md:text-base lg:text-lg font-semibold font-cinzel",
                isDark ? "text-amber-300" : "text-primary"
              )}
            >
              ${product.price.toFixed(2)}
            </span>
            <button
              className={cn(
                "p-1.5 md:p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-white/10" : "hover:bg-[#e8e0d8]/50"
              )}
              aria-label="Add to cart"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCartClick();
              }}
              disabled={!product.inStock}
            >
              <ShoppingCart
                size={16}
                className={cn(
                  "md:w-5 md:h-5",
                  isDark ? "text-white" : "text-[#2d2520]"
                )}
              />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
