import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Public API route to fetch all footer data
 * Used by the landing page Footer component
 */
export async function GET() {
  try {
    const [brand, socials, contact, newsletter, sections] = await Promise.all([
      prisma.footerBrand.findFirst({
        where: { isActive: true },
      }),
      prisma.footerSocial.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.footerContact.findFirst({
        where: { isActive: true },
      }),
      prisma.footerNewsletter.findFirst({
        where: { isActive: true },
      }),
      prisma.footerSection.findMany({
        where: { isActive: true },
        include: {
          links: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({
      brand: brand || null,
      socials: socials || [],
      contact: contact || null,
      newsletter: newsletter || null,
      sections: sections || [],
    });
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return NextResponse.json(
      { error: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}
