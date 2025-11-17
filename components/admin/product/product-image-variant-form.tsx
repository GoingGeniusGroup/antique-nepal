"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ProductForm } from "./product-form";
import { ProductImagesForm } from "./product-image-form";
import { ProductVariantForm } from "./variant-form";
import { ProductData, ProductImage, ProductVariant } from "./types";
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
  initialVariants?: ProductVariant[];
  onSave: (
    product: ProductData,
    images: ProductImage[],
    variants?: ProductVariant[]
  ) => void;
};

export function ProductWithImagesForm({
  product,
  images = [],
  initialVariants = [],
  onSave,
}: Props) {
  const [activeTab, setActiveTab] = useState<"product" | "images" | "variants">(
    "product"
  );

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
  const updateProductField = (field: keyof ProductData, value: any) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const [productImages, setProductImages] = useState<ProductImage[]>(
    images.length > 0
      ? images.map((img) => ({
          ...img,
          displayOrder: Number(img.displayOrder) || 0,
          isPrimary: Boolean(img.isPrimary),
        }))
      : [{ displayOrder: 0, isPrimary: false }]
  );

  // Image state
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  // Variant state
  const [deleteVariantIndex, setDeleteVariantIndex] = useState<number | null>(
    null
  );
  const [isDeletingVariant, setIsDeletingVariant] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [saving, setSaving] = useState(false);

  // ---------------------- IMAGE HANDLERS ----------------------

  const updateImageField = (
    index: number,
    field: keyof ProductImage,
    value: any
  ) => {
    const updated = [...productImages];
    let newValue = value;

    if (field === "displayOrder") newValue = Number(value) || 0;
    if (field === "isPrimary") newValue = Boolean(value);

    updated[index] = { ...updated[index], [field]: newValue };
    setProductImages(updated);
  };

  const addNewImage = () => {
    setProductImages((prev) => [
      ...prev,
      { displayOrder: prev.length, isPrimary: false },
    ]);
  };

  const confirmRemoveImage = (index: number) => setDeleteImageIndex(index);

  const removeImageConfirmed = async () => {
    if (deleteImageIndex === null) return;
    const img = productImages[deleteImageIndex];

    setIsDeletingImage(true);

    try {
      if (img.id) {
        const res = await fetch(`/api/admin/products/images/${img.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to delete image");
        }
        toast.success("Image deleted successfully");
      }

      setProductImages((prev) => prev.filter((_, i) => i !== deleteImageIndex));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete image");
    } finally {
      setDeleteImageIndex(null);
      setIsDeletingImage(false);
    }
  };

  // ---------------------- VARIANT HANDLERS ----------------------

  const confirmRemoveVariant = (index: number) => setDeleteVariantIndex(index);

  const removeVariantConfirmed = async () => {
    if (deleteVariantIndex === null) return;
    const variant = variants[deleteVariantIndex];

    setIsDeletingVariant(true);

    try {
      if (variant.id) {
        const res = await fetch(`/api/admin/products/variants/${variant.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to delete variant");
        }
        toast.success("Variant deleted successfully");
      }

      setVariants((prev) => prev.filter((_, i) => i !== deleteVariantIndex));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete variant");
    } finally {
      setDeleteVariantIndex(null);
      setIsDeletingVariant(false);
    }
  };

  const addNewVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        productId: "",
        name: "",
        sku: "",
        price: 0,
        color: "",
        size: "",
      } as ProductVariant,
    ]);
  };

  const updateVariantField = (
    index: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants((prev) => {
      const updated = [...prev];

      let newValue = value;

      if (field === "price") {
        newValue = Number(value);
        if (isNaN(newValue)) newValue = 0;
      }

      updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  };

  // const saveVariantsOnly = async () => {
  //   if (!productData.id) {
  //     toast.error("Save product first before adding variants");
  //     return;
  //   }

  //   for (const variant of variants) {
  //     if (!variant.name || !variant.sku) continue;

  //     const method = variant.id ? "PUT" : "POST";
  //     const url = variant.id
  //       ? `/api/admin/products/variants/${variant.id}`
  //       : `/api/admin/products/variants`;
  //     console.log({
  //       name: variant.name,
  //       sku: variant.sku,
  //       price: variant.price,
  //       productId: productData.id,
  //       color: variant.color,
  //       size: variant.size,
  //     });

  //     const res = await fetch(url, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...variant, productId: productData.id }),
  //     });
  //     console.log("response:", res);

  //     if (!res.ok) {
  //       toast.error("Failed to save variant");
  //       return;
  //     }
  //   }

  //   toast.success("Variants saved successfully");
  // };

  // Fetch existing variants if product exists
  useEffect(() => {
    if (!productData.id) return;

    const fetchVariants = async () => {
      try {
        const res = await fetch(
          `/api/admin/products/variants?productId=${productData.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch variants");
        const data = await res.json();
        const sanitizedVariants = (data.variants || []).map((v: any) => ({
          ...v,
          price: v.price ? parseFloat(v.price) : undefined,
        }));
        setVariants(sanitizedVariants);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Error fetching variants");
      }
    };

    fetchVariants();
  }, [productData.id]);

  // ---------------------- SAVE ALL ----------------------
  const saveAll = async () => {
    if (!productData.name || !productData.slug || !productData.sku) {
      toast.error("Name, Slug, and SKU are required.");
      return;
    }

    setSaving(true);

    try {
      // Save product first
      const url = productData.id
        ? `/api/admin/products/${productData.id}`
        : "/api/admin/products";
      const method = productData.id ? "PUT" : "POST";

      const productRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!productRes.ok) {
        const error = await productRes.json();
        toast.error(error.message || "Failed to save product.");
        return;
      }

      const savedProduct = await productRes.json();
      const productId = savedProduct.product.id;

      // Save images (unchanged)
      for (const img of productImages) {
        if (!img.file && !img.id) continue;

        const formData = new FormData();
        if (img.variantId) formData.append("variantId", img.variantId);
        formData.append("altText", img.altText || "");
        formData.append("displayOrder", img.displayOrder?.toString() || "0");
        formData.append("isPrimary", String(img.isPrimary || false));
        if (img.file) formData.append("image", img.file);

        const endpoint = img.id
          ? `/api/admin/products/images/${img.id}`
          : "/api/admin/products/images";

        if (!img.id) formData.append("productId", productId);

        const res = await fetch(endpoint, {
          method: img.id ? "PUT" : "POST",
          body: formData,
        });
        if (!res.ok) console.error("Failed to save image:", await res.json());
      }

      // ------------------ SAVE VARIANTS ------------------
      for (const variant of variants) {
        if (!variant.name || !variant.sku) continue;

        if (variant.id) {
          // Update existing variant
          const res = await fetch(
            `/api/admin/products/variants/${variant.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...variant, productId }),
            }
          );
          if (!res.ok)
            console.error("Failed to update variant:", await res.json());
        } else {
          // Create new variant
          const res = await fetch("/api/admin/products/variants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...variant, productId }),
          });
          if (!res.ok)
            console.error("Failed to create variant:", await res.json());
        }
      }

      toast.success(
        productData.id
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      onSave(savedProduct.product, productImages, variants);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  // ---------------------- RENDER ----------------------
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

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("product")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "product"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Product
        </button>
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "images"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab("variants")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "variants"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          Variants
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === "product" && (
          <ProductForm product={productData} onChange={updateProductField} />
        )}

        {/* Image form */}
        {activeTab === "images" && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium mb-2">Product Images</h4>
            <ProductImagesForm
              images={productImages}
              onChange={updateImageField}
              onAdd={addNewImage}
              onRemove={confirmRemoveImage}
            />
          </div>
        )}

        {/* Variant form */}
        {activeTab === "variants" && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium mb-2">Product Variants</h4>
            <ProductVariantForm
              variants={variants}
              onChange={updateVariantField}
              onAdd={addNewVariant}
              onRemove={confirmRemoveVariant}
              // onSave={saveVariantsOnly}
            />
          </div>
        )}
      </div>

      {/* IMAGE DELETE DIALOG */}
      <AlertDialog
        open={deleteImageIndex !== null}
        onOpenChange={() => setDeleteImageIndex(null)}
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
            <AlertDialogAction
              onClick={removeImageConfirmed}
              disabled={isDeletingImage}
            >
              {isDeletingImage ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* VARIANT DELETE DIALOG */}
      <AlertDialog
        open={deleteVariantIndex !== null}
        onOpenChange={() => setDeleteVariantIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this variant? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeVariantConfirmed}
              disabled={isDeletingVariant}
            >
              {isDeletingVariant ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
