-- CreateEnum
CREATE TYPE "VideoProcessingStage" AS ENUM ('TRANSCODING', 'BOX_UPLOAD', 'SONIX_UPLOAD', 'VIDEO_TRANSCODING', 'BOX_TO_GCS_TRANSFER', 'GDRIVE_TO_GCS_TRANSFER', 'YOUTUBE_TO_GCS_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "VideoProcessingIssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'IGNORED');

-- CreateTable
CREATE TABLE "VideoProcessingIssue" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "stage" "VideoProcessingStage" NOT NULL,
    "status" "VideoProcessingIssueStatus" NOT NULL DEFAULT 'OPEN',
    "errorMessage" TEXT NOT NULL,
    "errorDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "VideoProcessingIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VideoProcessingIssue" ADD CONSTRAINT "VideoProcessingIssue_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
