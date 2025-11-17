"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2 } from "lucide-react";
import { ProductVariant } from "./types";

type Props = {
  productId?: string;
  variants: ProductVariant[];
  onAdd: () => void;
  onChange: (index: number, field: keyof ProductVariant, value: any) => void;
  onRemove: (index: number) => void;
  onSave: (index: number) => void; // NEW
};

export function ProductVariantForm({
  productId = "",
  variants,
  onAdd,
  onChange,
  onRemove,
  onSave, // NEW
}: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    onAdd();
    setExpandedIndex(variants.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium">Product Variants</h4>
        <Button onClick={handleAddNew} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No variants yet. Click "Add Variant" to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-medium">
                    {variant.name || `Variant ${index + 1}`}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    SKU: {variant.sku || "Not set"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    size="sm"
                    variant="ghost"
                  >
                    {expandedIndex === index ? "Collapse" : "Edit"}
                  </Button>

                  <Button
                    onClick={() => onRemove(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Form Section */}
              {expandedIndex === index && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SKU */}
                    <div className="space-y-2">
                      <Label htmlFor={`sku-${index}`}>SKU *</Label>
                      <Input
                        id={`sku-${index}`}
                        value={variant.sku}
                        onChange={(e) => onChange(index, "sku", e.target.value)}
                        placeholder="e.g., SKU-001"
                      />
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Variant Name *</Label>
                      <Input
                        id={`name-${index}`}
                        value={variant.name}
                        onChange={(e) =>
                          onChange(index, "name", e.target.value)
                        }
                        placeholder="e.g., Red Large"
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor={`price-${index}`}>Price</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.price || ""}
                        onChange={(e) =>
                          onChange(index, "price", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                      <Label htmlFor={`color-${index}`}>Color</Label>
                      <Input
                        id={`color-${index}`}
                        value={variant.color || ""}
                        onChange={(e) =>
                          onChange(index, "color", e.target.value)
                        }
                        placeholder="e.g., Red"
                      />
                    </div>

                    {/* Size */}
                    <div className="space-y-2">
                      <Label htmlFor={`size-${index}`}>Size</Label>
                      <Input
                        id={`size-${index}`}
                        value={variant.size || ""}
                        onChange={(e) =>
                          onChange(index, "size", e.target.value)
                        }
                        placeholder="e.g., Large"
                      />
                    </div>
                  </div>

                  {/* Save + Delete Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      onClick={() => onRemove(index)}
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>

                    <Button onClick={() => onSave(index)} variant="default">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
