"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProductData } from "./types";

type Props = {
  product: ProductData;
  onChange: (field: keyof ProductData, value: any) => void;
};

export function ProductForm({ product, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Name</Label>
        <Input
          value={product.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter product name"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Slug</Label>
        <Input
          value={product.slug}
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="unique-slug"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">SKU</Label>
        <Input
          value={product.sku}
          onChange={(e) => onChange("sku", e.target.value)}
          placeholder="SKU12345"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Price</Label>
        <Input
          type="number"
          step="0.01"
          value={product.price}
          onChange={(e) => onChange("price", parseFloat(e.target.value))}
          placeholder="Enter price"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Active</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Switch
            checked={product.isActive}
            onCheckedChange={(v) => onChange("isActive", v)}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Featured</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Switch
            checked={product.isFeatured}
            onCheckedChange={(v) => onChange("isFeatured", v)}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {product.isFeatured ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <div className="md:col-span-2">
        <Label className="text-gray-700 dark:text-gray-300">
          Short Description
        </Label>
        <Textarea
          value={product.shortDescription ?? ""}
          onChange={(e) => onChange("shortDescription", e.target.value)}
          placeholder="Short summary for listing..."
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="md:col-span-2">
        <Label className="text-gray-700 dark:text-gray-300">Description</Label>
        <Textarea
          value={product.description ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Full product details..."
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Meta Title</Label>
        <Input
          value={product.metaTitle ?? ""}
          onChange={(e) => onChange("metaTitle", e.target.value)}
          placeholder="SEO meta title"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">
          Meta Description
        </Label>
        <Textarea
          value={product.metaDescription ?? ""}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder="SEO meta description..."
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
