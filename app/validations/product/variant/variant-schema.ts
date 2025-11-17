import { z } from "zod";

export const variantSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be positive").optional().nullable(),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
});

// For PATCH (partial update allowed)
export const variantUpdateSchema = variantSchema.partial();
