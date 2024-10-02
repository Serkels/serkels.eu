//

import { next_auth_procedure, observable, router } from "@1.modules/trpc";
import { z } from "zod";
import { on_message_event } from "./channel/message";
import send from "./send";
import thread_messages from "./thread/messages";

//

export const thread = router({
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

  messages: thread_messages,

  //

  on_new_message: next_auth_procedure
    .input(z.object({ thread_id: z.string() }))
    .subscription(async ({ ctx: { prisma, payload }, input }) => {
      const { thread_id } = input;
      const {
        profile: { id: profile_id },
      } = payload;

      // guard : Only subscribe to participating threads
      await prisma.thread.findUniqueOrThrow({
        where: { id: thread_id, participants: { some: { id: profile_id } } },
      });

      return observable<void>((emit) => {
        return on_message_event(`thread/${thread_id}/new_message`, () => {
          emit.next();
        });
      });
    }),

  //

  send: send,
});
