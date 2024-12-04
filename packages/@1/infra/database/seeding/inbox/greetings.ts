//

import { PrismaClient } from "#prisma/client";

//

export async function create_greatings_message(
  prisma: PrismaClient,
  author_profile_id: string,
  recipient_profile_id: string,
  message = "Bonjour",
) {
  await prisma.notification.create({
    data: {
      created_at: new Date(),
      id: "greatings_notification_id",
      inbox_message: {
        create: {
          message: {
            create: {
              author: { connect: { id: recipient_profile_id } },
              content: message,
              created_at: new Date(),
              thread: { create: { id: "greatings_thread_id" } },
              updated_at: new Date(),
            },
          },
        },
      },
      owner: { connect: { id: author_profile_id } },
      read_at: null,
      type: "INBOX_NEW_MESSAGE",
    },
  });
}
