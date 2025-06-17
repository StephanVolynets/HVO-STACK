-- CreateEnum
CREATE TYPE "FeedbackIssueType" AS ENUM ('TRANSCRIPTION', 'TRANSLATION', 'VOICE_OVER', 'AUDIO_ENGINEERING');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "issueType" "FeedbackIssueType";
