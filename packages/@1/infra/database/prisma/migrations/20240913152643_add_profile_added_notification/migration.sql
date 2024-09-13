-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PROFILE_ADDED';

-- CreateTable
CREATE TABLE "ProfileAddedNotification" (
    "notification_id" TEXT NOT NULL,
    "profile_id" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileAddedNotification_notification_id_key" ON "ProfileAddedNotification"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileAddedNotification_profile_id_notification_id_key" ON "ProfileAddedNotification"("profile_id", "notification_id");

-- AddForeignKey
ALTER TABLE "ProfileAddedNotification" ADD CONSTRAINT "ProfileAddedNotification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAddedNotification" ADD CONSTRAINT "ProfileAddedNotification_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
