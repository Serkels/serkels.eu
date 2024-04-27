//

import { Exchange_Create_Schema } from "@1.modules/exchange.domain";
import { next_auth_procedure, router } from "@1.modules/trpc";
import { z } from "zod";
import { deal_update } from "./deal_update";
import { find } from "./find";
import { inbox } from "./inbox";
import { thread_update } from "./thread_update";

export const me = router({
  //

  deal_by_exchange_id: next_auth_procedure
    .input(z.string())
    .query(async ({ ctx: { payload, prisma }, input: parent_id }) => {
      const { profile } = payload;
      const { id: studient_id } = await prisma.studient.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      return prisma.deal.findUnique({
        include: {
          exchange_threads: {
            where: { owner_id: studient_id },
            include: { thread: true },
          },
        },
        where: {
          participant_per_exchange: { parent_id, participant_id: studient_id },
        },
      });
    }),

  //

  delete: next_auth_procedure
    .input(z.string())
    .mutation(({ input: exchange_id, ctx: { prisma, payload } }) => {
      const { id: profile_id } = payload.profile;
      return prisma.exchange.delete({
        where: { id: exchange_id, owner: { profile_id } },
      });
    }),

  //

  find,

  //
  inbox,

  //

  update: next_auth_procedure
    .input(Exchange_Create_Schema.extend({ exchange_id: z.string() }))
    .mutation(({ input, ctx: { prisma, payload } }) => {
      const { exchange_id, ...input_data } = input;
      const { id: profile_id } = payload.profile;
      return prisma.exchange.update({
        data: {
          updated_at: new Date(),
          ...input_data,
        },
        where: { id: exchange_id, owner: { profile_id } },
      });
    }),

  deal_update,
  thread_update,
});
