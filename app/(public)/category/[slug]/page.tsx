"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { categories } from "@/data/categories";
import { Product } from "@/lib/types";

import { ThemeToggle } from "@/components/theme-toggle";
import { ProductControls } from "@/components/products/product-controls";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import ProductsBannerSection from "@/components/products/ProductsBannerSection";

const PRODUCTS_PER_PAGE = 8;

const CategoryPage = () => {
  const params = useParams(); // { slug: "shoulder-bags" }
  const category = categories.find((c) => c.slug === params.slug);

  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // filter products
  const filteredProducts = useMemo(() => {
    if (!category) return [];

    let filtered: Product[] = category.products as Product[];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.badge && p.badge.toLowerCase().includes(query))
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // sorting
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [category, inStockOnly, sortBy, searchQuery]);

  if (!category) return <p className="text-center py-20">Category not found</p>;

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

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
    <div className="min-h-screen bg-background mt-20 flex flex-col">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />

      {/* Banner */}
      <ProductsBannerSection
        title={category.name}
        subtitle={category.hero.subtitle}
      />

      <div className="flex flex-col gap-8 p-6 mx-3 lg:mx-16 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <h1 className="text-4xl font-bold font-inter">
            {category.name.toUpperCase()}
          </h1>

          <ProductControls
            selectedCategory={category.name}
            onCategoryChange={() => {}}
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
          <ProductGrid products={paginatedProducts} />

          {/* pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
