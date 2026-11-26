import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma, ReviewStatus } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-api-auth";

const reviewContentSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(120),
  comment: z.string().trim().min(1).max(3000),
});

const reviewSubmissionSchema = reviewContentSchema.extend({
  productId: z.string().trim().min(1),
});

const reviewIdSchema = z.object({
  reviewId: z.string().trim().min(1),
});

const reviewSortSchema = z.enum([
  "createdAt",
  "rating",
  "status",
  "product",
]);

// create
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = reviewSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a rating from 1 to 5, a title, and a comment." },
      { status: 400 }
    );
  }

  const { productId, rating, title, comment } = parsed.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: { productId, userId: session.user.id },
      },
      select: { id: true },
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted a review for this product." },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
        title,
      },
      include: { user: { select: { name: true } } },
    });
    revalidateTag("products", "max");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/admin/reviews");
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You have already submitted a review for this product." },
        { status: 409 }
      );
    }
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// update
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("reviewId" in body) ||
    typeof body.reviewId !== "string" ||
    !body.reviewId
  ) {
    return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
  }

  const parsed = reviewContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a rating from 1 to 5, a title, and a comment." },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.review.findUnique({
      where: { id: body.reviewId },
    });

    if (!existing)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    if (existing.userId !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await prisma.review.update({
      where: { id: body.reviewId },
      data: parsed.data,
      include: { user: { select: { name: true } } },
    });
    revalidateTag("products", "max");
    revalidatePath(`/products/${existing.productId}`);
    revalidatePath("/admin/reviews");
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = reviewIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.review.findUnique({
      where: { id: parsed.data.reviewId },
    });

    if (!existing)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    if (existing.userId !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.review.delete({ where: { id: parsed.data.reviewId } });
    revalidateTag("products", "max");
    revalidatePath(`/products/${existing.productId}`);
    revalidatePath("/admin/reviews");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//fetch
async function fetchReviews({
  page,
  pageSize,
  sort,
  order,
  search,
}: {
  page: number;
  pageSize: number;
  sort: z.infer<typeof reviewSortSchema>;
  order: "asc" | "desc";
  search: string;
}) {
  const searchTerm = search.trim();
  const matchingStatus = Object.values(ReviewStatus).find(
    (status) => status.toLowerCase() === searchTerm.toLowerCase()
  );
  const whereClause: Prisma.ReviewWhereInput = searchTerm
    ? {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { comment: { contains: searchTerm, mode: "insensitive" } },
          {
            user: { name: { contains: searchTerm, mode: "insensitive" } },
          },
          {
            user: {
              email: { contains: searchTerm, mode: "insensitive" },
            },
          },
          {
            product: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
          ...(matchingStatus ? [{ status: matchingStatus }] : []),
        ],
      }
    : {};

  const orderByClause: Prisma.ReviewOrderByWithRelationInput =
    sort === "product" ? { product: { name: order } } : { [sort]: order };

  const total = await prisma.review.count({ where: whereClause });
  const effectivePage = Math.min(
    page,
    Math.max(1, Math.ceil(total / pageSize))
  );
  const reviews = await prisma.review.findMany({
    skip: (effectivePage - 1) * pageSize,
    take: pageSize,
    orderBy: orderByClause,
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } },
    },
  });

  return { reviews, total, page: effectivePage };
}

export async function GET(req: Request) {
  const admin = await requireAdminApi();
  if (admin.response) return admin.response;

  const url = new URL(req.url);
  const requestedPage = Number(url.searchParams.get("page") || 1);
  const requestedPageSize = Number(url.searchParams.get("pageSize") || 10);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const pageSize =
    Number.isSafeInteger(requestedPageSize) && requestedPageSize > 0
      ? Math.min(requestedPageSize, 50)
      : 10;
  const parsedSort = reviewSortSchema.safeParse(url.searchParams.get("sort"));
  const sort = parsedSort.success ? parsedSort.data : "createdAt";
  const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
  const search = url.searchParams.get("q") || "";

  const { reviews, total, page: effectivePage } = await fetchReviews({
    page,
    pageSize,
    sort,
    order,
    search,
  });

  return NextResponse.json({
    data: reviews,
    total,
    page: effectivePage,
    pageSize,
  });
}
