/*
  Warnings:

  - You are about to drop the column `discord_channels` on the `Creator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Creator" DROP COLUMN "discord_channels",
ADD COLUMN     "discordData" JSONB;
