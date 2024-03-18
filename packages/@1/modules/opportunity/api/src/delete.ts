//

import { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure } from "@1.modules/trpc";

//

export default next_auth_procedure
  .input(ID_Schema)
  .mutation(async ({ input: opportunity_id, ctx: { prisma, payload } }) => {
    const {
      profile: { id: profile_id },
    } = payload;

    return prisma.opportunity.delete({
      where: { id: opportunity_id, owner: { profile_id } },
    });
  });
