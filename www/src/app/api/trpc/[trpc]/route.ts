//

import "reflect-metadata";

//

import { authOptions } from ":api/auth/[...nextauth]/route";
import { fromServer } from ":api/v1";
import { OpenAPI_Repository } from "@1/core/infra/openapi.repository";
import type { ApiClient, TRPCOpenAPIContext } from "@1/strapi-openapi";
import { app_router as router } from "@1/strapi-trpc-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";

//

export async function createContext() {
  const session = await getServerSession(authOptions);
  const openapi = new OpenAPI_Repository<ApiClient>(
    fromServer,
    session?.user?.jwt,
  );
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
    router,
    createContext,
  });

export { handler as GET, handler as POST };
