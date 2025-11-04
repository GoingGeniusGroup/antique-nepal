import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be positive"),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
