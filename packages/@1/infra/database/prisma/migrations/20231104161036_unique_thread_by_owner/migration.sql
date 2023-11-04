/*
  Warnings:

  - A unique constraint covering the columns `[owner_id,thread_id]` on the table `ExchangeThread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExchangeThread_owner_id_thread_id_key" ON "ExchangeThread"("owner_id", "thread_id");
