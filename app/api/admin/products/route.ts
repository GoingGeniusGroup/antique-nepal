import { NextRequest, NextResponse } from "next/server";
import { AddProductSchema } from "@/app/validations/product/product-schema";
import { ZodError } from "zod";
import { getProducts } from "@/lib/data/products";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// Fetch all products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 10), 100);
  const q = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "createdAt";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const result = await getProducts({ page, pageSize, q, sort, order });

  return NextResponse.json(result);
}

// Create Products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = AddProductSchema.parse(body);

    const slug = generateSlug(data.name);

    // Check duplicate slug or sku
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ sku: data.sku }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with this slug or SKU already exists",
        },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
      },
    });

    // Revalidate the products cache
    revalidateTag("products", "default");

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
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

// Helper to generate slug
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
