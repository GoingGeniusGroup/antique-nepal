"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductControlsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ProductControls({
  selectedCategory,
  onCategoryChange,
  inStockOnly,
  onInStockChange,
  sortBy,
  onSortChange,
}: ProductControlsProps) {
  const categories = ["All", "Accessories", "Bags"];

  return (
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

      <div className="flex items-center justify-end gap-4 flex-wrap md:flex-nowrap">
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
  );
}
