// app/api/admin/products/images/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateImageSchema } from "@/app/validations/product/image/image-schema";
import { deleteUploadcareFile } from "@/lib/uploadCare";
import { revalidateTag } from "next/cache";

// UPDATE IMAGE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = await context;
  const { id } = await params;
  console.log("Id:", id);

  try {
    const parsed = updateImageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.productImage.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const updatedImage = await prisma.productImage.update({
      where: { id },
      data: {
        url: parsed.data.url ?? undefined,
        productId: parsed.data.productId || undefined,
        variantId: parsed.data.variantId ?? undefined,
        altText: parsed.data.altText ?? undefined,
        displayOrder: parsed.data.displayOrder ?? undefined,
        isPrimary: parsed.data.isPrimary ?? undefined,
      },
    });
    revalidateTag("products", { expire: 0 });
    revalidateTag("featured-products", { expire: 0 });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update image", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE IMAGE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = await context;
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Image ID is required" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.productImage.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Uploadcare
    if (existing.url) {
      await deleteUploadcareFile(existing.url);
      console.log("✅ Deleted from Uploadcare:", existing.url);
    }

    // Delete from database
    await prisma.productImage.delete({ where: { id } });
    revalidateTag("products", { expire: 0 });
    revalidateTag("featured-products", { expire: 0 });

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete image", details: error.message },
      { status: 500 }
    );
  }
}
