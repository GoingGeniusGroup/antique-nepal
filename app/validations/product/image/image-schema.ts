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
  altText: z.string().optional().nullable(),
  displayOrder: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? Number(val) : undefined)),
  isPrimary: z
    .string()
    .optional()
    .nullable()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  variantId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
});
