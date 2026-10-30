import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("logo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Logo file is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "sitelogo");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const logoUrl = `/sitelogo/${filename}`;

    const existing = await prisma.siteSetting.findUnique({ where: { key: "general" } });
    let general: any = existing?.value || {};

    if (general.logo && typeof general.logo === "string" && general.logo.startsWith("/sitelogo/")) {
      const oldPath = path.join(process.cwd(), "public", general.logo);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.error("Failed to delete old site logo:", err);
      }
    }

    general.logo = logoUrl;

    await prisma.siteSetting.upsert({
      where: { key: "general" },
      update: { value: general },
      create: { key: "general", value: general },
    });

    return NextResponse.json({ logo: logoUrl });
  } catch (error) {
    console.error("Site logo upload error:", error);
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }
}
