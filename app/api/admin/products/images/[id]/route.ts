import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
import { updateImageSchema } from "@/app/validations/product/image/image-schema";

//UPDATE IMAGE
export async function PUT(req: NextRequest, context: any) {
  const { params } = await context;
  const { id } = await params;
  console.log("Id:", id);

  try {
    const formData = await req.formData();

    const fields = {
      productId: formData.get("productId") as string | null,
      variantId: formData.get("variantId") as string | null,
      altText: formData.get("altText") as string | null,
      displayOrder: formData.get("displayOrder") as string | null,
      isPrimary: formData.get("isPrimary") as string | null,
    };

    const parsed = updateImageSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File | null;
    let newUrl: string | undefined;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      newUrl = `/uploads/${filename}`;

      // Delete old file
      const existing = await prisma.productImage.findUnique({ where: { id } });
      if (existing?.url) {
        const oldPath = path.join(process.cwd(), "public", existing.url);
        if (fs.existsSync(oldPath)) await unlink(oldPath);
      }
    }

    const updatedImage = await prisma.productImage.update({
      where: { id },
      data: {
        productId: parsed.data.productId || undefined,
        variantId: parsed.data.variantId ?? undefined,
        altText: parsed.data.altText ?? undefined,
        displayOrder: parsed.data.displayOrder ?? undefined,
        isPrimary: parsed.data.isPrimary ?? undefined,
        ...(newUrl && { url: newUrl }),
      },
    });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error: any) {
    console.error("⚠️ PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update image", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE IMAGE
export async function DELETE(req: NextRequest, context: any) {
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

    if (existing.url) {
      const filePath = path.join(process.cwd(), "public", existing.url);
      if (fs.existsSync(filePath)) await unlink(filePath);
    }

    await prisma.productImage.delete({ where: { id } });

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("⚠️ DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete image", details: error.message },
      { status: 500 }
    );
  }
}
