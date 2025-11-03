"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

// Example: if using local images, import them
import bag1 from "@/public/hemp-bag-1.jpg";
import bag2 from "@/public/hemp-bag-2.jpg";
import bag3 from "@/public/hemp-bag-3.jpg";

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Himalayan Hemp Tote Bag",
      price: 89.99,
      image: bag1,
      inStock: true,
    },
    {
      id: 2,
      name: "Traditional Woven Backpack",
      price: 129.99,
      image: bag2,
      inStock: true,
    },
    {
      id: 3,
      name: "Artisan Shoulder Bag",
      price: 99.99,
      image: bag3,
      inStock: false,
    },
  ]);

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
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
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <p className="text-xl font-bold mb-4">${item.price}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={!item.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
