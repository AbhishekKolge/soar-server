/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `contactcountryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_contactcountryId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "contactcountryId",
DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted",
ADD COLUMN     "contactCountryId" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "contactNumber" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_contactCountryId_fkey" FOREIGN KEY ("contactCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
