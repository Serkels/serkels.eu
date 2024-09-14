-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Blacklist" (
    "owner_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_profile_id_owner_id_key" ON "Blacklist"("profile_id", "owner_id");

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
