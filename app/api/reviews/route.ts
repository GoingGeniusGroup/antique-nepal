import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// create
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId, rating, comment, title } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
        title, // You can implement this later
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// update
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { reviewId, rating, comment, title } = await req.json();

    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existing)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    if (existing.userId !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment, title },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// delete
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { reviewId } = await req.json();

    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existing)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    if (existing.userId !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
