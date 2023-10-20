//

import { procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const exchange_api_router = router({
  by_id: procedure
    .input(z.string())
    .query(async ({ input: id, ctx: { prisma } }) => {
      return prisma.exchange.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          in_exchange_of: true,
          owner: { include: { profile: true } },
          participants: true,
        },
      });
    }),

  find: procedure
    .input(
      z.object({
        category: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
        search: z.string().optional(),
      }),
    )
    .query(
      async ({
        input: { category, cursor, limit, search },
        ctx: { prisma },
      }) => {
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
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop()!;
          nextCursor = nextItem.id;
        }

        return { data: items, nextCursor };
      },
    ),
});

export default exchange_api_router;
export type ExchangeApiRouter = typeof exchange_api_router;
