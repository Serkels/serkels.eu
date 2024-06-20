//

import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { NotificationType } from "@prisma/client";
import { z } from "zod";

//

const answers_procedure = procedure.input(
  z.object({ question_id: z.string() }),
);
const protected_answers_procedure = next_auth_procedure.input(
  z.object({ question_id: z.string() }),
);

export const answers_api_router = router({
  //

  approve: protected_answers_procedure
    .input(z.object({ answer_id: z.string() }))
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const { question_id, answer_id: id } = input;
      const {
        profile: { id: profile_id },
      } = payload;

      return prisma.answer.update({
        data: {
          accepted_for: { connect: { id: question_id } },
          updated_at: new Date(),
        },
        where: {
          id,
          parent: { id: question_id, owner: { profile_id } },
        },
      });
    }),

  //

  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.answer.findUniqueOrThrow({
        where: { id },
        include: {
          accepted_for: { select: { id: true } },
          owner: {
            select: {
              id: true,
              profile: { select: { id: true, name: true, image: true } },
              university: true,
            },
          },
        },
      });
    }),

  //

  create: protected_answers_procedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const {
        profile: { id: profile_id },
      } = payload;
      const { content, question_id } = input;
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id },
      });

      return prisma.answer.create({
        data: {
          content,
          owner: { connect: { profile_id } },
          parent: { connect: { id: question_id } },
          forum_notifications: {
            create: {
              notification: {
                create: {
                  type: NotificationType.FORUM_NEW_AWNSER,
                  owner: { connect: { id: student_id } },
                },
              },
            },
          },
        },
      });
    }),

  //

  find: answers_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { question_id, cursor, limit } = input;

      const items = await prisma.answer.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { created_at: "asc" },
        take: limit + 1,
        include: {
          owner: {
            select: {
              id: true,
              profile: { select: { id: true, name: true, image: true } },
              university: true,
            },
          },
        },
        where: {
          parent_id: question_id,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { data: items, nextCursor };
    }),
});
