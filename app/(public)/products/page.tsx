"use client";

import { Pagination } from "@/components/products/pagination";
import { ProductControls } from "@/components/products/product-controls";
import { ProductGrid } from "@/components/products/product-grid";
import ProductsBannerSection from "@/components/products/ProductsBannerSection";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { getProducts, type ProductData } from "@/actions/products";

const PRODUCTS_PER_PAGE = 8;
const MIN_SEARCH_LENGTH = 3;

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<ProductData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track initial products per category for short query fallback
  const [initialProducts, setInitialProducts] = useState<
    Record<string, ProductData[]>
  >({});
  const [initialTotalPages, setInitialTotalPages] = useState<
    Record<string, number>
  >({});

  // Track latest request to avoid race conditions
  const latestRequest = useRef(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products safely
  const fetchProducts = useCallback(async () => {
    const requestId = ++latestRequest.current;

    const isInitialLoad = debouncedSearchQuery === "" && !selectedCategory;
    const isSearchActive =
      debouncedSearchQuery.length >= MIN_SEARCH_LENGTH || selectedCategory;

    if (!isInitialLoad && !isSearchActive) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getProducts({
        searchQuery: isSearchActive ? debouncedSearchQuery : "",
        selectedCategory,
        inStockOnly,
        sortBy,
        page: currentPage,
        perPage: PRODUCTS_PER_PAGE,
      });

      if (requestId === latestRequest.current) {
        setProducts(result.products);
        setTotalPages(result.totalPages);

        // Save initial products per category for short query fallback
        if (isInitialLoad && currentPage === 1) {
          const categoryKey = selectedCategory || "all";
          setInitialProducts((prev) => ({
            ...prev,
            [categoryKey]: result.products,
          }));
          setInitialTotalPages((prev) => ({
            ...prev,
            [categoryKey]: result.totalPages,
          }));
        }
      }
    } catch (err) {
      if (requestId === latestRequest.current) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      }
      console.error("[ProductsPage] Error loading products:", err);
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, [
    debouncedSearchQuery,
    selectedCategory,
    inStockOnly,
    sortBy,
    currentPage,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handlers
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
  };

  // Short query fallback logic
  const categoryKey = selectedCategory || "all";
  const isTypingShortQuery =
    searchQuery.length > 0 && searchQuery.length < MIN_SEARCH_LENGTH;

  const productsToDisplay =
    isTypingShortQuery && initialProducts[categoryKey]?.length > 0
      ? initialProducts[categoryKey]
      : products;

  const totalPagesToDisplay =
    isTypingShortQuery && initialTotalPages[categoryKey]
      ? initialTotalPages[categoryKey]
      : totalPages;

  // Memoized productVariants map
  const productVariantsMap = useMemo(() => {
    return productsToDisplay.reduce((acc, p) => {
      acc[p.id] = p.variants;
      return acc;
    }, {} as Record<string, (typeof productsToDisplay)[0]["variants"]>);
  }, [productsToDisplay]);

  return (
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

        {/* Products Section */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-gray-200 dark:bg-gray-800 h-72 rounded-lg"
                />
              ))}
            </div>
          ) : (
            <>
              <ProductGrid
                products={productsToDisplay}
                productVariants={productVariantsMap}
              />

              {totalPagesToDisplay > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPagesToDisplay}
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

export default ProductsPage;
