-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('SHORT', 'LONG');

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "form_type" "FormType" DEFAULT 'LONG';
