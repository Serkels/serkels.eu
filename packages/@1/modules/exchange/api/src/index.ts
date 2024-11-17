//

import type { Prisma } from "@1.infra/database";
import {
  Deal_Status_Schema,
  Exchange_Create_Schema,
} from "@1.modules/exchange.domain";
import {
  mergeRouters,
  next_auth_procedure,
  procedure,
  router,
} from "@1.modules/trpc";
import { z } from "zod";
import { me } from "./me";
import by_id_api_router from "./public/by_id";
import find_api_router from "./public/find";

//

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
          location: input_data.location ?? null,
          expiry_date: input_data.expiry_date ?? null,
          category: { connect: { id: category_id } },
          is_active: true,
          owner: { connect: { profile_id } },
          return: return_id ? { connect: { id: return_id } } : {},
        },
      });
    }),
  //

  me: me,

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

      const unactive_owned_exchanges_where: Prisma.ExchangeWhereInput = {
        is_active: false,
        owner: { profile_id },
      };
      const unactive_participating_exchanges_where: Prisma.ExchangeWhereInput =
        {
          is_active: false,
          deals: {
            some: {
              participant: { profile_id },
              status: Deal_Status_Schema.Enum.APPROVED,
            },
          },
        };

      const data = await prisma.exchange.findMany({
        include: {
          category: true,
          return: true,
          owner: { include: { profile: true } },
          deals: { where: { status: Deal_Status_Schema.Enum.APPROVED } },
        },
        orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
        take: limit,
        where: {
          OR: [
            unactive_owned_exchanges_where,
            unactive_participating_exchanges_where,
          ],
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
          deals: {
            select: { id: true },
            where: { status: Deal_Status_Schema.Enum.APPROVED },
          },
        },
        take: limit,
        where: {
          OR: [{ expiry_date: { gte: new Date() } }, { expiry_date: null }],
          is_active: true,
          owner: { profile_id },
        },
        orderBy: [{ created_at: "desc" }],
      });

      let next_cursor: typeof cursor | undefined = undefined;
      if (data.length > limit) {
        const next_item = data.pop()!;
        next_cursor = next_item.id;
      }

      return { data, next_cursor };
    }),

  //
});

export default mergeRouters(
  by_id_api_router,
  exchange_api_router,
  find_api_router,
);
export type ExchangeApiRouter = typeof exchange_api_router;
