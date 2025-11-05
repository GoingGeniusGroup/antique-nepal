"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Image } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type ProductImageData = {
  id?: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
};

type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImageData[];
};

type Props = {
  product?: ProductData;
  onChange: (product: ProductData) => void;
};

export function ProductFormCard({ product, onChange }: Props) {
  const [saving, setSaving] = useState(false);

  // Helper function to provide defaults
  const getProduct = (): ProductData => ({
    id: product?.id,
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description,
    shortDescription: product?.shortDescription,
    sku: product?.sku || "",
    price: product?.price || 0,
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    images: product?.images || [],
  });

  const updateField = (field: keyof ProductData, value: any) => {
    onChange({
      ...getProduct(),
      [field]: value,
    });
  };

  const addImage = () => {
    onChange({
      ...getProduct(),
      images: [
        ...getProduct().images,
        { url: "", altText: "", isPrimary: false },
      ],
    });
  };

  const updateImage = (
    index: number,
    field: keyof ProductImageData,
    value: any
  ) => {
    const updatedImages = [...getProduct().images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    onChange({ ...getProduct(), images: updatedImages });
  };

  const removeImage = (index: number) => {
    const updatedImages = getProduct().images.filter((_, i) => i !== index);
    onChange({ ...getProduct(), images: updatedImages });
  };

  const saveProduct = async () => {
    setSaving(true);
    try {
      // call your API here e.g., POST / PATCH
      toast.success("Product saved successfully!");
    } catch (err) {
      toast.error("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Product Details
        </h3>
        <Button onClick={saveProduct} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Product Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input
            value={product?.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={product?.slug || ""}
            onChange={(e) => updateField("slug", e.target.value)}
          />
        </div>
        <div>
          <Label>SKU</Label>
          <Input
            value={product?.sku || ""}
            onChange={(e) => updateField("sku", e.target.value)}
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={product?.price || 0}
            onChange={(e) => updateField("price", parseFloat(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={product?.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
      </div>

      {/* Images Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-md font-semibold text-foreground flex items-center gap-2">
            <Image className="h-4 w-4" />
            Product Images
          </h4>
          <Button size="sm" variant="outline" onClick={addImage}>
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>

        <div className="space-y-4">
          {product?.images.map((img, index) => (
            <div
              key={index}
              className="grid gap-4 md:grid-cols-3 items-end p-3 border border-border rounded"
            >
              <div>
                <Label>Image URL</Label>
                <Input
                  value={img.url}
                  onChange={(e) => updateImage(index, "url", e.target.value)}
                />
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input
                  value={img.altText || ""}
                  onChange={(e) =>
                    updateImage(index, "altText", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={img.isPrimary || false}
                    onChange={(e) =>
                      updateImage(index, "isPrimary", e.target.checked)
                    }
                  />
                  Primary
                </Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!product?.images || product.images.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No images added yet. Click "Add Image" to create one.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
