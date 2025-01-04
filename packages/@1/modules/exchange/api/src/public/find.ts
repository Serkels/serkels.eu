//

import type { Prisma } from "@1.infra/database";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import {
  maybe_session_procedure,
  router,
  with_next_cursor,
} from "@1.modules/trpc";
import { endOfYesterday } from "date-fns";
import { match, P } from "ts-pattern";
import { z } from "zod";

//

const input_schema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  filter: Exchange_Filter.default(Exchange_Filter.Enum.ALL),
  limit: z.number().min(1).max(10).default(10),
  search: z.string().optional(),
});

//

export default router({
  find: maybe_session_procedure
    .input(input_schema)
    .query(async ({ ctx: { session, prisma }, input }) => {
      const { limit, category, cursor, search } = input;
      const nerrow = match({ session, input })
        .with(
          { session: { profile: { role: "STUDENT" } } },
          ({
            session: {
              profile: { id: profile_id },
            },
            input: { filter },
          }) => profile_filter(profile_id, filter),
        )
        .otherwise(() => ({}));

      const search_where: Prisma.ExchangeWhereInput = {
        OR: [
          { title: { contains: search ?? "", mode: "insensitive" } },
          {
            description: { contains: search ?? "", mode: "insensitive" },
          },
          { location: { contains: search ?? "", mode: "insensitive" } },
          {
            owner: {
              profile: {
                name: { contains: search ?? "", mode: "insensitive" },
              },
            },
          },
        ],
      };

      const active_exchanges_where: Prisma.ExchangeWhereInput = {
        is_active: true,
        OR: [{ expiry_date: null }, { expiry_date: { gte: endOfYesterday() } }],
      };
      const category_where: Prisma.ExchangeWhereInput = category
        ? { category: { slug: category } }
        : {};

      const where_not_in_profile_blacklist = match(session?.profile)
        .with(
          { id: P.select() },
          (profile_id): Prisma.ExchangeWhereInput => ({
            AND: [
              { owner: { profile: { blacklist: { none: { profile_id } } } } },
              {
                owner: {
                  profile: {
                    blacklisted_by: { none: { owner_id: profile_id } },
                  },
                },
              },
            ],
          }),
        )
        .otherwise(() => ({}));

      const items = await prisma.exchange.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: [
          { expiry_date: { sort: "asc", nulls: "last" } },
          { created_at: "desc" },
          { id: "desc" },
        ],
        take: limit + 1,
        where: {
          AND: [
            where_not_in_profile_blacklist,
            search_where,
            active_exchanges_where,
            category_where,
            nerrow,
          ],
        },
      });

      return with_next_cursor(limit, items)((item) => item.id);
    }),
});

function profile_filter(
  profile_id: string,
  filter: z.infer<typeof Exchange_Filter>,
) {
  return match(filter)
    .with(Exchange_Filter.Enum.ALL, (): Prisma.ExchangeWhereInput => ({}))
    .with(
      Exchange_Filter.Enum.DATE_FLEXIBLE,
      (): Prisma.ExchangeWhereInput => ({ expiry_date: null }),
    )
    .with(
      Exchange_Filter.Enum.DATE_LIMITED,
      (): Prisma.ExchangeWhereInput => ({ expiry_date: { not: null } }),
    )
    .with(
      Exchange_Filter.Enum.MY_CIRCLES,
      (): Prisma.ExchangeWhereInput => ({
        owner: { profile: { in_contact_with: { some: { id: profile_id } } } },
      }),
    )
    .with(
      Exchange_Filter.Enum.ONLINE,
      (): Prisma.ExchangeWhereInput => ({ is_online: true }),
    )
    .with(
      Exchange_Filter.Enum.ON_SITE,
      (): Prisma.ExchangeWhereInput => ({ is_online: false }),
    )
    .with(
      Exchange_Filter.Enum.WITH_RETURN,
      (): Prisma.ExchangeWhereInput => ({ return: { isNot: null } }),
    )
    .with(
      Exchange_Filter.Enum.WITHOUT_RETURN,
      (): Prisma.ExchangeWhereInput => ({ return: null }),
    )
    .exhaustive();
}
