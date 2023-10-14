//

import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import type { Context } from "./context";

export const { router, middleware, mergeRouters, procedure } = initTRPC
  .context<Context>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ shape }) {
      return shape;
    },
  });

export const publicProcedure = procedure;

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
