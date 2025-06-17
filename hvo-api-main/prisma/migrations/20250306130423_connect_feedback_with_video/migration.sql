-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "reportedLanguageId" INTEGER,
ADD COLUMN     "videoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_reportedLanguageId_fkey" FOREIGN KEY ("reportedLanguageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
