import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

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

//fetch
export async function GET(req: Request) {
  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") || 1);
  const pageSize = Number(url.searchParams.get("pageSize") || 10);

  const sort = url.searchParams.get("sort") || "createdAt";
  const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";

  const search = url.searchParams.get("q") || "";

  const whereClause = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { comment: { contains: search, mode: "insensitive" as const } },
          {
            user: { name: { contains: search, mode: "insensitive" as const } },
          },
          {
            user: { email: { contains: search, mode: "insensitive" as const } },
          },
          {
            product: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  let orderByClause: Prisma.ReviewOrderByWithRelationInput;
  if (sort === "product") {
    orderByClause = { product: { name: order } };
  } else {
    orderByClause = { [sort]: order };
  }
  const reviews = await prisma.review.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderByClause,
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } },
    },
  });

  const total = await prisma.review.count({
    where: whereClause,
  });

  return NextResponse.json({
    data: reviews,
    total,
    page,
    pageSize,
  });
}
