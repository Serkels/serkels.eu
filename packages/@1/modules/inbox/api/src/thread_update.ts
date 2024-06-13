//

import { next_auth_procedure } from "@1.modules/trpc";
import { type Prisma } from "@prisma/client";
import { z } from "zod";

//

export const thread_update = next_auth_procedure
  .input(z.object({ thread_id: z.string() }))
  .mutation(async ({ ctx: { payload, prisma }, input }) => {
    const { thread_id } = input;
    const {
      profile: { id: profile_id },
    } = payload;
    const { id: student_id } = await prisma.student.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id },
    });

    const owner_id_thread_id: Prisma.InboxThreadOwner_idThread_idCompoundUniqueInput =
      { owner_id: student_id, thread_id };

    const last_seen_date = new Date();
    const thread = await prisma.thread.findUniqueOrThrow({
      where: { id: thread_id },
      select: {
        messages: {
          select: { id: true },
          where: {
            notifications: { some: { notification: { read_at: null } } },
          },
        },
      },
    });

    return prisma.$transaction([
      prisma.notification.updateMany({
        data: { read_at: last_seen_date },
        where: {
          inbox_message: {
            message_id: { in: thread.messages.map(({ id }) => id) },
          },
          owner_id: profile_id,
          read_at: null,
          // type: NotificationType.INBOX_NEW_MESSAGE,
        },
      }),
      prisma.inboxThread.update({
        data: { last_seen_date: last_seen_date },
        where: { owner_id_thread_id },
      }),
    ]);
  });
