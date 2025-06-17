/*
  Warnings:

  - You are about to drop the column `progress` on the `AudioDub` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AudioDub" DROP COLUMN "progress";

-- DropEnum
DROP TYPE "AudioDubProgress";
