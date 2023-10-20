//

import { Exchange_Schema, type Exchange } from "@1.modules/exchange.domain";
import { next_auth_procedure, procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const exchange_api_router = router({
  by_id: next_auth_procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return Exchange_Schema.parse(
        await prisma.exchange.findFirstOrThrow({ where: { id } }),
      ) as Exchange;
    }),

  find: procedure
    .input(
      z.object({
        cursor: z.date().default(new Date()),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input: { cursor, limit }, ctx: { prisma } }) => {
      const items = await prisma.exchange.findMany({
        cursor: { created_at: cursor },
        orderBy: { created_at: "asc" },
        take: limit + 1,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.created_at;
      }
      return { items, nextCursor };
    }),
});

export default exchange_api_router;
export type ExchangeApiRouter = typeof exchange_api_router;
