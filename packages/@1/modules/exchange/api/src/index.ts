//

import { Exchange_Filter } from "@1.modules/exchange.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { match } from "ts-pattern";
import { z } from "zod";

//

const exchange_api_router = router({
  //

  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.exchange.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          return: true,
          owner: { include: { profile: true } },
          participants: true,
        },
      });
    }),

  //

  by_particitpant: procedure
    .input(
      z.object({
        profile_id: z.string(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { profile_id, limit } = input;

      const data = await prisma.exchange.findMany({
        take: limit,
        where: { participants: { some: { profile_id } } },
        orderBy: { created_at: "asc" },
      });

      return { data };
    }),

  //

  by_profile: procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
        profile_id: z.string(),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { cursor, profile_id, limit } = input;

      const data = await prisma.exchange.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        take: limit,
        where: { owner: { profile_id: profile_id } },
        orderBy: { created_at: "asc" },
      });

      let next_cursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const next_item = data.pop()!;
        next_cursor = next_item.id;
      }

      return { data, next_cursor };
    }),

  //

  me: router({
    find_active: next_auth_procedure
      .input(
        z.object({
          cursor: z.string().optional(),
          limit: z.number().min(1).max(10).default(10),
        }),
      )
      .query(async ({ input, ctx: { payload, prisma } }) => {
        const { profile } = payload;
        const { cursor, limit } = input;

        const data = await prisma.exchange.findMany({
          ...(cursor ? { cursor: { id: cursor } } : {}),
          take: limit,
          where: {
            active: true,
            OR: [
              { owner: { profile_id: profile.id } },
              { participants: { some: { profile_id: profile.id } } },
            ],
          },
          orderBy: { updated_at: "asc" },
        });

        let next_cursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const next_item = data.pop()!;
          next_cursor = next_item.id;
        }

        return { data, next_cursor };
      }),
  }),

  //

  find: procedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.string().optional(),
        filter: Exchange_Filter.default(Exchange_Filter.Enum.ALL),
        limit: z.number().min(1).max(10).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { category, cursor, limit, search, filter } = input;
      type ExchangeWhere = NonNullable<
        Parameters<typeof prisma.exchange.findMany>[0]
      >["where"];
      const nerrow = match(filter)
        .with(Exchange_Filter.Enum.ALL, (): ExchangeWhere => ({}))
        .with(
          Exchange_Filter.Enum.ONLINE,
          (): ExchangeWhere => ({ is_online: true }),
        )
        .with(
          Exchange_Filter.Enum.ON_SITE,
          (): ExchangeWhere => ({ is_online: false }),
        )
        .with(
          Exchange_Filter.Enum.WITH_RETURN,
          (): ExchangeWhere => ({ return: { isNot: null } }),
        )
        .with(
          Exchange_Filter.Enum.WITHOUT_RETURN,
          (): ExchangeWhere => ({ return: null }),
        )
        .exhaustive();

      const items = await prisma.exchange.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { created_at: "asc" },
        take: limit + 1,
        where: {
          OR: [
            { title: { contains: search ?? "" } },
            { description: { contains: search ?? "" } },
          ],
          ...(category ? { category: { slug: category } } : {}),
          ...nerrow,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { data: items, nextCursor };
    }),

  //
});

export default exchange_api_router;
export type ExchangeApiRouter = typeof exchange_api_router;
