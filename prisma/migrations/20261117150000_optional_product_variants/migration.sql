ALTER TABLE "products"
ADD COLUMN "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lowStockThreshold" INTEGER NOT NULL DEFAULT 5;

ALTER TABLE "cart_items"
ADD COLUMN "productId" TEXT;

UPDATE "cart_items" AS cart_item
SET "productId" = product_variant."productId"
FROM "product_variants" AS product_variant
WHERE cart_item."productVariantId" = product_variant."id";

ALTER TABLE "cart_items"
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "productVariantId" DROP NOT NULL;

ALTER TABLE "cart_items"
ADD CONSTRAINT "cart_items_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "products"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

ALTER TABLE "order_items"
ADD COLUMN "productId" TEXT;

UPDATE "order_items" AS order_item
SET "productId" = product_variant."productId"
FROM "product_variants" AS product_variant
WHERE order_item."productVariantId" = product_variant."id";

ALTER TABLE "order_items"
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "productVariantId" DROP NOT NULL;

ALTER TABLE "order_items"
ADD CONSTRAINT "order_items_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "products"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
