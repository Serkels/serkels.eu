//

import type { Prisma } from "@1.infra/database";
import { next_auth_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export default next_auth_procedure
  .input(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(10).default(10),
    }),
  )
  .query(async ({ input, ctx: { prisma, payload } }) => {
    const { cursor, limit } = input;
    const { id: owner_id } = payload.profile;
    const message_select: Prisma.MessageSelect = {
      author: { select: { name: true } },
      thread_id: true,
    };

    const items = await prisma.notification.findMany({
      ...(cursor ? { cursor: { id: cursor } } : {}),
      orderBy: { created_at: "desc" },
      take: limit + 1,
      where: { owner_id },
      include: {
        inbox_message: {
          select: {
            message: {
              select: message_select,
            },
          },
        },
        exchange_message: {
          select: {
            exchange_id: true,
            exchange: {
              select: { owner: { select: { profile_id: true } }, title: true },
            },
            message: {
              select: message_select,
            },
          },
        },
        forum_message: {
          select: {
            answer: {
              select: {
                owner: {
                  select: {
                    profile_id: true,
                    profile: { select: { name: true } },
                  },
                },
                parent_id: true,
                parent: { select: { id: true, title: true } },
              },
            },
            answer_id: true,
          },
        },
      },
    });

    let prevCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop()!;
      prevCursor = nextItem.id;
    }

    return { data: items, prevCursor };
  });
