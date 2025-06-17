/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Creator` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Creator` table. All the data in the column will be lost.
  - The primary key for the `CreatorLanguage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `CreatorLanguage` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `CreatorLanguage` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `CreatorLanguage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CreatorLanguage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `CreatorLanguage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `CreatorLanguage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreatorLanguage" DROP CONSTRAINT "CreatorLanguage_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorLanguage" DROP CONSTRAINT "CreatorLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_languageId_fkey";

-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CreatorLanguage" DROP CONSTRAINT "CreatorLanguage_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "creatorId",
DROP COLUMN "languageId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_id" INTEGER NOT NULL,
ADD COLUMN     "language_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "CreatorLanguage_pkey" PRIMARY KEY ("creator_id", "language_id");

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "createdAt",
DROP COLUMN "languageId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "default_creatorId" INTEGER,
ADD COLUMN     "language_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_default_creatorId_fkey" FOREIGN KEY ("default_creatorId") REFERENCES "Creator"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguage" ADD CONSTRAINT "CreatorLanguage_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Creator"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorLanguage" ADD CONSTRAINT "CreatorLanguage_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
