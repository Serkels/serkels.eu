//

import { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import { answers_api_router } from "./answers";
import find from "./question/find";

const question_api_router = router({
  answers: answers_api_router,
  create: next_auth_procedure
    .input(z.object({ title: z.string(), category: z.string() }))
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const {
        profile: { id: profile_id },
      } = payload;
      const { title, category } = input;

      return prisma.question.create({
        data: {
          title,
          category: { connect: { id: category } },
          owner: { connect: { profile_id } },
        },
      });
    }),

  delete: next_auth_procedure
    .input(ID_Schema)
    .mutation(async ({ input: id, ctx: { prisma, payload } }) => {
      return prisma.question.delete({
        where: { id, owner: { profile_id: payload.profile.id } },
      });
    }),

  by_id: procedure
    .input(ID_Schema)
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.question.findUniqueOrThrow({
        where: { id },
        include: {
          answers: { select: { id: true } },
          accepted_answer: { select: { id: true } },
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

  find: find,
});

export default question_api_router;
export type ForumApiRouter = typeof question_api_router;
