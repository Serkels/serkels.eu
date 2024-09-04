//

import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import create from "./create";
import delete_router from "./delete";
import find_router from "./find";

//

const opportunity_api_router = router({
  create: create,
  delete: delete_router,

  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.opportunity.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          owner: { include: { profile: true } },
        },
      });
    }),

  by_slug: next_auth_procedure
    .input(z.string())
    .query(async ({ input: slug, ctx: { prisma } }) => {
      return prisma.opportunity.findUniqueOrThrow({
        where: { slug },
        include: {
          category: true,
          owner: { include: { profile: true } },
        },
      });
    }),
  //
  by_profile_id: procedure
    .input(z.object({ profile_id: z.string(), cursor: z.string().optional() }))
    .query(async ({ input: { profile_id }, ctx: { prisma } }) => {
      const data = await prisma.opportunity.findMany({
        where: { owner: { profile_id } },
        orderBy: { expiry_date: "asc" },
        include: {
          category: true,
          owner: { include: { profile: true } },
        },
      });
      return { data };
    }),

  //

  find: find_router,
});

export default opportunity_api_router;
export type OpportunityApiRouter = typeof opportunity_api_router;
