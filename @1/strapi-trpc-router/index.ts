//

import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import SuperJSON from "superjson";
import { z } from "zod";

export interface Context {
  greeting: () => Promise<string>;
}

export interface Notification {
  id: number;
  subject: "GENERAL";
  type: "GRETTING";
  profile?: { id: number };
  message: string;
  createdAt: Date;
  state: "pending" | "readed";
}

//

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});
export const router = t.router;
export const publicProcedure = t.procedure;

//

console.log("111");

export const appRouter = t.router({
  notifications: t.procedure
    .input(z.number())
    .subscription(function notifications({ ctx, input: user_id }) {
      console.log("on notifications", { ctx, user_id });
      return observable<Notification>(function sub(emit) {
        console.log("on notifications > observable sub", { ctx, user_id });

        const timer = setInterval(() => {
          // emits a number every second
          emit.next({
            id: 123,
            createdAt: new Date(),
            message: "Hello",
            state: "pending",
            subject: "GENERAL",
            type: "GRETTING",
            profile: { id: 0 },
          });
        }, 1000);

        emit.next({
          id: 123,
          createdAt: new Date(),
          message: "Hello",
          state: "pending",
          subject: "GENERAL",
          type: "GRETTING",
          profile: { id: 0 },
        });

        // const onAdd = (data: Notification) => {
        //   // emit data to client
        //   emit.next(data);
        // };
        // trigger `onAdd()` when `add` is triggered in our event emitter
        // ee.on("add", onAdd);
        return function unsub() {
          console.log("on notifications < observable unsub", { ctx, user_id });
          clearInterval(timer);
        };
      });
    }),
});

export type AppRouter = typeof appRouter;
