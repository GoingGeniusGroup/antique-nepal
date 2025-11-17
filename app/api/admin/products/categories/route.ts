import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    });
    return NextResponse.json({ categories });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, categoryIds } = await req.json();

    if (!productId || !Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: "Missing productId or categoryIds" },
        { status: 400 }
      );
    }

    // Delete old relations
    await prisma.productCategory.deleteMany({ where: { productId } });

    // Create new relations
    await prisma.productCategory.createMany({
      data: categoryIds.map((categoryId: string) => ({
        productId,
        categoryId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Categories assigned successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to assign categories" },
      { status: 500 }
    );
  }
}
