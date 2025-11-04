"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  count: number;
}

interface ProductControlsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ProductControls({
  selectedCategory,
  onCategoryChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: ProductControlsProps) {
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";
  // const categories = ["All", "Accessories", "Bags"];
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) =>
        setCategories([
          { id: "all", name: "All", slug: "all", displayOrder: 0, count: 0 },
          ...data,
        ])
      )
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Enhanced Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full group"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Search
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              isDark
                ? "text-white/60 group-focus-within:text-white"
                : "text-[#2d2520]/60 group-focus-within:text-primary"
            )}
          />
        </div>
        <Input
          type="text"
          placeholder="Search products by name, category, or badge..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-10 h-12 transition-all duration-300",
            isDark
              ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 focus:shadow-lg focus:shadow-white/10"
              : "bg-white border-[#e8e0d8] text-[#2d2520] focus:border-primary focus:shadow-lg focus:shadow-primary/10"
          )}
        />
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onSearchChange("")}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors",
              isDark
                ? "hover:bg-white/10 text-white/60"
                : "hover:bg-[#e8e0d8] text-[#2d2520]/60"
            )}
          >
            <span className="text-xs">✕</span>
          </motion.button>
        )}
      </motion.div>

      {/* Enhanced Filters row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex items-center"
        >
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Filter
              className={cn(
                "w-4 h-4",
                isDark ? "text-white/60" : "text-[#2d2520]/60"
              )}
            />
          </div>
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger
              className={cn(
                "w-40 pl-10 transition-all duration-200",
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-[#e8e0d8] hover:border-primary"
              )}
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}{" "}
                  {category.count > 0 ? `(${category.count})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Right side controls */}
        <div className="flex items-center justify-end gap-4 flex-wrap md:flex-nowrap">
          {/* In Stock Checkbox */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: inStockOnly
                ? isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(16,185,129,0.1)"
                : "transparent",
            }}
            onClick={() => onInStockChange(!inStockOnly)}
          >
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => onInStockChange(checked as boolean)}
            />
            <label
              htmlFor="in-stock"
              className={cn(
                "text-sm cursor-pointer select-none",
                isDark ? "text-white/90" : "text-[#2d2520]"
              )}
            >
              In stock
            </label>
          </motion.div>

          {/* Sort By */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger
                className={cn(
                  "w-40 transition-all duration-200",
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-[#e8e0d8] hover:border-primary"
                )}
              >
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
