//

import { passwordlessRouter } from "@1.modules/auth.infra.strapi";
import { OpenAPI_Repository } from "@1/core_";
import { initTRPC, type inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import SuperJSON from "superjson";
import { ZodError } from "zod";
import { fromServer } from "../v1";
import type { TRPCContext } from "@1/core_";

//

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession({ req: opts.req });

  return {
    openapi: new OpenAPI_Repository(fromServer, session?.user?.jwt),
    session,
  };
};

//

export const appRouter = initTRPC
  .context<TRPCContext>()
  .create({
    transformer: SuperJSON,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }),
  })
  .router({
    passwordless: passwordlessRouter,
  });

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
