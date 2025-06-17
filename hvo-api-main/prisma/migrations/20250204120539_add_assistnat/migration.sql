-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'VENDOR_ASSISTANT';

-- CreateTable
CREATE TABLE "Assistant" (
    "user_id" INTEGER NOT NULL,
    "managerId" INTEGER NOT NULL,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
