//

import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const inbox_api_router = router({
  //

  find: next_auth_procedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(10).default(10),
      }),
    )
    .query(async ({ ctx: { payload, prisma }, input }) => {
      const { profile } = payload;
      const { cursor, limit } = input;
      const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      const data = await prisma.inboxThread.findMany({
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { thread: { updated_at: "asc" } },
        take: limit + 1,
        where: { owner_id: studient_id },
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
      return prisma.inboxThread.findUniqueOrThrow({
        include: {
          thread: {
            include: {
              participants: { select: { id: true, name: true, image: true } },
              messages: { take: 1, orderBy: { created_at: "desc" } },
            },
          },
        },
        where: { owner_id: studient_id, id },
      });
    }),

  //

  thread: router({
    by_id: next_auth_procedure
      .input(z.string())
      .query(async ({ ctx: { payload, prisma }, input: id }) => {
        const { profile } = payload;
        return prisma.thread.findUniqueOrThrow({
          where: { id, participants: { some: { id: profile.id } } },
          include: { participants: true },
        });
      }),

    //

    messages: next_auth_procedure
      .input(
        z.object({
          thread_id: z.string(),
          cursor: z.date().optional(),
          limit: z.number().min(1).max(10).default(10),
        }),
      )
      .query(async ({ ctx: { payload, prisma }, input }) => {
        const { profile } = payload;
        const { cursor, limit, thread_id: id } = input;
        const data = await prisma.message.findMany({
          ...(cursor
            ? {
                cursor: {
                  unique_date_in_thread: { thread_id: id, created_at: cursor },
                },
              }
            : {}),
          include: { author: true },
          orderBy: { created_at: "desc" },
          take: limit + 1,
          where: { thread: { id, participants: { some: { id: profile.id } } } },
        });

        let prevCursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const prev_item = data.pop()!;
          prevCursor = prev_item.created_at;
        }

        return { data, prevCursor };
      }),
  }),
});

export default inbox_api_router;
export type InboxApiRouter = typeof inbox_api_router;
