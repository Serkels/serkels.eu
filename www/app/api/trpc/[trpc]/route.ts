//

import { fromServer } from ":api/v1";
import { passwordlessRouter } from "@1.modules.auth/infra.strapi";
import { OpenAPI_Repository } from "@1/core_";
import { initTRPC } from "@trpc/server";
import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";
import type { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import SuperJSON from "superjson";
import { ZodError } from "zod";

//

export const create_public_context = async () => {
  return {
    openapi: new OpenAPI_Repository(fromServer, ""),
  };
};
export const create_authorized_context = async (
  opts: FetchCreateContextFnOptions,
) => {
  debugger;
  const session = await getSession({ req: opts.req as any as NextApiRequest });

  return {
    openapi: new OpenAPI_Repository(fromServer, session?.user?.jwt),
    session,
  };
};

//
const t = initTRPC.context<typeof create_public_context>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

const publicRoutes = t.router({
  passwordless: passwordlessRouter,
});

const authorizedRoutes = t.router({});
export const app_router = t.mergeRouters(publicRoutes, authorizedRoutes);

export type AppRouter = typeof app_router;

//

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: app_router,
    createContext: create_public_context,
  });

export { handler as GET, handler as POST };
