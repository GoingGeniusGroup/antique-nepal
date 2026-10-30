import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const newsletter = await prisma.footerNewsletter.findFirst({
      where: { isActive: true },
    });
    return NextResponse.json(newsletter || {});
  } catch (error) {
    console.error("Error fetching footer newsletter:", error);
    return NextResponse.json({ error: "Failed to fetch footer newsletter" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Deactivate all existing newsletters
    await prisma.footerNewsletter.updateMany({
      data: { isActive: false },
    });
    
    const newsletter = await prisma.footerNewsletter.create({
      data: {
        title: body.title,
        description: body.description,
        isActive: true,
      },
    });
    
    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Error creating footer newsletter:", error);
    return NextResponse.json({ error: "Failed to create footer newsletter" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    const existingNewsletter = await prisma.footerNewsletter.findFirst({
      where: { isActive: true },
    });
    
    if (!existingNewsletter) {
      // Create new if none exists
      await prisma.footerNewsletter.updateMany({
        data: { isActive: false },
      });
      
      const newsletter = await prisma.footerNewsletter.create({
        data: {
          title: body.title,
          description: body.description,
          isActive: true,
        },
      });
      
      return NextResponse.json(newsletter);
    }
    
    const newsletter = await prisma.footerNewsletter.update({
      where: { id: existingNewsletter.id },
      data: {
        title: body.title,
        description: body.description,
      },
    });
    
    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Error updating footer newsletter:", error);
    return NextResponse.json({ error: "Failed to update footer newsletter" }, { status: 500 });
  }
}
