//

import { Exchange_Create_Schema } from "@1.modules/exchange.domain";
import {
  mergeRouters,
  next_auth_procedure,
  router,
  session_procedure,
} from "@1.modules/trpc";
import { z } from "zod";
import archive_router from "./archive";
import { delete_api_router } from "./delete";
import { find } from "./find";
import { inbox } from "./inbox";
import { thread_update } from "./thread_update";

/**
 * @deprecated externalize all the routes !
 */
const me_api_router = router({
  //

  archive: archive_router,

  //

  publications: next_auth_procedure
    .input(z.object({}))
    .query(async ({ ctx: { payload, prisma } }) => {
      const {
        profile: { id: profile_id },
      } = payload;

      return prisma.exchange.findMany({
        include: {
          category: true,
          return: true,
          owner: { include: { profile: true } },
          deals: { where: { status: "APPROVED" } },
        },
        orderBy: { created_at: "desc" },
        where: { owner: { profile_id } },
      });
    }),

  deal_by_exchange_id: session_procedure
    .input(z.string())
    .query(async ({ ctx: { session, prisma }, input: parent_id }) => {
      const { profile } = session;
      const { id: student_id } = await prisma.student.findUniqueOrThrow({
        select: { id: true },
        where: { profile_id: profile.id },
      });

      return prisma.deal.findUnique({
        include: {
          exchange_threads: {
            where: { owner_id: student_id },
            include: { thread: true },
          },
        },
        where: {
          participant_per_exchange: { parent_id, participant_id: student_id },
        },
      });
    }),

  //

  find: find,

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
          ...input_data,
          return_id: input_data.return_id ?? null,
          location: input_data.location ?? null,
          expiry_date: input_data.expiry_date ?? null,
          updated_at: new Date(),
        },
        where: { id: exchange_id, owner: { profile_id } },
      });
    }),

  thread_update,
});

export const me = mergeRouters(delete_api_router, me_api_router);
