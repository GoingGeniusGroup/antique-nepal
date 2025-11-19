"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        setCategories([
          { id: "all", name: "All", slug: "all", displayOrder: 0, count: 0 },
          ...data,
        ]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Update scroll indicators
  const updateScrollIndicators = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    updateScrollIndicators();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollIndicators);
    window.addEventListener("resize", updateScrollIndicators);

    return () => {
      el.removeEventListener("scroll", updateScrollIndicators);
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [categories]);

  const handleScroll = (distance: number) => {
    scrollRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Search */}
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
          placeholder="Search products by name and category..."
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

      {/* Category Pills with scroll */}
      <div className="relative">
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex gap-2 overflow-x-auto whitespace-nowrap px-2 no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => {
            const isActive =
              (selectedCategory === null && category.id === "all") ||
              selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() =>
                  onCategoryChange(category.id === "all" ? null : category.id)
                }
                className={cn(
                  "px-4 py-2 rounded-full cursor-pointer text-sm font-medium border transition-all shrink-0",
                  isActive
                    ? isDark
                      ? "bg-white text-black border-white"
                      : "bg-[#2d2520] text-white border-[#2d2520]"
                    : isDark
                    ? "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    : "bg-white text-[#2d2520]/70 border-[#e8e0d8] hover:border-primary hover:text-[#2d2520]"
                )}
              >
                {category.name}
                {category.count > 0 && (
                  <span className="ml-1 text-gray-500">({category.count})</span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Left scroll indicator */}
        {canScrollLeft && (
          <button
            aria-label="left-arrow"
            onClick={() => handleScroll(-150)}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md z-10",
              isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right scroll indicator */}
        {canScrollRight && (
          <button
            aria-label="right-arrow"
            onClick={() => handleScroll(150)}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-md z-10",
              isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stock + Sort */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap"
      >
        {/* In stock */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
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
            aria-label="in-stock"
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
              aria-label="Sort products"
              className={cn(
                "w-40 transition-all cursor-pointer duration-200",
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-[#e8e0d8] hover:border-primary"
              )}
            >
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="newest">
                Newest
              </SelectItem>
              <SelectItem className="cursor-pointer" value="price-low">
                Price: Low to High
              </SelectItem>
              <SelectItem className="cursor-pointer" value="price-high">
                Price: High to Low
              </SelectItem>
              <SelectItem className="cursor-pointer" value="name">
                Name: A to Z
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </motion.div>
    </div>
  );
}
