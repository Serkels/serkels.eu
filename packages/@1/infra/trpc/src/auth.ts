//

import { procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

export default router({
  verify: procedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx: { prisma }, input: { email } }) => {
      return await prisma.user.findUnique({
        select: { id: true },
        where: { email },
      });
    }),
});
