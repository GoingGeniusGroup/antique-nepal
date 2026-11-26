import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/admin-api-auth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (admin.response) return admin.response;

  const { id } = await context.params;

  try {
    const existing = await prisma.review.findUnique({
      where: { id },
      select: { productId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({
      where: { id },
    });
    revalidateTag("products", "max");
    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${existing.productId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to delete review", { status: 500 });
  }
}
