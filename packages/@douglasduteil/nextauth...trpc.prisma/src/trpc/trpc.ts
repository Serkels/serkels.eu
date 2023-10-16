import { initTRPC } from "@trpc/server";
import type { NextAuth_TRPCContext } from "../config";

export const { router, middleware, mergeRouters, procedure } = initTRPC
  .context<NextAuth_TRPCContext>()
  .create({
    transformer: {} as any,
  });
