/*
  Warnings:

  - You are about to drop the `VideoLanguage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoLanguage" DROP CONSTRAINT "VideoLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "VideoLanguage" DROP CONSTRAINT "VideoLanguage_videoId_fkey";

-- DropTable
DROP TABLE "VideoLanguage";

-- DropEnum
DROP TYPE "VideoProgress";
