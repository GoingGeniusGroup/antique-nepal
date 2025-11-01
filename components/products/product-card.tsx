"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    inStock: boolean;
    badge: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const handleCartClick = () => {
    toast.success("Item added to cart!");
  };

  return (
    <div className="group h-full flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            size={20}
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-foreground"
            )}
          />
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <p className="text-white font-semibold">Out of Stock</p>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 bg-gray-950 text-white flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="inline-block px-3 py-1 bg-green-600 text-xs font-medium rounded-full">
            {product.badge}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm md:text-base leading-tight">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <span className="text-lg md:text-xl font-semibold text-yellow-400">
            ${product.price.toFixed(2)}
          </span>
          <button
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Add to cart"
            onClick={() => handleCartClick()}
            disabled={!product.inStock}
          >
            <ShoppingCart size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
