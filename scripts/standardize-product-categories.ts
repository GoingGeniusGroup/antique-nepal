import "dotenv/config";
import { existsSync } from "node:fs";
import path from "node:path";
import prisma from "../lib/prisma";

const applyChanges = process.argv.includes("--apply");
const artisanImage =
  "/catimage/1762757664382-Two%20Weavers%20Engaged%20In%20Traditional%20Crafting%20With%20Looms%20(2).png";

const canonicalCategories = [
  {
    name: "tops",
    slug: "tops",
    image: "/images/products/kurthino7.jpg",
    description: "Everyday tops and single kurthi styles.",
    displayOrder: 1,
  },
  {
    name: "kurthi set",
    slug: "kurthi-set",
    image: "/images/products/kurthaset-8.jpg",
    description: "Coordinated kurthi sets for special occasions.",
    displayOrder: 2,
  },
  {
    name: "cord set",
    slug: "cord-set",
    image: artisanImage,
    description: "Easy-to-wear coordinated sets.",
    displayOrder: 3,
  },
  {
    name: "sweater",
    slug: "sweater",
    image: "/images/products/sweater1.jpg",
    description: "Warm layers for cooler days.",
    displayOrder: 4,
  },
  {
    name: "hand bags",
    slug: "hand-bags",
    image: "/images/products/handbag4.jpg",
    description: "Handcrafted accessories for everyday use.",
    displayOrder: 5,
  },
] as const;

const targetByCategoryName = new Map<string, string>([
  ["tops", "tops"],
  ["kurthi tops", "tops"],
  ["kurthi set", "kurthi set"],
  ["ladies kurtha", "kurthi set"],
  ["cord set", "cord set"],
  ["sweater", "sweater"],
  ["hand bags", "hand bags"],
]);

const normalizeName = (name: string) => name.trim().toLowerCase();

async function main() {
  for (const category of canonicalCategories) {
    const localImagePath = path.join(
      process.cwd(),
      "public",
      decodeURIComponent(category.image.slice(1))
    );
    if (!existsSync(localImagePath)) {
      throw new Error(`Missing local category image: ${category.image}`);
    }
  }

  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: {
          productId: true,
          product: { select: { name: true, sku: true } },
        },
      },
    },
  });

  const keeperByName = new Map<
    string,
    (typeof categories)[number]
  >();
  const keeperIds = new Set<string>();

  for (const canonical of canonicalCategories) {
    const slugMatch = categories.find(
      (category) =>
        category.slug === canonical.slug && !keeperIds.has(category.id)
    );
    const nameMatch = categories.find(
      (category) =>
        normalizeName(category.name) === canonical.name &&
        !keeperIds.has(category.id)
    );
    const keeper = slugMatch ?? nameMatch;
    if (keeper) {
      keeperByName.set(canonical.name, keeper);
      keeperIds.add(keeper.id);
    }
  }

  const reassignments: Array<{
    productName: string;
    sku: string;
    from: string;
    to: string;
  }> = [];
  const unmapped = categories.flatMap((category) => {
    if (keeperIds.has(category.id)) return [];

    const targetName = targetByCategoryName.get(normalizeName(category.name));
    if (targetName) {
      for (const assignment of category.products) {
        reassignments.push({
          productName: assignment.product.name,
          sku: assignment.product.sku,
          from: category.name,
          to: targetName,
        });
      }
      return [];
    }

    return category.products.map((assignment) => ({
      category: category.name,
      productName: assignment.product.name,
      sku: assignment.product.sku,
    }));
  });

  const categoriesToDelete = categories.filter(
    (category) => !keeperIds.has(category.id)
  );
  const categoriesToCreate = canonicalCategories.filter(
    (category) => !keeperByName.has(category.name)
  );

  console.log(
    JSON.stringify(
      {
        mode: applyChanges ? "apply" : "dry-run",
        existingCategories: categories.map((category) => ({
          name: category.name,
          slug: category.slug,
          active: category.isActive,
          products: category.products.map((assignment) => ({
            name: assignment.product.name,
            sku: assignment.product.sku,
          })),
        })),
        categoriesToCreate: categoriesToCreate.map(({ name, slug }) => ({
          name,
          slug,
        })),
        reassignments,
        categoriesToDelete: categoriesToDelete.map(({ name, slug }) => ({
          name,
          slug,
        })),
        unmapped,
      },
      null,
      2
    )
  );

  if (!applyChanges) return;
  if (unmapped.length > 0) {
    throw new Error(
      "Some products have categories that cannot be mapped safely; no changes were applied."
    );
  }

  const result = await prisma.$transaction(
    async (tx) => {
      const categoryIdsByName = new Map<string, string>();

      for (const canonical of canonicalCategories) {
        const existing = keeperByName.get(canonical.name);
        const category = existing
          ? { id: existing.id }
          : await tx.category.create({
              data: {
                name: canonical.name,
                slug: canonical.slug,
                description: canonical.description,
                image: canonical.image,
                displayOrder: canonical.displayOrder,
                isActive: true,
              },
              select: { id: true },
            });
        categoryIdsByName.set(canonical.name, category.id);
      }

      const productCategoryData = categoriesToDelete.flatMap((category) => {
        const targetName = targetByCategoryName.get(
          normalizeName(category.name)
        );
        const categoryId = targetName
          ? categoryIdsByName.get(targetName)
          : undefined;
        if (!categoryId) return [];

        return category.products.map((assignment) => ({
          productId: assignment.productId,
          categoryId,
        }));
      });

      if (productCategoryData.length > 0) {
        await tx.productCategory.createMany({
          data: productCategoryData,
          skipDuplicates: true,
        });
      }

      const deletedCategoryIds = categoriesToDelete.map(
        (category) => category.id
      );
      if (deletedCategoryIds.length > 0) {
        await tx.category.updateMany({
          where: { parentId: { in: deletedCategoryIds } },
          data: { parentId: null },
        });
        await tx.category.deleteMany({
          where: { id: { in: deletedCategoryIds } },
        });
      }

      for (const canonical of canonicalCategories) {
        await tx.category.update({
          where: { id: categoryIdsByName.get(canonical.name)! },
          data: {
            name: canonical.name,
            slug: canonical.slug,
            description: canonical.description,
            image: canonical.image,
            displayOrder: canonical.displayOrder,
            isActive: true,
            parentId: null,
          },
        });
      }

      return {
        categoriesCreated: categoriesToCreate.length,
        categoriesDeleted: categoriesToDelete.length,
        productCategoryLinksReassigned: productCategoryData.length,
      };
    },
    { maxWait: 10_000, timeout: 30_000 }
  );

  const finalCategories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { name: true, slug: true, image: true },
  });
  console.log(
    JSON.stringify({ result, finalCategories }, null, 2)
  );
}

main()
  .catch((error: unknown) => {
    console.error("Category standardization failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
