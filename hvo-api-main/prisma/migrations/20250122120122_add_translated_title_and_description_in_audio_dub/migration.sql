-- AlterTable
ALTER TABLE "AudioDub" ADD COLUMN     "approved" BOOLEAN DEFAULT false,
ADD COLUMN     "translatedDescription" TEXT,
ADD COLUMN     "translatedTitle" TEXT;
