//

import type { Notification } from "@1/models";
import { initTRPC } from "@trpc/server";
import { type Observable } from "@trpc/server/observable";
import SuperJSON from "superjson";
import { z } from "zod";

///

export interface AppContext {
  subscription_to: {
    notifications: (id: number) => Observable<Notification, unknown>;
    messages: (id: number) => Observable<Notification, unknown>;
  };
  // greeting: () => Promise<string>;
  verify_jwt: (token: string) => Promise<{ id: number }>;
  // get_my_notifications: (limit: number) => Promise<Notification[]>;
  // emitters: Map<number, EventEmitter>;
  // get_emmiter: (id: number, type: StremType) => EventEmitter;
}

//

const t = initTRPC.context<AppContext>().create({
  transformer: SuperJSON,
});
export const router = t.router;
export const publicProcedure = t.procedure;

//

export const appRouter = t.router({
  notifications: t.procedure
    .input(z.string())
    .subscription(async function notifications({ ctx, input: token }) {
      const { id: user_id } = await ctx.verify_jwt(token);
      return ctx.subscription_to.notifications(user_id);
      // let greetting_emmiter = ctx.emitters.get(user_id);
      // const greetting_emmiter = ctx.get_emmiter(user_id, "GRETTING");

      // // if (!greetting_emmiter) {
      // //   const emitter = new EventEmitter();
      // //   ctx.emitters.set(user_id, emitter);
      // //   greetting_emmiter = emitter;
      // // }
      // console.log("on notifications", { user_id });
      // return observable<Notification>(function sub(emit) {
      //   console.log("on notifications > observable sub", { user_id });
      //   const onAdd = (data: Notification) => emit.next(data);
      //   greetting_emmiter.on("add", onAdd);
      //   return function unsub() {
      //     greetting_emmiter.off("add", onAdd);
      //   };
      // });
    }),
});

export type AppRouter = typeof appRouter;
