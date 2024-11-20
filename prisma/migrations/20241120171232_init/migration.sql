/*
  Warnings:

  - A unique constraint covering the columns `[number,userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,userId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_number_userId_key" ON "Account"("number", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_number_userId_key" ON "Card"("number", "userId");
