/*
  Warnings:

  - You are about to drop the column `ownderId` on the `Template` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_ownderId_fkey";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "ownderId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
