//

import type { Prisma } from "@1.infra/database";
import {
  router,
  session_procedure,
  with_previous_cursor,
} from "@1.modules/trpc";
import { z } from "zod";

//

export default router({
  find: session_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ input, ctx: { prisma, session } }) => {
      const { cursor, limit } = input;
      const { id: owner_id } = session.profile;
      const message_select: Prisma.MessageSelect = {
        author: { select: { name: true, id: true, image: true } },
        thread_id: true,
      };

      const items = await prisma.notification.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { created_at: "desc" },
        take: limit + 1,
        where: { owner_id },
        include: {
          inbox_message: { select: { message: { select: message_select } } },
          exchange_message: {
            select: {
              exchange: {
                select: {
                  id: true,
                  owner: {
                    select: {
                      profile: {
                        select: { id: true, name: true, image: true },
                      },
                    },
                  },
                  title: true,
                },
              },
              message: { select: message_select },
            },
          },
          forum_message: {
            select: {
              answer: {
                select: {
                  owner: {
                    select: {
                      profile_id: true,
                      profile: { select: { name: true, image: true } },
                    },
                  },
                  parent_id: true,
                  parent: { select: { id: true, title: true } },
                },
              },
              answer_id: true,
            },
          },
          profile_added: {
            select: {
              profile: { select: { name: true, id: true, image: true } },
            },
          },
        },
      });

      return with_previous_cursor(limit, items)((item) => item.id);
    }),
});
