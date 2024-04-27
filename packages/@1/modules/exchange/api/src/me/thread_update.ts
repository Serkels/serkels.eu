//

import { next_auth_procedure } from "@1.modules/trpc";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

//

export const thread_update = next_auth_procedure
  .input(z.object({ thread_id: z.string() }))
  .mutation(async ({ ctx: { payload, prisma }, input }) => {
    const { thread_id } = input;
    const {
      profile: { id: profile_id },
    } = payload;
    const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
      select: { id: true },
      where: { profile_id },
    });

    const owner_id_thread_id: Prisma.ExchangeThreadOwner_idThread_idCompoundUniqueInput =
      { owner_id: studient_id, thread_id };

    return prisma.exchangeThread.update({
      data: { last_seen_date: new Date() },
      where: { owner_id_thread_id },
    });
  });
