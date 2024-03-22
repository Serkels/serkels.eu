/*
  Warnings:

  - You are about to drop the column `citizenship` on the `Studient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Studient"
RENAME COLUMN "citizenship" TO "language";
