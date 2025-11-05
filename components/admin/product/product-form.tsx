"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type NewProductData = {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

type Props = {
  onSave: (product: NewProductData) => void;
};

export function ProductForm({ onSave }: Props) {
  const [product, setProduct] = useState<NewProductData>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    sku: "",
    price: 0,
    isActive: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });

  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof NewProductData, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const saveProduct = async () => {
    if (!product.name || !product.slug || !product.sku) {
      toast.error("Name, Slug, and SKU are required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to save product.");
        return;
      }

      toast.success("✅ Product created successfully!");
      onSave(result.product);

      // Reset form after saving
      setProduct({
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        sku: "",
        price: 0,
        isActive: true,
        isFeatured: false,
        metaTitle: "",
        metaDescription: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Add Product</h3>
        <Button onClick={saveProduct} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input
            value={product.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <Label>Slug</Label>
          <Input
            value={product.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="unique-slug"
          />
        </div>

        <div>
          <Label>SKU</Label>
          <Input
            value={product.sku}
            onChange={(e) => updateField("sku", e.target.value)}
            placeholder="SKU12345"
          />
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) =>
              updateField("price", parseFloat(e.target.value) || 0)
            }
            placeholder="Enter price"
          />
        </div>

        <div>
          <Label>Active</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={product.isActive}
              onCheckedChange={(v) => updateField("isActive", v)}
            />
            <span>{product.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <div>
          <Label>Featured</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={product.isFeatured}
              onCheckedChange={(v) => updateField("isFeatured", v)}
            />
            <span>{product.isFeatured ? "Yes" : "No"}</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Short Description</Label>
          <Textarea
            value={product.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            placeholder="Short summary for listing..."
          />
        </div>

        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={product.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Full product details..."
          />
        </div>

        <div>
          <Label>Meta Title</Label>
          <Input
            value={product.metaTitle}
            onChange={(e) => updateField("metaTitle", e.target.value)}
            placeholder="SEO meta title"
          />
        </div>

        <div>
          <Label>Meta Description</Label>
          <Textarea
            value={product.metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            placeholder="SEO meta description..."
          />
        </div>
      </div>
    </div>
  );
}
