-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_audioDubId_fkey";

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "audioDubId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_audioDubId_fkey" FOREIGN KEY ("audioDubId") REFERENCES "AudioDub"("id") ON DELETE SET NULL ON UPDATE CASCADE;
