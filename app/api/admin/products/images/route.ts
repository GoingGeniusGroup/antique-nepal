// app/api/admin/products/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { productImagesSchema } from "@/app/validations/product/image/image-schema";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const parsed = productImagesSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { productId, images } = parsed.data;
    const imageIds = images.flatMap((image) => (image.id ? [image.id] : []));
    const matchingImages = imageIds.length
      ? await prisma.productImage.findMany({
          where: { productId, id: { in: imageIds } },
          select: { id: true },
        })
      : [];

    if (matchingImages.length !== imageIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more images do not belong to this product" },
        { status: 400 }
      );
    }

    const savedImages = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: {
          productId,
          ...(imageIds.length ? { id: { notIn: imageIds } } : {}),
        },
      });

      const results = [];
      for (const image of images) {
        const data = {
          url: image.url,
          variantId: image.variantId ?? null,
          altText: image.altText ?? "",
          displayOrder: image.displayOrder,
          isPrimary: image.isPrimary,
        };

        if (image.id) {
          results.push(
            await tx.productImage.update({
              where: { id: image.id },
              data,
            })
          );
        } else {
          results.push(
            await tx.productImage.create({
              data: { ...data, productId },
            })
          );
        }
      }

      return results;
    });
    revalidateTag("products", { expire: 0 });
    revalidateTag("featured-products", { expire: 0 });

    return NextResponse.json(
      {
        success: true,
        data: savedImages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product image save error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to save product images",
      },
      { status: 500 }
    );
  }
}
