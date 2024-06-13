-- CreateEnum
CREATE TYPE "ProfileRole" AS ENUM ('ADMIN', 'PARTNER', 'STUDENT');

-- CreateEnum
CREATE TYPE "CategoryContext" AS ENUM ('EXCHANGE', 'OPPORTUNITY', 'FORUM');

-- CreateEnum
CREATE TYPE "ExchangeType" AS ENUM ('PROPOSAL', 'RESEARCH');

-- CreateEnum
CREATE TYPE "ExchangeThreadStatus" AS ENUM ('IDLE', 'DENIED', 'APPROVED_BY_THE_ORGANIZER', 'APPROVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INBOX_NEW_MESSAGE');

-- CreateTable
CREATE TABLE "SignupPayload" (
    "role" "ProfileRole" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "context" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "bio" TEXT,
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "role" "ProfileRole" NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "language" TEXT,
    "city" TEXT,
    "field_of_study" TEXT,
    "profile_id" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "city" TEXT,
    "link" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "exchange_id" TEXT,
    "opportunity_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "context" "CategoryContext" DEFAULT 'EXCHANGE',
    "rank" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL,
    "is_online" BOOLEAN NOT NULL,
    "location" TEXT,
    "owner_id" TEXT NOT NULL,
    "places" INTEGER NOT NULL,
    "return_id" TEXT,
    "title" TEXT NOT NULL,
    "type" "ExchangeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "status" "ExchangeThreadStatus" NOT NULL DEFAULT 'IDLE',
    "parent_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeThread" (
    "id" TEXT NOT NULL,
    "last_seen_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,
    "deal_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,

    CONSTRAINT "ExchangeThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "link" TEXT NOT NULL,
    "location" TEXT,
    "owner_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "accepted_answer_id" TEXT,
    "category_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboxThread" (
    "id" TEXT NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "last_seen_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,

    CONSTRAINT "InboxThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "PasswordlessToken" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordlessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "payload_email" TEXT
);

-- CreateTable
CREATE TABLE "_Contacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProfileFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ParticipantsInThread" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategorizedStudentInterest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SignupPayload_email_key" ON "SignupPayload"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_profile_id_key" ON "Student"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_profile_id_key" ON "Partner"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_owner_id_exchange_id_key" ON "Bookmark"("owner_id", "exchange_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_owner_id_opportunity_id_key" ON "Bookmark"("owner_id", "opportunity_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_context_key" ON "Category"("slug", "context");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_parent_id_participant_id_key" ON "Deal"("parent_id", "participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeThread_owner_id_deal_id_key" ON "ExchangeThread"("owner_id", "deal_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeThread_owner_id_thread_id_key" ON "ExchangeThread"("owner_id", "thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_slug_key" ON "Opportunity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Question_accepted_answer_id_key" ON "Question"("accepted_answer_id");

-- CreateIndex
CREATE UNIQUE INDEX "InboxThread_owner_id_thread_id_key" ON "InboxThread"("owner_id", "thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_thread_id_created_at_key" ON "Message"("thread_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "InboxMessageNotification_notification_id_key" ON "InboxMessageNotification"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "InboxMessageNotification_message_id_notification_id_key" ON "InboxMessageNotification"("message_id", "notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordlessToken_body_key" ON "PasswordlessToken"("body");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_Contacts_AB_unique" ON "_Contacts"("A", "B");

-- CreateIndex
CREATE INDEX "_Contacts_B_index" ON "_Contacts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileFollows_AB_unique" ON "_ProfileFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileFollows_B_index" ON "_ProfileFollows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantsInThread_AB_unique" ON "_ParticipantsInThread"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantsInThread_B_index" ON "_ParticipantsInThread"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategorizedStudentInterest_AB_unique" ON "_CategorizedStudentInterest"("A", "B");

-- CreateIndex
CREATE INDEX "_CategorizedStudentInterest_B_index" ON "_CategorizedStudentInterest"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_exchange_id_fkey" FOREIGN KEY ("exchange_id") REFERENCES "Exchange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "Opportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeThread" ADD CONSTRAINT "ExchangeThread_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeThread" ADD CONSTRAINT "ExchangeThread_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeThread" ADD CONSTRAINT "ExchangeThread_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_accepted_answer_id_fkey" FOREIGN KEY ("accepted_answer_id") REFERENCES "Answer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxThread" ADD CONSTRAINT "InboxThread_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxThread" ADD CONSTRAINT "InboxThread_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxMessageNotification" ADD CONSTRAINT "InboxMessageNotification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboxMessageNotification" ADD CONSTRAINT "InboxMessageNotification_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_payload_email_fkey" FOREIGN KEY ("payload_email") REFERENCES "SignupPayload"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Contacts" ADD CONSTRAINT "_Contacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Contacts" ADD CONSTRAINT "_Contacts_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileFollows" ADD CONSTRAINT "_ProfileFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileFollows" ADD CONSTRAINT "_ProfileFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantsInThread" ADD CONSTRAINT "_ParticipantsInThread_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantsInThread" ADD CONSTRAINT "_ParticipantsInThread_B_fkey" FOREIGN KEY ("B") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategorizedStudentInterest" ADD CONSTRAINT "_CategorizedStudentInterest_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategorizedStudentInterest" ADD CONSTRAINT "_CategorizedStudentInterest_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
