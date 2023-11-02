//

import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

export const me = router({
  //
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
          is_active: true,
          OR: [
            { owner: { profile_id: profile.id } },
            {
              deals: {
                some: { participant: { profile: { id: profile.id } } },
              },
            },
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

  //

  inbox: router({
    by_exchange_id: next_auth_procedure
      .input(
        z.object({
          exchange_id: z.string(),
          cursor: z.string().optional(),
          limit: z.number().min(1).max(10).default(10),
        }),
      )
      .query(async ({ ctx: { payload, prisma }, input }) => {
        const { profile } = payload;
        const { cursor, exchange_id, limit } = input;
        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });

        const data = await prisma.exchangeThread.findMany({
          ...(cursor ? { cursor: { id: cursor } } : {}),
          orderBy: {
            // deal: { status: "asc" },
            thread: { updated_at: "asc" },
          },
          take: limit + 1,
          where: { owner_id: studient_id, deal: { parent_id: exchange_id } },
        });

        let next_cursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const next_item = data.pop()!;
          next_cursor = next_item.id;
        }

        return { data, next_cursor };
      }),

    //
    by_id: next_auth_procedure
      .input(z.string())
      .query(async ({ ctx: { payload, prisma }, input: id }) => {
        const { profile } = payload;
        const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
          select: { id: true },
          where: { profile_id: profile.id },
        });
        return prisma.exchangeThread.findUniqueOrThrow({
          include: {
            deal: true,
            thread: {
              include: {
                participants: {
                  select: { id: true, name: true, image: true },
                },
                messages: { take: 1, orderBy: { created_at: "desc" } },
              },
            },
          },
          where: { owner_id: studient_id, id },
        });
      }),
  }),
  //
});
