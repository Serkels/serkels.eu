//

import { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { next_auth_procedure } from "@1.modules/trpc";
import slugify from "slugify";

//

export default next_auth_procedure
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
  });
