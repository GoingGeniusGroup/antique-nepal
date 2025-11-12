// app/api/admin/products/images/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateImageSchema } from "@/app/validations/product/image/image-schema";
import { uploadcare, deleteUploadcareFile } from "@/lib/uploadCare";

// UPDATE IMAGE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // Get existing image to delete old one if replacing
    const existing = await prisma.productImage.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (file) {
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload new image to Uploadcare
      const uploaded = await uploadcare.uploadFile(buffer, {
        fileName: file.name,
        contentType: file.type,
      });

      const newUuid = uploaded.uuid;
      const cdnDomain = "https://6bbzdfr35c.ucarecd.net";
      newUrl = `${cdnDomain}/${newUuid}/${file.name}`;

      console.log("✅ Uploaded to Uploadcare:", newUrl);

      // Delete old image from Uploadcare
      if (existing.url) {
        await deleteUploadcareFile(existing.url);
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
