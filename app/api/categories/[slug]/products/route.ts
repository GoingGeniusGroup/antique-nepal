import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // fetch category with products
    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        products: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                isActive: true,
                images: {
                  select: {
                    url: true, // ✅ matches your schema
                    altText: true, // optional
                    isPrimary: true, // optional
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { category: null, products: [] },
        { status: 404 }
      );
    }

    // flatten products and convert price
    const products = category.products.map((p) => ({
      ...p.product,
      price: Number(p.product.price),
    }));

    return NextResponse.json({ category, products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ category: null, products: [] }, { status: 500 });
  }
}
