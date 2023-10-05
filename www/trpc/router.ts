//

import { passwordlessRouter } from "@1.modules.auth/infra.strapi";
import { exchange_router } from "@1.modules.exchange/infra.strapi";
import { profileRouter } from "@1.modules.profile/infra.strapi";
import type { TRPCOpenAPIContext } from "@1/strapi-openapi";
import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";

//

const { router } = initTRPC.context<TRPCOpenAPIContext>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const app_router = router({
  exchange: exchange_router,
  profile: profileRouter,
  passwordless: passwordlessRouter,
});

export type AppRouter = typeof app_router;
