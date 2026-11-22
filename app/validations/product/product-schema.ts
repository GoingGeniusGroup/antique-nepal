import { z } from "zod";

export const AddProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stockQuantity: z.coerce.number().int().nonnegative().optional().default(0),
  lowStockThreshold: z.coerce.number().int().nonnegative().optional().default(5),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
