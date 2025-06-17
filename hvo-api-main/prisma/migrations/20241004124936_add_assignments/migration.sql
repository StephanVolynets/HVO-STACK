/*
  Warnings:

  - The values [Admin,Vendor,Creator,Staff] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [Transcriptor,Translator,Voice_Actor,Audio_Engineer] on the enum `StaffType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VideoProgress" AS ENUM ('TRANSCRIPTION', 'TRANSLATION', 'VOICE_OVER', 'AUDIO_ENGINEERING');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'VENDOR', 'CREATOR', 'STAFF');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StaffType_new" AS ENUM ('TRANSCRIPTOR', 'TRANSLATOR', 'VOICE_ACTOR', 'AUDIO_ENGINEER');
ALTER TABLE "Staff" ALTER COLUMN "staff_type" TYPE "StaffType_new" USING ("staff_type"::text::"StaffType_new");
ALTER TYPE "StaffType" RENAME TO "StaffType_old";
ALTER TYPE "StaffType_new" RENAME TO "StaffType";
DROP TYPE "StaffType_old";
COMMIT;

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "youtube_url" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'BACKLOG',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoLanguage" (
    "videoId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "VideoLanguage_pkey" PRIMARY KEY ("videoId","languageId")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "assignmentStatus" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "video_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Creator"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLanguage" ADD CONSTRAINT "VideoLanguage_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLanguage" ADD CONSTRAINT "VideoLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
