/*
  Warnings:

  - You are about to drop the column `creatorPhase` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `vendorDescription` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "creatorPhase",
DROP COLUMN "vendorDescription",
ALTER COLUMN "vendorPhase" DROP NOT NULL;
