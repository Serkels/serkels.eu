//

import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const inbox_api_router = router({
  //

  find: next_auth_procedure.query(async ({ ctx: { payload, prisma } }) => {
    const { profile } = payload;
    const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id: profile.id },
    });
    return prisma.inboxThread.findMany({
      where: { owner_id: studient_id },
    });
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
          limit: z.number().min(1).max(10).default(2),
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
          take: limit + 1,
          where: { thread: { id, participants: { some: { id: profile.id } } } },
          include: { author: true },
          orderBy: { created_at: "desc" },
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
