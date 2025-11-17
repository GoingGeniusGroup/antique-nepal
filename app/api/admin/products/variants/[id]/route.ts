import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { variantUpdateSchema } from "@/app/validations/product/variant/variant-schema";

// UPDATE VARIANT
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await req.json();
    const parsed = variantUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.productVariant.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ updated });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update variant" },
      { status: 500 }
    );
  }
}

// DELETE VARIANT
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.productVariant.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Variant deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting variant:", error);
    return NextResponse.json(
      { message: "Failed to delete variant" },
      { status: 500 }
    );
  }
}
