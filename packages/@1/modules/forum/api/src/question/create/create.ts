//

import { router, session_procedure } from "@1.modules/trpc";
import { z } from "zod";

export default router({
  create: session_procedure
    .input(z.object({ title: z.string(), category: z.string() }))
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const {
        profile: { id: profile_id },
      } = session;
      const { title, category } = input;

      return prisma.question.create({
        data: {
          title,
          category: { connect: { id: category } },
          owner: { connect: { profile_id } },
        },
      });
    }),
});
