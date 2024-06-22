-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'FORUM_NEW_AWNSER';

-- CreateTable
CREATE TABLE "ForumNotification" (
    "answer_id" TEXT,
    "notification_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumNotification_notification_id_key" ON "ForumNotification"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "ForumNotification_answer_id_notification_id_key" ON "ForumNotification"("answer_id", "notification_id");

-- AddForeignKey
ALTER TABLE "ForumNotification" ADD CONSTRAINT "ForumNotification_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumNotification" ADD CONSTRAINT "ForumNotification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
