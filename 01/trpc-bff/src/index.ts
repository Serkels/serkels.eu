//

import {
  exchange_router,
  message_router,
} from "@1.modules.exchange/infra.strapi";
import type { AppContext, TRPCOpenAPIContext } from "@1/strapi-trpc-router";
import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

//

const t = initTRPC.context<AppContext & TRPCOpenAPIContext>().create({
  transformer: SuperJSON,
});
export const router = t.router;
export const publicProcedure = t.procedure;

//

export const app_router = t.mergeRouters(
  t.router({
    // notifications: t.procedure
    //   .input(z.string())
    //   .subscription(async function notifications({ ctx, input: token }) {
    //     const { id: user_id } = await ctx.verify_jwt(token);
    //     return ctx.subscription_to.notifications(user_id);
    //   }),
  }),
  t.router({
    exchange: exchange_router,
    deal: t.router({ message: message_router }),
  }),
);

export type AppRouter = typeof app_router;
