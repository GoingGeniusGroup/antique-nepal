import z from "zod";

export const productImageSchema = z.object({
  productId: z.string().nonempty("productId is required"),
  variantId: z.string().optional().nullable(),
  altText: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
  isPrimary: z.coerce.boolean().default(false),
});

export const updateImageSchema = z.object({
  url: z.string().min(1).optional(),
  altText: z.string().optional().nullable(),
  displayOrder: z.coerce.number().optional(),
  isPrimary: z.coerce.boolean().optional(),
  variantId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
});

export const productImagesSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().min(1, "Image URL is required"),
      variantId: z.string().optional().nullable(),
      altText: z.string().optional().nullable(),
      displayOrder: z.coerce.number().default(0),
      isPrimary: z.boolean().default(false),
    })
  ),
});
