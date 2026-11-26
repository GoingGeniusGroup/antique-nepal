import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getActiveCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        displayOrder: true,
        _count: { select: { products: true } },
      },
    });

    return categories.map((cat) => ({
      ...cat,
      count: cat._count.products,
    }));
  },
  ["active-storefront-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export async function GET() {
  try {
    const formatted = await getActiveCategories();

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
