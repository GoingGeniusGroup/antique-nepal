"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { ProductData } from "@/actions/products";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductControls } from "@/components/products/product-controls";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import ProductsBannerSection from "@/components/products/ProductsBannerSection";

const PRODUCTS_PER_PAGE = 8;

interface Category {
  id: string;
  name: string;
  description?: string;
  hero?: { subtitle?: string };
}

const CategoryPage = () => {
  const params = useParams(); // { slug: "shoulder-bags" }

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("useEffect triggered. slug:", params.slug);
    if (!params.slug) {
      console.log("No slug yet, returning.");
      return;
    }

    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          perPage: PRODUCTS_PER_PAGE.toString(),
          searchQuery: searchQuery,
          inStockOnly: inStockOnly.toString(),
          sortBy: sortBy,
        });
        const url = `/api/categories/${params.slug}/products?${queryParams.toString()}`;
        console.log("Fetching from URL:", url);
        const res = await fetch(url);
        const data = await res.json();

        console.log("API response:", data);

        if (!data.category) {
          setCategory(null);
          setProducts([]);
          setTotalPages(0);
          return;
        }

        setCategory(data.category);
        const formattedProducts: ProductData[] = data.products.map(
          (product: any) => {
            const imageUrl =
              product.images?.find((img: any) => img.isPrimary)?.url ||
              product.images?.[0]?.url;

            let image = "/product_placeholder.jpeg";
            if (imageUrl) {
              const cleanedUrl = imageUrl
                .trim()
                .replace(/^[\/\\]+/, "")
                .replace(/["\']/g, "");
              image = cleanedUrl.startsWith("http")
                ? cleanedUrl
                : `/${cleanedUrl}`;
            }

            return {
              id: product.id,
              name: product.name,
              category: data.category.name,
              price: Number(product.price),
              image,
              inStock: product.isActive, // Assuming isActive indicates stock
              badge: data.category.name,
            };
          }
        );
        setProducts(formattedProducts);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [params.slug, currentPage, searchQuery, inStockOnly, sortBy]);

  const paginatedProducts = products;

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!category) return <p className="text-center py-20">Category not found</p>;

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
        subtitle={category.hero?.subtitle || "Explore our collection"}
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

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          <ProductGrid products={paginatedProducts} />

          {/* Pagination */}
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
