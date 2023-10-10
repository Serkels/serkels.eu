//

import "reflect-metadata";

//

import { authOptions } from ":api/auth/[...nextauth]/route";
import { fromServer } from ":api/v1";
import { app_router } from "@1.bff/trpc";
import { OpenAPI_Repository } from "@1/core/infra/openapi.repository";
import type {} from "@1/strapi-openapi";
import type { ApiClient, AppContext } from "@1/strapi-trpc-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";

//

export async function createContext(): Promise<AppContext> {
  debugger;
  const session = await getServerSession(authOptions);
  const openapi = new OpenAPI_Repository<ApiClient>(
    fromServer,
    session?.user?.jwt,
  );
  return {
    subscription_to: undefined as any,
    verify_jwt: undefined as any,
    openapi,
    headers: openapi.headers,
  };
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
