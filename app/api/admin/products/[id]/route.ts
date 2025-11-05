import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateProductSchema } from "@/app/validations/product/product-schema";
import { ZodError } from "zod";
import fs from "fs";
import path from "path";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true }, // fetch linked images
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete physical files
    for (const img of existing.images) {
      const filePath = path.join(process.cwd(), "public/uploads", img.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete image records
    await prisma.productImage.deleteMany({ where: { productId: id } });

    // Delete the product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
