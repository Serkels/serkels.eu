//

import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

//

export const {
  createCallerFactory,
  mergeRouters,
  middleware,
  procedure,
  router,
} = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});
