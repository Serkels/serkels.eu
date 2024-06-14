//

import { thread_recipient } from "@1.modules/inbox.domain/select";
import {
  next_auth_input_token,
  next_auth_procedure,
  router,
} from "@1.modules/trpc";
import { NotificationType, Prisma } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

class MessageEventEmitter extends EventEmitter {}
const message_event_emitter = new MessageEventEmitter();

export const thread = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ ctx: { payload, prisma }, input: id }) => {
      const { profile } = payload;
      return prisma.thread.findUniqueOrThrow({
        where: { id, participants: { some: { id: profile.id } } },
        include: { participants: true },
      });
    }),

  //

  messages: next_auth_procedure
    .input(
      z.object({
        thread_id: z.string(),
        cursor: z.date().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ ctx: { payload, prisma }, input }) => {
      const { profile } = payload;
      const { cursor, limit, thread_id: id } = input;
      const data = await prisma.message.findMany({
        ...(cursor
          ? {
              cursor: {
                unique_date_in_thread: { thread_id: id, created_at: cursor },
              },
            }
          : {}),
        include: { author: true },
        orderBy: { created_at: "desc" },
        take: limit + 1,
        where: { thread: { id, participants: { some: { id: profile.id } } } },
      });

      let prevCursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const prev_item = data.pop()!;
        prevCursor = prev_item.created_at;
      }

      return { data, prevCursor };
    }),

  //

  on_new_message: next_auth_input_token
    .input(z.object({ thread_id: z.string() }))
    .subscription(async ({ ctx: { prisma, payload }, input }) => {
      const { thread_id } = input;
      const {
        profile: { id: profile_id },
      } = payload;

      // guard : Only subscribe to participating threads
      await prisma.thread.findUniqueOrThrow({
        where: { id: thread_id, participants: { some: { id: profile_id } } },
      });

      return observable<void>((emit) => {
        const new_message = () => {
          emit.next();
        };
        message_event_emitter.on(`${thread_id}>new_message`, new_message);
        return () => {
          message_event_emitter.off(`${thread_id}>new_message`, new_message);
        };
      });
    }),

  //

  send: next_auth_procedure
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

      const { id: student_id } = await prisma.student.findFirstOrThrow({
        select: { id: true },
        where: { profile_id },
      });

      // guard : Only write on participating threads
      const { participants } = await prisma.thread.findUniqueOrThrow({
        select: { participants: { select: { id: true } } },
        where: { id: thread_id, participants: { some: { id: profile_id } } },
      });
      const recipient = thread_recipient({ participants, profile_id });
      const updated_at = new Date();

      const [exchange_thread, inbox_thread] = await Promise.all([
        prisma.exchangeThread.findUnique({
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
                data: { last_seen_date: updated_at },
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
        .otherwise<Prisma.ThreadUpdateInput>(() => ({}));

      const notifications = match({
        exchange_thread,
        inbox_thread,
      })
        .with(
          { exchange_thread: P.nonNullable },
          (): Prisma.InboxMessageNotificationCreateNestedManyWithoutMessageInput => ({}),
        )
        .with(
          { inbox_thread: P.nonNullable },
          (): Prisma.InboxMessageNotificationCreateNestedManyWithoutMessageInput => ({
            create: {
              notification: {
                create: {
                  owner_id: recipient.id,
                  type: NotificationType.INBOX_NEW_MESSAGE,
                },
              },
            },
          }),
        )
        .otherwise(() => ({}));

      const updated_thread = await prisma.thread.update({
        data: {
          updated_at: updated_at,
          messages: {
            create: {
              created_at: updated_at,
              updated_at,
              author: { connect: { id: profile_id } },
              content,
              notifications,
            },
          },
          ...linked_thread_update,
        },
        where: { id: thread_id },
      });

      message_event_emitter.emit(`${thread_id}>new_message`);
      return updated_thread;
    }),
});
