"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { useHomepageSettings } from "@/contexts/settings-context";
import { ProductCard } from "@/components/product-card";
import { NavigationLink } from "@/components/navigation-link";
import {
  containerVariants,
  itemVariants,
  viewportConfig,
  viewportConfigHeader,
} from "./landing-utils";

// Custom variants with different timing
const containerVariantsCustom = {
  ...containerVariants,
  visible: {
    ...containerVariants.visible,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariantsCustom = {
  ...itemVariants,
  hidden: { ...itemVariants.hidden, y: 40 },
};

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  description: string;
  category: string;
  tag?: string; // Assuming 'tag' is an optional string for "Best Seller", "New", "Popular"
}

export function FeaturedCollection() {
  const { theme, isReady } = useTheme();
  const { homepage } = useHomepageSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [popularRes, bestSellerRes, latestRes] = await Promise.all([
          fetch("/api/products/popular"),
          fetch("/api/products/best-seller"),
          fetch("/api/products/latest"),
        ]);

        if (!popularRes.ok || !bestSellerRes.ok || !latestRes.ok) {
          throw new Error(`HTTP error!`);
        }

        const [popularProduct, bestSellerProduct, latestProduct] = await Promise.all([
          popularRes.json(),
          bestSellerRes.json(),
          latestRes.json(),
        ]);

        const allFetchedProducts = [popularProduct, bestSellerProduct, latestProduct].filter(p => p !== null);

        // Filter for unique products based on ID
        const uniqueProductsMap = new Map<string, Product>();
        allFetchedProducts.forEach(product => {
          if (product && !uniqueProductsMap.has(product.id)) {
            uniqueProductsMap.set(product.id, product);
          }
        });
        const featuredProducts = Array.from(uniqueProductsMap.values());

        setProducts(featuredProducts);

      } catch (error) {
        console.error("Error fetching featured products:", error);
        setError("Failed to load featured products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      className={`relative py-20 overflow-hidden ${
        !isReady
          ? "bg-[#f0ebe5]"
          : theme === "dark"
          ? "bg-[#111111]"
          : "bg-[#f0ebe5]"
      }`}
    >
      {/* Mountain Silhouette Bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none ${
          !isReady
            ? "opacity-15"
            : theme === "dark"
            ? "opacity-10"
            : "opacity-15"
        }`}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 150"
          preserveAspectRatio="none"
        >
          <path
            d="M0,150 L0,100 L200,50 L400,80 L600,30 L800,70 L1000,40 L1200,90 L1200,150 Z"
            fill="currentColor"
            className={
              !isReady
                ? "text-[#2d2520]/25"
                : theme === "dark"
                ? "text-white/20"
                : "text-[#2d2520]/25"
            }
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportConfigHeader}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-center text-4xl sm:text-5xl tracking-[0.08em] font-cinzel font-semibold mb-3 ${
              !isReady
                ? "text-[#2d2520]"
                : theme === "dark"
                ? "text-white"
                : "text-[#2d2520]"
            }`}
          >
            {homepage?.featuredTitle || "FEATURED COLLECTION"}
          </h2>
          <p
            className={`text-center text-xl font-inter mb-12 ${
              !isReady
                ? "text-neutral-600"
                : theme === "dark"
                ? "text-neutral-400"
                : "text-neutral-600"
            }`}
          >
            {homepage?.featuredDescription || "Discover our most beloved pieces, each crafted with centuries of tradition"}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-sm md:max-w-none font-inter mx-auto"
          variants={containerVariantsCustom}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {loadingProducts ? (
            <p className="text-center text-xl">Loading products...</p>
          ) : error ? (
            <p className="text-center text-xl text-red-500">{error}</p>
          ) : (
            products.map((product, index) => (
              <motion.div key={`${product.id}-${index}`} variants={itemVariantsCustom}>
                <ProductCard
                  id={product.id}
                  title={product.name}
                  price={product.price.toString()}
                  img={product.images?.[0]?.url || "/product_placeholder.jpeg"}
                  tag={product.tag}
                  description={product.description}
                />
              </motion.div>
            ))
          )}
        </motion.div>

       
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <NavigationLink href="/products">
            <motion.div
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 text-sm font-medium shadow-lg shadow-emerald-500/20 group cursor-pointer"
              whileHover={{
                scale: 1.08,
                boxShadow: "0 15px 40px rgba(107,74,50,0.4)",
                y: -3,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              View Full Collection
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </motion.div>
          </NavigationLink>
        </motion.div>
        
      </div>
    </section>
  );
}
