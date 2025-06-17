/*
  Warnings:

  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AudioDubProgress" AS ENUM ('TRANSCRIPTION', 'TRANSLATION', 'VOICE_OVER', 'AUDIO_ENGINEERING');

-- CreateEnum
CREATE TYPE "AudioDubStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TRANSCRIPTION', 'TRANSLATION', 'VOICE_OVER', 'AUDIO_ENGINEERING');

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_language_id_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_video_id_fkey";

-- AlterTable
ALTER TABLE "Creator" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CreatorLanguage" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "Assignment";

-- DropEnum
DROP TYPE "AssignmentStatus";

-- CreateTable
CREATE TABLE "AudioDub" (
    "id" SERIAL NOT NULL,
    "status" "AudioDubStatus" NOT NULL DEFAULT 'PENDING',
    "progress" "AudioDubProgress" NOT NULL DEFAULT 'TRANSCRIPTION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "videoId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "AudioDub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "type" "TaskType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "audioDubId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStaff" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,

    CONSTRAINT "TaskStaff_pkey" PRIMARY KEY ("taskId","staffId")
);

-- AddForeignKey
ALTER TABLE "AudioDub" ADD CONSTRAINT "AudioDub_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioDub" ADD CONSTRAINT "AudioDub_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_audioDubId_fkey" FOREIGN KEY ("audioDubId") REFERENCES "AudioDub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStaff" ADD CONSTRAINT "TaskStaff_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskStaff" ADD CONSTRAINT "TaskStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
