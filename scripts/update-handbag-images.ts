import "dotenv/config";
import { existsSync } from "node:fs";
import path from "node:path";
import prisma from "../lib/prisma";

const applyChanges = process.argv.includes("--apply");
const categoryImage = "/images/products/handbag4.jpg";
const imagePathsByProductName = new Map<string, string[]>([
  ["minimalist tote hand bag", ["/images/products/handbag4.jpg"]],
  [
    "classic leather hand bag",
    [
      "/images/products/handbag1.jpg",
      "/images/products/handbag2.jpg",
      "/images/products/handbag3.jpg",
    ],
  ],
]);

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "hand-bags" },
    select: { id: true, name: true, image: true },
  });
  if (!category) throw new Error('Category "hand-bags" was not found.');

  const products = await prisma.product.findMany({
    where: { categories: { some: { categoryId: category.id } } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stockQuantity: true,
      description: true,
      image: true,
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
          displayOrder: true,
          variantId: true,
        },
      },
    },
  });

  const unmappedProducts = products.filter(
    (product) =>
      !imagePathsByProductName.has(product.name.trim().toLowerCase())
  );
  const imagePaths = [
    categoryImage,
    ...Array.from(imagePathsByProductName.values()).flat(),
  ];

  for (const imagePath of new Set(imagePaths)) {
    const localPath = path.join(
      process.cwd(),
      "public",
      imagePath.slice(1).replace(/\//g, path.sep)
    );
    if (!existsSync(localPath)) {
      throw new Error(`Missing handbag image file: ${imagePath}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: applyChanges ? "apply" : "dry-run",
        category: {
          name: category.name,
          currentImage: category.image,
          newImage: categoryImage,
        },
        products: products.map((product) => ({
          name: product.name,
          sku: product.sku,
          price: Number(product.price),
          stock: product.stockQuantity,
          description: product.description,
          currentScalarImage: product.image,
          currentImageRecords: product.images,
          newImages:
            imagePathsByProductName.get(product.name.trim().toLowerCase()) ??
            [],
        })),
        unmappedProducts: unmappedProducts.map(({ name, sku }) => ({
          name,
          sku,
        })),
      },
      null,
      2
    )
  );

  if (!applyChanges) return;
  if (unmappedProducts.length > 0) {
    throw new Error(
      "Some hand bags products lack an explicit image mapping; no changes were applied."
    );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.category.update({
        where: { id: category.id },
        data: { image: categoryImage },
      });

      for (const product of products) {
        const imagePaths =
          imagePathsByProductName.get(product.name.trim().toLowerCase())!;
        await tx.product.update({
          where: { id: product.id },
          data: { image: imagePaths[0] },
        });
        await tx.productImage.deleteMany({
          where: { productId: product.id },
        });
        await tx.productImage.createMany({
          data: imagePaths.map((url, index) => ({
            productId: product.id,
            url,
            altText: product.name,
            isPrimary: index === 0,
            displayOrder: index,
          })),
        });
      }
    },
    { maxWait: 10_000, timeout: 30_000 }
  );

  const updatedProducts = await prisma.product.findMany({
    where: { categories: { some: { categoryId: category.id } } },
    orderBy: { name: "asc" },
    select: {
      name: true,
      sku: true,
      image: true,
      images: {
        select: { url: true, isPrimary: true, displayOrder: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        categoryImage: categoryImage,
        updatedProducts,
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error("Handbag image update failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
