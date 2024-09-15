//

import type { Prisma } from "@1.infra/database";
import { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import find_inboxes from "./find";
import { thread } from "./thread";

const inbox_api_router = router({
  //

  talk_to: next_auth_procedure
    .input(z.string())
    .mutation(
      async ({ ctx: { payload, prisma }, input: recipient_profile_id }) => {
        const { profile } = payload;
        const { id: student_id } = await prisma.student.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });
        const existing_inbox_thread = await prisma.inboxThread.findFirst({
          where: {
            owner_id: student_id,
            thread: { participants: { some: { id: recipient_profile_id } } },
          },
        });

        if (existing_inbox_thread) return existing_inbox_thread;

        const { id: recipient_student_id } =
          await prisma.student.findUniqueOrThrow({
            select: { id: true },
            where: { profile_id: recipient_profile_id },
          });

        await prisma.thread.create({
          data: {
            participants: {
              connect: [{ id: profile.id }, { id: recipient_profile_id }],
            },
            inbox_threads: {
              createMany: {
                data: [
                  { owner_id: student_id },
                  { owner_id: recipient_student_id },
                ],
              },
            },
          },
        });
        return prisma.inboxThread.findFirstOrThrow({
          where: {
            owner_id: student_id,
            thread: { participants: { some: { id: recipient_profile_id } } },
          },
        });
      },
    ),

  //

  find: find_inboxes,

  //

  by_thread_id: next_auth_procedure
    .input(z.string())
    .query(async ({ ctx: { payload, prisma }, input: thread_id }) => {
      const { profile } = payload;
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const owner_id_thread_id: Prisma.InboxThreadOwner_idThread_idCompoundUniqueInput =
        { owner_id: student_id, thread_id };

      return prisma.inboxThread.findUniqueOrThrow({
        include: {
          thread: {
            include: {
              participants: { select: { id: true, name: true, image: true } },
              messages: { take: 1, orderBy: [{ created_at: "desc" }] },
            },
          },
        },
        where: {
          owner_id_thread_id,
        },
      });
    }),

  //

  by_profile_id: next_auth_procedure
    .input(z.object({ profile_id: ID_Schema }))
    .query(async ({ input, ctx: { payload, prisma } }) => {
      const {
        profile: { id: profile_id },
      } = payload;
      const { profile_id: participant_id } = input;

      const { id: owner_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id },
      });
      return prisma.inboxThread.findFirst({
        where: {
          owner_id,
          thread: { participants: { some: { id: participant_id } } },
        },
        select: { thread: { select: { id: true } } },
      });
    }),

  thread,
});

export default inbox_api_router;
export type InboxApiRouter = typeof inbox_api_router;
