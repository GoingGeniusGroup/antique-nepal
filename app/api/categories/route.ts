import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true }, // only active categories
      orderBy: { displayOrder: "asc" }, // order by displayOrder
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        displayOrder: true,
        _count: { select: { products: true } }, // count the products
      },
    });

    // Map the count to a simpler property for frontend
    const formatted = categories.map((cat) => ({
      ...cat,
      count: cat._count.products,
    }));

    return new Response(JSON.stringify(formatted), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch categories" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
