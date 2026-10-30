"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Spinner } from "@/components/ui/spinner";
import { ProductControls } from "@/components/products/product-controls";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import { getProducts, type ProductData } from "@/actions/products";

const PRODUCTS_PER_PAGE = 8;
const MIN_SEARCH_LENGTH = 4;

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [effectiveSearchQuery, setEffectiveSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchProducts = useCallback(async () => {
    const shouldSearch =
      effectiveSearchQuery.length >= MIN_SEARCH_LENGTH || selectedCategory;

    if (!shouldSearch) {
      setProducts([]);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getProducts({
        searchQuery: effectiveSearchQuery,
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
      console.error("[SearchPage] Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    effectiveSearchQuery,
    selectedCategory,
    inStockOnly,
    sortBy,
    currentPage,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length >= MIN_SEARCH_LENGTH) {
      searchTimeoutRef.current = setTimeout(() => {
        setEffectiveSearchQuery(query);
      }, 300);
    } else if (query.length === 0) {
      setEffectiveSearchQuery("");
    }
  };

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

  const isEmptyState = !effectiveSearchQuery && !selectedCategory;
  const isTypingShortQuery =
    searchQuery.length > 0 && searchQuery.length < MIN_SEARCH_LENGTH;

  return (
    <main className="pt-16 md:pt-20 min-h-screen bg-[#f7f5f2] dark:bg-[#0a0a0a] relative">
      <ThemeToggle
        variant="fixed"
        position="right-4 md:right-8 top-24 md:top-28"
        animationType="scale"
        animationDelay={0.3}
        zIndex={30}
      />

      <div className="flex flex-col gap-8 p-6 mx-3 lg:mx-16 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <h1 className="text-4xl font-bold font-inter text-[#2d2520] dark:text-white">
            Search
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

          {/* Search hint */}
          {isTypingShortQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800"
            >
              Continue typing... Search will begin after{" "}
              {MIN_SEARCH_LENGTH - searchQuery.length} more character(s)
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          {isEmptyState ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 tracking-tight">
                  Discover Your Perfect Match
                </h2>

                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  Begin your search above to explore our curated collection.
                  Find exactly what you need with our intuitive browsing
                  experience.
                </p>

                <div className="pt-4">
                  <div className="w-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600 mx-auto"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 mb-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-10 w-10 mr-2 text-primary" />
              <p className="text-gray-600 dark:text-gray-200 text-lg font-medium">
                Loading products...
              </p>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Search Results
                  {effectiveSearchQuery && (
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      {" "}
                      for &quot;{effectiveSearchQuery}&quot;
                    </span>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 font-normal">
                    {" "}
                    ({products.length}{" "}
                    {products.length === 1 ? "product" : "products"})
                  </span>
                </h3>
              </div>

              <ProductGrid
                products={products}
                productVariants={products.reduce((acc, p) => {
                  acc[p.id] = p.variants;
                  return acc;
                }, {} as Record<string, (typeof products)[0]["variants"]>)}
              />

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
  );
};

export default SearchPage;
