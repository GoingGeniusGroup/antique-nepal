import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.footerSection.findMany({
      where: { isActive: true },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching footer sections:", error);
    return NextResponse.json({ error: "Failed to fetch footer sections" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const section = await prisma.footerSection.create({
      data: {
        title: body.title,
        displayOrder: body.displayOrder || 0,
        isActive: body.isActive ?? true,
      },
    });
    
    return NextResponse.json(section);
  } catch (error) {
    console.error("Error creating footer section:", error);
    return NextResponse.json({ error: "Failed to create footer section" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // Batch update sections with their links
    if (Array.isArray(body)) {
      // Get all existing sections
      const existingSections = await prisma.footerSection.findMany();
      const existingIds = existingSections.map(s => s.id);
      const incomingIds = body.filter(s => s.id).map(s => s.id);
      
      // Find IDs to delete (exist in DB but not in incoming data)
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      
      // Delete removed sections (will cascade delete links)
      if (idsToDelete.length > 0) {
        await prisma.footerSection.deleteMany({
          where: { id: { in: idsToDelete } }
        });
      }
      
      const results = [];
      
      for (const section of body) {
        // Upsert section
        const upsertedSection = await prisma.footerSection.upsert({
          where: { id: section.id || 'new-' + section.title },
          update: {
            title: section.title,
            displayOrder: section.displayOrder || 0,
            isActive: section.isActive ?? true,
          },
          create: {
            title: section.title,
            displayOrder: section.displayOrder || 0,
            isActive: section.isActive ?? true,
          },
        });
        
        // Handle links if provided
        if (section.links && Array.isArray(section.links)) {
          // Delete existing links not in the new list
          const linkIds = section.links.filter((l: any) => l.id).map((l: any) => l.id);
          await prisma.footerLink.deleteMany({
            where: {
              sectionId: upsertedSection.id,
              id: { notIn: linkIds },
            },
          });
          
          // Upsert each link
          for (const link of section.links) {
            await prisma.footerLink.upsert({
              where: { id: link.id || 'new-' + link.name },
              update: {
                name: link.name,
                href: link.href,
                displayOrder: link.displayOrder || 0,
                isActive: link.isActive ?? true,
              },
              create: {
                sectionId: upsertedSection.id,
                name: link.name,
                href: link.href,
                displayOrder: link.displayOrder || 0,
                isActive: link.isActive ?? true,
              },
            });
          }
        }
        
        // Fetch the complete section with links
        const completeSection = await prisma.footerSection.findUnique({
          where: { id: upsertedSection.id },
          include: {
            links: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
        });
        
        results.push(completeSection);
      }
      
      return NextResponse.json(results);
    }
    
    // Single section update
    const section = await prisma.footerSection.update({
      where: { id: body.id },
      data: {
        title: body.title,
        displayOrder: body.displayOrder,
        isActive: body.isActive,
      },
      include: {
        links: true,
      },
    });
    
    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating footer section:", error);
    return NextResponse.json({ error: "Failed to update footer section" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    // This will cascade delete all links
    await prisma.footerSection.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting footer section:", error);
    return NextResponse.json({ error: "Failed to delete footer section" }, { status: 500 });
  }
}
