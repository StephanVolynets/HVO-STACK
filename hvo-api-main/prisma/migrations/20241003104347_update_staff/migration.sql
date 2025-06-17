/*
  Warnings:

  - You are about to drop the column `language` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `staffType` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `languageId` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staff_type` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "language",
DROP COLUMN "staffType",
ADD COLUMN     "languageId" INTEGER NOT NULL,
ADD COLUMN     "staff_type" "StaffType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
