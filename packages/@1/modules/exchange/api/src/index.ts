//

import {
  Deal_Status_Schema,
  Exchange_Create_Schema,
  Exchange_Filter,
} from "@1.modules/exchange.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { Prisma } from "@prisma/client";
import { match } from "ts-pattern";
import { z } from "zod";
import { me } from "./me";

const exchange_api_router = router({
  //

  create: next_auth_procedure
    .input(Exchange_Create_Schema)
    .mutation(async ({ input, ctx: { prisma, payload } }) => {
      const {
        profile: { id: profile_id },
      } = payload;

      const { category_id, return_id, ...input_data } = input;

      return prisma.exchange.create({
        data: {
          ...input_data,
          category: { connect: { id: category_id } },
          is_active: true,
          owner: { connect: { profile_id } },
          return: return_id ? { connect: { id: return_id } } : {},
        },
      });
    }),
  //

  me,

  //

  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.exchange.findUniqueOrThrow({
        include: {
          category: true,
          return: true,
          owner: { include: { profile: true } },
          deals: { where: { status: Deal_Status_Schema.Enum.APPROVED } },
        },
        where: { id },
      });
    }),

  //

  by_particitpant: next_auth_procedure
    .input(
      z.object({
        profile_id: z.string(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { prisma } }) => {
      const { profile_id, limit } = input;

      const data = await prisma.exchange.findMany({
        include: {
          category: true,
          return: true,
          owner: { include: { profile: true } },
          deals: { where: { status: Deal_Status_Schema.Enum.APPROVED } },
        },
        orderBy: { updated_at: "asc" },
        take: limit,
        where: {
          is_active: false,
          deals: {
            every: {
              participant: { profile_id },
              status: Deal_Status_Schema.Enum.APPROVED,
            },
          },
        },
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
        include: {
          category: true,
          return: true,
          owner: { include: { profile: true } },
          deals: { where: { status: Deal_Status_Schema.Enum.APPROVED } },
        },
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

  find: next_auth_procedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.string().optional(),
        filter: Exchange_Filter.default(Exchange_Filter.Enum.ALL),
        limit: z.number().min(1).max(10).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx: { prisma, payload } }) => {
      const {
        profile: { id: profile_id },
      } = payload;
      const { category, cursor, limit, search, filter } = input;
      type ExchangeWhere = Prisma.ExchangeWhereInput;
      const nerrow = match(filter)
        .with(Exchange_Filter.Enum.ALL, (): ExchangeWhere => ({}))
        .with(
          Exchange_Filter.Enum.DATE_FLEXIBLE,
          (): ExchangeWhere => ({ expiry_date: null }),
        )
        .with(
          Exchange_Filter.Enum.DATE_LIMITED,
          (): ExchangeWhere => ({ expiry_date: { not: null } }),
        )
        .with(
          Exchange_Filter.Enum.MY_FOLLOWS,
          (): ExchangeWhere => ({
            owner: { profile: { followed_by: { some: { id: profile_id } } } },
          }),
        )
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
        orderBy: [{ created_at: "desc" }, { expiry_date: "desc" }],
        take: limit + 1,
        where: {
          OR: [
            { title: { contains: search ?? "", mode: "insensitive" } },
            { description: { contains: search ?? "", mode: "insensitive" } },
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
