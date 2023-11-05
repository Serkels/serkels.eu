-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Studient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
