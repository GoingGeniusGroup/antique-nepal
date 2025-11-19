import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { variantSchema } from "@/app/validations/product/variant/variant-schema";
import { revalidateTag } from "next/cache";
import { getVariantsByProductId } from "@/lib/data/variants";

// CREATE VARIANT
export async function POST(req: Request) {
  try {
    const json = await req.json();

    const parsed = variantSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const variant = await prisma.productVariant.create({ data });

    // Revalidate cache for this product's variants
    revalidateTag(`variants-${data.productId}`, "default");
    revalidateTag("variants", "default"); // Also revalidate general variants cache

    return NextResponse.json({ variant }, { status: 201 });
  } catch (error) {
    console.error("Error creating variant:", error);
    return NextResponse.json(
      { message: "Failed to create variant" },
      { status: 500 }
    );
  }
}

// GET VARIANTS BY PRODUCT ID
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    const variants = await getVariantsByProductId(productId);

    return NextResponse.json({ variants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json(
      { message: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}
