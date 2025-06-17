/*
  Warnings:

  - You are about to drop the column `isPrepeared` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "isPrepeared",
ADD COLUMN     "isInitialized" BOOLEAN NOT NULL DEFAULT false;
