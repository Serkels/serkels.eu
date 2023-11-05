/*
  Warnings:

  - A unique constraint covering the columns `[accepted_answer_id]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "accepted_answer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Question_accepted_answer_id_key" ON "Question"("accepted_answer_id");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_accepted_answer_id_fkey" FOREIGN KEY ("accepted_answer_id") REFERENCES "Answer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
