"use client";

import { Pagination } from "@/components/products/pagination";
import { ProductControls } from "@/components/products/product-controls";
import { ProductGrid } from "@/components/products/product-grid";
import ProductsBannerSection from "@/components/products/ProductsBannerSection";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { getProducts, type ProductData } from "@/actions/products";
import { Spinner } from "@/components/ui/spinner";

const PRODUCTS_PER_PAGE = 8;

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProducts({
        searchQuery,
        selectedCategory,
        inStockOnly,
        sortBy,
        page: currentPage,
        perPage: PRODUCTS_PER_PAGE,
      });

      setProducts(result.products);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("[v0] Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, inStockOnly, sortBy, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <>
      <main className="pt-16 md:pt-20 min-h-screen bg-[#f7f5f2] dark:bg-[#0a0a0a] relative">
        <ThemeToggle
          variant="fixed"
          position="right-4 md:right-8 top-24 md:top-28"
          animationType="scale"
          animationDelay={0.3}
          zIndex={30}
        />

        <ProductsBannerSection
          title="Our Hemp Collection"
          subtitle="Discover handcrafted accessories made from sustainable hemp fiber by skilled artisans in the Himalayan foothills."
        />
        <div className="flex flex-col gap-8 p-6 mx-3 lg:mx-16 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-4xl font-bold font-inter text-[#2d2520] dark:text-white">
              PRODUCTS
            </h1>

            <ProductControls
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              inStockOnly={inStockOnly}
              onInStockChange={handleInStockChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </motion.div>

          {/* products section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            {error && (
              <div className="p-4 mb-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="h-10 w-10 mr-2 text-primary" />
                <p className="text-gray-600 dark:text-gray-200 text-lg font-medium">
                  Loading products...
                </p>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  productVariants={products.reduce((acc, p) => {
                    acc[p.id] = p.variants;
                    return acc;
                  }, {} as Record<string, (typeof products)[0]["variants"]>)}
                />

                {/* pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default ProductsPage;
