/*
  Warnings:

  - You are about to drop the column `countryName` on the `Language` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Language" DROP COLUMN "countryName",
ADD COLUMN     "country_name" TEXT;
