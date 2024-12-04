//

import {
  mergeRouters,
  next_auth_procedure,
  procedure,
  router,
} from "@1.modules/trpc";
import { z } from "zod";
import { create_api_router } from "./answers/create";
import { delete_api_router } from "./answers/delete";

//

const answers_procedure = procedure.input(
  z.object({ question_id: z.string() }),
);
const protected_answers_procedure = next_auth_procedure.input(
  z.object({ question_id: z.string() }),
);

/**
 * @deprecated use merged routes instead
 */
const legacy_answers_api_router = router({
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

export const answers_api_router = mergeRouters(
  create_api_router,
  delete_api_router,
  legacy_answers_api_router,
);
