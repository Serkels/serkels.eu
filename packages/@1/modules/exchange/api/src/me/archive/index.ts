//

import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";

//

const input_schema = z.object({
  exchange_id: z.string(),
});

//

export default router({
  add: next_auth_procedure
    .input(input_schema)
    .mutation(async ({ input: { exchange_id }, ctx: { prisma, payload } }) => {
      const { id: profile_id } = payload.profile;
      const { id: exchange_thread_id } =
        await prisma.exchangeThread.findFirstOrThrow({
          select: { id: true },
          where: { deal: { parent_id: exchange_id }, owner: { profile_id } },
        });
      return prisma.exchangeThread.update({
        data: { is_archived: true },
        where: { id: exchange_thread_id },
      });
    }),

  //

  has: next_auth_procedure
    .input(input_schema)
    .query(async ({ input: { exchange_id }, ctx: { payload, prisma } }) => {
      const { id: profile_id } = payload.profile;
      return prisma.exchangeThread.findFirst({
        select: { id: true, is_archived: true },
        where: {
          deal: { parent_id: exchange_id },
          is_archived: true,
          owner: { profile_id },
        },
      });
    }),

  //

  remove: next_auth_procedure
    .input(input_schema)
    .mutation(async ({ input: { exchange_id }, ctx: { prisma, payload } }) => {
      const { id: profile_id } = payload.profile;
      const { id: exchange_thread_id } =
        await prisma.exchangeThread.findFirstOrThrow({
          select: { id: true },
          where: { deal: { parent_id: exchange_id }, owner: { profile_id } },
        });
      return prisma.exchangeThread.update({
        data: { is_archived: false },
        where: { id: exchange_thread_id },
      });
    }),
});
