-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INBOX_NEW_MESSAGE');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "type" "NotificationType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboxMessageNotification" (
    "notification_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InboxMessageNotification_notification_id_key" ON "InboxMessageNotification"("notification_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxMessageNotification" ADD CONSTRAINT "InboxMessageNotification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxMessageNotification" ADD CONSTRAINT "InboxMessageNotification_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
