-- CreateEnum
CREATE TYPE "AudioDubPhase" AS ENUM ('TRANSCRIPTION', 'TRANSLATION', 'VOICE_OVER', 'AUDIO_ENGINEERING');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "FeedbackPhase" AS ENUM ('UNKNOWN', 'TRANSCRIPTION', 'TRANSLATION', 'VOICE_OVER', 'AUDIO_ENGINEERING');

-- AlterEnum
ALTER TYPE "AudioDubStatus" ADD VALUE 'REVIEW';

-- AlterTable
ALTER TABLE "AudioDub" ADD COLUMN     "phase" "AudioDubPhase" NOT NULL DEFAULT 'TRANSCRIPTION';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "autoUploadedPendingSubmission" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "creatorDescription" TEXT NOT NULL,
    "vendorDescription" TEXT,
    "creatorPhase" "FeedbackPhase" NOT NULL,
    "vendorPhase" "AudioDubPhase" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "audioDubId" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_audioDubId_fkey" FOREIGN KEY ("audioDubId") REFERENCES "AudioDub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
