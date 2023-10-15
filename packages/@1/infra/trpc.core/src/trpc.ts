//

import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

//

export const { router, middleware, mergeRouters, procedure } = initTRPC
  .context<Context>()
  .create({
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

// const isAuthed = middleware(({ next, ctx }) => {
//   const user = ctx.session?.user;

//   if (!user?.name) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }

//   return next({
//     ctx: {
//       user: {
//         ...user,
//         name: user.name,
//       },
//     },
//   });
// });

// /**
//  * Protected base procedure
//  */
// export const authedProcedure = t.procedure.use(isAuthed);
