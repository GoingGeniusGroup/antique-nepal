import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const brand = await prisma.footerBrand.findFirst({
      where: { isActive: true },
    });
    return NextResponse.json(brand || {});
  } catch (error) {
    console.error("Error fetching footer brand:", error);
    return NextResponse.json({ error: "Failed to fetch footer brand" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Deactivate all existing brands
    await prisma.footerBrand.updateMany({
      data: { isActive: false },
    });
    
    // Create or update the brand
    const brand = await prisma.footerBrand.create({
      data: {
        name: body.name,
        logo: body.logo,
        tagline: body.tagline,
        description: body.description,
        isActive: true,
      },
    });
    
    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error creating footer brand:", error);
    return NextResponse.json({ error: "Failed to create footer brand" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // Find the active brand
    const existingBrand = await prisma.footerBrand.findFirst({
      where: { isActive: true },
    });
    
    if (!existingBrand) {
      // Create new if none exists
      await prisma.footerBrand.updateMany({
        data: { isActive: false },
      });
      
      const brand = await prisma.footerBrand.create({
        data: {
          name: body.name,
          logo: body.logo,
          tagline: body.tagline,
          description: body.description,
          isActive: true,
        },
      });
      
      return NextResponse.json(brand);
    }
    
    const brand = await prisma.footerBrand.update({
      where: { id: existingBrand.id },
      data: {
        name: body.name,
        logo: body.logo,
        tagline: body.tagline,
        description: body.description,
      },
    });
    
    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error updating footer brand:", error);
    return NextResponse.json({ error: "Failed to update footer brand" }, { status: 500 });
  }
}
