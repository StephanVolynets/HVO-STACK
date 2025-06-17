-- CreateEnum
CREATE TYPE "FeedbackIssueStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "FeedbackStatus" ADD VALUE 'REJECTED';

-- CreateTable
CREATE TABLE "FeedbackIssue" (
    "id" SERIAL NOT NULL,
    "startTimestamp" INTEGER NOT NULL,
    "endTimestamp" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "FeedbackIssueStatus" NOT NULL DEFAULT 'NEW',
    "feedbackId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeedbackIssue" ADD CONSTRAINT "FeedbackIssue_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
