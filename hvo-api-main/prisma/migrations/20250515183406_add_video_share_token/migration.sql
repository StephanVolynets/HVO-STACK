-- CreateTable
CREATE TABLE "VideoShareToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoShareToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoShareToken_token_key" ON "VideoShareToken"("token");

-- AddForeignKey
ALTER TABLE "VideoShareToken" ADD CONSTRAINT "VideoShareToken_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
