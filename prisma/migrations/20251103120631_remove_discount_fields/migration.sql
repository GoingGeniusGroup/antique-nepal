/*
  Warnings:

  - You are about to drop the column `compareAtPrice` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `compareAtPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "compareAtPrice";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "compareAtPrice",
DROP COLUMN "costPrice";

-- CreateIndex
CREATE INDEX "site_settings_key_idx" ON "site_settings"("key");
