/*
  Warnings:

  - You are about to drop the `Books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "public"."users_email_key";

-- DropTable
DROP TABLE "public"."Books";

-- DropTable
DROP TABLE "public"."Cart";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."Review";

-- DropTable
DROP TABLE "public"."User";

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
