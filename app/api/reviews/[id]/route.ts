import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.review.delete({
      where: { id },
    });
    revalidateTag("reviews", { expire: 0 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to delete review", { status: 500 });
  }
}
