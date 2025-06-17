-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_audioDubId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "audioDubId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_audioDubId_fkey" FOREIGN KEY ("audioDubId") REFERENCES "AudioDub"("id") ON DELETE SET NULL ON UPDATE CASCADE;
