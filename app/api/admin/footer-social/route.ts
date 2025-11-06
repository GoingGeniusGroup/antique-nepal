import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const socials = await prisma.footerSocial.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(socials);
  } catch (error) {
    console.error("Error fetching footer socials:", error);
    return NextResponse.json({ error: "Failed to fetch footer socials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const social = await prisma.footerSocial.create({
      data: {
        name: body.name,
        icon: body.icon,
        href: body.href,
        displayOrder: body.displayOrder || 0,
        isActive: body.isActive ?? true,
      },
    });
    
    return NextResponse.json(social);
  } catch (error) {
    console.error("Error creating footer social:", error);
    return NextResponse.json({ error: "Failed to create footer social" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    console.log("=== FOOTER SOCIAL PATCH ===");
    console.log("Incoming body:", JSON.stringify(body, null, 2));
    
    // Batch update all socials
    if (Array.isArray(body)) {
      // Get all existing socials
      const existingSocials = await prisma.footerSocial.findMany();
      const existingIds = existingSocials.map(s => s.id);
      const incomingIds = body.filter(s => s.id).map(s => s.id);
      
      console.log("Existing IDs in DB:", existingIds);
      console.log("Incoming IDs:", incomingIds);
      
      // Find IDs to delete (exist in DB but not in incoming data)
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      
      console.log("IDs to DELETE:", idsToDelete);
      
      // Prepare operations
      const operations = [];
      
      // Delete removed socials
      if (idsToDelete.length > 0) {
        console.log("Adding delete operation for:", idsToDelete);
        operations.push(
          prisma.footerSocial.deleteMany({
            where: { id: { in: idsToDelete } }
          })
        );
      }
      
      // Upsert all incoming socials
      body.forEach((social) => {
        operations.push(
          prisma.footerSocial.upsert({
            where: { id: social.id || 'new-' + Math.random().toString(36).substr(2, 9) },
            update: {
              name: social.name,
              icon: social.icon,
              href: social.href,
              displayOrder: social.displayOrder || 0,
              isActive: social.isActive ?? true,
            },
            create: {
              name: social.name,
              icon: social.icon,
              href: social.href,
              displayOrder: social.displayOrder || 0,
              isActive: social.isActive ?? true,
            },
          })
        );
      });
      
      console.log("Executing transaction with", operations.length, "operations");
      const results = await prisma.$transaction(operations);
      console.log("Transaction completed successfully");
      console.log("=== END FOOTER SOCIAL PATCH ===");
      
      return NextResponse.json({ success: true, results });
    }
    
    // Single update
    const social = await prisma.footerSocial.update({
      where: { id: body.id },
      data: {
        name: body.name,
        icon: body.icon,
        href: body.href,
        displayOrder: body.displayOrder,
        isActive: body.isActive,
      },
    });
    
    return NextResponse.json(social);
  } catch (error) {
    console.error("Error updating footer social:", error);
    return NextResponse.json({ error: "Failed to update footer social" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    await prisma.footerSocial.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting footer social:", error);
    return NextResponse.json({ error: "Failed to delete footer social" }, { status: 500 });
  }
}
