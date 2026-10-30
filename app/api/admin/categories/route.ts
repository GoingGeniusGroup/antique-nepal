import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// Fetch all categories
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 10), 100);
  const q = (searchParams.get("q") || "").trim();
  const sort = searchParams.get("sort") || "createdAt";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const where: Prisma.CategoryWhereInput | undefined = q
    ? {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
        _count: {
          select: { products: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ page, pageSize, total, data });
}

// Create Category
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string | null;
        const imageFile = formData.get("image") as File | null;

        if (!name || !slug) {
            return NextResponse.json({ success: false, message: "Name and slug are required" }, { status: 400 });
        }

        // Check duplicate slug
        const existing = await prisma.category.findFirst({
            where: { slug },
        });

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category with this slug already exists",
                },
                { status: 400 }
            );
        }

        let imageUrl: string | undefined;
        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), "public/catimage");
            await mkdir(uploadDir, { recursive: true }); // Ensure directory exists
            const filename = `${Date.now()}-${imageFile.name}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            imageUrl = `/catimage/${filename}`;
        }

        // Create category
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image: imageUrl,
            },
        });
        return NextResponse.json({ success: true, category }, { status: 201 });
    } catch (error) {
        console.error("Category create error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

// Update Category
export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string | null;
        const imageFile = formData.get("image") as File | null;

        if (!name || !slug) {
            return NextResponse.json({ success: false, message: "Name and slug are required" }, { status: 400 });
        }

        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
        }

        if (slug !== existing.slug) {
            const duplicate = await prisma.category.findFirst({ where: { slug } });
            if (duplicate) {
                return NextResponse.json({ success: false, message: "Slug is already in use" }, { status: 400 });
            }
        }

        let imageUrl: string | undefined = existing.image || undefined;
        if (imageFile) {
            if (existing.image) {
                const oldImagePath = path.join(process.cwd(), "public", existing.image);
                try { await unlink(oldImagePath); } catch (err) { console.error("Failed to delete old image:", err); }
            }

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), "public/catimage");
            await mkdir(uploadDir, { recursive: true });
            const filename = `${Date.now()}-${imageFile.name}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            imageUrl = `/catimage/${filename}`;
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name, slug, description, image: imageUrl },
        });

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error(`Category update error:`, error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// Delete Category
export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
        }

        const existing = await prisma.category.findUnique({
            where: { id },
            include: { children: true } 
        });
        if (!existing) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
        }

        await prisma.$transaction(async (tx) => {
            if (existing.children.length > 0) {
                await tx.category.updateMany({ where: { parentId: id }, data: { parentId: null } });
            }
            await tx.productCategory.deleteMany({ where: { categoryId: id } });
            await tx.category.delete({ where: { id } });
        });

        if (existing.image) {
            const imagePath = path.join(process.cwd(), "public", existing.image);
            try { await unlink(imagePath); } catch (err) { console.error("Failed to delete image file:", err); }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Category delete error:`, error);
        let errorMessage = "Server error during category deletion.";
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            errorMessage = `Database error: ${error.code}. ${error.meta?.cause || 'No specific cause provided.'}`;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}
