-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "isAudioResourceUploaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVideoResourceUploaded" BOOLEAN NOT NULL DEFAULT false;
