//

import { ID_Schema } from "@1.modules/core/domain";
import { router, session_procedure } from "@1.modules/trpc";

//

export default router({
  delete: session_procedure
    .input(ID_Schema)
    .mutation(async ({ input: id, ctx: { prisma, session } }) => {
      return prisma.question.delete({
        where: { id, owner: { profile_id: session.profile.id } },
      });
    }),
});
