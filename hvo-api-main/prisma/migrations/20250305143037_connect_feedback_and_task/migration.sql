-- CreateTable
CREATE TABLE "FeedbackTask" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feedbackId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackTask_pkey" PRIMARY KEY ("feedbackId","taskId")
);

-- AddForeignKey
ALTER TABLE "FeedbackTask" ADD CONSTRAINT "FeedbackTask_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTask" ADD CONSTRAINT "FeedbackTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
