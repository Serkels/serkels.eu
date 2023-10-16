//

import { procedure, router } from "@1.module/trpc";
import auth_api_router from "@1.modules/auth.api";
import profile_api_router from "@1.modules/profile.api";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

//

export const root_router = router({
  auth: auth_api_router,
  profile: profile_api_router,
  hello: procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => `Hello, ${input.name}!`),

  randomNumber: procedure.subscription(() => {
    console.log("<randomNumber.procedure.subscription>");
    return observable<{ randomNumber: number }>((emit) => {
      console.log("<randomNumber.observable>");
      emit.next({ randomNumber: Math.random() });
      const timer = setInterval(() => {
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

export { root_router as router };
export type Router = typeof root_router;
