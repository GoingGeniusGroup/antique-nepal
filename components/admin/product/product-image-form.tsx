"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ProductImage } from "./types";
import { Button } from "@/components/ui/button";

type Props = {
  images: ProductImage[];
  onChange: (index: number, field: keyof ProductImage, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function ProductImagesForm({
  images,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="space-y-6">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <Label className="font-medium text-gray-800 dark:text-gray-200">
              Image {idx + 1}
            </Label>
            <button
              onClick={() => onRemove(idx)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Preview existing image */}
            {img.url && !img.file && (
              <div>
                <Label>Preview</Label>
                <img
                  src={img.url}
                  alt={img.altText || `Image ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-md mt-1"
                />
              </div>
            )}

            {/* File input (cannot prefill) */}
            <div>
              <Label>Upload File</Label>
              <Input
                type="file"
                className="mt-1"
                onChange={(e) =>
                  onChange(idx, "file", e.target.files?.[0] || null)
                }
              />
            </div>

            {/* Alt Text */}
            <div>
              <Label>Alt Text</Label>
              <Input
                value={img.altText ?? ""}
                className="mt-1"
                onChange={(e) => onChange(idx, "altText", e.target.value)}
                placeholder="Alt text"
              />
            </div>

            {/* Display Order */}
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={img.displayOrder ?? 0} // default to 0 if undefined
                className="mt-1"
                onChange={(e) =>
                  onChange(idx, "displayOrder", parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* Primary Switch */}
            <div className="flex items-center space-x-2 mt-5">
              <Switch
                checked={img.isPrimary ?? false}
                onCheckedChange={(v) => onChange(idx, "isPrimary", v)}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {img.isPrimary ? "Primary" : "Not Primary"}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Button onClick={onAdd} variant={"outline"}>
          Add New Image
        </Button>
      </div>
    </div>
  );
}
