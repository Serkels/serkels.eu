//

import { NotificationType, type Prisma } from "@1.infra/database";
import { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
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
  delete: next_auth_procedure
    .input(ID_Schema)
    .mutation(async ({ input: id, ctx: { prisma, payload } }) => {
      return prisma.answer.delete({
        where: { id, owner: { profile_id: payload.profile.id } },
      });
    }),
  //

  disapprove: protected_answers_procedure
    .input(z.object({ answer_id: z.string(), question_id: z.string() }))
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const { question_id, answer_id: id } = input;
      const {
        profile: { id: profile_id },
      } = payload;

      return prisma.answer.update({
        data: {
          accepted_for: { disconnect: true }, // Déconnecte la réponse de la question
          updated_at: new Date(),
        },
        where: {
          id,
          parent: { id: question_id, owner: { profile_id } }, // Vérifie que l'utilisateur est bien le propriétaire
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

      const {
        owner: { profile_id: owner_profile_id },
      } = await prisma.question.findUniqueOrThrow({
        select: { owner_id: true, owner: { select: { profile_id: true } } },
        where: { id: question_id },
      });
      const is_self_answer = profile_id === owner_profile_id;

      const create_forum_notifications: Pick<
        Prisma.AnswerCreateInput,
        "forum_notifications"
      > = is_self_answer
        ? {}
        : {
            forum_notifications: {
              create: {
                notification: {
                  create: {
                    type: NotificationType.FORUM_NEW_AWNSER,
                    owner: { connect: { id: owner_profile_id } },
                  },
                },
              },
            },
          };

      return prisma.answer.create({
        data: {
          content,
          owner: { connect: { profile_id } },
          parent: { connect: { id: question_id } },
          ...create_forum_notifications,
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
