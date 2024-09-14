//

import type { Prisma, PrismaClient } from "@1.infra/database";
import type { ID_Schema } from "@1.modules/core/domain";
import { next_auth_procedure, with_previous_cursor } from "@1.modules/trpc";
import { z } from "zod";

//

const input_schema = z.object({
  thread_id: z.string(),
  cursor: z.date().optional(),
  limit: z.number().min(1).max(10).default(10),
});

const is_participating_thread = (
  profile_id: ID_Schema,
): Prisma.MessageWhereInput => ({
  thread: { participants: { some: { id: profile_id } } },
});

const is_delivered = (profile_id: ID_Schema): Prisma.MessageWhereInput => ({
  NOT: [{ author: { id: { not: profile_id } }, delivered: false }],
});
const get_messages =
  (
    prisma: PrismaClient,
    profile_id: string,
    input: z.infer<typeof input_schema>,
  ) =>
  (thread_id: string) => {
    const { cursor, limit } = input;
    return prisma.message.findMany({
      ...(cursor
        ? {
            cursor: {
              unique_date_in_thread: { thread_id, created_at: cursor },
            },
          }
        : {}),
      include: { author: true },
      orderBy: { created_at: "desc" },
      take: limit + 1,
      where: {
        AND: [
          { thread: { id: thread_id } },
          is_participating_thread(profile_id),
          is_delivered(profile_id),
        ],
      },
    });
  };

export default next_auth_procedure
  .input(input_schema)
  .query(async ({ ctx: { payload, prisma }, input }) => {
    const { profile } = payload;
    const { limit, thread_id: id } = input;
    const messages = await get_messages(prisma, profile.id, input)(id);
    return with_previous_cursor(limit, messages)((item) => item.created_at);
  });
