/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."users_phone_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "footer_brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_socials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_links" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_contact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_newsletter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "footer_socials_displayOrder_idx" ON "footer_socials"("displayOrder");

-- CreateIndex
CREATE INDEX "footer_sections_displayOrder_idx" ON "footer_sections"("displayOrder");

-- CreateIndex
CREATE INDEX "footer_links_sectionId_idx" ON "footer_links"("sectionId");

-- CreateIndex
CREATE INDEX "footer_links_displayOrder_idx" ON "footer_links"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "footer_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
