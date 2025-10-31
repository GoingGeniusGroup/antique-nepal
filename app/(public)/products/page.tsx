"use client";
import { Pagination } from "@/components/products/pagination";
import { ProductControls } from "@/components/products/product-controls";
import { ProductGrid } from "@/components/products/product-grid";
import ProductsBannerSection from "@/components/products/ProductsBannerSection";
import { useMemo, useState } from "react";

const PRODUCTS_PER_PAGE = 8;

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // mock data
  const allProducts = [
    {
      id: 1,
      name: "Artisan Hemp Wallet",
      category: "Accessories",
      price: 34.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Totte Bag",
    },
    {
      id: 2,
      name: "Artisan Hemp Wallet",
      category: "Accessories",
      price: 34.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Totte Bag",
    },
    {
      id: 3,
      name: "Organic Cotton Tote",
      category: "Bags",
      price: 45.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Eco-Friendly",
    },
    {
      id: 4,
      name: "Bamboo Sunglasses",
      category: "Accessories",
      price: 52.0,
      image: "/hemp-shoulder-bag.jpg",
      inStock: false,
      badge: "Sustainable",
    },
    {
      id: 5,
      name: "Linen Beach Bag",
      category: "Bags",
      price: 39.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Summer",
    },
    {
      id: 6,
      name: "Cork Crossbody Bag",
      category: "Bags",
      price: 55.0,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Eco-Friendly",
    },
    {
      id: 7,
      name: "Recycled Backpack",
      category: "Bags",
      price: 65.0,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Sustainable",
    },
    {
      id: 8,
      name: "Jute Clutch",
      category: "Accessories",
      price: 28.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: false,
      badge: "Eco-Friendly",
    },
    {
      id: 9,
      name: "Natural Fiber Hat",
      category: "Accessories",
      price: 42.0,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Summer",
    },
    {
      id: 10,
      name: "Hemp Shoulder Bag",
      category: "Bags",
      price: 49.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Totte Bag",
    },
    {
      id: 11,
      name: "Woven Wallet",
      category: "Accessories",
      price: 24.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Compact",
    },
    {
      id: 12,
      name: "Sustainable Daypack",
      category: "Bags",
      price: 59.99,
      image: "/hemp-shoulder-bag.jpg",
      inStock: true,
      badge: "Eco-Friendly",
    },
  ];

  // filter products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // sorting ko lagi
    if (sortBy === "price-low") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [selectedCategory, inStockOnly, sortBy]);

  // pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // reset to first page when filters change
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
  return (
    <>
      <main>
        <ProductsBannerSection />
        <div className="flex flex-col gap-8 p-6 mx-3 lg:mx-16 md:p-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-foreground">PRODUCTS</h1>

            <ProductControls
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              inStockOnly={inStockOnly}
              onInStockChange={handleInStockChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>

          {/* products section */}
          <div className="flex-1">
            <ProductGrid products={paginatedProducts} />

            {/* pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductsPage;
