import z from "zod";

export const productImageSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().optional().nullable(),
  altText: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
  isPrimary: z.coerce.boolean().default(false),
});

export const updateImageSchema = z.object({
  altText: z.string().optional().nullable(),
  displayOrder: z.coerce.number().optional(),
  isPrimary: z.coerce.boolean().optional(),
  variantId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
});
