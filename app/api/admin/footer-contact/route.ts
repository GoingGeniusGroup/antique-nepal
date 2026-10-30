import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contact = await prisma.footerContact.findFirst({
      where: { isActive: true },
    });
    return NextResponse.json(contact || {});
  } catch (error) {
    console.error("Error fetching footer contact:", error);
    return NextResponse.json({ error: "Failed to fetch footer contact" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Deactivate all existing contacts
    await prisma.footerContact.updateMany({
      data: { isActive: false },
    });
    
    const contact = await prisma.footerContact.create({
      data: {
        email: body.email,
        phone: body.phone,
        address: body.address,
        isActive: true,
      },
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error creating footer contact:", error);
    return NextResponse.json({ error: "Failed to create footer contact" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    const existingContact = await prisma.footerContact.findFirst({
      where: { isActive: true },
    });
    
    if (!existingContact) {
      // Create new if none exists
      await prisma.footerContact.updateMany({
        data: { isActive: false },
      });
      
      const contact = await prisma.footerContact.create({
        data: {
          email: body.email,
          phone: body.phone,
          address: body.address,
          isActive: true,
        },
      });
      
      return NextResponse.json(contact);
    }
    
    const contact = await prisma.footerContact.update({
      where: { id: existingContact.id },
      data: {
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating footer contact:", error);
    return NextResponse.json({ error: "Failed to update footer contact" }, { status: 500 });
  }
}
