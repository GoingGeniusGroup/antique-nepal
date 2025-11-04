import z from "zod";

export const productImageSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().optional().nullable(),
  altText: z.string().optional().nullable(),
  displayOrder: z
    .string()
    .transform((val) => (val ? Number(val) : 0))
    .optional()
    .nullable(),
  isPrimary: z
    .string()
    .transform((val) => val === "true")
    .optional()
    .nullable(),
});

export const updateImageSchema = z.object({
  id: z.string().nonempty(),
  url: z.string().url().optional(),
  altText: z.string().optional(),
  displayOrder: z.number().optional(),
  isPrimary: z.boolean().optional(),
});
