//

import { mergeRouters, procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import { create_api_router } from "./create";
import delete_router from "./delete";
import find_router from "./find";
import { update_api_router } from "./update";

//

const opportunity_api_router = router({
  delete: delete_router,

  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.opportunity.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          owner: {
            select: {
              profile: { select: { id: true, image: true, name: true } },
            },
          },
        },
      });
    }),

  by_slug: procedure
    .input(z.string())
    .query(async ({ input: slug, ctx: { prisma } }) => {
      return prisma.opportunity.findUniqueOrThrow({
        where: { slug },
        include: {
          category: true,
          owner: {
            select: {
              profile: { select: { id: true, image: true, name: true } },
            },
          },
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

export default mergeRouters(
  create_api_router,
  opportunity_api_router,
  update_api_router,
);
export type OpportunityApiRouter = typeof opportunity_api_router;
