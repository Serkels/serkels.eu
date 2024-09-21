//

import type { Prisma } from "@1.infra/database";
import { Partner_Filter } from "@1.modules/opportunity.domain";
import { maybe_next_auth_procedure, with_next_cursor } from "@1.modules/trpc";
import { startOfToday } from "date-fns";
import { match, P } from "ts-pattern";
import { z } from "zod";

//

const input_schema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  filter: Partner_Filter.default(Partner_Filter.Enum.ALL),
  limit: z.number().min(1).max(12).default(12),
  search: z.string().optional(),
});

//

const where_category_input = (category: string | undefined) =>
  match(category)
    .with(
      P.string,
      (value): Prisma.OpportunityWhereInput => ({
        category: { slug: value },
      }),
    )
    .otherwise(() => ({}));

const where_filter_input = (
  filter: z.infer<typeof Partner_Filter>,
  profile_id?: string | undefined,
): Prisma.OpportunityWhereInput =>
  match(filter)
    .with(Partner_Filter.Enum.MY_OPPORTUNITIES, () => ({
      owner: { profile_id },
    }))
    .with(Partner_Filter.Enum.ALL, () => ({
      expiry_date: { gte: startOfToday() },
    }))
    .otherwise(() => ({}));

const where_not_expired_input = (): Prisma.OpportunityWhereInput => ({
  expiry_date: { gte: startOfToday() },
});
const where_not_in_profile_blacklist_input = (profile_id: string | undefined) =>
  match(profile_id)
    .with(
      P.string,
      (value): Prisma.OpportunityWhereInput => ({
        AND: [
          {
            owner: { profile: { blacklist: { none: { profile_id: value } } } },
          },
          {
            owner: {
              profile: { blacklisted_by: { none: { owner_id: value } } },
            },
          },
        ],
      }),
    )
    .otherwise(() => ({}));

const where_search_input = (
  search: string | undefined,
): Prisma.OpportunityWhereInput => ({
  OR: [
    { title: { contains: search ?? "", mode: "insensitive" } },
    { description: { contains: search ?? "", mode: "insensitive" } },
    { location: { contains: search ?? "", mode: "insensitive" } },
    {
      owner: {
        profile: {
          name: { contains: search ?? "", mode: "insensitive" },
        },
      },
    },
  ],
});

//

export default maybe_next_auth_procedure
  .input(input_schema)
  .query(async ({ ctx: { payload, prisma }, input }) => {
    const { limit, category, cursor, search, filter } = input;

    const where_category = where_category_input(category);
    const where_filter = match(payload.profile)
      .with({ role: "PARTNER" }, ({ id: profile_id }) =>
        where_filter_input(filter, profile_id),
      )
      .otherwise(() => ({}));
    const where_not_expired = where_not_expired_input();
    const where_not_in_profile_blacklist = match(payload.profile)
      .with(P.nonNullable, ({ id: profile_id }) =>
        where_not_in_profile_blacklist_input(profile_id),
      )
      .otherwise(() => ({}));
    const where_search = where_search_input(search);

    const items = await prisma.opportunity.findMany({
      ...(cursor ? { cursor: { id: cursor } } : {}),
      orderBy: { expiry_date: "asc" },
      take: limit + 1,
      select: {
        id: true,
        category: { select: { id: true, name: true, slug: true } },
        cover: true,
        created_at: true,
        description: true,
        expiry_date: true,
        location: true,
        owner: {
          select: {
            profile: { select: { id: true, name: true, image: true } },
          },
        },
        slug: true,
        title: true,
        updated_at: true,
      },
      where: {
        AND: [
          where_category,
          where_filter,
          where_not_expired,
          where_not_in_profile_blacklist,
          where_search,
        ],
      },
    });

    return with_next_cursor(limit, items)((item) => item.id);
  });
