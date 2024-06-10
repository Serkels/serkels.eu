//

import { next_auth_procedure } from "@1.modules/trpc";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

//

export const find = next_auth_procedure
  .input(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(10).default(10),
      search: z.string().optional(),
    }),
  )
  .query(async ({ input, ctx: { payload, prisma } }) => {
    const { profile } = payload;
    const { cursor, limit, search } = input;

    const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id: profile.id },
    });

    const search_where: Prisma.ExchangeWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            {
              owner: {
                profile: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {};

    const deal_releated_to_me_where: Prisma.DealWhereInput = {
      OR: [
        { participant_id: studient_id },
        {
          parent: { owner_id: studient_id },
        },
      ],
    };

    const find_cursor = cursor
      ? ({
          participant_per_exchange: {
            parent_id: cursor,
            participant_id: profile.id,
          },
        } as Prisma.DealWhereUniqueInput)
      : {};

    const deals = await prisma.deal.findMany({
      ...find_cursor,
      orderBy: { updated_at: "desc" },
      select: { parent: true },
      take: limit + 1,
      where: { ...deal_releated_to_me_where, parent: { ...search_where } },
      distinct: ["parent_id"],
    });

    const data = deals.map(({ parent }) => parent);

    let next_cursor: typeof cursor | undefined = undefined;
    if (data.length > limit) {
      const next_item = data.pop()!;
      next_cursor = next_item.id;
    }

    return { data, next_cursor };
  });
