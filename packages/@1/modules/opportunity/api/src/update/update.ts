//

import { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

export default router({
  update: next_auth_procedure
    .input(Opportunity_Create_Schema.merge(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const { id, ...opportunity } = input;
      const { profile } = payload;
      const { id: partner_id } = await prisma.partner.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });
      return prisma.opportunity.update({
        data: opportunity,
        where: { id, owner_id: partner_id },
      });
    }),
});
