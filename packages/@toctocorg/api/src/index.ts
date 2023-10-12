//

import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

//

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => `Hello, ${input.name}!`),

  randomNumber: t.procedure.subscription(() => {
    console.log("<randomNumber.procedure.subscription>");
    return observable<{ randomNumber: number }>((emit) => {
      console.log("<randomNumber.observable>");
      emit.next({ randomNumber: Math.random() });
      const timer = setInterval(() => {
        console.log("<randomNumber.timer>");
        // emits a number every second
        emit.next({ randomNumber: Math.random() });
      }, 500);

      return () => {
        console.log("<randomNumber.observable.teardown>");
        clearInterval(timer);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
