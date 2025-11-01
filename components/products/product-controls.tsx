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
import { Search } from "lucide-react";

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
  const categories = ["All", "Accessories", "Bags"];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products by name, category, or badge..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) =>
            onCategoryChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category === "All" ? "all" : category}
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Right side controls */}
        <div className="flex items-center justify-end gap-4 flex-wrap md:flex-nowrap">
          {/* In Stock Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => onInStockChange(checked as boolean)}
            />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              In stock
            </label>
          </div>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
