//

import { ID_Schema } from "@1.modules/core/domain";
import { mergeRouters, procedure, router } from "@1.modules/trpc";
import { answers_api_router } from "./answers";
import { create_api_router } from "./question/create";
import { delete_api_router } from "./question/delete";
import { find_api_router } from "./question/find";

const question_api_router = router({
  answers: answers_api_router,

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
});

export default mergeRouters(
  create_api_router,
  delete_api_router,
  find_api_router,
  question_api_router,
);
export type ForumApiRouter = typeof question_api_router;
