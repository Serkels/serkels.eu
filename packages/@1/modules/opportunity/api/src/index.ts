//

import { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import slugify from "slugify";
import { z } from "zod";
import find_router from "./find";

//

const opportunity_api_router = router({
  create: next_auth_procedure
    .input(Opportunity_Create_Schema)
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const { profile } = payload;
      const { is_online, category, ...input_data } = input;
      const { id: partner_id } = await prisma.partner.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      let slug;
      do {
        slug = slugify(input.title).toLowerCase();
      } while (
        (await prisma.opportunity.findUnique({ where: { slug } })) !== null
      );

      return prisma.opportunity.create({
        data: {
          ...input_data,
          slug,
          location: is_online ? null : String(input.location),
          owner: { connect: { id: partner_id } },
          category: { connect: { id: category } },
        },
      });
    }),

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
