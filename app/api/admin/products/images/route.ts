import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { productImageSchema } from "@/app/validations/product/image/image-schema";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fields = {
      productId: formData.get("productId") as string,
      variantId: formData.get("variantId") as string | null,
      altText: formData.get("altText") as string | null,
      displayOrder: formData.get("displayOrder") as string | null,
      isPrimary: formData.get("isPrimary") as string | null,
    };

    console.log("📦 Incoming fields:", fields);

    const parsed = productImageSchema.safeParse(fields);

    if (!parsed.success) {
      console.error("❌ Zod Validation Error:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File | null;
    console.log("File:", file);

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const newImage = await prisma.productImage.create({
      data: {
        url: `/uploads/${filename}`,
        productId: parsed.data.productId,
        variantId: parsed.data.variantId,
        altText: parsed.data.altText || "",
        displayOrder: parsed.data.displayOrder || 0,
        isPrimary: parsed.data.isPrimary || false,
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("⚠️ Server Error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: String(error) },
      { status: 500 }
    );
  }
}
