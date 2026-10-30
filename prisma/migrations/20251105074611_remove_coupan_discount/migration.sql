/*
  Warnings:

  - You are about to drop the column `discount` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `coupon_usages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."coupon_usages" DROP CONSTRAINT "coupon_usages_couponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."coupon_usages" DROP CONSTRAINT "coupon_usages_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."coupon_usages" DROP CONSTRAINT "coupon_usages_userId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "discount";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "discount";

-- DropTable
DROP TABLE "public"."coupon_usages";

-- DropTable
DROP TABLE "public"."coupons";

-- DropEnum
DROP TYPE "public"."CouponType";
