//

import { initTRPC, type inferAsyncReturnType } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import SuperJSON from "superjson";
import { EventEmitter } from "ws";

//
export const createContext = () => ({});
export type Context = inferAsyncReturnType<typeof createContext>;

//

const t = initTRPC.create({
  transformer: SuperJSON,
});

type Post = { foo: "Poost" };
const ee = new EventEmitter();
export const appRouter = t.router({
  notifications: t.procedure.subscription(function notifications() {
    console.log("on notifications");
    return observable<Post>(function sub(emit) {
      console.log("on observable sub");
      const onAdd = (data: Post) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("add", onAdd);
      emit.next({ foo: "Poost" });
      return function unsub() {
        console.log("on observable unsub");
        ee.off("add", onAdd);
      };
    });
  }),
});
