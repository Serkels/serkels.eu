//

import { NotificationType, type Prisma } from "@1.infra/database";
import { router } from "@1.modules/trpc";
import { z } from "zod";
import { protected_answers_procedure } from "../procedure";

//

export default router({
  create: protected_answers_procedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const {
        profile: { id: profile_id },
      } = session;
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
});
