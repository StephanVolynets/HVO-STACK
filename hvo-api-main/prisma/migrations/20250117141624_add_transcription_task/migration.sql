/*
  Warnings:

  - A unique constraint covering the columns `[transcription_task_id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "transcription_task_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Video_transcription_task_id_key" ON "Video"("transcription_task_id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_transcription_task_id_fkey" FOREIGN KEY ("transcription_task_id") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
