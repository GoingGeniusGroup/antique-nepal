"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Save, Trash } from "lucide-react";
import { ProductForm } from "./product-form";
import { ProductImagesForm } from "./product-image-form";
import { ProductData, ProductImage } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

type Props = {
  product?: ProductData | null;
  images?: ProductImage[];
  onSave: (product: ProductData, images: ProductImage[]) => void;
};

export function ProductWithImagesForm({ product, images = [], onSave }: Props) {
  const [productData, setProductData] = useState<ProductData>({
    id: product?.id,
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    sku: product?.sku || "",
    price: product?.price || 0,
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
  });
  console.log("Images:", images);

  const [productImages, setProductImages] = useState<ProductImage[]>(
    images.length > 0
      ? images.map((img) => ({
          ...img,
          displayOrder: Number(img.displayOrder) || 0,
          isPrimary: Boolean(img.isPrimary),
        }))
      : [{ displayOrder: 0, isPrimary: false }]
  );

  const [saving, setSaving] = useState(false);

  // Image deletion dialog
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateProductField = (field: keyof ProductData, value: any) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const updateImageField = (
    index: number,
    field: keyof ProductImage,
    value: any
  ) => {
    const updated = [...productImages];
    let newValue = value;

    if (field === "displayOrder") newValue = Number(value) || 0;
    if (field === "isPrimary") newValue = Boolean(value);
    updated[index] = { ...updated[index], [field]: value };
    setProductImages(updated);
  };

  const addNewImage = () => {
    setProductImages((prev) => [
      ...prev,
      { displayOrder: prev.length, isPrimary: false },
    ]);
  };

  const confirmRemoveImage = (index: number) => setDeleteIndex(index);

  const removeImage = async () => {
    if (deleteIndex === null) return;
    const img = productImages[deleteIndex];

    setIsDeleting(true);

    try {
      if (img.id) {
        const res = await fetch(`/api/admin/products/images/${img.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete image");
        toast.success("✅ Image deleted successfully");
      }
      setProductImages((prev) => prev.filter((_, i) => i !== deleteIndex));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    } finally {
      setDeleteIndex(null);
      setIsDeleting(false);
    }
  };

  const saveAll = async () => {
    if (!productData.name || !productData.slug || !productData.sku) {
      toast.error("Name, Slug, and SKU are required.");
      return;
    }

    setSaving(true);

    try {
      const url = productData.id
        ? `/api/admin/products/${productData.id}`
        : "/api/admin/products";
      const method = productData.id ? "PUT" : "POST";

      const productRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const savedProduct = await productRes.json();
      if (!productRes.ok) {
        toast.error(savedProduct.message || "Failed to save product.");
        return;
      }
      for (const img of productImages) {
        // If all fields are empty, skip it
        const isEmpty =
          !img.file &&
          !img.altText?.trim() &&
          (img.displayOrder === undefined || img.displayOrder === null) &&
          img.isPrimary === false;

        if (isEmpty) continue; // Skip completely

        // If image has an ID, update existing one (PUT)
        if (img.id) {
          const formData = new FormData();
          if (img.variantId) formData.append("variantId", img.variantId);
          formData.append("altText", img.altText || "");
          formData.append("displayOrder", img.displayOrder?.toString() || "0");
          formData.append("isPrimary", String(img.isPrimary));

          // Include file only if a new one was selected
          if (img.file) formData.append("image", img.file);

          await fetch(`/api/admin/products/images/${img.id}`, {
            method: "PUT",
            body: formData,
          });
        }

        // If image has no ID but has a file, it’s a new one (POST)
        else if (img.file) {
          const formData = new FormData();
          formData.append("productId", savedProduct.product.id);
          if (img.variantId) formData.append("variantId", img.variantId);
          formData.append("image", img.file);
          formData.append("altText", img.altText || "");
          formData.append("displayOrder", img.displayOrder?.toString() || "0");
          formData.append("isPrimary", String(img.isPrimary));

          await fetch("/api/admin/products/images", {
            method: "POST",
            body: formData,
          });
        }
      }

      toast.success(
        productData.id
          ? "✅ Product updated successfully!"
          : "✅ Product created successfully!"
      );
      onSave(savedProduct.product, productImages);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-6 px-4 py-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-lg font-semibold">
          {product ? "Edit Product" : "Add Product"}
        </h3>
        <Button onClick={saveAll} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="space-y-6">
        <ProductForm product={productData} onChange={updateProductField} />

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-md font-medium mb-2">Product Images</h4>
          <ProductImagesForm
            images={productImages}
            onChange={updateImageField}
            onAdd={addNewImage}
            onRemove={confirmRemoveImage}
          />
        </div>
      </div>

      {/* AlertDialog for confirming image deletion */}
      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={() => setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeImage} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
