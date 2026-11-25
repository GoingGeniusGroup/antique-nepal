import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";

const reviewStatusSchema = z.object({
  status: z.enum(["APPROVED", "PENDING"]),
});

type ReviewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: ReviewRouteContext) {
  const admin = await requireAdminApi();
  if (admin.response) return admin.response;

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = reviewStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Status must be APPROVED or PENDING" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.review.findUnique({
      where: { id },
      select: { productId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    revalidateTag("reviews", { expire: 0 });
    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${existing.productId}`);

    return NextResponse.json(review);
  } catch (error) {
    console.error("PATCH /api/admin/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update review status" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: ReviewRouteContext) {
  const admin = await requireAdminApi();
  if (admin.response) return admin.response;

  const { id } = await params;
  try {
    const existing = await prisma.review.findUnique({
      where: { id },
      select: { productId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });
    revalidateTag("reviews", { expire: 0 });
    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${existing.productId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
