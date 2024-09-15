//

import {
  NotificationType,
  type Prisma,
  type PrismaClient,
} from "@1.infra/database";
import { next_auth_procedure } from "@1.modules/trpc";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { emit_message_event } from "../channel/message";

//

const get_student_id = (prisma: PrismaClient) => (profile_id: string) => {
  return prisma.student.findFirstOrThrow({
    select: { id: true },
    where: { profile_id },
  });
};

const get_user_blacklist = (prisma: PrismaClient) => (profile_id: string) =>
  prisma.blacklist.findMany({
    select: { profile_id: true },
    where: { owner_id: profile_id },
  });
const get_recipient =
  (prisma: PrismaClient, profile_id: string) => async (thread_id: string) =>
    prisma.profile.findFirst({
      select: {
        id: true,
        blacklist: { select: { profile_id: true }, where: { profile_id } },
      },
      where: {
        id: { not: profile_id },
        participants_in_thread: { some: { id: thread_id } },
      },
    });

type CreateMessageContext = {
  prisma: PrismaClient;
  profile_id: string;
  student_id: string;
  recipient_id: string;
  thread_id: string;
  is_blacklisted: boolean;
};
const create_message =
  (context: CreateMessageContext) => async (content: string) => {
    const {
      prisma,
      profile_id,
      student_id,
      thread_id,
      recipient_id,
      is_blacklisted,
    } = context;
    const updated_at = new Date();
    const [exchange_thread, inbox_thread] = await Promise.all([
      prisma.exchangeThread.findUnique({
        select: { deal: { select: { parent_id: true } } },
        where: { owner_id_thread_id: { owner_id: student_id, thread_id } },
      }),
      prisma.inboxThread.findUnique({
        where: { owner_id_thread_id: { owner_id: student_id, thread_id } },
      }),
    ]);
    const linked_thread_update = match({
      exchange_thread,
      inbox_thread,
    })
      .with(
        { exchange_thread: P.nonNullable },
        (): Prisma.ThreadUpdateInput => ({
          exchange_threads: {
            update: {
              data: {
                deal: { update: { updated_at } },
                last_seen_date: updated_at,
              },
              where: {
                owner_id_thread_id: { owner_id: student_id, thread_id },
              },
            },
          },
        }),
      )
      .with(
        { inbox_thread: P.nonNullable },
        (): Prisma.ThreadUpdateInput => ({
          inbox_threads: {
            update: {
              data: { last_seen_date: updated_at },
              where: {
                owner_id_thread_id: { owner_id: student_id, thread_id },
              },
            },
          },
        }),
      )
      .otherwise(() => ({}));

    const inbox_notifications: Prisma.InboxMessageNotificationCreateNestedManyWithoutMessageInput =
      inbox_thread
        ? {
            create: {
              notification: {
                create: {
                  owner_id: recipient_id,
                  type: NotificationType.INBOX_NEW_MESSAGE,
                },
              },
            },
          }
        : {};

    const exchange_notifications: Prisma.ExchangeMessageNotificationUncheckedCreateNestedManyWithoutMessageInput =
      exchange_thread
        ? {
            create: {
              exchange: { connect: { id: exchange_thread.deal.parent_id } },
              notification: {
                create: {
                  owner_id: recipient_id,
                  type: NotificationType.EXCHANGE_NEW_MESSAGE,
                },
              },
            },
          }
        : {};

    return await prisma.thread.update({
      data: {
        updated_at: updated_at,
        messages: {
          create: {
            created_at: updated_at,
            updated_at,
            author: { connect: { id: profile_id } },
            delivered: !is_blacklisted,
            content,
            inbox_notifications,
            exchange_notifications,
          },
        },
        ...linked_thread_update,
      },
      where: { id: thread_id },
    });
  };

export default next_auth_procedure
  .input(
    z.object({
      thread_id: z.string(),
      content: z.string(),
    }),
  )
  .mutation(async ({ ctx: { payload, prisma }, input }) => {
    const {
      profile: { id: profile_id },
    } = payload;
    const { content, thread_id } = input;

    const { id: student_id } = await get_student_id(prisma)(profile_id);
    const recipient = await get_recipient(prisma, profile_id)(thread_id);
    if (!recipient) throw new Error("recipient not found");
    const user_blacklist = await get_user_blacklist(prisma)(profile_id);

    const is_in_user_blacklist = user_blacklist.some(
      (blacklist) => blacklist.profile_id === recipient.id,
    );
    const is_recipient_blacklisted = recipient.blacklist.some(
      (blacklist) => blacklist.profile_id === profile_id,
    );
    const is_blacklisted = is_in_user_blacklist || is_recipient_blacklisted;

    const message = await create_message({
      prisma,
      profile_id,
      student_id,
      recipient_id: recipient.id,
      thread_id,
      is_blacklisted,
    })(content);

    emit_message_event(`thread/${thread_id}/new_message`, { thread_id });
    return message;
  });
