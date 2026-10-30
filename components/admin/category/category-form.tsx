"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import Image from "next/image";

type CategoryData = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
};

type Props = {
  category?: CategoryData | null;
  onSave: (category: CategoryData) => void;
};

export function CategoryForm({ category, onSave }: Props) {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    id: category?.id,
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(category?.image || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryData({
        id: category.id,
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        image: category.image || null,
      });
      setPreviewUrl(category.image || null);
    }
  }, [category]);

  const updateField = (field: keyof CategoryData, value: string | null) => {
    setCategoryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!categoryData.name || !categoryData.slug) {
      toast.error("Name and Slug are required.");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("slug", categoryData.slug);
    formData.append("description", categoryData.description || "");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const url = categoryData.id
        ? `/api/admin/categories?id=${categoryData.id}`
        : "/api/admin/categories";
      const method = categoryData.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const savedCategory = await res.json();
      if (!res.ok) {
        toast.error(savedCategory.message || "Failed to save category.");
        return;
      }

      toast.success(
        categoryData.id
          ? "✅ Category updated successfully!"
          : "✅ Category created successfully!"
      );
      onSave(savedCategory.category);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4 py-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {category ? "Edit Category" : "Add Category"}
        </h3>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={categoryData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g. Handmade Bags"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={categoryData.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="e.g. handmade-bags"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={categoryData.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A short description of the category."
          />
        </div>
        <div>
          <Label htmlFor="image">Category Image</Label>
          <Input id="image" type="file" onChange={handleImageChange} />
          {previewUrl && (
            <div className="mt-4">
              <Image
                src={previewUrl}
                alt="Category preview"
                width={200}
                height={200}
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
