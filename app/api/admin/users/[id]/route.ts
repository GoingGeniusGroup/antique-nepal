import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID missing" },
        { status: 400 }
      );
    }

    const { isActive, role } = await req.json();

    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(role && { role }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        role: true,
      },
    });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("User update error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }, // fetch linked images
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete the user
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
