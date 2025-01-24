//

import type { PrismaClient } from "@1.infra/database";
import { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import slugify from "slugify";

//

export default router({
  create: next_auth_procedure
    .use(async function inject_behavior({ ctx, next }) {
      const { prisma } = ctx;
      const is_existing_slug_repository = create_is_existing_slug_repository({
        prisma,
      });
      const get_unique_slug = create_unique_slug(is_existing_slug_repository);
      return next({
        ctx: { ...ctx, behavior: { unique_slug: get_unique_slug } },
      });
    })
    .input(Opportunity_Create_Schema)
    .mutation(async ({ input, ctx: { prisma, payload, behavior } }) => {
      const { profile } = payload;
      const { id: partner_id } = await prisma.partner.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const slug = await behavior.unique_slug(input.title);

      return prisma.opportunity.create({
        data: {
          ...input,
          slug,
          owner_id: partner_id,
        },
      });
    }),
});

//

interface IsExistingSlug_Repository {
  is_existing_slug: (slug: string) => Promise<boolean>;
}
function create_unique_slug({ is_existing_slug }: IsExistingSlug_Repository) {
  return async function unique_slug(text: string, count = 0) {
    const slug = slugify(count > 0 ? `${text}-${count}` : text, {
      strict: true,
    }).toLocaleLowerCase();

    if (await is_existing_slug(slug)) {
      return unique_slug(text, count + 1);
    }

    return slug;
  };
}

//

function create_is_existing_slug_repository({
  prisma,
}: {
  prisma: PrismaClient;
}): IsExistingSlug_Repository {
  return {
    async is_existing_slug(slug: string) {
      return (
        (await prisma.opportunity.findUnique({
          select: { id: true },
          where: { slug },
        })) !== null
      );
    },
  };
}
