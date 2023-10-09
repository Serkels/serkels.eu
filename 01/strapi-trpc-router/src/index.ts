//

import { passwordlessRouter } from "@1.modules.auth/infra.strapi";
import { exchange_router } from "@1.modules.exchange/infra.strapi";
import type { Notification_New_Answer_Props } from "@1.modules.notification/domain";
import { profileRouter } from "@1.modules.profile/infra.strapi";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import { initTRPC } from "@trpc/server";
import { type Observable } from "@trpc/server/observable";
import SuperJSON from "superjson";
import { z } from "zod";

//

export interface AppContext {
  subscription_to: {
    notifications: (
      id: number,
    ) => Observable<Notification_New_Answer_Props, unknown>;
    messages: (
      id: number,
    ) => Observable<Notification_New_Answer_Props, unknown>;
  };
  verify_jwt: (token: string) => Promise<{ id: number }>;
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
    }),
  exchange: exchange_router,
  profile: profileRouter,
  passwordless: passwordlessRouter,
});

export type AppRouter = typeof appRouter;

//

export const TRPC_React: CreateTRPCReact<AppRouter, AppContext, null> =
  createTRPCReact<AppRouter, AppContext>({
    abortOnUnmount: true,
  });

export const TRPC_REACT: () => CreateTRPCReact<
  AppRouter,
  AppContext,
  null
> = () => TRPC_React;
