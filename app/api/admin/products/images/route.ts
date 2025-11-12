// app/api/admin/products/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { productImageSchema } from "@/app/validations/product/image/image-schema";
import { uploadcare } from "@/lib/uploadCare";

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
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File | null;
    console.log(
      "File received:",
      file ? `${file.name} (${file.size} bytes)` : "No file"
    );

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file is required",
        },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Uploadcare
    console.log("Converting file to buffer...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`Buffer created: ${buffer.length} bytes`);

    // Upload to Uploadcare with buffer and filename
    console.log("Uploading to Uploadcare...");
    const uploaded = await uploadcare.uploadFile(buffer, {
      fileName: file.name,
      contentType: file.type,
    });

    const uuid = uploaded.uuid;
    const fileName = file.name;

    // Your custom Uploadcare CDN domain (from your Uploadcare dashboard)
    const UPLOADCARE_CDN_BASE = "https://6bbzdfr35c.ucarecd.net";

    const imageUrl = `${UPLOADCARE_CDN_BASE}/${uuid}/${fileName}`;

    // Save to database
    console.log("Saving to database...");
    const newImage = await prisma.productImage.create({
      data: {
        url: imageUrl,
        productId: parsed.data.productId,
        variantId: parsed.data.variantId,
        altText: parsed.data.altText || "",
        displayOrder: parsed.data.displayOrder || 0,
        isPrimary: parsed.data.isPrimary || false,
      },
    });

    console.log("✅ Image created successfully:", newImage.id);

    return NextResponse.json(
      {
        success: true,
        data: newImage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("⚠️ Server Error:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
        message: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
