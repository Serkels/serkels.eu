//

import "reflect-metadata";

//
import { authOptions } from ":api/auth/[...nextauth]/route";
import { fromServer } from ":api/v1";
import { app_router } from ":trpc/router";
import { OpenAPI_Repository } from "@1/core_";
import type { TRPCOpenAPIContext } from "@1/strapi-openapi";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";

//

export const create_public_context = async (jwt = "") => {
  const openapi = new OpenAPI_Repository(fromServer, jwt);
  return {
    openapi,
    headers: openapi.headers,
  } satisfies TRPCOpenAPIContext;
};

//

export async function createContext() {
  const session = await getServerSession(authOptions);

  const openapi = new OpenAPI_Repository(fromServer, session?.user?.jwt);
  return {
    openapi,
    headers: openapi.headers,
  } satisfies TRPCOpenAPIContext;
}

//

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: app_router,
    createContext,
  });

export { handler as GET, handler as POST };
