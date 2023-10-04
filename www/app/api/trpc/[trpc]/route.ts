//

import { authOptions } from ":api/auth/[...nextauth]/route";
import { fromServer } from ":api/v1";
import { passwordlessRouter } from "@1.modules.auth/infra.strapi";
import { profileRouter } from "@1.modules.profile/infra.strapi";
import { OpenAPI_Repository } from "@1/core_";
import { initTRPC } from "@trpc/server";
import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";
import type { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
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
  const session = await getSession({ req: opts.req as any as NextApiRequest });
  console.log("<create_authorized_context> session=", session);
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

const authorizedRoutes = t.router({
  profile: profileRouter,
});
export const app_router = t.mergeRouters(publicRoutes, authorizedRoutes);

export type AppRouter = typeof app_router;

//

export async function createContext() {
// opts: FetchCreateContextFnOptions,
// opts: NodeHTTPCreateContextFnOptions<NextApiRequest, NextApiResponse>,
  // console.log("<createContext> opts=", opts);
  // const {
  //   req: { headers },
  // } = opts;
  // console.log("<createContext> headers=", headers);
  const session = await getServerSession(authOptions);

  // console.log("<createContext> session=", session);
  const openapi = new OpenAPI_Repository(fromServer, session?.user?.jwt);
  return {
    openapi,
    headers: openapi.headers,
  };
}

// const trpcApiHandler = createNextApiHandler({

//   router: app_router,
//   createContext,
//   // createContext,
//   // onError:
//   //   process.env.NODE_ENV === 'development'
//   //     ? ({path, error}: any) => {
//   //         console.error(
//   //           `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
//   //         )
//   //       }
//   //     : undefined,
// });
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: app_router,
    createContext,
  });

export { handler as GET, handler as POST };
