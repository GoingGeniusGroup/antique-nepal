import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import db from "@/lib/prisma";

const ALLOWED_CATEGORIES = ["tops", "kurthi set", "cord set", "sweater", "hand bags"] as const;

const productImageSchema = z
  .string()
  .trim()
  .optional()
  .refine((image) => {
    if (!image) return true;
    if (image.startsWith("/images/")) {
      try {
        const segments = image.slice("/images/".length).split("/");
        return segments.every((segment) => {
          const decoded = decodeURIComponent(segment);
          return (
            decoded.length > 0 &&
            decoded !== "." &&
            decoded !== ".." &&
            !/[\/\\?#]/.test(decoded)
          );
        });
      } catch {
        return false;
      }
    }

    try {
      const url = new URL(image);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Image must be an HTTP(S) URL or a local /images/... path");

const productRowSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  sku: z.string().trim().min(1, "SKU is required"),
  category: z.string().trim().toLowerCase().pipe(z.enum(ALLOWED_CATEGORIES)),
  description: z.string().optional(),
  image: productImageSchema,
});

const bulkImportSchema = z.array(productRowSchema);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = bulkImportSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.issues[0]?.message ?? "Invalid product data",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const itemsBySku = new Map<string, (typeof validation.data)[number]>();
    for (const item of validation.data) {
      if (!itemsBySku.has(item.sku)) {
        itemsBySku.set(item.sku, item);
      }
    }
    const items = [...itemsBySku.values()];
    const productsToImport = items.map((item) => {
      const baseSlug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

      return {
        item,
        slug: uniqueSlug,
      };
    });

    const uniqueCategories = [
      ...new Set(items.map((item) => item.category)),
    ];

    const result = await db.$transaction(async (tx) => {
      const categories = await Promise.all(
        uniqueCategories.map((categoryName) => {
          const categorySlug = categoryName.replace(/[^a-z0-9]+/g, "-");
          return tx.category.upsert({
            where: { slug: categorySlug },
            create: { name: categoryName, slug: categorySlug },
            update: {},
            select: { id: true, slug: true },
          });
        })
      );
      const categoryIdsBySlug = new Map(
        categories.map((category) => [category.slug, category.id])
      );

      const products = await Promise.all(
        productsToImport.map(({ item, slug }) =>
          tx.product.upsert({
            where: { sku: item.sku },
            create: {
              name: item.title,
              slug,
              price: item.price,
              stockQuantity: item.stock,
              sku: item.sku,
              description: item.description,
              image: item.image || null,
              isActive: true,
            },
            update: {
              name: item.title,
              price: item.price,
              stockQuantity: item.stock,
              description: item.description,
              ...(item.image ? { image: item.image } : {}),
              isActive: true,
            },
            select: { id: true, sku: true },
          })
        )
      );

      const variants = await Promise.all(
        products.map(async (product) => {
          const item = itemsBySku.get(product.sku)!;
          const variant = await tx.productVariant.upsert({
            where: { sku: item.sku },
            create: {
              productId: product.id,
              sku: item.sku,
              name: "Default",
              price: item.price,
              isActive: true,
            },
            update: {
              productId: product.id,
              name: "Default",
              price: item.price,
              isActive: true,
            },
            select: { id: true },
          });

          await tx.inventory.upsert({
            where: { productVariantId: variant.id },
            create: {
              productVariantId: variant.id,
              quantity: item.stock,
            },
            update: { quantity: item.stock },
          });

          return { product, item };
        })
      );

      await Promise.all(
        variants.map(async ({ product, item }) => {
          if (!item.image) return;

          const primaryImage = await tx.productImage.findFirst({
            where: { productId: product.id, isPrimary: true },
            select: { id: true },
          });

          if (primaryImage) {
            await tx.productImage.update({
              where: { id: primaryImage.id },
              data: { url: item.image, altText: item.title },
            });
          } else {
            await tx.productImage.create({
              data: {
                productId: product.id,
                url: item.image,
                altText: item.title,
                isPrimary: true,
              },
            });
          }
        })
      );

      if (variants.length > 0) {
        await tx.productCategory.createMany({
          data: variants.map(({ product, item }) => ({
            productId: product.id,
            categoryId: categoryIdsBySlug.get(
              item.category.replace(/[^a-z0-9]+/g, "-")
            )!,
          })),
          skipDuplicates: true,
        });
      }

      return products.length;
    }, { maxWait: 10_000, timeout: 30_000 });

    revalidateTag("products", { expire: 0 });
    return NextResponse.json({
      success: true,
      count: result,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}