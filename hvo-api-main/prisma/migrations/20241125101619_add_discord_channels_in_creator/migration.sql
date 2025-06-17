-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "discord_channels" JSONB;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "email" BOOLEAN NOT NULL DEFAULT false,
    "discord" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
