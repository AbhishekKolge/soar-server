/*
  Warnings:

  - You are about to drop the column `logoId` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Bank` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "logoId",
DROP COLUMN "logoUrl";
