/*
  Warnings:

  - A unique constraint covering the columns `[message_id,notification_id]` on the table `InboxMessageNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InboxMessageNotification_message_id_notification_id_key" ON "InboxMessageNotification"("message_id", "notification_id");
