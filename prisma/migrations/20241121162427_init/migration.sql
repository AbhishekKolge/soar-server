-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_balanceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_contactCountryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_securityId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_contactCountryId_fkey" FOREIGN KEY ("contactCountryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "Security"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Balance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
