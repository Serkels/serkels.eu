//

import { next_auth_procedure } from "@1.modules/trpc";
import { z } from "zod";

//

export const deal_update = next_auth_procedure
  .input(
    z.object({
      exchange_id: z.string(),
      thread_id: z.string(),
    }),
  )
  .mutation(async ({ ctx: { payload, prisma }, input }) => {
    const { exchange_id, thread_id } = input;
    const {
      profile: { id: profile_id },
    } = payload;
    const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id },
    });

    const deal = await prisma.deal.findFirstOrThrow({
      select: { id: true },
      where: {
        parent_id: exchange_id,
        exchange_threads: { some: { thread_id, owner_id: studient_id } },
      },
    });

    return prisma.deal.update({
      data: {
        updated_at: new Date(),
      },
      where: { id: deal.id },
    });
  });
