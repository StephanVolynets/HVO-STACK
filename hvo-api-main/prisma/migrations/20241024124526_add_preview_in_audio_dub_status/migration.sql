/*
  Warnings:

  - Made the column `language_id` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "AudioDubStatus" ADD VALUE 'PREVIEW';

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_language_id_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "language_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
