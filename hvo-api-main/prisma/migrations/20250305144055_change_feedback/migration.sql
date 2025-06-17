/*
  Warnings:

  - You are about to drop the column `issueType` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "issueType",
ADD COLUMN     "originPhase" "AudioDubPhase";

-- DropEnum
DROP TYPE "FeedbackIssueType";
