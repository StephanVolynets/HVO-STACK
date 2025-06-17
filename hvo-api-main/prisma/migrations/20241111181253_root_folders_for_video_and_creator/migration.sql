/*
  Warnings:

  - The values [PREVIEW] on the enum `AudioDubStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AudioDubStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "AudioDub" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AudioDub" ALTER COLUMN "status" TYPE "AudioDubStatus_new" USING ("status"::text::"AudioDubStatus_new");
ALTER TYPE "AudioDubStatus" RENAME TO "AudioDubStatus_old";
ALTER TYPE "AudioDubStatus_new" RENAME TO "AudioDubStatus";
DROP TYPE "AudioDubStatus_old";
ALTER TABLE "AudioDub" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "root_folder_id" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "root_folder_id" TEXT;
