//

import {
  Opportunity_Schema,
  type Opportunity,
} from "@1.modules/opportunity.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const opportunity_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return Opportunity_Schema.parse(
        await prisma.opportunity.findFirstOrThrow({ where: { id } }),
      ) as Opportunity;
    }),
});

export default opportunity_api_router;
export type OpportunityApiRouter = typeof opportunity_api_router;
