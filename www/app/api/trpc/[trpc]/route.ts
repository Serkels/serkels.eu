//

import { authOptions } from ":api/auth/[...nextauth]/route";
import { fromServer } from ":api/v1";
import { passwordlessRouter } from "@1.modules.auth/infra.strapi";
import { profileRouter } from "@1.modules.profile/infra.strapi";
import { OpenAPI_Repository } from "@1/core_";
import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import SuperJSON from "superjson";
import { ZodError } from "zod";

//

export const create_public_context = async (jwt = "") => {
  const openapi = new OpenAPI_Repository(fromServer, jwt);
  return {
    openapi,
    headers: openapi.headers,
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

const authorizedRoutes = t.router({
  profile: profileRouter,
});
export const app_router = t.mergeRouters(publicRoutes, authorizedRoutes);

export type AppRouter = typeof app_router;

//

export async function createContext() {
  const session = await getServerSession(authOptions);

  const openapi = new OpenAPI_Repository(fromServer, session?.user?.jwt);
  return {
    openapi,
    headers: openapi.headers,
  };
}

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: app_router,
    createContext,
  });

export { handler as GET, handler as POST };
