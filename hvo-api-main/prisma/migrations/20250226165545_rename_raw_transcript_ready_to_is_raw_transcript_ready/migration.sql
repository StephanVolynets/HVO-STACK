/*
  Warnings:

  - You are about to drop the column `rawTranscriptReady` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "rawTranscriptReady",
ADD COLUMN     "isRawTranscriptReady" BOOLEAN DEFAULT false;
