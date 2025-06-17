/*
  Warnings:

  - You are about to drop the column `default_creatorId` on the `Staff` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_default_creatorId_fkey";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "default_creatorId",
ADD COLUMN     "default_creator_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_default_creator_id_fkey" FOREIGN KEY ("default_creator_id") REFERENCES "Creator"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
