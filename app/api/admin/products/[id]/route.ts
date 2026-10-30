import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateProductSchema } from "@/app/validations/product/product-schema";
import { ZodError } from "zod";
import { deleteUploadcareFile } from "@/lib/uploadCare";
import { revalidateTag } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID missing" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const data = UpdateProductSchema.parse(body);

    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
    });
    revalidateTag("products", { expire: 0 });
    return NextResponse.json(
      { success: true, product: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product update error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product and related images
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete images from Uploadcare
    for (const img of existing.images) {
      try {
        if (img.url) {
          await deleteUploadcareFile(img.url);
          console.log("✅ Deleted from Uploadcare:", img.url);
        }
      } catch (err) {
        console.warn("⚠️ Failed to delete from Uploadcare:", img.url, err);
      }
    }

    // Delete image records from DB
    await prisma.productImage.deleteMany({ where: { productId: id } });

    // Delete product record
    await prisma.product.delete({ where: { id } });
    revalidateTag("products", { expire: 0 });

    return NextResponse.json({
      success: true,
      message: "✅ Product and associated images deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Product delete error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
