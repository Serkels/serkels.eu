//

import { Exchange_Filter } from "@1.modules/exchange.domain";
import {
  next_auth_procedure,
  procedure,
  router,
  type inferProcedureInput,
} from "@1.modules/trpc";
import type { Prisma } from "@prisma/client";
import { endOfYesterday } from "date-fns";
import { match, P } from "ts-pattern";
import { z } from "zod";

//

const public_schema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(10).default(10),
  search: z.string().optional(),
});

const public_procedure = procedure.input(public_schema);
const private_procedure = next_auth_procedure.input(
  public_schema.extend({
    filter: Exchange_Filter.default(Exchange_Filter.Enum.ALL),
  }),
);

export default router({
  public: public_procedure.query(find_resolver),
  private: private_procedure.query(find_resolver),
});

async function find_resolver(
  options:
    | inferProcedureInput<typeof public_procedure>
    | inferProcedureInput<typeof private_procedure>,
) {
  type ExchangeWhere = Prisma.ExchangeWhereInput;
  const {
    ctx: { prisma },
    input: { limit, category, cursor, search },
  } = options;

  const nerrow = match(options)
    .with(
      { ctx: { payload: P._ } },
      ({
        ctx: {
          payload: {
            profile: { id: profile_id },
          },
        },
        input: { filter },
      }) => profile_filter(profile_id, filter),
    )
    .otherwise(() => ({}));

  const search_where: ExchangeWhere = {
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

  const active_exchanges_where: ExchangeWhere = {
    OR: [{ expiry_date: null }, { expiry_date: { gte: endOfYesterday() } }],
  };
  const category_where: ExchangeWhere = category
    ? { category: { slug: category } }
    : {};

  const items = await prisma.exchange.findMany({
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: [{ expiry_date: "asc" }, { created_at: "desc" }],
    take: limit + 1,
    where: {
      AND: [search_where, active_exchanges_where, category_where, nerrow],
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop()!;
    nextCursor = nextItem.id;
  }

  return { data: items, nextCursor };
}

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
        owner: { profile: { followed_by: { some: { id: profile_id } } } },
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
