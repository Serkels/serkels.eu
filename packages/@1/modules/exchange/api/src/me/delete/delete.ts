//

import { router, session_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export default router({
  delete: session_procedure
    .input(z.object({ exchange_id: z.string() }))
    .mutation(({ input: { exchange_id }, ctx: { prisma, session } }) => {
      const { id: profile_id } = session.profile;
      return prisma.exchange.delete({
        where: { id: exchange_id, owner: { profile_id } },
      });
    }),
});
