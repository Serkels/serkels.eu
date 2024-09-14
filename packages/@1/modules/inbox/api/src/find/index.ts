// //

import type { Prisma, PrismaClient } from "@1.infra/database";
import { next_auth_procedure, with_next_cursor } from "@1.modules/trpc";
import { match, P } from "ts-pattern";
import { z } from "zod";

// //

const get_student_id = (prisma: PrismaClient) => (profile_id: string) => {
  return prisma.student.findFirstOrThrow({
    select: { id: true },
    where: { profile_id },
  });
};

// const get_inbox_threads = (prisma: PrismaClient) => (student_id: string) => {
//   return prisma.inboxThread.findMany({
//     where: { owner_id: student_id },
//   });
// };

// //

const input_schema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(10).default(10),
  search: z.string().optional(),
});

const where_search_input = (search: string | undefined) =>
  match(search)
    .with(
      P.string,
      (value): Prisma.InboxThreadWhereInput => ({
        OR: [
          {
            thread: {
              participants: {
                some: { name: { contains: value, mode: "insensitive" } },
              },
            },
          },
          {
            thread: {
              messages: {
                some: {
                  content: { contains: value, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }),
    )
    .otherwise(() => ({}));

export default next_auth_procedure
  .input(input_schema)
  .query(async ({ ctx: { payload, prisma }, input }) => {
    const { profile } = payload;
    const { cursor, limit, search } = input;
    const { id: student_id } = await get_student_id(prisma)(profile.id);

    const search_where = where_search_input(search);

    const data = await prisma.inboxThread.findMany({
      ...(cursor
        ? {
            cursor: {
              owner_id_thread_id: { owner_id: student_id, thread_id: cursor },
            },
          }
        : {}),
      orderBy: [{ thread: { updated_at: "desc" } }],
      include: { thread: { select: { id: true, updated_at: true } } },
      take: limit + 1,
      where: { owner_id: student_id, ...search_where },
    });

    return with_next_cursor(limit, data)((item) => item.thread_id);
  });
