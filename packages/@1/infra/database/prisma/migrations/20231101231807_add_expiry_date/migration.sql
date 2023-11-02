/*
  Warnings:

  - You are about to drop the column `active` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `when` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `when` on the `Opportunity` table. All the data in the column will be lost.
  - Added the required column `is_active` to the `Exchange` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry_date` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exchange" DROP COLUMN "active",
DROP COLUMN "when",
ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "when",
ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL;
