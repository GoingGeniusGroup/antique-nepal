import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const BROKEN_IMAGE_PREFIX = "https://ucarecdn.com/a1b2c3d4";
const prisma = new PrismaClient();
const applyChanges = process.argv.includes("--apply");

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { image: { startsWith: BROKEN_IMAGE_PREFIX } },
        { images: { some: { url: { startsWith: BROKEN_IMAGE_PREFIX } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      sku: true,
      image: true,
      images: {
        where: { url: { startsWith: BROKEN_IMAGE_PREFIX } },
        select: { id: true },
      },
      _count: {
        select: {
          orderItems: true,
          cartItems: true,
          wishlistItems: true,
          reviews: true,
        },
      },
    },
  });

  const safeToDelete = products.filter(
    ({ _count }) =>
      _count.orderItems === 0 &&
      _count.cartItems === 0 &&
      _count.wishlistItems === 0 &&
      _count.reviews === 0
  );
  const preserve = products.filter((product) => !safeToDelete.includes(product));

  console.log(
    JSON.stringify(
      {
        mode: applyChanges ? "apply" : "dry-run",
        matched: products.map(({ name, sku, image, images, _count }) => ({
          name,
          sku,
          brokenProductImage: Boolean(
            image?.startsWith(BROKEN_IMAGE_PREFIX)
          ),
          brokenImageRows: images.length,
          references: _count,
        })),
        safeToDelete: safeToDelete.length,
        preserveAndClearBrokenImages: preserve.length,
      },
      null,
      2
    )
  );

  if (!applyChanges || products.length === 0) return;

  const imageIds = preserve.flatMap((product) =>
    product.images.map((image) => image.id)
  );
  const productIdsToClear = preserve
    .filter((product) => product.image?.startsWith(BROKEN_IMAGE_PREFIX))
    .map((product) => product.id);

  const result = await prisma.$transaction(async (tx) => {
    const deletedProducts = safeToDelete.length
      ? await tx.product.deleteMany({
          where: { id: { in: safeToDelete.map((product) => product.id) } },
        })
      : { count: 0 };
    const deletedImages = imageIds.length
      ? await tx.productImage.deleteMany({ where: { id: { in: imageIds } } })
      : { count: 0 };
    const clearedProductImages = productIdsToClear.length
      ? await tx.product.updateMany({
          where: { id: { in: productIdsToClear } },
          data: { image: null },
        })
      : { count: 0 };

    return {
      deletedProducts: deletedProducts.count,
      deletedImages: deletedImages.count,
      clearedProductImages: clearedProductImages.count,
    };
  });

  console.log("Cleanup completed:", JSON.stringify(result));
}

main()
  .catch((error: unknown) => {
    console.error("Broken product image cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
