"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";

const ProductNotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <Search className="w-20 h-20" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#2d2520] dark:text-white mb-4">
        <span className="text-destructive">Oops!</span> Product Not Found
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 text-center">
        We couldn’t find the product you were looking for. It might have been
        removed or the link is broken.
      </p>

      {/* Suggestions */}
      <div className="mb-6 text-gray-600 dark:text-gray-400 text-center">
        <ul className="list-disc list-inside space-y-2">
          <li>Try browsing our categories.</li>
          <li>Return to the homepage to explore more products.</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
        >
          <ShoppingCart className="w-5 h-5" />
          Browse Products
        </Link>

        <Link
          href="/"
          className="px-6 py-3 border hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-semibold transition"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
};

export default ProductNotFound;
