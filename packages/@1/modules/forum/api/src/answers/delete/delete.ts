//

import { ID_Schema } from "@1.modules/core/domain";
import { router } from "@1.modules/trpc";
import { z } from "zod";
import { protected_answers_procedure } from "../procedure";

//

export default router({
  delete: protected_answers_procedure
    .input(z.object({ answers_id: ID_Schema }))
    .mutation(
      async ({
        input: { answers_id, question_id },
        ctx: { prisma, session },
      }) => {
        return prisma.answer.delete({
          where: {
            id: answers_id,
            parent_id: question_id,
            owner: { profile_id: session.profile.id },
          },
        });
      },
    ),
});
