import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const createAddressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]).default("BOTH"),
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(100),
  isDefault: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = createAddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid address details" },
        { status: 400 }
      );
    }

    const address = await prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId } });
      const isDefault = parsed.data.isDefault || addressCount === 0;

      if (isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          ...parsed.data,
          addressLine2: parsed.data.addressLine2 || null,
          isDefault,
          userId,
        },
        select: {
          id: true,
          type: true,
          fullName: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
          isDefault: true,
        },
      });
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Failed to create address:", error);
    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 }
    );
  }
}
